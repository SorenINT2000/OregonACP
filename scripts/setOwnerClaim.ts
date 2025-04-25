const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setOwnerClaim(email: string) {
  try {
    // Get the user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set both owner and executive claims
    await admin.auth().setCustomUserClaims(user.uid, { 
      owner: false,
      executive: true // Also set executive claim
    });

    console.log(`Successfully set owner and executive claims for user: ${email}`);
  } catch (error) {
    console.error('Error setting owner claim:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as a command line argument');
  process.exit(1);
}

setOwnerClaim(email); 