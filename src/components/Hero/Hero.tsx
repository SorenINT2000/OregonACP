import React from 'react';
import { Container, Text, Title, Group, Paper } from '@mantine/core';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { Divider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Hero.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  link?: string;
  openInNewTab?: boolean;
}

interface HeroProps {
  title: string;
  gradientText?: string;
  description: string;
  rightDescription?: string;
  buttons?: ArrowButtonProps[];
  rightButtons?: ArrowButtonProps[];
  backgroundColor?: string;
  backgroundImage?: string;
  gradientTo?: string;
  gradientOpacity?: number;
}

export function Hero({
  title,
  gradientText,
  description,
  rightDescription,
  buttons = [],
  rightButtons = [],
  backgroundImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8&auto=format&fit=crop&w=1080&q=80',
  gradientTo = '#062343',
  gradientOpacity = 0.7,
}: HeroProps) {
  const isMobile = useMediaQuery(`(max-width: 1020px)`);
  const backgroundStyle = {
    '--hero-bg-image': `url(${backgroundImage})`,
    '--hero-gradient-to': gradientTo,
    '--hero-gradient-opacity': gradientOpacity,
  } as React.CSSProperties;

  return (
    <>
      <div className={classes.root} style={backgroundStyle}>
        <Container size="lg">
          <div className={classes.inner}>
            <div className={classes.content}>
              <div className={classes.title}>
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'lime' }}
                >
                  {gradientText}
                </Text>
                <Divider my="sm" />
                <Title className={classes.title}>
                  {title}{' '}
                </Title>
              </div>

              <Text className={classes.description} mt={30} fw={700}>
                {description}
              </Text>

              <Group className={classes.controls}>
                <Group>
                  {buttons.map((button, index) => (
                    <ArrowButton
                      key={index}
                      text={button.text}
                      onClick={button.onClick}
                      link={button.link}
                      openInNewTab={button.openInNewTab}
                      gradient={button.gradient}
                      className={classes.control}
                    />
                  ))}
                </Group>
                {rightButtons.length > 0 && (
                  <Group>
                    {rightButtons.map((button, index) => (
                      <ArrowButton
                        key={index}
                        text={button.text}
                        onClick={button.onClick}
                        link={button.link}
                        openInNewTab={button.openInNewTab}
                        gradient={button.gradient}
                        className={classes.control}
                      />
                    ))}
                  </Group>
                )}
              </Group>
            </div>

            {!isMobile && rightDescription && (
              <div className={classes.rightContent}>
                <Paper className={classes.quotePaper} p="md" radius="md">
                  <Text className={classes.quoteText} size="xl" fw={500} ta="center">
                    {rightDescription}
                  </Text>
                </Paper>
              </div>
            )}
          </div>
        </Container>
      </div>

      {isMobile && rightDescription && (
        <Container size="lg" mt="xl">
          <Paper className={classes.mobileQuotePaper} p="xl" radius="md" withBorder>
            <Text className={classes.mobileQuoteText} size="xl" fw={500} ta="center">
              {rightDescription}
            </Text>
          </Paper>
        </Container>
      )}
    </>
  );
} 