import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Group,
  Card,
  Stack,
  Modal,
  Accordion,
  Text
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc, Timestamp, getDoc, query, where, orderBy } from 'firebase/firestore';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { RichTextEditor } from './RichTextEditor';
import { BlogPostGrid } from './BlogPostGrid/BlogPostGrid';
import { useAuth } from '../contexts/AuthContext';

interface BlogPost {
  id: string;
  authorId: string;
  body: string;
  timestamp: Timestamp;
  visible: boolean;
  organization: string;
}

interface CommitteeDashboardProps {
  title: string;
  organization: string;
}

export const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ title, organization }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [canPost, setCanPost] = useState(false);
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
        allowBase64: false,
        HTMLAttributes: {},
      }),
      Placeholder.configure({
        placeholder: 'Compose a blog post',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

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
        allowBase64: false,
        HTMLAttributes: {},
      }),
    ],
    content: editContent,
    onUpdate: ({ editor }) => {
      setEditContent(editor.getHTML());
    },
  });

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
  };

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'blogPosts'),
        where('organization', '==', organization),
        orderBy('timestamp', 'desc')
      )
    );

    const fetchedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];

    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchPosts();
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization, currentUser]);

  useEffect(() => {
    if (editingPost) {
      editEditor?.commands.setContent(editingPost.body);
    }
  }, [editingPost, editEditor]);

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    if (!content.trim()) return;

    try {
      await addDoc(collection(db, 'blogPosts'), {
        authorId: auth.currentUser.uid,
        body: content,
        timestamp: Timestamp.now(),
        visible: true,
        organization: organization
      });

      setContent('');
      editor?.commands.setContent('');
      await fetchPosts(); // Refresh posts after creating a new one
      notifications.show({
        title: 'Success',
        message: 'Post created successfully',
        color: 'green'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create post',
        color: 'red'
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleVisibilityToggle = async (postId: string, currentVisibility: boolean) => {
    try {
      await updateDoc(doc(db, 'blogPosts', postId), {
        visible: !currentVisibility,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post visibility:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingPost) return;

    try {
      await updateDoc(doc(db, 'blogPosts', editingPost.id), {
        body: editContent,
        timestamp: Timestamp.now(),
      });
      setEditModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Stack>
      {title && <Title order={2}>{title}</Title>}

      <Accordion>
        <Accordion.Item value="editor">
          <Accordion.Control disabled={!canPost}>
            <Group justify="space-between">
              <Text>Create New Post</Text>
              {!canPost && (
                <Text size="sm" c="dimmed">
                  You don't have permission to post in this committee
                </Text>
              )}
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Card withBorder p="md">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}>
                <Stack>
                  <RichTextEditor
                    editor={editor}
                    minHeight="250px"
                    showTextFormatting={true}
                    showHeadingFormatting={true}
                    showListFormatting={true}
                    showBlockquoteFormatting={true}
                    showHorizontalRuleFormatting={true}
                  />
                  <Button type="submit">Create Post</Button>
                </Stack>
              </form>
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Title order={3} mt="xl">Existing Posts</Title>

      <BlogPostGrid
        key={posts.length}
        title=""
        description=""
        isAdmin={true}
        organization={organization}
        onDeletePost={handleDelete}
        onVisibilityToggle={handleVisibilityToggle}
      />

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Post"
        size="xl"
      >
        <Stack>
          <RichTextEditor
            editor={editEditor}
            minHeight="250px"
            showTextFormatting={true}
            showHeadingFormatting={false}
            showListFormatting={false}
            showBlockquoteFormatting={false}
            showHorizontalRuleFormatting={false}
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}; 