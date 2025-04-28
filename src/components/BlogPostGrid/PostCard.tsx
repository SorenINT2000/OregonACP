import React from 'react';
import { Card, Group, Avatar, Badge, Stack, Text } from '@mantine/core';
import classes from './BlogPostGrid.module.css';
import { Timestamp } from 'firebase/firestore';
import { formatRelativeTime } from '../../utils/dateUtils';
import { JSX } from 'react';

// Committee gradient colors
const committeeGradients = {
  awards: { from: 'yellow', to: 'red' },
  policy: { from: 'cyan', to: 'green' },
  chapterMeeting: { from: 'violet', to: 'blue' },
  default: { from: 'gray', to: 'black' }
};

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

  // Determine if the post is visible or not
  const isVisible = post.visible !== false; // Default to true if undefined

  // Apply different styles for invisible posts
  const cardStyle = {
    cursor: 'pointer',
    width: '420px',
    height: '360px',
    // Add dashed border and tan background for invisible posts
    ...(isVisible ? {} : {
      border: '2px dashed #ccc',
      backgroundColor: '#f5f5dc', // Tan background
    })
  };

  // Helper function to render author info
  const renderAuthorInfo = (): JSX.Element | null => {
    if (!authorInfo) return null;

    return (
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
      </Group>
    );
  };

  // Helper function to render committee badge
  const renderCommitteeBadge = (): JSX.Element => {
    return (
      <Badge
        variant="gradient"
        gradient={
          committeeGradients[post.organization as keyof typeof committeeGradients] ||
          committeeGradients.default
        }
      >
        {getCommitteeName(post.organization)}
      </Badge>
    );
  };

  return (
    <Card
      withBorder
      p="md"
      h={360}
      className={classes.card}
      style={cardStyle}
      onClick={() => onPostClick(post)}
    >
      <Stack h="100%" gap="xs">
        <Group justify="space-between flex-end">
          {authorInfo ? renderAuthorInfo() : renderCommitteeBadge()}
          <Text size="sm" c="dimmed">
            {formatRelativeTime(post.timestamp?.toDate() || new Date())}
          </Text>
        </Group>

        <Group justify="flex-start">
          {authorInfo && renderCommitteeBadge()}
          {!isVisible && <Badge color="orange" variant="light">Hidden</Badge>}
        </Group>

        <div
          dangerouslySetInnerHTML={{ __html: post.body }}
          className={classes.postContent}
        />
      </Stack>
    </Card>
  );
}; 