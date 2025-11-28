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

## 🔗 Related

- Frontend: [firebase-frontend repository]
- Firestore UI: http://127.0.0.1:4000/firestore (when emulator running)

## 👨‍💻 Development Notes

This backend uses **package.json imports** for clean module resolution:
- `#notes` → `./notes/index.js`
- `#validators` → `./validators.js`
- `#authMiddleware` → `./authMiddleware.js`

## 📚 Documentation

For detailed Firebase Functions documentation:
- [Firebase Functions v2 Docs](https://firebase.google.com/docs/functions)
- [Callable Functions](https://firebase.google.com/docs/functions/callable)

---

**Built for WBS Coding School Certification Module**

## Related Repositories

- **Backend Repository:** [https://github.com/ChaOscDelEch/firebase-backend](https://github.com/ChaOscDelEch/firebase-backend)
- **Frontend Repository:** [https://github.com/ChaOscDelEch/firebase-frontend](https://github.com/ChaOscDelEch/firebase-frontend)
