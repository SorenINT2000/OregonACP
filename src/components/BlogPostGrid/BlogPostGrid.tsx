import React, { useState, useEffect } from 'react';
import { Title, Text, Card, SimpleGrid, Group, Avatar, Badge, Stack, Container, Modal, ActionIcon, Switch, Button, Pagination, Center } from '@mantine/core';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp, updateDoc, doc, deleteDoc, limit, startAfter, where } from 'firebase/firestore';
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
  visible: boolean;
  organization: string;
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
  isAdmin?: boolean;
  organization?: string;
  onDeletePost?: (postId: string) => void;
  onVisibilityToggle?: (postId: string, currentVisibility: boolean) => void;
}

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  title = "Latest Updates",
  description = "Stay informed with the latest news and updates from our committees",
  isAdmin = false,
  organization,
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
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [firstVisible, setFirstVisible] = useState<any>(null);
  const [collectionLastVisible, setCollectionLastVisible] = useState<Record<string, any>>({});
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
    if (isAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization, isAdmin]);

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

      let postsQuery;
      const postsPerPage = 6;

      if (organization) {
        postsQuery = query(
          collection(db, 'blogPosts'),
          where('organization', '==', organization),
          orderBy('timestamp', 'desc'),
          limit(postsPerPage)
        );
      } else {
        postsQuery = query(
          collection(db, 'blogPosts'),
          orderBy('timestamp', 'desc'),
          limit(postsPerPage)
        );
      }

      if (currentPage > 1 && lastVisible) {
        postsQuery = query(
          postsQuery,
          startAfter(lastVisible)
        );
      }

      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];

      const visiblePosts = isAdmin
        ? fetchedPosts
        : fetchedPosts.filter(post => post.visible);

      setPosts(visiblePosts);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

      const countQuery = organization
        ? query(
          collection(db, 'blogPosts'),
          where('organization', '==', organization)
        )
        : query(collection(db, 'blogPosts'));

      const countSnapshot = await getDocs(countQuery);
      setTotalPosts(countSnapshot.size);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    fetchPosts();
  }, [organization]);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

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

      try {
        // Update in the master collection
        await updateDoc(doc(db, 'blogPosts', postId), {
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

      try {
        // Delete from the master collection
        await deleteDoc(doc(db, 'blogPosts', postId));

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
      // Update in the master collection
      await updateDoc(doc(db, 'blogPosts', selectedPost.id), {
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
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
      <Stack gap="xl">
        {totalPages > 1 && (
          <Center>
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              radius="md"
              size="md"
              disabled={loading}
            />
          </Center>
        )}

        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {Array.from({ length: postsPerPage }).map((_, index) => (
              <Skeleton key={index} height='360px' width='420px' radius="md" />
            ))}
          </SimpleGrid>
        ) : posts.length === 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <Card withBorder p="md">
              <Text>No posts available.</Text>
            </Card>
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {posts.map((post) => {
              const postWithOrganization = {
                ...post,
                organization: post.organization
              };

              return (
                <PostCard
                  key={post.id}
                  post={postWithOrganization}
                  users={users}
                  onPostClick={setSelectedPost}
                  isAdmin={isAdmin}
                />
              );
            })}
          </SimpleGrid>
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
            selectedPost && isAdmin && (
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
                  selectedPost.organization === 'awards' ? 'blue' :
                    selectedPost.organization === 'policy' ? 'green' :
                      'violet'
                }>
                  {getCommitteeName(selectedPost.organization)}
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