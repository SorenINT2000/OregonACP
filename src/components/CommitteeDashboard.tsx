import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Group,
  Card,
  Stack,
  Modal
} from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { RichTextEditor } from './RichTextEditor';
import { BlogPostGrid } from './BlogPostGrid/BlogPostGrid';

interface BlogPost {
  id: string;
  authorId: string;
  body: string;
  timestamp: Timestamp;
  visible: boolean;
}

interface CommitteeDashboardProps {
  title: string;
  collectionName: string;
}

export const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ title, collectionName }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const editEditor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content: editContent,
    onUpdate: ({ editor }) => {
      setEditContent(editor.getHTML());
    },
  });

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const fetchedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editingPost) {
      editEditor?.commands.setContent(editingPost.body);
    }
  }, [editingPost, editEditor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      console.error('No user logged in');
      return;
    }

    if (!content.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    const postData = {
      authorId: auth.currentUser.uid,
      body: content,
      timestamp: Timestamp.now(),
      visible: true,
    };

    try {
      await addDoc(collection(db, collectionName), postData);
      setContent('');
      editor?.commands.setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, postId));
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleVisibilityToggle = async (postId: string, currentVisibility: boolean) => {
    try {
      await updateDoc(doc(db, collectionName, postId), {
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
      await updateDoc(doc(db, collectionName, editingPost.id), {
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
      <Title order={2}>{title}</Title>

      <Card withBorder p="md">
        <form onSubmit={handleSubmit}>
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

      <Title order={3} mt="xl">Existing Posts</Title>

      <BlogPostGrid
        key={posts.length}
        title=""
        description=""
        isAdmin={true}
        collectionName={collectionName}
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