import React from 'react';
import { Container, Text, Title, Group, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import classes from './HeroCarousel.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CarouselSlide {
  title: string;
  gradientText?: string;
  description: string;
  backgroundImage: string;
  bottomDescription?: string;
  buttons?: ArrowButtonProps[];
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  gradientTo?: string;
  gradientOpacity?: number;
}

export function HeroCarousel({
  slides,
  gradientTo = '#062343',
  gradientOpacity = 0.7,
}: HeroCarouselProps) {
  return (
    <Carousel
      withIndicators
      height={500}
      slideSize="100%"
      slideGap="md"
      loop
      classNames={{
        root: classes.carousel,
        indicators: classes.indicators,
        indicator: classes.indicator,
      }}
    >
      {slides.map((slide, index) => {
        const backgroundStyle = {
          '--hero-bg-image': `url(${slide.backgroundImage})`,
          '--hero-gradient-to': gradientTo,
          '--hero-gradient-opacity': gradientOpacity,
        } as React.CSSProperties;

        return (
          <Carousel.Slide key={index}>
            <div className={classes.root} style={backgroundStyle}>
              <Container size="lg">
                <div className={classes.inner}>
                  <div className={classes.content}>
                    <Title className={classes.title}>
                      {slide.title}{' '}
                      {slide.gradientText && (
                        <Text
                          component="span"
                          inherit
                          variant="gradient"
                          gradient={{ from: 'pink', to: 'yellow' }}
                        >
                          {slide.gradientText}
                        </Text>
                      )}
                    </Title>

                    <Text className={classes.description} mt={30} fw={700}>
                      {slide.description}
                    </Text>

                    <Group className={classes.controls}>
                      {slide.buttons && slide.buttons.map((button, btnIndex) => (
                        <ArrowButton
                          key={btnIndex}
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
              
              {slide.bottomDescription && (
                <Paper className={classes.bottomDescription} p="md" withBorder>
                  <Text size="sm" c="dimmed">
                    {slide.bottomDescription}
                  </Text>
                </Paper>
              )}
            </div>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
} 