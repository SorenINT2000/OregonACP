import React, { useState, useEffect } from 'react';
import { Table, Avatar, Group, Text, Badge, Button, Accordion, Stack, Switch, Modal, Skeleton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'firebase/auth';

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

interface PermissionsTableProps {
  executiveUsers: UserProfile[];
  nonExecutiveUsers: UserProfile[];
  userPermissions: { [key: string]: UserPermissions };
  loading: boolean;
  onRefresh: () => void;
}

const COMMITTEES: { id: string; name: string }[] = [
  { id: 'awardsBlog', name: 'Awards Committee' },
  { id: 'policyBlog', name: 'Policy Committee' },
  { id: 'chapterMeetingBlog', name: 'Chapter Meeting Committee' }
];

// Executive Users Table Component
interface ExecutiveUsersTableProps {
  users: UserProfile[];
  userPermissions: { [key: string]: UserPermissions };
  currentUser: User | null;
  isOwner: boolean;
  onOpenConfirmModal: (user: UserProfile) => void;
  loading?: boolean;
}

const ExecutiveUsersTable: React.FC<ExecutiveUsersTableProps> = ({
  users,
  userPermissions,
  currentUser,
  isOwner,
  onOpenConfirmModal,
  loading = false
}) => {
  const renderExecutiveUserRow = (user: UserProfile) => {
    return (
      <Table.Tr key={user.id}>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
          <Group gap="sm" justify="center">
            <Avatar src={user.photoURL} radius="xl" size="sm" />
            <Text size="sm" fw={500}>
              {user.displayName}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>{user.email}</Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>{user.createdAt?.toLocaleDateString()}</Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>
          {user.owner ? (
            <Badge color="yellow">Owner</Badge>
          ) : (
            <Badge color="purple">Executive</Badge>
          )}
        </Table.Td>
        {isOwner && (
          <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
            {!user.owner && (
              <Group justify="center">
                <Button
                  size="xs"
                  color="purple"
                  variant="light"
                  onClick={() => onOpenConfirmModal(user)}
                >
                  Remove Executive
                </Button>
              </Group>
            )}
          </Table.Td>
        )}
      </Table.Tr>
    );
  };

  const renderSkeletonRow = (index: number) => (
    <Table.Tr key={`exec-skeleton-${index}`}>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Group gap="sm" justify="center">
          <Skeleton circle height={32} width={32} />
          <Skeleton height={24} width={100} />
        </Group>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Skeleton height={24} width={150} mx="auto" />
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Skeleton height={24} width={100} mx="auto" />
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>
        <Skeleton height={24} width={100} mx="auto" />
      </Table.Td>
      {isOwner && (
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
          <Skeleton height={24} width={100} mx="auto" />
        </Table.Td>
      )}
    </Table.Tr>
  );

  if (users.length === 0 && !loading) {
    return null;
  }

  return (
    <div>
      <Group justify="center" mb="md">
        <Badge size="xl" color="purple">Executive Users</Badge>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>User</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Email</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Created</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>Status</Table.Th>
            {isOwner && (
              <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Actions</Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <>
              {renderSkeletonRow(0)}
              {renderSkeletonRow(1)}
            </>
          ) : (
            users.map(renderExecutiveUserRow)
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

// Non-Executive Users Table Component
interface NonExecutiveUsersTableProps {
  users: UserProfile[];
  userPermissions: { [key: string]: UserPermissions };
  currentUser: User | null;
  isExecutive: boolean;
  isOwner: boolean;
  onPermissionChange: (userId: string, committeeId: string, newValue: boolean) => void;
  onOpenConfirmModal: (user: UserProfile) => void;
  loading?: boolean;
}

const NonExecutiveUsersTable: React.FC<NonExecutiveUsersTableProps> = ({
  users,
  userPermissions,
  currentUser,
  isExecutive,
  isOwner,
  onPermissionChange,
  onOpenConfirmModal,
  loading = false
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const renderUserRow = (user: UserProfile) => {
    const permissions = userPermissions[user.id]?.permissions || {
      awardsBlog: false,
      policyBlog: false,
      chapterMeetingBlog: false
    };

    return (
      <Table.Tr key={user.id}>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
          <Group gap="sm" justify="center">
            <Avatar src={user.photoURL} radius="xl" size="sm" />
            <Text size="sm" fw={500}>
              {user.displayName}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>{user.email}</Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>{user.createdAt?.toLocaleDateString()}</Table.Td>
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>
          <Accordion
            value={expandedUser === user.id ? user.id : null}
            onChange={(value) => setExpandedUser(value as string)}
            styles={{
              root: {
                width: '100%'
              },
              content: {
                width: '100%',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Accordion.Item value={user.id}>
              <Accordion.Control>
                <Group justify="space-between">
                  <Text>Permissions</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack p="md">
                  <Text size="sm" c="dimmed" mb="md">
                    {isExecutive
                      ? 'As an executive, you can manage all user permissions and profile settings.'
                      : 'Toggle permissions for each committee. Users with permissions can post to their respective committee blogs.'}
                  </Text>

                  {COMMITTEES.map(committee => (
                    <Group key={committee.id} justify="space-between" wrap="nowrap">
                      <div>
                        <Text fw={500}>{committee.name}</Text>
                        <Text size="sm" c="dimmed">
                          {permissions[committee.id]
                            ? 'Can post to committee blog'
                            : 'Cannot post to committee blog'}
                        </Text>
                      </div>
                      <Switch
                        checked={permissions[committee.id] || false}
                        onChange={(event) => onPermissionChange(user.id, committee.id, event.currentTarget.checked)}
                        disabled={!isExecutive && !isOwner}
                      />
                    </Group>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Table.Td>
        {isOwner && (
          <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
            <Group justify="center">
              <Button
                size="xs"
                color="purple"
                variant="light"
                onClick={() => onOpenConfirmModal(user)}
              >
                Make Executive
              </Button>
            </Group>
          </Table.Td>
        )}
      </Table.Tr>
    );
  };

  const renderSkeletonRow = (index: number) => (
    <Table.Tr key={`non-exec-skeleton-${index}`}>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Group gap="sm" justify="center">
          <Skeleton circle height={32} width={32} />
          <Skeleton height={24} width={100} />
        </Group>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Skeleton height={24} width={150} mx="auto" />
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
        <Skeleton height={24} width={100} mx="auto" />
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>
        <Skeleton height={24} />
      </Table.Td>
      {isOwner && (
        <Table.Td style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>
          <Skeleton height={24} width={100} mx="auto" />
        </Table.Td>
      )}
    </Table.Tr>
  );

  return (
    <div>
      <Group justify="center" mb="md">
        <Badge size="xl" color="blue">Regular Users</Badge>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>User</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Email</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Created</Table.Th>
            <Table.Th style={{ textAlign: 'center', padding: '1rem', width: isOwner ? '40%' : '55%' }}>Permissions</Table.Th>
            {isOwner && (
              <Table.Th style={{ textAlign: 'center', padding: '1rem', width: '15%' }}>Actions</Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <>
              {renderSkeletonRow(0)}
              {renderSkeletonRow(1)}
              {renderSkeletonRow(2)}
            </>
          ) : (
            users.map(renderUserRow)
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

// Main PermissionsTable Component
export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  executiveUsers,
  nonExecutiveUsers,
  userPermissions,
  loading,
  onRefresh
}) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { currentUser } = useAuth();
  const isExecutive = currentUser?.executive === true;
  const isOwner = currentUser?.owner === true;
  const functions = getFunctions();

  // Set isInitialLoad to false after the first load completes
  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  const handleExecutiveToggle = async (userId: string, newValue: boolean) => {
    try {
      console.log('Toggling executive status:', { userId, newValue });

      const setExecutiveClaim = httpsCallable(functions, 'setExecutiveClaim');
      await setExecutiveClaim({ uid: userId, isExecutive: newValue });

      // Refresh the data after updating
      onRefresh();

      notifications.show({
        title: 'Success',
        message: `User ${newValue ? 'promoted to' : 'demoted from'} executive status`,
        color: 'green'
      });
    } catch (error) {
      console.error('Error toggling executive status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update executive status',
        color: 'red'
      });
    }
  };

  const handlePermissionChange = async (userId: string, committeeId: string, newValue: boolean) => {
    try {
      // Check if the current user has permission to make this change
      if (!isExecutive && !isOwner) {
        throw new Error('You do not have permission to update user permissions');
      }

      // Get the target user's permissions to check if they are an executive
      const targetUserPermissions = userPermissions[userId];
      if (!targetUserPermissions) {
        throw new Error('User permissions not found');
      }

      // Only allow updating permissions for non-executive users
      if (targetUserPermissions.executive) {
        throw new Error('Cannot update permissions for executive users');
      }

      // Call the cloud function to update permissions
      const updateUserPermissions = httpsCallable(functions, 'updateUserPermissions');
      await updateUserPermissions({
        userId,
        committeeId,
        newValue
      });

      // Refresh the data after updating
      onRefresh();

      notifications.show({
        title: 'Success',
        message: 'Permissions updated successfully',
        color: 'green'
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update permissions',
        color: 'red'
      });
    }
  };

  const openConfirmModal = (user: UserProfile) => {
    setSelectedUser(user);
    setConfirmModalOpen(true);
  };

  // Only show loading skeletons during initial load
  const showLoadingSkeletons = loading && isInitialLoad;

  return (
    <>
      <Stack gap="xl">
        <ExecutiveUsersTable
          users={executiveUsers}
          userPermissions={userPermissions}
          currentUser={currentUser}
          isOwner={isOwner}
          onOpenConfirmModal={openConfirmModal}
          loading={showLoadingSkeletons}
        />
        <NonExecutiveUsersTable
          users={nonExecutiveUsers}
          userPermissions={userPermissions}
          currentUser={currentUser}
          isExecutive={isExecutive}
          isOwner={isOwner}
          onPermissionChange={handlePermissionChange}
          onOpenConfirmModal={openConfirmModal}
          loading={showLoadingSkeletons}
        />
      </Stack>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Action"
        centered
      >
        {selectedUser && (
          <Stack>
            <Text>
              {selectedUser.executive
                ? `Are you sure you want to remove executive privileges from ${selectedUser.displayName}?`
                : `Are you sure you want to make ${selectedUser.displayName} an executive?`}
            </Text>
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
              <Button
                color={selectedUser.executive ? "red" : "blue"}
                onClick={() => {
                  handleExecutiveToggle(selectedUser.id, !selectedUser.executive);
                  setConfirmModalOpen(false);
                }}
              >
                {selectedUser.executive ? "Remove Executive" : "Make Executive"}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}; 