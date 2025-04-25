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
exports.updateUserPermissions = exports.getUserClaimsHttp = exports.getUserClaims = exports.setExecutiveClaim = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
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
//# sourceMappingURL=index.js.map