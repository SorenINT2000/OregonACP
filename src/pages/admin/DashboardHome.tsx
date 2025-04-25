import React from 'react';
import { Title, Text, Stack, Container } from '@mantine/core';
import { BlogPostGrid } from '../../components/BlogPostGrid/BlogPostGrid';

export default function DashboardHome() {
  return (
    <Stack>
      <Title order={2}>Dashboard Home</Title>
      <Text size="lg" mb="xl">Recent posts from all committees</Text>

      <Container size="xl" px={0}>
        <BlogPostGrid
          title="All Committee Updates"
          description="View and manage all committee posts"
          isAdmin={true}
        />
      </Container>
    </Stack>
  );
} 