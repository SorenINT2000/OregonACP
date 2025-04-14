import React from 'react';
import { Title, Text, Stack, Container } from '@mantine/core';
import { BlogPostGrid } from '../../components/BlogPostGrid/BlogPostGrid';

export const DashboardHome: React.FC = () => {
  return (
    <Stack>
      <Title order={2}>Dashboard Home</Title>
      <Text size="lg" mb="xl">Recent posts from all committees</Text>

      <Container size="xl" px={0}>
        <BlogPostGrid
          title=""
          description=""
          isAdmin={true}
        />
      </Container>
    </Stack>
  );
}; 