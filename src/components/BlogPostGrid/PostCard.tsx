import React from 'react';
import { Card, Group, Avatar, Badge, Stack, Text } from '@mantine/core';
import classes from './BlogPostGrid.module.css';
import { Timestamp } from 'firebase/firestore';

interface BlogPost {
  id: string;
  body: string;
  timestamp: Timestamp;
  organization: string;
  visible?: boolean;
  authorInfo?: UserInfo;
}

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string;
}

interface PostCardProps {
  post: BlogPost;
  authorInfo?: UserInfo;
  onPostClick: (post: BlogPost) => void;
  enableEdit: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, authorInfo, onPostClick, enableEdit }) => {
  const getAuthorName = () => {
  };

  const getAuthorPhoto = () => {
    return;
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

  return (
    <Card
      withBorder
      p="md"
      h={360}
      className={classes.card}
      style={{ cursor: 'pointer', width: '420px', height: '360px' }}
      onClick={() => onPostClick(post)}
    >
      <Stack h="100%" gap="xs">
        <Group justify="space-between">
          {authorInfo && (
            <Group>
              <Avatar
                src={authorInfo.photoURL}
                radius="xl"
                size="sm"
                color="blue"
              />
              <Text fw={500} size="sm">
                {authorInfo.displayName || authorInfo.email?.split('@')[0] || 'Unknown User'}
              </Text>
            </Group>)}
          <Badge color={
            post.organization === 'awards' ? 'blue' :
              post.organization === 'policy' ? 'green' :
                'violet'
          }>
            {getCommitteeName(post.organization)}
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