import React, { useState, useEffect } from 'react';
import { Title, Text, Card, SimpleGrid, Group, Avatar, Badge, Stack, Container, useMantineTheme, px, Modal, ActionIcon, Switch, Button, Pagination, Center } from '@mantine/core';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
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

interface BlogPost {
  id: string;
  authorId: string;
  body: string;
  timestamp: Timestamp;
  collectionName: string;
  visible: boolean;
}

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string;
}

interface BlogPostGridProps {
  title?: string;
  description?: string;
  maxPosts?: number;
  isAdmin?: boolean;
  collectionName?: string;
  onDeletePost?: (postId: string) => void;
  onVisibilityToggle?: (postId: string, currentVisibility: boolean) => void;
}

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  title = "Latest Updates",
  description = "Stay informed with the latest news and updates from our committees",
  maxPosts = 8,
  isAdmin = false,
  collectionName,
  onDeletePost,
  onVisibilityToggle
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const db = getFirestore(app);

  const editEditor = useEditor({
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

  useEffect(() => {
    fetchPosts();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  // Add a new useEffect to refresh posts when they change
  useEffect(() => {
    // This will ensure that when a post is edited or deleted, the UI is updated
    if (posts.length > 0) {
      // We don't need to do anything here, just having this effect will ensure
      // the component re-renders when posts change
    }
  }, [posts]);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'UserProfiles'));
      const usersData: Record<string, UserInfo> = {};

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        usersData[doc.id] = {
          uid: doc.id,
          displayName: userData.displayName || null,
          email: userData.email || null,
          photoURL: userData.photoURL || undefined
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);

      if (collectionName) {
        // Fetch posts from a specific collection (for admin dashboard)
        const postsQuery = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);

        const fetchedPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          collectionName
        })) as BlogPost[];

        setPosts(fetchedPosts);
      } else {
        // Fetch posts from all collections (for homepage)
        const awardsQuery = query(collection(db, 'awardsBlog'), orderBy('timestamp', 'desc'));
        const policyQuery = query(collection(db, 'policyBlog'), orderBy('timestamp', 'desc'));
        const chapterMeetingQuery = query(collection(db, 'chapterMeetingBlog'), orderBy('timestamp', 'desc'));

        const [awardsSnapshot, policySnapshot, chapterMeetingSnapshot] = await Promise.all([
          getDocs(awardsQuery),
          getDocs(policyQuery),
          getDocs(chapterMeetingQuery)
        ]);

        const awardsPosts = awardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          collectionName: 'awardsBlog'
        })) as BlogPost[];

        const policyPosts = policySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          collectionName: 'policyBlog'
        })) as BlogPost[];

        const chapterMeetingPosts = chapterMeetingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          collectionName: 'chapterMeetingBlog'
        })) as BlogPost[];

        // Combine and sort all posts by timestamp, filtering out invisible posts
        const allPosts = [...awardsPosts, ...policyPosts, ...chapterMeetingPosts]
          .filter(post => post.visible !== false) // Show posts that are visible or don't have visibility set
          .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

        // Set all posts without limiting them
        setPosts(allPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = (authorId: string) => {
    const user = users[authorId];
    if (user) {
      return user.displayName || user.email || 'Unknown User';
    }
    return 'Unknown User';
  };

  const getAuthorPhoto = (authorId: string) => {
    const user = users[authorId];
    if (user && user.photoURL) {
      return user.photoURL;
    }
    return null;
  };

  const getCommitteeName = (collectionName: string) => {
    switch (collectionName) {
      case 'awardsBlog':
        return 'Awards Committee';
      case 'policyBlog':
        return 'Policy Committee';
      case 'chapterMeetingBlog':
        return 'Chapter Meeting Committee';
      default:
        return 'Unknown Committee';
    }
  };

  const handleVisibilityToggle = async (postId: string, currentVisibility: boolean) => {
    if (onVisibilityToggle) {
      onVisibilityToggle(postId, currentVisibility);
      // Update local state immediately
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId
          ? { ...post, visible: !currentVisibility }
          : post
      ));
      // Update selected post if it's the one being toggled
      if (selectedPost?.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, visible: !currentVisibility } : null);
      }
    } else {
      // Find the post to get its collection name
      const post = posts.find(p => p.id === postId);
      if (!post) {
        console.error('Post not found for visibility toggle');
        return;
      }

      // Use the collectionName from the post if available, otherwise use the prop
      const postCollectionName = post.collectionName || collectionName;

      if (!postCollectionName) {
        console.error('No collection name available for visibility toggle');
        return;
      }

      try {
        await updateDoc(doc(db, postCollectionName, postId), {
          visible: !currentVisibility,
        });
        // Update local state immediately
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === postId
            ? { ...post, visible: !currentVisibility }
            : post
        ));
        // Update selected post if it's the one being toggled
        if (selectedPost?.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, visible: !currentVisibility } : null);
        }
      } catch (error) {
        console.error('Error updating post visibility:', error);
      }
    }
  };

  const openDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (onDeletePost) {
      onDeletePost(postId);
    } else {
      // Find the post to get its collection name
      const post = posts.find(p => p.id === postId);
      if (!post) {
        console.error('Post not found for deletion');
        return;
      }

      // Use the collectionName from the post if available, otherwise use the prop
      const postCollectionName = post.collectionName || collectionName;

      if (!postCollectionName) {
        console.error('No collection name available for deletion');
        return;
      }

      try {
        await deleteDoc(doc(db, postCollectionName, postId));
        setDeleteModalOpen(false);
        setPostToDelete(null);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = async () => {
    if (!selectedPost) return;

    try {
      // Use the collectionName from the post if available, otherwise use the prop
      const postCollectionName = selectedPost.collectionName || collectionName;

      if (!postCollectionName) {
        console.error('No collection name available for editing post');
        return;
      }

      await updateDoc(doc(db, postCollectionName, selectedPost.id), {
        body: editContent,
        timestamp: Timestamp.now(),
      });

      // Update local state
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === selectedPost.id
          ? { ...post, body: editContent }
          : post
      ));

      setSelectedPost(prev => prev ? { ...prev, body: editContent } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const startEditing = (post: BlogPost) => {
    setSelectedPost(post);
    setEditContent(post.body);
    editEditor?.commands.setContent(post.body);
    setIsEditing(true);
  };

  const renderPosts = () => {
    if (loading) {
      return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {Array.from({ length: postsPerPage }).map((_, index) => (
            <Skeleton key={index} height={360} width='100%' radius="md" />
          ))}
        </SimpleGrid>
      );
    }

    if (posts.length === 0) {
      return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card withBorder p="md">
            <Text>No posts available.</Text>
          </Card>
        </SimpleGrid>
      );
    }

    // If we're in admin mode and maxPosts is specified, limit the posts
    const displayPosts = isAdmin && maxPosts ? posts.slice(0, maxPosts) : posts;

    // Calculate pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(displayPosts.length / postsPerPage);

    return (
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              users={users}
              onPostClick={setSelectedPost}
            />
          ))}
        </SimpleGrid>

        {totalPages > 1 && (
          <Center>
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              radius="md"
              size="md"
            />
          </Center>
        )}
      </Stack>
    );
  };

  return (
    <Container size="xl" className={classes.wrapper}>
      <Stack>
        {title && <Title order={2} className={classes.title}>{title}</Title>}
        {description && <Text size="mb" className={classes.description}>{description}</Text>}

        {renderPosts()}

        <Modal
          opened={selectedPost !== null}
          onClose={() => {
            setSelectedPost(null);
            setIsEditing(false);
          }}
          size="80%"
          title={
            selectedPost && (
              <Group>
                <Avatar
                  src={getAuthorPhoto(selectedPost.authorId)}
                  radius="xl"
                  size="sm"
                  color="blue"
                />
                <div>
                  <Text fw={500}>{getAuthorName(selectedPost.authorId)}</Text>
                  <Text size="sm" c="dimmed">
                    {selectedPost.timestamp?.toDate().toLocaleDateString()} {selectedPost.timestamp?.toDate().toLocaleTimeString()}
                  </Text>
                </div>
              </Group>
            )
          }
        >
          {selectedPost && (
            <Stack>
              <Group justify="apart">
                <Badge color={
                  selectedPost.collectionName === 'awardsBlog' ? 'blue' :
                    selectedPost.collectionName === 'policyBlog' ? 'green' :
                      'violet'
                }>
                  {getCommitteeName(selectedPost.collectionName)}
                </Badge>

                {isAdmin && (
                  <Group>
                    <Switch
                      label="Visible"
                      checked={selectedPost.visible}
                      onChange={() => handleVisibilityToggle(selectedPost.id, selectedPost.visible)}
                      size="sm"
                    />
                    <ActionIcon
                      variant={isEditing ? "filled" : "subtle"}
                      color="blue"
                      onClick={() => {
                        if (isEditing) {
                          handleEdit();
                        } else {
                          startEditing(selectedPost);
                        }
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => openDeleteModal(selectedPost.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                )}
              </Group>

              {isEditing ? (
                <Stack>
                  <RichTextEditor
                    editor={editEditor}
                    minHeight="250px"
                    showTextFormatting={true}
                    showHeadingFormatting={true}
                    showListFormatting={true}
                    showBlockquoteFormatting={true}
                    showHorizontalRuleFormatting={true}
                  />
                  <Group justify="flex-end">
                    <Button variant="subtle" onClick={() => {
                      setIsEditing(false);
                      setEditContent(selectedPost.body);
                      editEditor?.commands.setContent(selectedPost.body);
                    }}>Cancel</Button>
                    <Button onClick={handleEdit}>Save Changes</Button>
                  </Group>
                </Stack>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedPost.body }}
                  className={classes.postContent}
                  style={{ maxHeight: '70vh', overflowY: 'auto' }}
                />
              )}
            </Stack>
          )}
        </Modal>

        <Modal
          opened={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setPostToDelete(null);
          }}
          title="Delete Post"
          size="sm"
        >
          <Stack>
            <Text>Are you sure you want to delete this post? This action cannot be undone.</Text>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => {
                setDeleteModalOpen(false);
                setPostToDelete(null);
              }}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => postToDelete && handleDelete(postToDelete)}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}; 