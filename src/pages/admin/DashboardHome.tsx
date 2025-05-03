import React, { useState } from 'react';
import { Text, Stack, Divider } from '@mantine/core';
import { BlogPostGrid } from '../../components/BlogPostGrid/BlogPostGrid';

export default function DashboardHome() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Stack align="center" gap="0">
      <Text
        fw={900}
        size="3rem"
        variant="gradient"
        gradient={{ from: '#fab005', to: '#fa5252', deg: 90 }}
      >
        Community Bulletin
        <Divider
          my="sm"
          style={{
            background: 'linear-gradient(90deg, #fab005, #fa5252)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            height: '2px',
            border: 'none'
          }}
        />
      </Text>

      <Text
        size="md"
        c="dimmed"
        pb="xs"
      >
        Manage all blog posts across all committees
      </Text>

      <BlogPostGrid
        showInvisiblePosts={true}
        showAuthorInfo={true}
        showControls={true}
        refreshTrigger={refreshTrigger}
        resetRefreshTrigger={() => setRefreshTrigger(0)}
        showCreateCard={true}
      />
    </Stack >
  );
} 