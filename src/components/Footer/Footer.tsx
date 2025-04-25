import React from 'react';
import { Container, Text, Group, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <Text size="sm" c="dimmed">
            OR Chapter ACP 5727 Baker Way NW Suite 200 Gig Harbor, WA 98332 | Ph. 1-877-460-5880 | Copyright © 2023 <s>AMInc.org</s>
          </Text>
          <Group gap="xs" wrap="wrap">
            <Anchor component={Link} to="/privacy-policy" size="sm">
              Privacy Policy
            </Anchor>
            <Anchor component={Link} to="/contact" size="sm">
              Contact Us
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
} 