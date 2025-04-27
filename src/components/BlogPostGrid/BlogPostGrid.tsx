import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Title, Text, Card, SimpleGrid, Group, Avatar, Badge, Stack, Container, Modal, ActionIcon, Switch, Button, Pagination, Center, Popover } from '@mantine/core';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, updateDoc, doc, deleteDoc, limit, startAfter, endBefore, where, getCountFromServer, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import classes from './BlogPostGrid.module.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextEditor } from '../RichTextEditor';
import { PostCard } from './PostCard';
import { Skeleton } from '@mantine/core';


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
  title?: string;
  description?: string;
  organization?: string;
  showInvisiblePosts?: boolean;
  showAuthorInfo?: boolean;
  showControls?: boolean;
  refreshTrigger?: number;
  resetRefreshTrigger?: () => void;
}

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  title = "Latest Updates",
  description = "Stay informed with the latest news and updates from our committees",
  organization,
  showInvisiblePosts = false,
  showAuthorInfo = false,
  showControls = false,
  refreshTrigger = 0,
  resetRefreshTrigger = () => { }
}) => {
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

  // Firestore
  const db = getFirestore(app);
  const auth = getAuth(app);

  const isAuthenticated = () => {
    return auth.currentUser !== null;
  };

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
  }, [refreshTrigger]);

  // Handle regular pagination and filter changes
  useEffect(() => {
    fetchPosts();
  }, [db, currentPage, organization, showInvisiblePosts, editor]);

  // Editor content updates
  useEffect(() => {
    if (selectedPost && editor) {
      editor.commands.setContent(selectedPost.body);
    }
  }, [selectedPost, editor]);

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
      const postsToSkip = pagesToSkip * postsPerPage;

      // Get all posts up to the current page
      let postsQuery = query(
        filteredQuery,
        orderBy('timestamp', 'desc'),
        limit(postsToSkip + postsPerPage)
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
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommitteeName = (organization: string | undefined) => {
    if (!organization) return 'Unknown Committee';

    switch (organization) {
      case 'awards':
        return 'Awards Committee';
      case 'policy':
        return 'Policy Committee';
      case 'chapterMeeting':
        return 'Chapter Meeting Committee';
      default:
        return 'Unknown Committee';
    }
  };

  const handleVisibilityToggle = async (newVisibility: boolean) => {
    if (!selectedPost) {
      console.error('Post not found for visibility toggle');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error updating post visibility:', error);
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

      // Update local state
      setPosts(prevPosts => prevPosts.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
      setDeletePopoverOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
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
    }
  };

  const startEditing = (post: BlogPost) => {
    editor?.commands.setContent(post.body);
    setIsEditing(true);
  };

  return (
    <Container size="xl" className={classes.wrapper}>
      <Stack>
        {title && <Title order={2} className={classes.title}>{title}</Title>}
        {description && <Text size="lg" className={classes.description} mb="xl">{description}</Text>}

        {/* Pagination */}
        <Center mt="xl">
          <Pagination
            total={Math.ceil(postCount / postsPerPage)}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Center>

        {/* Posts */}
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {/* If loading, show skeletons */}
            {loading &&
              Array.from({ length: postsPerPage }).map((_, index) => (
                <Skeleton key={index} height='360px' width='420px' radius="md" />
              ))}

            {/* If there are no posts, show a card with a message */}
            {postCount === 0 && (
              <Card withBorder p="md">
                <Text>No posts available.</Text>
              </Card>
            )}

            {/* Otherwise show the posts */}
            {posts?.length > 0 &&
              posts.map((post) =>
                <PostCard
                  key={post.id}
                  post={post}
                  authorInfo={showAuthorInfo ? authors[post.authorId as string] : undefined}
                  onPostClick={() => setSelectedPost(post)}
                  enableEdit={showControls}
                />)}
          </SimpleGrid>
        </Stack>


        {/* View/Edit Post Modal */}
        {selectedPost && (
          <Modal
            opened={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            title="Post Details"
            size="xl"
          >
            <Stack>
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

                {/* Committee Badge */}
                <Badge color={
                  selectedPost?.organization === 'awards' ? 'blue' :
                    selectedPost?.organization === 'policy' ? 'green' :
                      'violet'
                }>
                  {getCommitteeName(selectedPost?.organization)}
                </Badge>
              </Group>

              {/* Controls */}
              {showControls &&
                <Group justify="flex-start">
                  {/* Visibility Toggle */}
                  <Switch
                    label="Visible"
                    checked={selectedPost.visible}
                    onChange={(event) => handleVisibilityToggle(event.currentTarget.checked)}
                  />

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
                </Group>}

              {/* Timestamp */}
              <Text size="sm" c="dimmed">
                {selectedPost?.timestamp?.toDate().toLocaleDateString()} {selectedPost?.timestamp?.toDate().toLocaleTimeString()}
              </Text>

              {/* Post Content */}
              {isEditing &&
                <>
                  <RichTextEditor editor={editor} />

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
    </Container >
  );
}