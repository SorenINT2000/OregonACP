import React, { useState, useEffect, useRef } from 'react';
import { Text, Card, SimpleGrid, Group, Avatar, Badge, Stack, Container, Modal, ActionIcon, Switch, Button, Pagination, Center, Popover, Loader, Divider } from '@mantine/core';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, updateDoc, doc, deleteDoc, limit, where, getCountFromServer, getDoc, addDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import classes from './BlogPostGrid.module.css';
import { IconEdit, IconTrash, IconEye, IconEyeClosed, IconPlus } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextEditor } from '../RichTextEditor';
import { PostCard } from './PostCard';
import { Skeleton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import Placeholder from '@tiptap/extension-placeholder';


interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string;
}

interface BlogPost {
  id: string;
  authorId?: string;
  body: string;
  organization: string;
  timestamp: Timestamp;
  visible: boolean;
}

interface BlogPostGridProps {
  organization?: string;
  showInvisiblePosts?: boolean;
  showAuthorInfo?: boolean;
  showControls?: boolean;
  refreshTrigger?: number;
  resetRefreshTrigger?: () => void;
  showCreateCard?: boolean;
}

// Committee gradient colors
const committeeGradients = {
  awards: { from: '#fab005', to: '#fa5252' },
  policy: { from: '#15aabf', to: '#40c057' },
  chapterMeeting: { from: '#7950f2', to: '#228be6' },
  default: { from: '#bbbbbb', to: '#000000' }
};

const committeeNames = {
  awards: 'Awards',
  policy: 'Policy',
  chapterMeeting: 'Chapter Meeting',
  default: 'Unknown'
};

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  organization,
  showInvisiblePosts = false,
  showAuthorInfo = false,
  showControls = false,
  showCreateCard = false,
  refreshTrigger = 0,
  resetRefreshTrigger = () => { },
}) => {

  const committeeName = committeeNames[organization as keyof typeof committeeNames] || committeeNames.default;
  const committeeGradient = committeeGradients[organization as keyof typeof committeeGradients] || committeeGradients.default;

  // Posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);

  // Pagination
  const postsPerPage = 6;
  const [postCount, setPostCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lastVisible = useRef<any>(null);
  const firstVisible = useRef<any>(null);
  const previousPage = useRef(1);

  // Post Details
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState('');
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  // Create Post Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createContent, setCreateContent] = useState('');
  const [canPost, setCanPost] = useState(false);

  // Firestore
  const db = getFirestore(app);
  const auth = getAuth(app);
  const { currentUser } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      })
    ],
    content: editContent,
    onUpdate: ({ editor }) => {
      setEditContent(editor.getHTML());
    },
  });

  const createEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: 'Compose a blog post',
      }),
    ],
    content: createContent,
    onUpdate: ({ editor }) => {
      setCreateContent(editor.getHTML());
    },
  });

  // Check if user has permission to post
  useEffect(() => {
    const checkPermissions = async () => {
      if (!auth.currentUser) {
        setCanPost(false);
        return;
      }

      // Check if user is executive or owner - they should have access to all blogs
      if (currentUser?.executive || currentUser?.owner) {
        console.log('User is executive or owner, granting access');
        setCanPost(true);
        return;
      }

      // For non-executive/non-owner users, check specific blog permissions
      if (organization) {
        try {
          const permissionsRef = doc(db, 'UserPermissions', auth.currentUser.uid);
          const permissionsDoc = await getDoc(permissionsRef);

          console.log('Permissions doc exists:', permissionsDoc.exists());
          if (permissionsDoc.exists()) {
            const data = permissionsDoc.data();
            console.log('Permissions data:', data);
            // Check if the permissions object exists and has the specific blog permission
            const hasPermission = data?.permissions?.[`${organization}Blog`] === true;
            console.log('Has permission for', organization, ':', hasPermission);
            setCanPost(hasPermission);
          } else {
            console.log('No permissions document found');
            setCanPost(false);
          }
        } catch (error) {
          console.error('Error checking permissions:', error);
          setCanPost(false);
        }
      } else {
        // If no organization specified, only executives/owners can post
        setCanPost(false);
      }
    };

    if (showCreateCard) {
      checkPermissions();
    }
  }, [db, organization, currentUser, auth.currentUser, showCreateCard]);

  // Handle creating a new post
  const handleCreateSubmit = async () => {
    if (!auth.currentUser) return;
    if (!createContent.trim()) return;

    try {
      await addDoc(collection(db, 'blogPosts'), {
        authorId: auth.currentUser.uid,
        body: createContent,
        timestamp: Timestamp.now(),
        visible: true,
        organization: organization
      });

      setCreateContent('');
      createEditor?.commands.setContent('');
      setCreateModalOpen(false);

      // Increment refresh trigger to cause a refresh
      if (resetRefreshTrigger) {
        resetRefreshTrigger();
      }

      // Refresh the posts
      fetchPosts();

      notifications.show({
        title: 'Success',
        message: 'Post created successfully',
        color: 'green'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      if (error instanceof Error)
        notifications.show({
          title: 'Error creating post',
          message: error.message,
          color: 'red'
        });
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Count the number of posts that match the filters
      let filteredQuery = query(
        collection(db, 'blogPosts'),
        ...(showInvisiblePosts ? [] : [where('visible', '==', true)]),
        ...(organization ? [where('organization', '==', organization)] : []),
      );

      const countSnapshot = await getCountFromServer(filteredQuery);
      setPostCount(countSnapshot.data().count);

      // Calculate how many pages to skip
      const pagesToSkip = currentPage - 1;
      const adjustedPostsToFetch =
        (currentPage === 1 && showCreateCard && canPost)
          ? postsPerPage - 1  // Fetch one less post
          : postsPerPage;
      const postsToSkip = pagesToSkip * adjustedPostsToFetch;

      // Get all posts up to the current page
      let postsQuery = query(
        filteredQuery,
        orderBy('timestamp', 'desc'),
        limit(postsToSkip + adjustedPostsToFetch)
      );

      const postsSnapshot = await getDocs(postsQuery);
      const fetchedPosts = postsSnapshot.docs
        .slice(postsToSkip) // Get only the posts for the current page
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];

      // Update pagination state
      if (postsSnapshot.docs.length > 0) {
        firstVisible.current = postsSnapshot.docs[0];
        lastVisible.current = postsSnapshot.docs[postsSnapshot.docs.length - 1];
      }

      setPosts(fetchedPosts);

      // Collect all unique authorIds from the fetched posts
      const authorIds = fetchedPosts.map(post => post.authorId);

      if (authorIds.length > 0) {
        // Fetch author info
        try {
          const authorsInfo: Record<string, UserInfo> = {};

          // Use Promise.all to handle multiple async operations
          await Promise.all(Array.from(authorIds).map(async (authorId) => {
            if (authorId) {
              const authorRef = doc(db, 'UserProfiles', authorId);
              const authorSnapshot = await getDoc(authorRef);
              if (authorSnapshot.exists()) {
                const authorInfo = authorSnapshot.data() as UserInfo;
                authorsInfo[authorId] = authorInfo;
              }
            }
          }));

          setAuthors(authorsInfo);
        } catch (error) {
          console.error('Error fetching authors:', error);
          if (error instanceof Error)
            notifications.show({
              title: 'Error fetching authors',
              message: error.message,
              color: 'red'
            });
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error instanceof Error)
        notifications.show({
          title: 'Error fetching posts',
          message: error.message,
          color: 'red'
        });
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (newVisibility: boolean) => {
    if (!selectedPost) {
      console.error('Post not found for visibility toggle');
      return;
    }

    try {
      // Start loading animation
      setVisibilityLoading(true);

      // Update in Firestore
      await updateDoc(doc(db, 'blogPosts', selectedPost.id), {
        visible: newVisibility,
      });

      // Update local state immediately
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === selectedPost.id
          ? { ...post, visible: newVisibility }
          : post
      ));

      // Update selected post state
      setSelectedPost(prev => prev ? { ...prev, visible: newVisibility } : null);
    } catch (error: any) {
      console.error('Error updating post visibility:', error);
      if (error instanceof Error)
        notifications.show({
          title: 'Error updating post visibility',
          message: error.message,
          color: 'red'
        });
    } finally {
      // Stop loading animation
      setVisibilityLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) {
      console.error('No post selected for deletion');
      return;
    }

    try {
      // Delete from collection
      await deleteDoc(doc(db, 'blogPosts', selectedPost.id));

      // Handle edge case: last post on last page
      const isLastPage = currentPage === Math.ceil(postCount / postsPerPage);
      const isLastPostOnPage = posts.length === 1;

      if (isLastPage && isLastPostOnPage && currentPage > 1) {
        // Go to previous page
        setCurrentPage(prev => prev - 1);
      } else {
        // Update local state immediately
        setPosts(prevPosts => prevPosts.filter(p => p.id !== selectedPost.id));

        // Refetch posts for current page to fill in the gap
        fetchPosts();
      }

      setSelectedPost(null);
      setDeletePopoverOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error instanceof Error)
        notifications.show({
          title: 'Error deleting post',
          message: error.message,
          color: 'red'
        });
    }
  }

  const handleEdit = async () => {
    if (!selectedPost) return;

    try {
      // Update in the master collection
      await updateDoc(doc(db, 'blogPosts', selectedPost.id), {
        body: editor?.getHTML() || '',
        timestamp: Timestamp.now(),
      });

      // Update local state
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === selectedPost.id
          ? { ...post, body: editor?.getHTML() || '' }
          : post
      ));

      setSelectedPost(prev => prev ? { ...prev, body: editor?.getHTML() || '' } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      if (error instanceof Error)
        notifications.show({
          title: 'Error updating post',
          message: error.message,
          color: 'red'
        });
    }
  };

  const startEditing = (post: BlogPost) => {
    editor?.commands.setContent(post.body);
    setIsEditing(true);
  };

  // Handle refresh trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Reset pagination when refresh is triggered
      setCurrentPage(1);
      previousPage.current = 1;
      lastVisible.current = null;
      firstVisible.current = null;
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Handle regular pagination and filter changes
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, currentPage, organization, showInvisiblePosts, editor]);

  // Editor content updates
  useEffect(() => {
    if (selectedPost && editor) {
      editor.commands.setContent(selectedPost.body);
    }
  }, [selectedPost, editor]);

  // Add Ctrl+S shortcut for saving when in edit mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's' && isEditing) {
        event.preventDefault(); // Prevent browser save dialog
        handleEdit();
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  return (
    <Container size="xl">
      <Stack>
        {/* Pagination */}
        <Center>
          <Pagination
            total={Math.ceil(postCount / postsPerPage)}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Center>

        {/* Posts */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" verticalSpacing="md">
          {/* Create Post Card */}
          {showCreateCard && canPost && !loading && (
            <Card
              withBorder
              padding="lg"
              radius="md"
              className={classes.card}
              onClick={() => setCreateModalOpen(true)}
              style={{
                cursor: 'pointer',
                border: '2px dashed var(--mantine-color-gray-4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '360px'
              }}
            >
              <IconPlus size={48} stroke={1.5} color="var(--mantine-color-gray-6)" />
              <Text size="lg" fw={500} mt="md" c="dimmed">Create New Post</Text>
            </Card>
          )}

          {/* If loading, show skeletons */}
          {loading &&
            Array.from({ length: postsPerPage }).map((_, index) => (
              <Skeleton key={index} height='360px' width='420px' radius="md" />
            ))}

          {/* If there are no posts, show a card with a message */}
          {!loading && postCount === 0 && !showCreateCard && (
            <Card withBorder>
              <Text>No posts available.</Text>
            </Card>
          )}

          {/* Otherwise show the posts */}
          {!loading && posts?.length > 0 &&
            posts.map((post) =>
              <PostCard
                key={post.id}
                post={post}
                authorInfo={showAuthorInfo ? authors[post.authorId as string] : undefined}
                onPostClick={() => setSelectedPost(post)}
                enableEdit={showControls}
              />)}
        </SimpleGrid>

        {/* Create Post Modal */}
        <Modal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          size="xl"
          title={
            <Stack gap="5">
              <Group>
                <Text
                  variant="gradient"
                  gradient={{ from: committeeGradient.from, to: committeeGradient.to, deg: 90 }}
                  fw={1000}
                  size="xl"
                >
                  Create New {committeeName} Post
                </Text>
              </Group>

              {/* Gradient-colored divider */}
              <Divider
                py="0"
                style={{
                  background: `linear-gradient(90deg, ${committeeGradient.from}, ${committeeGradient.to})`,
                  height: '2px',
                  width: '100%'
                }}
              />
            </Stack>
          }
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateSubmit();
          }}>
            <Stack>
              <RichTextEditor
                editor={createEditor}
                minHeight="250px"
                showTextFormatting={true}
                showHeadingFormatting={true}
                showListFormatting={true}
                showBlockquoteFormatting={true}
                showHorizontalRuleFormatting={true}
              />
              <Group justify="flex-end">
                <Button variant="subtle" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Post</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* View/Edit Post Modal */}
        {selectedPost && (
          <Modal
            opened={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            size="xl"
            styles={{
              header: {
                paddingBottom: 0,
                width: '100%'
              }
            }}
            title={
              <Stack gap="5">
                <Group>
                  <Text
                    variant="gradient"
                    gradient={
                      committeeGradients[selectedPost?.organization as keyof typeof committeeGradients] ||
                      committeeGradients.default
                    }
                    fw={1000}
                    size="xl"
                  >
                    {committeeNames[selectedPost?.organization as keyof typeof committeeNames]} Update
                  </Text>


                  {/* Timestamp */}
                  <Text size="sm" c="dimmed">
                    {selectedPost?.timestamp?.toDate().toLocaleDateString()} {selectedPost?.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Group>
                <Group justify="flex-start">
                  {/* Author Info */}
                  {showAuthorInfo && (
                    <Group>
                      <Avatar
                        src={authors[selectedPost?.authorId as string]?.photoURL || undefined}
                        radius="xl"
                        size="sm"
                        color="blue"
                      />
                      <Text fw={500}>{authors[selectedPost?.authorId as string]?.displayName || authors[selectedPost?.authorId as string]?.email || 'Unknown User'}</Text>
                    </Group>
                  )}

                  {/* Controls */}
                  {showControls &&
                    <>
                      {/* Edit Button */}
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => startEditing(selectedPost)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>

                      {/* Delete Button */}
                      <Popover
                        opened={deletePopoverOpen}
                        onChange={setDeletePopoverOpen}
                        position="bottom"
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => setDeletePopoverOpen(true)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Stack>
                            <Text>Are you sure you want to delete this post?</Text>
                            <Group justify="flex-end">
                              <Button variant="subtle" onClick={() => setDeletePopoverOpen(false)}>Cancel</Button>
                              <Button color="red" onClick={handleDelete}>Delete</Button>
                            </Group>
                          </Stack>
                        </Popover.Dropdown>
                      </Popover>

                      {/* Visibility Toggle with loading indicator */}
                      <Group gap="xs">
                        <Switch
                          checked={selectedPost.visible}
                          onChange={(event) => handleVisibilityToggle(event.currentTarget.checked)}
                          disabled={visibilityLoading}
                          size="md"
                          color="green"
                          onLabel={<IconEye size={16} stroke={2.5} color="var(--mantine-color-white)" />}
                          offLabel={<IconEyeClosed size={16} stroke={2.5} color="var(--mantine-color-orange-6)" />}
                        />
                        {visibilityLoading && <Loader size="xs" />}
                        {!visibilityLoading && !selectedPost.visible && (
                          <Badge color="orange" variant="light">Hidden</Badge>
                        )}
                        {!visibilityLoading && selectedPost.visible && (
                          <Badge color="green" variant="light">Visible</Badge>
                        )}
                      </Group>
                    </>}
                </Group>

                {/* Gradient-colored divider */}
                <Divider
                  py="0"
                  style={{
                    background: `linear-gradient(to right, var(--mantine-color-${(committeeGradients[selectedPost?.organization as keyof typeof committeeGradients] ||
                      committeeGradients.default).from
                      }-6), var(--mantine-color-${(committeeGradients[selectedPost?.organization as keyof typeof committeeGradients] ||
                        committeeGradients.default).to
                      }-6))`,
                    height: '2px',
                    width: '100%'
                  }}
                />
              </Stack>
            }
          >
            <Stack>

              {/* Post Content */}
              {isEditing &&
                <>
                  <RichTextEditor
                    editor={editor}
                    showTextFormatting={true}
                    showHeadingFormatting={true}
                    showListFormatting={true}
                    showBlockquoteFormatting={true}
                    showHorizontalRuleFormatting={true}
                  />

                  {/* // Save/Cancel Edit Buttons */}
                  <Group>
                    <Button variant="subtle" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleEdit}>Save Changes</Button>
                  </Group>
                </>}

              {!isEditing &&
                <div
                  dangerouslySetInnerHTML={{ __html: selectedPost?.body || '' }}
                  className={classes.postContent}
                />
              }
            </Stack>
          </Modal>
        )}
      </Stack>
    </Container>
  );
}