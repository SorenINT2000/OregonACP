import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppShell, Group, Button, Text, Stack, Divider } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text size="xl" fw={700}>ACP Admin Dashboard</Text>
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
          >
            Awards Committee
          </Button>
          <Button
            component={Link}
            to="/admin/dashboard/policy"
            variant="subtle"
            fullWidth
          >
            Policy Committee
          </Button>
          <Button
            component={Link}
            to="/admin/dashboard/chapter-meeting"
            variant="subtle"
            fullWidth
          >
            Chapter Meeting Committee
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
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}; 