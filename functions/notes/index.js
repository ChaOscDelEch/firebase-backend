import {onCall, HttpsError} from 'firebase-functions/v2/https';
import admin from 'firebase-admin';

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

/**
 * DEVELOPMENT MODE - Simplified validation
 * Production security will be added later per Jorge's requirements
 */

/**
 * V2 Callable Function - Read all notes from Firestore
 * Returns an array of note objects
 * DEV MODE: Simplified authentication
 */
export const readNotes = onCall({region: 'europe-west1'}, async (request) => {
  try {
    console.log('📖 Reading notes...');

    const notesSnapshot = await db.collection('notes').get();

    const notes = [];
    notesSnapshot.forEach((doc) => {
      notes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {success: true, notes, count: notes.length};
  } catch (error) {
    console.error('Error reading notes:', error);
    throw new HttpsError('internal', error.message || 'Failed to read notes');
  }
});

/**
 * V2 Callable Function - Create a new note in Firestore
 * Takes: title (string), content (string)
 * Returns: The newly created note object
 * DEV MODE: Basic validation only
 */
export const createNote = onCall({region: 'europe-west1'}, async (request) => {
  try {
    const {title, content} = request.data;

    // Basic validation
    if (!title || !title.trim()) {
      throw new HttpsError('invalid-argument', 'Title is required');
    }
    if (!content || !content.trim()) {
      throw new HttpsError('invalid-argument', 'Content is required');
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // Length validation
    if (trimmedTitle.length < 3) {
      throw new HttpsError(
        'invalid-argument',
        'Title must be at least 3 characters long',
      );
    }
    if (trimmedContent.length < 10) {
      throw new HttpsError(
        'invalid-argument',
        'Content must be at least 10 characters long',
      );
    }

    console.log('✍️ Creating note:', trimmedTitle);

    // Create note document
    const noteData = {
      title: trimmedTitle,
      content: trimmedContent,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      status: 'active',
    };

    const noteRef = await db.collection('notes').add(noteData);
    const noteDoc = await noteRef.get();

    const createdNote = {
      id: noteDoc.id,
      ...noteDoc.data(),
    };

    return {
      success: true,
      note: createdNote,
      message: 'Note created successfully',
    };
  } catch (error) {
    console.error('Error creating note:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', error.message || 'Failed to create note');
  }
});
