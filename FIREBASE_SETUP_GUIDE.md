# Firebase Backend & Frontend Setup Guide

## 🏗️ Project Structure

```
certification-app-back/          ← Backend (Firebase Functions)
├── functions/
│   ├── index.js                 ← Cloud Functions (readNotes, createNote)
│   └── package.json             ← Backend dependencies
├── firebase.json                ← Firebase configuration
├── firestore.rules              ← Security rules
└── firestore.indexes.json       ← Database indexes

certification-app-front/         ← Frontend (React + Vite)
├── src/
│   ├── App.jsx                  ← Notes app UI
│   ├── ModuleDetail.jsx         ← Module detail page
│   ├── firebase.js              ← Firebase SDK setup
│   └── main.jsx                 ← React entry point
└── package.json                 ← Frontend dependencies
```

## 📊 Firebase Collections & Fields

### Collection: `notes`
Each document in the `notes` collection has:

```javascript
{
  id: "auto-generated-id",        // Document ID (auto)
  title: "string",                // Note title
  content: "string",              // Note content
  createdAt: Date,                // Creation timestamp
  updatedAt: Date                 // Last update timestamp
}
```

## 🔥 Firebase Functions (Backend)

### 1. `readNotes` Function
- **Type:** Callable HTTPS Function
- **Region:** europe-west1
- **URL:** `http://127.0.0.1:5001/demo-no-project/europe-west1/readNotes`
- **What it does:** Reads all notes from Firestore
- **Returns:** 
  ```javascript
  {
    success: true,
    notes: [
      { id, title, content, createdAt, updatedAt },
      ...
    ]
  }
  ```

### 2. `createNote` Function
- **Type:** Callable HTTPS Function
- **Region:** europe-west1
- **URL:** `http://127.0.0.1:5001/demo-no-project/europe-west1/createNote`
- **What it does:** Creates a new note in Firestore
- **Input:**
  ```javascript
  {
    title: "string",
    content: "string"
  }
  ```
- **Returns:**
  ```javascript
  {
    success: true,
    note: { id, title, content, createdAt, updatedAt }
  }
  ```

## 🌐 Frontend Connection

### Firebase Configuration (`src/firebase.js`)
```javascript
// Project ID for emulator
projectId: 'demo-no-project'

// Functions emulator connection
connectFunctionsEmulator(functions, '127.0.0.1', 5001)

// Firestore emulator connection
connectFirestoreEmulator(db, '127.0.0.1', 8080)
```

### How Frontend Calls Backend
```javascript
// Import callable functions
import { readNotes, createNote } from './firebase';

// Call readNotes
const result = await readNotes();
// Returns: { data: { success: true, notes: [...] } }

// Call createNote
const result = await createNote({ title: "...", content: "..." });
// Returns: { data: { success: true, note: {...} } }
```

## ✅ How to Verify Everything Works

### 1. Check Backend (Emulators) is Running
Open terminal and run:
```bash
cd certification-app-back
firebase emulators:start
```

**You should see:**
```
✔  All emulators ready!
│ Functions  │ 127.0.0.1:5001 │
│ Firestore  │ 127.0.0.1:8080 │
Emulator UI at http://127.0.0.1:4000/
```

### 2. Check Frontend is Running
Open another terminal:
```bash
cd certification-app-front
npm run dev
```

**You should see:**
```
VITE v7.2.4  ready in 406 ms
➜  Local:   http://localhost:5173/
```

### 3. Test the Connection

#### Option A: Use the Notes App
1. Open http://localhost:5173
2. Create a note with title and content
3. Click "Create Note"
4. Note should appear in the list below

#### Option B: Use Firebase Emulator UI
1. Open http://127.0.0.1:4000/
2. Click "Firestore" tab
3. You should see the `notes` collection
4. Each created note appears as a document

#### Option C: Check Browser Console
1. Open http://localhost:5173
2. Press F12 (Developer Tools)
3. Go to "Network" tab
4. Create a note
5. You should see requests to:
   - `http://127.0.0.1:5001/demo-no-project/europe-west1/createNote`

### 4. Check Backend Logs
In the terminal running Firebase emulators, you should see:
```
i  functions: Beginning execution of "europe-west1-createNote"
i  functions: Finished "europe-west1-createNote" in 12.5ms
```

## 🔍 Troubleshooting

### Backend Issues
- **Port already in use:** Kill the process using port 5001 or 8080
- **Functions not loading:** Check `functions/index.js` for syntax errors
- **"Cannot read properties of undefined":** Check admin.firestore() initialization

### Frontend Issues
- **"Failed to fetch":** Ensure emulators are running first
- **CORS errors:** Emulators should auto-configure CORS
- **"INTERNAL error":** Check backend terminal for detailed error logs

### Connection Issues
- **Verify ports match:**
  - Functions: 5001 (frontend firebase.js should match)
  - Firestore: 8080 (frontend firebase.js should match)
- **Check projectId:** Must be 'demo-no-project' in both places

## 📁 Database Structure in Firestore Emulator

```
Firestore Database
└── notes (collection)
    ├── doc1 (auto-generated ID)
    │   ├── title: "My First Note"
    │   ├── content: "This is the content..."
    │   ├── createdAt: 2025-11-26T10:30:00Z
    │   └── updatedAt: 2025-11-26T10:30:00Z
    ├── doc2 (auto-generated ID)
    │   ├── title: "Another Note"
    │   ├── content: "More content here..."
    │   ├── createdAt: 2025-11-26T11:00:00Z
    │   └── updatedAt: 2025-11-26T11:00:00Z
    └── ...
```

## 🎯 Key Learning Points

1. **Firebase Functions = Backend API**
   - Functions run server-side
   - Handle business logic and database operations
   - Secured with emulator configuration

2. **Firestore = NoSQL Database**
   - Collections contain documents
   - Documents contain fields
   - No schema required (flexible structure)

3. **Callable Functions = Easy RPC**
   - Call backend functions like regular JavaScript functions
   - Automatic serialization/deserialization
   - Built-in error handling

4. **Emulators = Local Development**
   - No cloud costs during development
   - Fast iteration and testing
   - Data cleared when emulators stop

## 🚀 Next Steps

1. **Add more features:**
   - Update note function
   - Delete note function
   - Search/filter notes

2. **Add authentication:**
   - Firebase Auth emulator
   - User-specific notes
   - Protected functions

3. **Deploy to production:**
   - `firebase deploy --only functions`
   - Update frontend to use production URLs
   - Configure production Firestore

## 📚 Resources

- Firebase Emulator Suite: https://firebase.google.com/docs/emulator-suite
- Cloud Functions: https://firebase.google.com/docs/functions
- Firestore: https://firebase.google.com/docs/firestore
