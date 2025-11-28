/**
 * Input Validation & Sanitization Module
 * Production-ready validators for WBS Module Certification System
 */

// Security constants
const VALIDATION_RULES = {
  module: {
    titleEn: { min: 3, max: 200 },
    titleDe: { min: 3, max: 200 },
    descriptionEn: { min: 10, max: 5000 },
    objectiveDe: { min: 10, max: 5000 },
    shortCode: { min: 2, max: 20 },
    dqsNumber: { min: 1, max: 50 },
    curriculum: { max: 10000 },
  },
  course: {
    name: { min: 3, max: 200 },
    description: { min: 10, max: 2000 },
  },
  certificationRound: {
    name: { min: 3, max: 100 },
    description: { max: 1000 },
  },
  comment: {
    text: { min: 1, max: 2000 },
  },
  user: {
    displayName: { min: 2, max: 100 },
    email: { max: 254 }, // RFC 5321
  },
};

// Allowed domains for email validation
const ALLOWED_DOMAINS = ["wbscodingschool.com", "wbs.de"]; // Configure as needed

/**
 * Sanitize string input - trim whitespace and remove dangerous characters
 */
function sanitizeString(input) {
  if (typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .slice(0, 10000); // Hard limit
}

/**
 * Validate string length
 */
function validateLength(value, min = 0, max = Infinity, fieldName = "Field") {
  const length = value?.length || 0;
  
  if (length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters long`);
  }
  
  if (length > max) {
    throw new Error(`${fieldName} must not exceed ${max} characters`);
  }
  
  return true;
}

/**
 * Validate email format and domain restriction
 */
function validateEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Email is required");
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new Error("Invalid email format");
  }
  
  // Domain restriction
  const domain = trimmedEmail.split("@")[1];
  if (!ALLOWED_DOMAINS.includes(domain)) {
    throw new Error(`Email must be from allowed domains: ${ALLOWED_DOMAINS.join(", ")}`);
  }
  
  return trimmedEmail;
}

/**
 * Validate required string field
 */
function validateRequired(value, fieldName = "Field") {
  const sanitized = sanitizeString(value);
  
  if (!sanitized || sanitized.length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
  
  return sanitized;
}

/**
 * Validate optional string field
 */
function validateOptional(value, min = 0, max = Infinity, fieldName = "Field") {
  if (!value) return null;
  
  const sanitized = sanitizeString(value);
  
  if (sanitized.length === 0) return null;
  
  validateLength(sanitized, min, max, fieldName);
  
  return sanitized;
}

/**
 * Validate numeric input
 */
function validateNumber(value, min = 0, max = Infinity, fieldName = "Field") {
  const num = Number(value);
  
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (num < min || num > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  
  return num;
}

/**
 * Validate date input
 */
function validateDate(dateValue, fieldName = "Date") {
  if (!dateValue) {
    throw new Error(`${fieldName} is required`);
  }
  
  const date = new Date(dateValue);
  
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }
  
  return date;
}

/**
 * Validate enum value
 */
function validateEnum(value, allowedValues, fieldName = "Field") {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(", ")}`);
  }
  
  return value;
}

/**
 * Validate Module input
 */
function validateModuleInput(data) {
  const rules = VALIDATION_RULES.module;
  
  const validated = {
    titleEn: validateRequired(data.titleEn, "English Title"),
    descriptionEn: validateRequired(data.descriptionEn, "English Description"),
    shortCode: validateOptional(data.shortCode, rules.shortCode.min, rules.shortCode.max, "Short Code"),
    dqsNumber: validateOptional(data.dqsNumber, rules.dqsNumber.min, rules.dqsNumber.max, "DQS Number"),
    bkz: validateOptional(data.bkz, 1, 50, "BKZ"),
    pricePerUE: data.pricePerUE ? validateNumber(data.pricePerUE, 0, 1000000, "Price per UE") : null,
    pricePerModule: data.pricePerModule ? validateNumber(data.pricePerModule, 0, 1000000, "Price per Module") : null,
    ue45: data.ue45 ? validateNumber(data.ue45, 1, 1000, "UE in 45 Min") : null,
    weeks: data.weeks ? validateNumber(data.weeks, 1, 104, "Weeks") : null,
    curriculum: validateOptional(data.curriculum, 0, rules.curriculum.max, "Curriculum"),
    nrMab: validateOptional(data.nrMab, 0, 50, "Nr MAB"),
    certificate: validateOptional(data.certificate, 0, 200, "Certificate"),
  };
  
  // Validate length constraints
  validateLength(validated.titleEn, rules.titleEn.min, rules.titleEn.max, "English Title");
  validateLength(validated.descriptionEn, rules.descriptionEn.min, rules.descriptionEn.max, "English Description");
  
  return validated;
}

/**
 * Validate Course input
 */
function validateCourseInput(data) {
  const rules = VALIDATION_RULES.course;
  
  const validated = {
    name: validateRequired(data.name, "Course Name"),
    description: validateRequired(data.description, "Course Description"),
  };
  
  validateLength(validated.name, rules.name.min, rules.name.max, "Course Name");
  validateLength(validated.description, rules.description.min, rules.description.max, "Course Description");
  
  return validated;
}

/**
 * Validate Certification Round input
 */
function validateCertificationRoundInput(data) {
  const rules = VALIDATION_RULES.certificationRound;
  
  const validated = {
    name: validateRequired(data.name, "Round Name"),
    description: validateOptional(data.description, 0, rules.description.max, "Description"),
    startDate: validateDate(data.startDate, "Start Date"),
    dueDate: validateDate(data.dueDate, "Due Date"),
  };
  
  validateLength(validated.name, rules.name.min, rules.name.max, "Round Name");
  
  // Business rule: Due date must be after start date
  if (validated.dueDate <= validated.startDate) {
    throw new Error("Due date must be after start date");
  }
  
  return validated;
}

/**
 * Validate Comment input
 */
function validateCommentInput(data) {
  const rules = VALIDATION_RULES.comment;
  
  const validated = {
    text: validateRequired(data.text, "Comment Text"),
    moduleId: validateRequired(data.moduleId, "Module ID"),
  };
  
  validateLength(validated.text, rules.comment.text.min, rules.comment.text.max, "Comment Text");
  
  return validated;
}

/**
 * Validate User input
 */
function validateUserInput(data) {
  const rules = VALIDATION_RULES.user;
  
  const validated = {
    email: validateEmail(data.email),
    displayName: validateRequired(data.displayName, "Display Name"),
    role: validateEnum(data.role, ["sysadmin", "programOwner", "operations"], "Role"),
  };
  
  validateLength(validated.displayName, rules.user.displayName.min, rules.user.displayName.max, "Display Name");
  
  return validated;
}

/**
 * Rate limiting tracker (in-memory for emulator, use Firestore for production)
 */
const rateLimitStore = new Map();

/**
 * Check rate limit for user actions
 * @param {string} userId - User ID
 * @param {string} action - Action type (e.g., 'createModule', 'createComment')
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
function checkRateLimit(userId, action, maxRequests = 10, windowMs = 60000) {
  const key = `${userId}:${action}`;
  const now = Date.now();
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [now]);
    return true;
  }
  
  const timestamps = rateLimitStore.get(key).filter((t) => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    throw new Error(`Rate limit exceeded. Maximum ${maxRequests} requests per minute for ${action}`);
  }
  
  timestamps.push(now);
  rateLimitStore.set(key, timestamps);
  
  return true;
}

/**
 * Detect duplicate content (prevent spam)
 */
const recentContentHashes = new Map();

function checkDuplicateContent(userId, content, action, windowMs = 30000) {
  const hash = `${userId}:${content.substring(0, 100)}`;
  const now = Date.now();
  
  if (recentContentHashes.has(hash)) {
    const lastSubmission = recentContentHashes.get(hash);
    if (now - lastSubmission < windowMs) {
      throw new Error("Duplicate submission detected. Please wait before submitting identical content.");
    }
  }
  
  recentContentHashes.set(hash, now);
  
  // Clean up old entries
  for (const [key, timestamp] of recentContentHashes.entries()) {
    if (now - timestamp > windowMs * 2) {
      recentContentHashes.delete(key);
    }
  }
  
  return true;
}

module.exports = {
  sanitizeString,
  validateLength,
  validateEmail,
  validateRequired,
  validateOptional,
  validateNumber,
  validateDate,
  validateEnum,
  validateModuleInput,
  validateCourseInput,
  validateCertificationRoundInput,
  validateCommentInput,
  validateUserInput,
  checkRateLimit,
  checkDuplicateContent,
  VALIDATION_RULES,
};
