import React, { useState, useEffect, useRef } from 'react';
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
  ActionIcon,
  Progress,
  Tabs,
  FileButton
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconEdit, IconUpload, IconPhoto } from '@tabler/icons-react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app, storage } from '../../firebase';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('upload');
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Function to delete a profile picture from storage
  const deleteProfilePictureFromStorage = async (url: string) => {
    try {
      // Only attempt to delete if the URL is from our Firebase Storage
      if (url.includes('firebasestorage.googleapis.com')) {
        // Extract the path from the URL
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
        console.log('Successfully deleted old profile picture from storage');
      }
    } catch (err) {
      console.error('Error deleting old profile picture from storage:', err);
      // Don't throw the error - we don't want to block the profile update if deletion fails
    }
  };

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

          setDisplayName(userData.displayName || auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || '');
          setPhotoURL(userData.photoURL || auth.currentUser.photoURL || '');
        } else {
          console.log('User document does not exist in Firestore, creating new document');

          // Create a new user document with default values
          const newUserData = {
            displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || '',
            email: auth.currentUser.email || '',
            photoURL: auth.currentUser.photoURL || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Set the document in Firestore
          await setDoc(userDocRef, newUserData);

          // Update local state with the new user data
          setDisplayName(newUserData.displayName);
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

      // Store the old photo URL before updating
      const oldPhotoURL = photoURL;

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

        // Delete the old profile picture from storage if it exists and is from our storage
        if (oldPhotoURL) {
          await deleteProfilePictureFromStorage(oldPhotoURL);
        }

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

  const handleFileUpload = async () => {
    if (!file || !auth.currentUser) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Store the old photo URL before updating
      const oldPhotoURL = photoURL;

      // Create a storage reference
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}/${fileName}`);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          setError('Failed to upload image. Please try again.');
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Ensure user is still logged in
            if (!auth.currentUser) {
              throw new Error('User is no longer logged in');
            }

            // Update the user's profile picture in Firebase Auth
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL
            });

            // Update the Firestore document
            const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
            await updateDoc(userDocRef, {
              photoURL: downloadURL
            });

            // Delete the old profile picture from storage if it exists and is from our storage
            if (oldPhotoURL) {
              await deleteProfilePictureFromStorage(oldPhotoURL);
            }

            // Update the local state
            setPhotoURL(downloadURL);
            setFile(null);
            setUploading(false);
            setModalOpen(false);

            // Reset the file input
            if (resetRef.current) {
              resetRef.current();
            }
          } catch (error) {
            console.error('Error updating profile with uploaded image:', error);
            setError('Failed to update profile with uploaded image.');
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error in file upload process:', error);
      setError('An unexpected error occurred during upload.');
      setUploading(false);
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
      // Store the old photo URL before clearing
      const oldPhotoURL = photoURL;

      // Update the user's profile picture in Firebase Auth
      await updateProfile(auth.currentUser, {
        photoURL: null
      });

      // Update the Firestore document
      const userDocRef = doc(db, 'UserProfiles', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL: null
      });

      // Delete the old profile picture from storage if it exists and is from our storage
      if (oldPhotoURL) {
        await deleteProfilePictureFromStorage(oldPhotoURL);
      }

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
          setFile(null);
          setUploadProgress(0);
          setUploading(false);
          if (resetRef.current) {
            resetRef.current();
          }
        }}
        title="Update Profile Picture"
        size="md"
      >
        <Stack>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="upload" leftSection={<IconUpload size={16} />}>
                Upload Image
              </Tabs.Tab>
              <Tabs.Tab value="url" leftSection={<IconPhoto size={16} />}>
                Image URL
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="upload" pt="md">
              <Stack>
                <FileButton
                  resetRef={resetRef}
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={setFile}
                  disabled={uploading}
                >
                  {(props) => (
                    <Button {...props} leftSection={<IconUpload size={16} />}>
                      Select Image
                    </Button>
                  )}
                </FileButton>

                {file && (
                  <Text size="sm">
                    Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Text>
                )}

                {uploading && (
                  <Stack>
                    <Text size="sm">Uploading: {uploadProgress.toFixed(0)}%</Text>
                    <Progress value={uploadProgress} size="sm" />
                  </Stack>
                )}

                <Group justify="space-between" mt="xl">
                  <Group>
                    {photoURL && (
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={handleClearProfilePicture}
                        disabled={uploading}
                      >
                        Clear Picture
                      </Button>
                    )}
                  </Group>

                  <Group>
                    <Button variant="subtle" onClick={() => setModalOpen(false)} disabled={uploading}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFileUpload}
                      loading={uploading}
                      disabled={!file || uploading}
                    >
                      Upload Image
                    </Button>
                  </Group>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="url" pt="md">
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
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Modal>
    </Stack>
  );
}; 