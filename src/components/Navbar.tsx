import { Container, Group, Button, Image, ActionIcon, Menu, Burger, Drawer, Stack, Collapse } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { IconBrandFacebook, IconBrandInstagram, IconChevronDown } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export function Navbar() {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);
  const [eventsExpanded, { toggle: toggleEvents }] = useDisclosure(false);

  const MobileNavLinks = () => (
    <>
      <Button
        component={Link}
        to="/"
        variant={location.pathname === '/' ? 'filled' : 'subtle'}
        onClick={() => opened && toggle()}
        fullWidth
      >
        Home
      </Button>
      <Button
        component={Link}
        to="/about"
        variant={location.pathname === '/about' ? 'filled' : 'subtle'}
        onClick={() => opened && toggle()}
        fullWidth
      >
        About
      </Button>
      <Button
        variant={location.pathname === '/events' || location.pathname === '/annual-meeting' ? 'filled' : 'subtle'}
        rightSection={<IconChevronDown size={16} style={{ transform: eventsExpanded ? 'rotate(180deg)' : 'none' }} />}
        onClick={toggleEvents}
        fullWidth
      >
        Events
      </Button>
      <Collapse in={eventsExpanded}>
        <Stack gap="xs" pl="md">
          <Button
            component={Link}
            to="/events"
            variant="subtle"
            fullWidth
            onClick={() => opened && toggle()}
            styles={{
              root: {
                fontWeight: location.pathname === '/events' ? 700 : 400
              }
            }}
          >
            Chapter Events
          </Button>
          <Button
            component={Link}
            to="/annual-meeting"
            variant="subtle"
            fullWidth
            onClick={() => opened && toggle()}
            styles={{
              root: {
                fontWeight: location.pathname === '/annual-meeting' ? 700 : 400
              }
            }}
          >
            Annual Chapter Meeting
          </Button>
        </Stack>
      </Collapse>
      <Button
        component={Link}
        to="/resources"
        variant={location.pathname === '/resources' ? 'filled' : 'subtle'}
        onClick={() => opened && toggle()}
        fullWidth
      >
        Resources
      </Button>
    </>
  );

  const DesktopNavLinks = () => (
    <>
      <Button
        component={Link}
        to="/"
        variant={location.pathname === '/' ? 'filled' : 'subtle'}
      >
        Home
      </Button>
      <Button
        component={Link}
        to="/about"
        variant={location.pathname === '/about' ? 'filled' : 'subtle'}
      >
        About
      </Button>
      <Button
        component={Link}
        to="/resources"
        variant={location.pathname === '/resources' ? 'filled' : 'subtle'}
      >
        Resources
      </Button>
      <Menu position="bottom" withArrow>
        <Menu.Target>
          <Button 
            variant={location.pathname === '/events' || location.pathname === '/annual-meeting' ? 'filled' : 'subtle'}
            rightSection={<IconChevronDown size={16} />}
          >
            Events
          </Button>
        </Menu.Target>
        
        <Menu.Dropdown>
          <Menu.Item 
            component={Link} 
            to="/events"
            fw={location.pathname === '/events' ? 700 : 400}
          >
            Chapter Events
          </Menu.Item>
          <Menu.Item 
            component={Link} 
            to="/annual-meeting"
            fw={location.pathname === '/annual-meeting' ? 700 : 400}
          >
            Annual Chapter Meeting
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );

  const SocialLinks = ({ centered = false }) => (
    <Group justify={centered ? "center" : undefined}>
      <ActionIcon
        component="a"
        href="https://www.facebook.com/OregonACP"
        target="_blank"
        rel="noopener noreferrer"
        variant="subtle"
        size="lg"
        radius="xl"
        aria-label="Facebook"
      >
        <IconBrandFacebook size={24} />
      </ActionIcon>
      
      <ActionIcon
        component="a"
        href="https://www.instagram.com/oregonacp"
        target="_blank"
        rel="noopener noreferrer"
        variant="subtle"
        size="lg"
        radius="xl"
        aria-label="Instagram"
      >
        <IconBrandInstagram size={24} />
      </ActionIcon>
    </Group>
  );

  return (
    <Container size="xl" h="100%">
      <Group justify="space-between" h="100%">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Image
            src="/logo_full.png"
            alt="Oregon ACP Logo"
            h={40}
            w="auto"
            fit="contain"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <Group visibleFrom="sm">
          <DesktopNavLinks />
          <SocialLinks />
        </Group>

        {/* Mobile Burger Menu */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        
        {/* Mobile Drawer */}
        <Drawer
          opened={opened}
          onClose={toggle}
          size="80%"
          position="right"
          padding="xl"
          title="Menu"
          hiddenFrom="sm"
          zIndex={1000}
          styles={{
            body: {
              paddingTop: '1rem'
            },
            header: {
              marginBottom: '1rem'
            }
          }}
        >
          <Stack gap="md">
            <MobileNavLinks />
            <SocialLinks centered />
          </Stack>
        </Drawer>
      </Group>
    </Container>
  );
} 