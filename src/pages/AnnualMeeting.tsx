import React from 'react';
import { Container, Title, Text } from '@mantine/core';

const AnnualMeeting: React.FC = () => {
  return (
    <Container size="xl">
      <Title order={1} mb="md">Annual Chapter Meeting</Title>
      <Text size="lg" c="dimmed">
        Information about the Annual Chapter Meeting will be available soon.
      </Text>
    </Container>
  );
};

export default AnnualMeeting; 