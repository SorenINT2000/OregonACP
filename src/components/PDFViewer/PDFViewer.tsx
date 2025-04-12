import React, { useState } from 'react';
import { Container, Title, Text, Paper, Group, Button, Collapse } from '@mantine/core';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';
import classes from './PDFViewer.module.css';

interface PDFViewerProps {
  title: string;
  description: string;
  pdfPath: string;
}

export function PDFViewer({ title, description, pdfPath }: PDFViewerProps) {
  const [opened, setOpened] = useState(false);

  const handleDownload = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <Container size="lg" py="md">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2}>{title}</Title>
        
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        
        <Group mt="md">
          <Button 
            variant="light"
            onClick={() => setOpened((o) => !o)}
            rightSection={<IconChevronDown size={16} />}
          >
            {opened ? 'Hide PDF' : 'Show PDF'}
          </Button>
          <Button 
            leftSection={<IconDownload size={16} />}
            variant="light"
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </Group>

        <Collapse in={opened}>
          <div className={classes.pdfContainer}>
            <iframe
              src={pdfPath}
              className={classes.pdfFrame}
              title={title}
            />
          </div>
        </Collapse>
      </Paper>
    </Container>
  );
} 