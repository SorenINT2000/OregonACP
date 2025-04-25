const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function refreshToken(email: string) {
  try {
    // Get the user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Revoke all refresh tokens for the user
    await admin.auth().revokeRefreshTokens(user.uid);
    
    console.log(`Successfully revoked refresh tokens for user: ${email}`);
    console.log('The user will need to sign in again to get a new token with the latest claims.');
    
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as a command line argument');
  process.exit(1);
}

refreshToken(email); 