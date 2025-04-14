import React, { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Button,
  Card,
  Stack,
  TextInput,
  Avatar,
  Center,
  Alert,
  Loader,
  Modal,
  Group,
  Box,
  ActionIcon
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconEdit } from '@tabler/icons-react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../../firebase';
import classes from './Profile.module.css';

export const Profile: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setIsInitialized(true);
        return;
      }

      try {
        const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Initial user document in Firestore:', userData);

          setDisplayName(userData.displayName || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
          setPhotoURL(userData.photoURL || '');
          setRole(userData.role || '');
          setOrganization(userData.organization || '');
          setPosition(userData.position || '');
          setBio(userData.bio || '');
        } else {
          console.log('User document does not exist in Firestore');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchUserData();
  }, [auth.currentUser, db]);

  // Function to verify the current state of the user document
  const verifyUserDocument = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Current user document in Firestore after update:', userData);
      } else {
        console.error('User document does not exist in Firestore after update');
      }
    } catch (err) {
      console.error('Error verifying user document:', err);
    }
  };

  const handleImageUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (!imageUrl) {
      setUrlError('Please enter an image URL');
      return;
    }

    try {
      // Validate the image URL
      const img = new Image();
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Invalid image URL'));
      });

      // Update the user's profile picture in Firebase Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: imageUrl
        });

        // Update the Firestore document
        const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          photoURL: imageUrl
        });

        // Verify the update was successful
        await verifyUserDocument();

        // Update the local state
        setPhotoURL(imageUrl);
        setImageUrl('');

        // Close the modal
        setModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setUrlError('Failed to update profile picture. Please check the URL and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setError('No user logged in');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('Updating profile with display name:', displayName);

      // Update user profile in Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });

      console.log('Firebase Auth profile updated, updating Firestore...');

      // Update user document in Firestore
      const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
      console.log('Updating Firestore document at path:', userDocRef.path);

      await updateDoc(userDocRef, {
        displayName,
        photoURL,
        updatedAt: new Date()
      });

      console.log('Firestore document updated successfully');
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClearProfilePicture = async () => {
    if (!auth.currentUser) return;

    try {
      // Update the user's profile picture in Firebase Auth
      await updateProfile(auth.currentUser, {
        photoURL: null
      });

      // Update the Firestore document
      const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL: null
      });

      // Verify the update was successful
      await verifyUserDocument();

      // Update the local state
      setPhotoURL(null);

      // Close the modal
      setModalOpen(false);
    } catch (err) {
      console.error('Error clearing profile picture:', err);
      setError('Failed to clear profile picture');
    }
  };

  if (!isInitialized) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Stack>
      <Title order={2}>Profile Settings</Title>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      )}

      {success && (
        <Alert icon={<IconCheck size={16} />} title="Success" color="green">
          Your profile has been updated successfully.
        </Alert>
      )}

      <Card withBorder p="md" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Center>
              <Box className={classes.avatarContainer} onClick={() => setModalOpen(true)}>
                <Avatar
                  src={photoURL}
                  size={180}
                  radius="xl"
                  color="blue"
                />
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="sm"
                  radius="xl"
                  className={classes.avatarEditButton}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Box>
            </Center>

            <TextInput
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <Text size="sm" c="dimmed">
              Your profile information will be displayed on blog posts and other parts of the application.
            </Text>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </Stack>
        </form>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setImageUrl('');
          setUrlError(null);
        }}
        title="Update Profile Picture"
        size="md"
      >
        <Stack>
          <TextInput
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            error={urlError}
          />
          <Text size="xs" c="dimmed">
            Enter a URL to an image that is publicly accessible
          </Text>

          <Alert icon={<IconAlertCircle size={16} />} title="Note" color="blue">
            Image uploading is currently disabled. Please use an image URL instead.
          </Alert>

          <Group justify="space-between" mt="xl">
            <Group>
              {photoURL && (
                <Button
                  variant="subtle"
                  color="red"
                  onClick={handleClearProfilePicture}
                >
                  Clear Picture
                </Button>
              )}
            </Group>

            <Group>
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImageUrlSubmit}
                loading={loading}
              >
                Use Image URL
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}; 