import React from 'react';
import { Container, Text, Title, Group } from '@mantine/core';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import classes from './Hero.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

interface HeroProps {
  title: string;
  gradientText?: string;
  description: string;
  buttons?: ArrowButtonProps[];
  backgroundColor?: string;
  backgroundImage?: string;
  gradientTo?: string;
  gradientOpacity?: number;
}

export function Hero({
  title,
  gradientText,
  description,
  buttons = [{ text: 'Get started', gradient: { from: 'pink', to: 'yellow' }, size: 'xl' }],
  backgroundImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8&auto=format&fit=crop&w=1080&q=80',
  gradientTo = '#062343',
  gradientOpacity = 0.7,
}: HeroProps) {
  const backgroundStyle = {
    '--hero-bg-image': `url(${backgroundImage})`,
    '--hero-gradient-to': gradientTo,
    '--hero-gradient-opacity': gradientOpacity,
  } as React.CSSProperties;

  return (
    <div className={classes.root} style={backgroundStyle}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              {title}{' '}
              {gradientText && (
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'pink', to: 'yellow' }}
                >
                  {gradientText}
                </Text>
              )}
            </Title>

            <Text className={classes.description} mt={30} fw={700}>
              {description}
            </Text>

            <Group className={classes.controls}>
              {buttons.map((button, index) => (
                <ArrowButton
                  key={index}
                  text={button.text}
                  onClick={button.onClick}
                  gradient={button.gradient}
                  size={button.size}
                  className={classes.control}
                />
              ))}
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
} 