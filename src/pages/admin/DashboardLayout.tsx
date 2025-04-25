import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppShell, Group, Button, Text, Stack, Divider, Badge } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type BlogName = 'awardsBlog' | 'policyBlog' | 'chapterMeetingBlog';

interface UserPermissions {
  permissions: {
    awardsBlog: boolean;
    policyBlog: boolean;
    chapterMeetingBlog: boolean;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout, currentUser, refreshUserClaims, loading } = useAuth();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const db = getFirestore(app);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (currentUser) {
        try {
          const permissionsDoc = await getDoc(doc(db, 'UserPermissions', currentUser.uid));
          if (permissionsDoc.exists()) {
            setPermissions(permissionsDoc.data() as UserPermissions);
          }
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }
    };

    fetchPermissions();
  }, [currentUser, db]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return null;
  }

  // If user is executive or owner, they have access to all blogs
  const hasAccess = (blogName: BlogName) => {
    if (currentUser.executive || currentUser.owner) {
      return true;
    }
    return permissions?.permissions?.[blogName] === true;
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Text size="xl" fw={700}>ACP Admin Dashboard</Text>
            <Group gap="xs">
              <Text size="sm" c="dimmed">{currentUser.email}</Text>
              {(currentUser.owner && <Badge color="yellow">Owner</Badge>) ||
                (currentUser.executive && <Badge color="purple">Executive</Badge>)}
            </Group>
          </Group>
          <Button onClick={handleLogout} variant="subtle" color="red">
            Logout
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <Button
            component={Link}
            to="/admin/dashboard"
            variant="filled"
            fullWidth
            mb="md"
          >
            Dashboard Home
          </Button>

          <Text fw={700} size="lg" mb="md">Committees</Text>
          <Button
            component={Link}
            to="/admin/dashboard/awards"
            variant="subtle"
            fullWidth
            rightSection={
              <Badge
                color={hasAccess('awardsBlog') ? "green" : "gray"}
                size="sm"
              >
                {hasAccess('awardsBlog') ? "Access" : "No Access"}
              </Badge>
            }
          >
            Awards
          </Button>
          <Button
            component={Link}
            to="/admin/dashboard/policy"
            variant="subtle"
            fullWidth
            rightSection={
              <Badge
                color={hasAccess('policyBlog') ? "green" : "gray"}
                size="sm"
              >
                {hasAccess('policyBlog') ? "Access" : "No Access"}
              </Badge>
            }
          >
            Policy
          </Button>
          <Button
            component={Link}
            to="/admin/dashboard/chapter-meeting"
            variant="subtle"
            fullWidth
            rightSection={
              <Badge
                color={hasAccess('chapterMeetingBlog') ? "green" : "gray"}
                size="sm"
              >
                {hasAccess('chapterMeetingBlog') ? "Access" : "No Access"}
              </Badge>
            }
          >
            Chapter Meeting
          </Button>

          <Divider my="md" />

          <Text fw={700} size="lg" mb="md">Account</Text>
          <Button
            component={Link}
            to="/admin/dashboard/profile"
            variant="subtle"
            fullWidth
          >
            Profile Settings
          </Button>
          <Button
            component={Link}
            to="/admin/dashboard/permissions"
            variant="subtle"
            fullWidth
          >
            Permissions
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}; 