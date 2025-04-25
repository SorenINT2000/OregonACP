import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp();

// CORS middleware
const corsHandler = cors({ origin: true });

export const setExecutiveClaim = onCall(async (request) => {
  // Check if the caller is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // Get the caller's user record to check if they are an owner
  const callerUid = request.auth.uid;
  const callerRecord = await admin.auth().getUser(callerUid);
  const isOwner = callerRecord.customClaims?.owner === true;

  if (!isOwner) {
    throw new HttpsError(
      'permission-denied',
      'Only owners can set executive claims.'
    );
  }

  // Validate the input data
  const { uid, isExecutive } = request.data;
  if (!uid || typeof isExecutive !== 'boolean') {
    throw new HttpsError(
      'invalid-argument',
      'The function requires a valid uid and isExecutive boolean.'
    );
  }

  try {
    // Set the custom claim
    await admin.auth().setCustomUserClaims(uid, { executive: isExecutive });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting executive claim:', error);
    throw new HttpsError(
      'internal',
      'An error occurred while setting the executive claim.'
    );
  }
});

export const getUserClaims = onCall(async (request) => {
  // Check if the caller is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // Validate the input data
  const { uids } = request.data;
  if (!Array.isArray(uids)) {
    throw new HttpsError(
      'invalid-argument',
      'The function requires an array of user UIDs.'
    );
  }

  try {
    // Get the user records and their claims
    const userRecords = await Promise.all(
      uids.map(uid => admin.auth().getUser(uid))
    );

    // Map the results to a more client-friendly format
    const claims = userRecords.reduce((acc, user) => {
      acc[user.uid] = {
        executive: user.customClaims?.executive === true,
        owner: user.customClaims?.owner === true
      };
      return acc;
    }, {} as { [key: string]: { executive: boolean, owner: boolean } });

    return { claims };
  } catch (error) {
    console.error('Error getting user claims:', error);
    throw new HttpsError(
      'internal',
      'An error occurred while getting user claims.'
    );
  }
});

// HTTP function for getUserClaims that handles CORS
export const getUserClaimsHttp = onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    // Check if the request is a preflight request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      // Get the authorization token from the request header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized');
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      
      // Verify the token
      await admin.auth().verifyIdToken(idToken);

      // Validate the input data
      const { uids } = req.body;
      if (!Array.isArray(uids)) {
        res.status(400).send('Invalid Argument: The function requires an array of user UIDs.');
        return;
      }

      // Get the user records and their claims
      const userRecords = await Promise.all(
        uids.map(uid => admin.auth().getUser(uid))
      );

      // Map the results to a more client-friendly format
      const claims = userRecords.reduce((acc, user) => {
        acc[user.uid] = {
          executive: user.customClaims?.executive === true,
          owner: user.customClaims?.owner === true
        };
        return acc;
      }, {} as { [key: string]: { executive: boolean, owner: boolean } });

      res.status(200).json({ claims });
    } catch (error) {
      console.error('Error getting user claims:', error);
      res.status(500).send('Internal Server Error: An error occurred while getting user claims.');
    }
  });
});

export const updateUserPermissions = onCall(async (request) => {
  // Check if the caller is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // Get the caller's user record to check if they are an owner or executive
  const callerUid = request.auth.uid;
  const callerRecord = await admin.auth().getUser(callerUid);
  const isOwner = callerRecord.customClaims?.owner === true;
  const isExecutive = callerRecord.customClaims?.executive === true;

  if (!isOwner && !isExecutive) {
    throw new HttpsError(
      'permission-denied',
      'Only owners and executives can update user permissions.'
    );
  }

  // Validate the input data
  const { userId, committeeId, newValue } = request.data;
  if (!userId || !committeeId || typeof newValue !== 'boolean') {
    throw new HttpsError(
      'invalid-argument',
      'The function requires a valid userId, committeeId, and newValue boolean.'
    );
  }

  try {
    // Get the target user's executive status
    const targetUserRecord = await admin.auth().getUser(userId);
    const isTargetExecutive = targetUserRecord.customClaims?.executive === true;

    // Only allow updating permissions for non-executive users
    if (isTargetExecutive) {
      throw new HttpsError(
        'permission-denied',
        'Cannot update permissions for executive users.'
      );
    }

    // Get the current permissions document
    const db = admin.firestore();
    const userPermissionsRef = db.collection('UserPermissions').doc(userId);
    const userPermissionsDoc = await userPermissionsRef.get();

    if (!userPermissionsDoc.exists) {
      // Create new permissions document
      await userPermissionsRef.set({
        permissions: {
          [committeeId]: newValue
        }
      });
    } else {
      // Update existing permissions
      const currentPermissions = userPermissionsDoc.data()?.permissions || {};
      await userPermissionsRef.update({
        permissions: {
          ...currentPermissions,
          [committeeId]: newValue
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user permissions:', error);
    throw new HttpsError(
      'internal',
      'An error occurred while updating user permissions.'
    );
  }
}); 