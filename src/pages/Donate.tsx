import React from 'react';
import { Container, Title, Text } from '@mantine/core';

const Donate: React.FC = () => {
  return (
    <Container size="xl">
      <Title order={1} mb="md">Donate to Oregon ACP</Title>
      <Text size="lg" c="dimmed">
        Support our mission to enhance the quality and effectiveness of health care in Oregon.
      </Text>
    </Container>
  );
};

export default Donate; 