import React, { useState } from 'react';
import { Stack, Text, Divider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { BlogPostGrid } from './BlogPostGrid/BlogPostGrid';

interface CommitteeDashboardProps {
  title: string;
  organization: string;
}

// Committee gradient colors
const committeeGradients = {
  awards: { from: '#fab005', to: '#fa5252' },
  policy: { from: '#15aabf', to: '#40c057' },
  chapterMeeting: { from: '#7950f2', to: '#228be6' },
  default: { from: '#bbbbbb', to: '#000000' }
};

const committeeNames = {
  awards: 'Awards',
  policy: 'Policy',
  chapterMeeting: 'Chapter Meeting',
  default: 'Unknown'
};

export const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ title, organization }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const gradient = committeeGradients[organization as keyof typeof committeeGradients] || committeeGradients.default;
  const committeeName = committeeNames[organization as keyof typeof committeeNames] || committeeNames.default;
  return (
    <Stack align="center" ta="center" gap="0">
      <Text
        fw={900}
        size="3rem"
        variant="gradient"
        gradient={{ from: gradient.from, to: gradient.to, deg: 90 }}
      >
        {`${committeeName} Updates`}
        <Divider
          my="sm"
          style={{
            background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
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
        {`View and manage ${committeeName.toLowerCase()} committee posts`}
      </Text>

      <BlogPostGrid
        organization={organization}
        showInvisiblePosts={true}
        showAuthorInfo={true}
        showControls={true}
        showCreateCard={true}
        refreshTrigger={refreshTrigger}
        resetRefreshTrigger={() => setRefreshTrigger(0)}
      />
    </Stack>
  );
}; 