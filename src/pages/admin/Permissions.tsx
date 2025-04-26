import React, { useState, useEffect } from 'react';
import { Container, Title, Group, Badge, Paper, Button, Modal, TextInput, Stack } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionsTable } from '../../components/PermissionsTable';
import { notifications } from '@mantine/notifications';
import { collection, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

// Define interfaces
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
  updatedAt: Date;
  executive: boolean;
  owner: boolean;
}

interface UserPermissions {
  id: string;
  executive: boolean;
  owner: boolean;
  permissions: {
    [key: string]: boolean;
  };
}

export const Permissions: React.FC = () => {
  const { currentUser } = useAuth();
  const isExecutive = currentUser?.executive === true;
  const isOwner = currentUser?.owner === true;
  const [loading, setLoading] = useState(true);
  const [executiveUsers, setExecutiveUsers] = useState<UserProfile[]>([]);
  const [nonExecutiveUsers, setNonExecutiveUsers] = useState<UserProfile[]>([]);
  const [userPermissions, setUserPermissions] = useState<{ [key: string]: UserPermissions }>({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const functions = getFunctions();

  const fetchPermissions = async () => {
    try {
      setLoading(true);

      // Get user profiles from Firestore
      const usersRef = collection(db, 'UserProfiles');
      console.log('Fetching user profiles from Firestore');

      const usersSnapshot = await getDocs(usersRef);
      const userIds = usersSnapshot.docs.map(doc => doc.id);

      if (userIds.length === 0) {
        console.warn('No users found in UserProfiles collection');
        notifications.show({
          title: 'Warning',
          message: 'No users found in the database',
          color: 'yellow'
        });
        return;
      }

      // Get user claims using the Cloud Function
      const getUserClaims = httpsCallable(functions, 'getUserClaims');
      console.log('Calling getUserClaims with uids:', userIds);

      const claimsResult = await getUserClaims({
        uids: userIds
      }) as {
        data: {
          claims: {
            [key: string]: {
              executive: boolean,
              owner: boolean
            }
          }
        }
      };

      console.log('Claims result:', claimsResult);
      const { claims } = claimsResult.data;

      // Create UserProfile objects from user profiles and claims
      const users = usersSnapshot.docs.map(doc => {
        const userData = doc.data();
        const userClaims = claims[doc.id] || { executive: false, owner: false };
        return {
          id: doc.id,
          displayName: userData.displayName || 'Unknown',
          email: userData.email || '',
          photoURL: userData.photoURL || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
          executive: userClaims.executive || false,
          owner: userClaims.owner || false
        };
      }) as UserProfile[];

      console.log('Processed users:', users);

      // Fetch all user permissions from Firestore
      const permissionsRef = collection(db, 'UserPermissions');
      const permissionsSnapshot = await getDocs(permissionsRef);
      const permissionsData = permissionsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().permissions || {};
        return acc;
      }, {} as { [key: string]: { [key: string]: boolean } });

      // Create permissions object with actual permissions from Firestore
      const permissions = {} as { [key: string]: UserPermissions };

      // Set up permissions with actual values from Firestore
      users.forEach(user => {
        const userPerms = permissionsData[user.id] || {};
        permissions[user.id] = {
          id: user.id,
          executive: user.executive,
          owner: user.owner,
          permissions: {
            awardsBlog: userPerms.awardsBlog || false,
            policyBlog: userPerms.policyBlog || false,
            chapterMeetingBlog: userPerms.chapterMeetingBlog || false
          }
        };
      });

      setUserPermissions(permissions);

      // Split users into executive and non-executive
      const executiveUsersList = users.filter(user => user.executive);
      const nonExecutiveUsersList = users.filter(user => !user.executive);

      console.log('Final lists:', {
        executiveUsers: executiveUsersList,
        nonExecutiveUsers: nonExecutiveUsersList
      });

      setExecutiveUsers(executiveUsersList);
      setNonExecutiveUsers(nonExecutiveUsersList);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch permissions: ' + (error instanceof Error ? error.message : String(error)),
        color: 'red'
      });
    }
    setLoading(false);
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      notifications.show({
        title: 'Error',
        message: 'Please enter an email address',
        color: 'red'
      });
      return;
    }

    setInviteLoading(true);

    try {
      // Use the Cloud Function to create the user
      const functions = getFunctions();
      const createUser = httpsCallable(functions, 'createUser');

      try {
        const result = await createUser({ email: inviteEmail });
        console.log('Create user result:', result);
      } catch (error: any) {
        console.error('Error creating user:', error);

        // Check if the error is because the user already exists
        if (error.message && error.message.includes('already exists')) {
          notifications.show({
            title: 'Error',
            message: 'A user with this email already exists',
            color: 'red'
          });
          setInviteLoading(false);
          return;
        }

        // For other errors, show a more detailed message
        notifications.show({
          title: 'Error',
          message: `Failed to create user: ${error.message || 'Unknown error'}`,
          color: 'red'
        });
        setInviteLoading(false);
        return;
      }

      // Send password reset email
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, inviteEmail);

        notifications.show({
          title: 'Success',
          message: 'Password reset email sent successfully',
          color: 'green'
        });

        setInviteModalOpen(false);
        setInviteEmail('');
      } catch (error: any) {
        console.error('Error sending password reset email:', error);

        notifications.show({
          title: 'Warning',
          message: 'User created but failed to send password reset email.',
          color: 'yellow'
        });
      }
    } catch (error) {
      console.error('Error in invite user process:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to process invitation',
        color: 'red'
      });
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    // setLoading(true);
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container size="xl">
      <Group justify="space-between" mb="md">
        <Title order={1}>Permissions Management</Title>
        <Group>
          {(isExecutive || isOwner) && (
            <Button
              onClick={() => setInviteModalOpen(true)}
              variant="filled"
              color="blue"
            >
              Invite User
            </Button>
          )}
          {(isOwner && (
            <Badge size="lg" color="yellow">Owner Access</Badge>
          )) || (isExecutive && (
            <Badge size="lg" color="purple">Executive Access</Badge>
          ))}
        </Group>
      </Group>
      <Paper shadow="xs" p="md">
        <PermissionsTable
          executiveUsers={executiveUsers}
          nonExecutiveUsers={nonExecutiveUsers}
          userPermissions={userPermissions}
          loading={loading}
          onRefresh={fetchPermissions}
        />
      </Paper>

      <Modal
        opened={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New User"
        centered
      >
        <Stack>
          <TextInput
            label="Email Address"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              loading={inviteLoading}
            >
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}; 