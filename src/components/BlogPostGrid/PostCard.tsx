import React from 'react';
import { Card, Group, Avatar, Badge, Stack, Text } from '@mantine/core';
import classes from './BlogPostGrid.module.css';

interface BlogPost {
  id: string;
  authorId: string;
  body: string;
  timestamp: any; // Using any for now, but you might want to use the proper Firestore Timestamp type
  collectionName: string;
  visible: boolean;
}

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string;
}

interface PostCardProps {
  post: BlogPost;
  users: Record<string, UserInfo>;
  onPostClick: (post: BlogPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, users, onPostClick }) => {
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

  return (
    <Card
      withBorder
      p="md"
      h={360}
      className={classes.card}
      style={{ cursor: 'pointer' }}
      onClick={() => onPostClick(post)}
    >
      <Stack h="100%" gap="xs">
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
}; 