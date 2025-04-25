import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

/**
 * Initialize the UserExecutives collection for existing users
 * This is a temporary solution until Cloud Functions are deployed
 */
export const initializeExecutives = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No authenticated user found');
      return;
    }
    
    // Get all users from the users collection
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    // Create a batch of operations to set executive status
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Check if the user already has an executive document
      const executiveDoc = await getDoc(doc(db, 'UserExecutives', userId));
      
      if (!executiveDoc.exists()) {
        // Set default executive status (only the first user is an executive)
        const isExecutive = userId === currentUser.uid;
        
        // Create the executive document
        await setDoc(doc(db, 'UserExecutives', userId), {
          isExecutive,
          updatedAt: new Date()
        });
        
        console.log(`Initialized executive status for user ${userId}: ${isExecutive}`);
      }
    }
    
    console.log('Executive initialization complete');
  } catch (error) {
    console.error('Error initializing executives:', error);
  }
}; 