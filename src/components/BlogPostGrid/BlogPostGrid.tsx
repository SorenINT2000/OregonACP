import React, { useState, useEffect } from 'react';
import { Title, Text, Card, SimpleGrid, Group, Avatar, Badge, Stack, Skeleton, Container, useMantineTheme, px, Modal, ActionIcon, Switch, Button } from '@mantine/core';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import classes from './BlogPostGrid.module.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { RichTextEditor } from '../RichTextEditor';

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
  const db = getFirestore(app);
  const theme = useMantineTheme();

  const editEditor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
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

        // Limit the number of posts if maxPosts is specified
        const limitedPosts = maxPosts ? allPosts.slice(0, maxPosts) : allPosts;
        setPosts(limitedPosts);
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

  const PostCard = ({ post }: { post: BlogPost }) => (
    <Card
      withBorder
      p="md"
      h="100%"
      className={classes.card}
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedPost(post)}
    >
      <Stack h="100%">
        <Group justify="space-between">
          <Group>
            <Avatar
              src={getAuthorPhoto(post.authorId)}
              radius="xl"
              size="sm"
              color="blue"
            />
            <Text fw={500} size="sm">{getAuthorName(post.authorId)}</Text>
          </Group>
          <Badge color={
            post.collectionName === 'awardsBlog' ? 'blue' :
              post.collectionName === 'policyBlog' ? 'green' :
                'violet'
          }>
            {getCommitteeName(post.collectionName)}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {post.timestamp?.toDate().toLocaleDateString()} {post.timestamp?.toDate().toLocaleTimeString()}
        </Text>

        <div
          dangerouslySetInnerHTML={{ __html: post.body }}
          className={classes.postContent}
        />
      </Stack>
    </Card>
  );

  const LoadingSkeleton = () => {
    const BASE_HEIGHT = 360;
    const getSubHeight = (children: number, spacing: number) =>
      BASE_HEIGHT / children - spacing * ((children - 1) / children);

    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Skeleton height={BASE_HEIGHT} radius="md" animate={false} />
        <Stack>
          <Skeleton height={getSubHeight(2, px(theme.spacing.md) as number)} radius="md" animate={false} />
          <Skeleton height={getSubHeight(2, px(theme.spacing.md) as number)} radius="md" animate={false} />
        </Stack>
        <Stack>
          <Skeleton height={getSubHeight(3, px(theme.spacing.md) as number)} radius="md" animate={false} />
          <Skeleton height={getSubHeight(3, px(theme.spacing.md) as number)} radius="md" animate={false} />
          <Skeleton height={getSubHeight(3, px(theme.spacing.md) as number)} radius="md" animate={false} />
        </Stack>
        <Skeleton height={BASE_HEIGHT} radius="md" animate={false} />
      </SimpleGrid>
    );
  };

  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <Text ta="center" size="lg" c="dimmed" py="xl">
          No posts found. Posts will appear here once they are created.
        </Text>
      );
    }

    // Create a layout with different column arrangements based on post count
    if (posts.length <= 4) {
      // For 1-4 posts, use a simple grid
      return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </SimpleGrid>
      );
    } else {
      // For more than 4 posts, create a more dynamic layout
      const firstPost = posts[0];
      const lastPost = posts[posts.length - 1];
      const middlePosts = posts.slice(1, -1);

      // Split middle posts into two groups
      const midPoint = Math.ceil(middlePosts.length / 2);
      const leftMiddlePosts = middlePosts.slice(0, midPoint);
      const rightMiddlePosts = middlePosts.slice(midPoint);

      return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <PostCard post={firstPost} />

          <Stack gap="md">
            {leftMiddlePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>

          <Stack gap="md">
            {rightMiddlePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>

          <PostCard post={lastPost} />
        </SimpleGrid>
      );
    }
  };

  return (
    <Container size="xl" className={classes.wrapper}>
      <Stack>
        <Title order={2} className={classes.title}>{title}</Title>
        <Text size="lg" className={classes.description} mb="xl">{description}</Text>

        {loading ? <LoadingSkeleton /> : renderPosts()}

        <Modal
          opened={selectedPost !== null}
          onClose={() => {
            setSelectedPost(null);
            setIsEditing(false);
          }}
          size="lg"
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