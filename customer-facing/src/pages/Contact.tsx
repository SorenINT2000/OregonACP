import React from 'react';
import { Container, Title, Text, Paper, TextInput, Textarea, Button, Stack, Group, Anchor } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

const Contact: React.FC = () => {
  return (
    <Container size="xl">
      <Title order={1} mb="md">Contact Us</Title>
      <Text size="lg" c="dimmed" mb="xl">
        Have questions about the Oregon Chapter of ACP? We're here to help. Reach out to us through the form below or contact us directly.
      </Text>

      <Group align="stretch" grow>
        <Paper shadow="sm" p="xl" radius="md" withBorder style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Title order={2} mb="md">Send us a Message</Title>
          <form style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Name"
                placeholder="Your name"
                required
              />
              <TextInput
                label="Email"
                placeholder="your.email@example.com"
                required
              />
              <TextInput
                label="Subject"
                placeholder="What is this regarding?"
                required
              />
              <Textarea
                label="Message"
                placeholder="Your message here..."
                minRows={4}
                required
              />
              <Button type="submit" size="md">
                Send Message
              </Button>
            </Stack>
          </form>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Title order={2} mb="md">Contact Information</Title>
          <Stack style={{ flex: 1 }}>
            <Group>
              <IconMail size={24} />
              <div>
                <Text fw={500}>Email</Text>
                <Anchor href="mailto:oregonacp@aminc.org">oregonacp@aminc.org</Anchor>
              </div>
            </Group>
            <Group>
              <IconPhone size={24} />
              <div>
                <Text fw={500}>Phone</Text>
                <Anchor href="tel:1-877-460-5880">1-877-460-5880</Anchor>
              </div>
            </Group>
            <Group>
              <IconMapPin size={24} />
              <div>
                <Text fw={500}>Address</Text>
                <Text>5727 Baker Way NW Suite 200<br />Gig Harbor, WA 98332</Text>
              </div>
            </Group>
          </Stack>

          <Title order={3} mt="xl" mb="md">Office Hours</Title>
          <Text>Monday - Friday: 9:00 AM - 5:00 PM PST</Text>
        </Paper>
      </Group>
    </Container>
  );
};

export default Contact; 