import { Container, SimpleGrid, Text, Title, Paper } from '@mantine/core';
import classes from './LinkGrid.module.css';


interface LinkCardProps {
  img: string | null;
  title: string;
  description: string;
  link: string;
}

export function LinkCard({ img, title, description, link }: LinkCardProps) {
  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      className={`${classes.card} ${img ? classes.cardWithImage : ''}`}
      style={img ? { backgroundImage: `url(${img})` } : undefined}
      onClick={() => window.open(link, '_blank')}
    >
      <Container className={img ? classes.cardContent : undefined}>
        <div>
          <Text mt="sm" mb={7}>
            {title}
          </Text>
          <Text size="sm" c="dimmed" lh={1.6}>
            {description}
          </Text>
        </div>
      </Container>
    </Paper>
  );
}

interface LinkGridProps {
  title: string;
  description: string;
  links: LinkCardProps[];
}

export function LinkGrid({ title, description, links }: LinkGridProps) {
  const features = links.map((feature, index) => <LinkCard {...feature} key={index} />);

  return (
    <Container size="lg" className={classes.wrapper} p="md">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title className={classes.title}>{title}</Title>

        <Container size={560} p={0}>
          <Text size="sm" className={classes.description}>
            {description}
          </Text>
        </Container>

        <SimpleGrid
          mt={60}
          cols={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 'xl', md: 10 }}
          verticalSpacing={{ base: 'xl', md: 10 }}
        >
          {features}
        </SimpleGrid>
      </Paper>
    </Container>
  );
}