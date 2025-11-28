# 🔥 Firebase Backend - Notes API

Backend for the WBS Module Certification System using Firebase Cloud Functions.

## 🏗️ Architecture

- **Firebase Functions v2** (Cloud Functions for Firebase)
- **Firestore** (NoSQL database)
- **ESM Modules** (Modern JavaScript imports)
- **Modular Structure** (Clean code organization)

## 📁 Project Structure

```
firebase-backend/
├── functions/
│   ├── notes/              # Notes resource functions
│   │   └── index.js        # readNotes, createNote
│   ├── index.js            # Main entry point (re-exports)
│   ├── package.json        # Dependencies (ESM module)
│   ├── eslint.config.js    # ESLint configuration
│   └── .prettierrc         # Prettier formatting rules
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Database indexes
└── firebase.json           # Firebase configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Firebase account

### Installation

```bash
# Install dependencies
cd functions
npm install

# Login to Firebase
firebase login
```

### Development

```bash
# Start emulators (Functions + Firestore)
firebase emulators:start

# Access Emulator UI
# http://127.0.0.1:4000
```

### Available Functions

#### `readNotes`
- **Type**: Callable HTTPS Function
- **Region**: europe-west1
- **Purpose**: Fetch all notes from Firestore
- **Returns**: `{success: boolean, notes: Note[], count: number}`

#### `createNote`
- **Type**: Callable HTTPS Function  
- **Region**: europe-west1
- **Purpose**: Create a new note
- **Input**: `{title: string, content: string}`
- **Validation**:
  - Title: 3-200 characters
  - Content: 10-5000 characters
- **Returns**: `{success: boolean, note: Note, message: string}`

## 🛠️ Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Start emulators
npm run serve

# Deploy to production
npm run deploy
```

## 📦 Dependencies

- `firebase-admin` - Firebase Admin SDK
- `firebase-functions` - Cloud Functions SDK

## 🎨 Code Style

- **Prettier** for formatting
- **ESLint** with Google style guide
- **ESM modules** (import/export)

## 🔒 Security (Development Mode)

Currently running in **development mode** with simplified security:
- ✅ Basic input validation
- ⏸️ Authentication (to be added)
- ⏸️ Rate limiting (to be added)
- ⏸️ Audit logging (to be added)

## 📝 Environment

- **Node.js**: 20
- **Region**: europe-west1
- **Runtime**: Cloud Functions v2

## Related

**Frontend Repository:** [https://github.com/ChaOscDelEch/firebase-frontend](https://github.com/ChaOscDelEch/firebase-frontend)

### Why Separate Repositories?

This project was intentionally split from a monorepo structure into independent repositories to demonstrate production-ready architectural practices:

**Independent Deployment Cycles:**
- Backend (Firebase Cloud Functions) can be deployed without touching frontend code
- Frontend (React SPA) can be updated and deployed to static hosting independently
- Each repository has its own CI/CD pipeline potential

**Team Collaboration Model:**
- Backend team can work with firebase-admin, Cloud Functions, and Firestore security rules
- Frontend team focuses on React, TanStack Query, and user experience
- No conflicts in package.json dependencies or build processes

**Technology Stack Separation:**
- Backend: Node.js ESM, firebase-functions, firebase-admin (server-side only)
- Frontend: React 19, Vite, Firebase client SDK, TanStack Query
- Each repo optimized for its specific runtime environment

**Professional Review & Code Quality:**
- Easier to review backend security, validation, and serverless architecture
- Frontend performance and UX can be evaluated independently
- Clear separation of concerns for certification assessment

This architecture mirrors real-world microservices patterns where backend APIs and frontend applications are maintained as separate deployable units.

**Firestore UI:** http://127.0.0.1:4000/firestore (when emulator running)



## 👨‍💻 Development Notes

This backend uses **package.json imports** for clean module resolution:

## 📚 Documentation

For detailed Firebase Functions documentation:


**Built for WBS Coding School Certification Module**

