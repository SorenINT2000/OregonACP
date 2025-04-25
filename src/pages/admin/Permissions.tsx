import React, { useState, useEffect } from 'react';
import { Container, Title, Group, Badge, Paper } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionsTable } from '../../components/PermissionsTable';
import { notifications } from '@mantine/notifications';
import { collection, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../firebase';

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

  useEffect(() => {
    // setLoading(true);
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container size="xl">
      <Group justify="space-between" mb="md">
        <Title order={1}>Permissions Management</Title>
        {(isOwner && (
          <Badge size="lg" color="yellow">Owner Access</Badge>
        )) || (isExecutive && (
          <Badge size="lg" color="purple">Executive Access</Badge>
        ))}
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
    </Container>
  );
}; 