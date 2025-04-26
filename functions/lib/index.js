"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.inviteUserHttp = exports.inviteUser = exports.updateUserPermissions = exports.getUserClaimsHttp = exports.getUserClaims = exports.setExecutiveClaim = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file
dotenv.config();
admin.initializeApp();
// CORS middleware
const corsHandler = (0, cors_1.default)({ origin: true });
exports.setExecutiveClaim = (0, https_1.onCall)(async (request) => {
    // Check if the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Get the caller's user record to check if they are an owner
    const callerUid = request.auth.uid;
    const callerRecord = await admin.auth().getUser(callerUid);
    const isOwner = callerRecord.customClaims?.owner === true;
    if (!isOwner) {
        throw new https_1.HttpsError('permission-denied', 'Only owners can set executive claims.');
    }
    // Validate the input data
    const { uid, isExecutive } = request.data;
    if (!uid || typeof isExecutive !== 'boolean') {
        throw new https_1.HttpsError('invalid-argument', 'The function requires a valid uid and isExecutive boolean.');
    }
    try {
        // Set the custom claim
        await admin.auth().setCustomUserClaims(uid, { executive: isExecutive });
        return { success: true };
    }
    catch (error) {
        console.error('Error setting executive claim:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while setting the executive claim.');
    }
});
exports.getUserClaims = (0, https_1.onCall)(async (request) => {
    // Check if the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Validate the input data
    const { uids } = request.data;
    if (!Array.isArray(uids)) {
        throw new https_1.HttpsError('invalid-argument', 'The function requires an array of user UIDs.');
    }
    try {
        // Get the user records and their claims
        const userRecords = await Promise.all(uids.map(uid => admin.auth().getUser(uid)));
        // Map the results to a more client-friendly format
        const claims = userRecords.reduce((acc, user) => {
            acc[user.uid] = {
                executive: user.customClaims?.executive === true,
                owner: user.customClaims?.owner === true
            };
            return acc;
        }, {});
        return { claims };
    }
    catch (error) {
        console.error('Error getting user claims:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while getting user claims.');
    }
});
// HTTP function for getUserClaims that handles CORS
exports.getUserClaimsHttp = (0, https_1.onRequest)((req, res) => {
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
            const userRecords = await Promise.all(uids.map(uid => admin.auth().getUser(uid)));
            // Map the results to a more client-friendly format
            const claims = userRecords.reduce((acc, user) => {
                acc[user.uid] = {
                    executive: user.customClaims?.executive === true,
                    owner: user.customClaims?.owner === true
                };
                return acc;
            }, {});
            res.status(200).json({ claims });
        }
        catch (error) {
            console.error('Error getting user claims:', error);
            res.status(500).send('Internal Server Error: An error occurred while getting user claims.');
        }
    });
});
exports.updateUserPermissions = (0, https_1.onCall)(async (request) => {
    // Check if the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Get the caller's user record to check if they are an owner or executive
    const callerUid = request.auth.uid;
    const callerRecord = await admin.auth().getUser(callerUid);
    const isOwner = callerRecord.customClaims?.owner === true;
    const isExecutive = callerRecord.customClaims?.executive === true;
    if (!isOwner && !isExecutive) {
        throw new https_1.HttpsError('permission-denied', 'Only owners and executives can update user permissions.');
    }
    // Validate the input data
    const { userId, committeeId, newValue } = request.data;
    if (!userId || !committeeId || typeof newValue !== 'boolean') {
        throw new https_1.HttpsError('invalid-argument', 'The function requires a valid userId, committeeId, and newValue boolean.');
    }
    try {
        // Get the target user's executive status
        const targetUserRecord = await admin.auth().getUser(userId);
        const isTargetExecutive = targetUserRecord.customClaims?.executive === true;
        // Only allow updating permissions for non-executive users
        if (isTargetExecutive) {
            throw new https_1.HttpsError('permission-denied', 'Cannot update permissions for executive users.');
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
        }
        else {
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
    }
    catch (error) {
        console.error('Error updating user permissions:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while updating user permissions.');
    }
});
exports.inviteUser = (0, https_1.onCall)(async (request) => {
    // Check if the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Get the caller's user record to check if they are an executive or owner
    const callerRecord = await admin.auth().getUser(request.auth.uid);
    const isCallerExecutive = callerRecord.customClaims?.executive === true;
    const isCallerOwner = callerRecord.customClaims?.owner === true;
    if (!isCallerExecutive && !isCallerOwner) {
        throw new https_1.HttpsError('permission-denied', 'Only executives and owners can invite new users.');
    }
    const { email } = request.data;
    if (!email || typeof email !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'The function requires an email parameter.');
    }
    try {
        // Check if user already exists
        try {
            await admin.auth().getUserByEmail(email);
            throw new https_1.HttpsError('already-exists', 'A user with this email already exists.');
        }
        catch (error) {
            // If the error is not "user not found", rethrow it
            if (error instanceof https_1.HttpsError) {
                throw error;
            }
            // If we get here, the user doesn't exist, which is what we want
        }
        // Create the user with a temporary password
        const userRecord = await admin.auth().createUser({
            email,
            emailVerified: false,
            password: Math.random().toString(36).slice(-8) // Temporary random password
        });
        // Create initial user profile
        const db = admin.firestore();
        await db.collection('UserProfiles').doc(userRecord.uid).set({
            email,
            displayName: email.split('@')[0], // Use part before @ as initial display name
            photoURL: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Create initial permissions document
        await db.collection('UserPermissions').doc(userRecord.uid).set({
            permissions: {
                awardsBlog: false,
                policyBlog: false,
                chapterMeetingBlog: false
            }
        });
        // Generate a password reset link that will be used to set the initial password
        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            throw new https_1.HttpsError('internal', 'Frontend URL is not configured. Please set the frontend.url config variable.');
        }
        const actionCodeSettings = {
            url: `${frontendUrl}/admin/set-password`,
            handleCodeInApp: true
        };
        // Generate and send the password reset email
        const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
        // Create a mail document
        await db.collection('mail').add({
            to: email,
            message: {
                subject: 'Welcome to Oregon ACP',
                text: `Welcome to Oregon ACP! Please click the following link to set your password: ${resetLink}`,
                html: `
          <h1>Welcome to Oregon ACP!</h1>
          <p>Please click the following link to set your password:</p>
          <p><a href="${resetLink}">Set Password</a></p>
        `
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error inviting user:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while inviting the user.');
    }
});
// Add an HTTP version of the inviteUser function with CORS support
exports.inviteUserHttp = (0, https_1.onRequest)((req, res) => {
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
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            // Check if the user is an executive or owner
            const isExecutive = decodedToken.executive === true;
            const isOwner = decodedToken.owner === true;
            if (!isExecutive && !isOwner) {
                res.status(403).send('Permission Denied: Only executives and owners can invite new users.');
                return;
            }
            // Get the email from the request body
            const { email } = req.body;
            if (!email || typeof email !== 'string') {
                res.status(400).send('Invalid Argument: The function requires an email parameter.');
                return;
            }
            // Check if user already exists
            try {
                await admin.auth().getUserByEmail(email);
                res.status(409).send('Already Exists: A user with this email already exists.');
                return;
            }
            catch (error) {
                // If the error is not "user not found", rethrow it
                if (error.code !== 'auth/user-not-found') {
                    throw error;
                }
                // If we get here, the user doesn't exist, which is what we want
            }
            // Create the user with a temporary password
            const userRecord = await admin.auth().createUser({
                email,
                emailVerified: false,
                password: Math.random().toString(36).slice(-8) // Temporary random password
            });
            // Create initial user profile
            const db = admin.firestore();
            await db.collection('UserProfiles').doc(userRecord.uid).set({
                email,
                displayName: email.split('@')[0], // Use part before @ as initial display name
                photoURL: '',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            // Create initial permissions document
            await db.collection('UserPermissions').doc(userRecord.uid).set({
                permissions: {
                    awardsBlog: false,
                    policyBlog: false,
                    chapterMeetingBlog: false
                }
            });
            // Generate a password reset link
            const frontendUrl = process.env.FRONTEND_URL;
            if (!frontendUrl) {
                throw new Error('FRONTEND_URL environment variable is not set.');
            }
            const actionCodeSettings = {
                url: `${frontendUrl}/admin/set-password`,
                handleCodeInApp: true
            };
            // Generate and send the password reset email
            await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error('Error inviting user:', error);
            res.status(500).send('Internal Server Error: An error occurred while inviting the user.');
        }
    });
});
exports.createUser = (0, https_1.onCall)(async (request) => {
    // Check if the request is made by an authenticated user
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Check if the user has executive or owner permissions using custom claims
    const isExecutive = request.auth.token.executive === true;
    const isOwner = request.auth.token.owner === true;
    if (!isExecutive && !isOwner) {
        throw new https_1.HttpsError('permission-denied', 'Only executive users and owners can create new users.');
    }
    const { email } = request.data;
    if (!email) {
        throw new https_1.HttpsError('invalid-argument', 'Email is required.');
    }
    try {
        // Check if user already exists
        try {
            await admin.auth().getUserByEmail(email);
            throw new https_1.HttpsError('already-exists', 'A user with this email already exists.');
        }
        catch (error) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }
        // Create the user
        const userRecord = await admin.auth().createUser({
            email,
            emailVerified: false,
            password: Math.random().toString(36).slice(-8) // Temporary random password
        });
        // Create user profile
        await admin.firestore().collection('UserProfiles').doc(userRecord.uid).set({
            email,
            displayName: email.split('@')[0],
            photoURL: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Create initial permissions
        await admin.firestore().collection('UserPermissions').doc(userRecord.uid).set({
            permissions: {
                awardsBlog: false,
                policyBlog: false,
                chapterMeetingBlog: false
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while creating the user.');
    }
});
//# sourceMappingURL=index.js.map