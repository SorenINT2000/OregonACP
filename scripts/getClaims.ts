const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function getClaims(email: string) {
  try {
    // Get the user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Get the user's custom claims
    const userRecord = await admin.auth().getUser(user.uid);
    
    console.log(`User: ${email} (${user.uid})`);
    console.log('Custom claims:', userRecord.customClaims || 'No custom claims set');
    
    // Also check Firestore UserPermissions
    const db = admin.firestore();
    const userPermissionsDoc = await db.collection('UserPermissions').doc(user.uid).get();
    
    if (userPermissionsDoc.exists) {
      console.log('Firestore UserPermissions:', userPermissionsDoc.data());
    } else {
      console.log('No UserPermissions document found in Firestore');
    }
    
  } catch (error) {
    console.error('Error getting claims:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as a command line argument');
  process.exit(1);
}

getClaims(email); 