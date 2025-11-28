/**
 * Authentication & Authorization Middleware
 * Production-ready auth for WBS Module Certification System
 */

const admin = require("firebase-admin");

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const FieldValue = admin.firestore.FieldValue;

// User roles hierarchy
const ROLES = {
  SYSADMIN: "sysadmin",
  PROGRAM_OWNER: "programOwner",
  OPERATIONS: "operations",
};

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  [ROLES.SYSADMIN]: 3,
  [ROLES.PROGRAM_OWNER]: 2,
  [ROLES.OPERATIONS]: 1,
};

/**
 * Verify Firebase Auth token and get user context
 */
async function authenticateUser(request) {
  // In emulator mode, auth might be simplified
  // For production, this checks the Firebase token
  
  if (!request.auth) {
    throw new Error("Unauthorized: No authentication provided");
  }
  
  const userId = request.auth.uid;
  const email = request.auth.token.email;
  
  // Verify user exists and is active in Firestore
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  
  if (!userDoc.exists) {
    throw new Error("Unauthorized: User not found in system");
  }
  
  const userData = userDoc.data();
  
  if (!userData.active) {
    throw new Error("Unauthorized: User account is deactivated");
  }
  
  // Get role from custom claims (set by sysadmin)
  const role = request.auth.token.role || userData.role;
  
  if (!role || !Object.values(ROLES).includes(role)) {
    throw new Error("Unauthorized: Invalid user role");
  }
  
  return {
    userId,
    email,
    role,
    displayName: userData.displayName,
    active: userData.active,
  };
}

/**
 * Check if user has required role
 */
function requireRole(userContext, requiredRoles) {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  
  if (!requiredRoles.includes(userContext.role)) {
    throw new Error(`Forbidden: Requires one of these roles: ${requiredRoles.join(", ")}`);
  }
  
  return true;
}

/**
 * Check if user has minimum role level
 */
function requireMinRole(userContext, minRole) {
  const userLevel = ROLE_HIERARCHY[userContext.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
  
  if (userLevel < requiredLevel) {
    throw new Error(`Forbidden: Requires minimum role: ${minRole}`);
  }
  
  return true;
}

/**
 * Check if certification round is active (for edit operations)
 */
async function requireActiveCertificationRound() {
  const roundsSnapshot = await admin
      .firestore()
      .collection("certificationRounds")
      .where("status", "==", "active")
      .limit(1)
      .get();
  
  if (roundsSnapshot.empty) {
    throw new Error("Forbidden: No active certification round. Changes are not allowed.");
  }
  
  return roundsSnapshot.docs[0].data();
}

/**
 * Check if user owns or is assigned to a resource
 */
async function requireOwnership(userContext, resourceType, resourceId, ownerField = "createdBy") {
  // Sysadmin can access everything
  if (userContext.role === ROLES.SYSADMIN) {
    return true;
  }
  
  const resourceDoc = await admin
      .firestore()
      .collection(resourceType)
      .doc(resourceId)
      .get();
  
  if (!resourceDoc.exists) {
    throw new Error(`${resourceType} not found`);
  }
  
  const resourceData = resourceDoc.data();
  
  // Check ownership
  if (resourceData[ownerField] !== userContext.userId) {
    throw new Error(`Forbidden: You do not own this ${resourceType}`);
  }
  
  return true;
}

/**
 * Audit log helper - track all important actions
 */
async function logAudit(action, userContext, resourceType, resourceId, details = {}) {
  try {
    await admin.firestore().collection("auditLogs").add({
      action, // e.g., 'CREATE_MODULE', 'UPDATE_COURSE', 'DELETE_USER'
      userId: userContext.userId,
      userEmail: userContext.email,
      userRole: userContext.role,
      resourceType, // e.g., 'modules', 'courses', 'users'
      resourceId,
      details, // Additional context (e.g., what changed)
      timestamp: FieldValue.serverTimestamp(),
      ipAddress: details.ipAddress || null,
    });
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error("Audit log failed:", error);
  }
}

/**
 * Validate domain restriction for new users
 */
function validateEmailDomain(email, allowedDomains = ["wbscodingschool.com"]) {
  const domain = email.split("@")[1];
  
  if (!allowedDomains.includes(domain)) {
    throw new Error(`Email domain not allowed. Must be one of: ${allowedDomains.join(", ")}`);
  }
  
  return true;
}

/**
 * Combined auth wrapper for Cloud Functions
 */
async function authorizeRequest(request, options = {}) {
  const {
    requireRoles = null,
    requireMinRole: minRole = null,
    requireActiveRound = false,
    requireOwnership: ownership = null,
  } = options;
  
  // Step 1: Authenticate user
  const userContext = await authenticateUser(request);
  
  // Step 2: Check role requirements
  if (requireRoles) {
    requireRole(userContext, requireRoles);
  }
  
  if (minRole) {
    requireMinRole(userContext, minRole);
  }
  
  // Step 3: Check certification round status
  let activeRound = null;
  if (requireActiveRound) {
    activeRound = await requireActiveCertificationRound();
  }
  
  // Step 4: Check ownership
  if (ownership) {
    await requireOwnership(
        userContext,
        ownership.resourceType,
        ownership.resourceId,
        ownership.ownerField,
    );
  }
  
  return {
    userContext,
    activeRound,
  };
}

module.exports = {
  ROLES,
  authenticateUser,
  requireRole,
  requireMinRole,
  requireActiveCertificationRound,
  requireOwnership,
  logAudit,
  validateEmailDomain,
  authorizeRequest,
};
