import React, { useEffect, useRef } from 'react';
import { Container, Text, Title, Group, Paper } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import type { EmblaCarouselType as CarouselApi } from 'embla-carousel';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import classes from './HeroCarousel.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  link?: string;
  openInNewTab?: boolean;
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
  gradientTo = 'rgb(0, 0, 0)',
  gradientOpacity = 0.7,
}: HeroCarouselProps) {
  const [emblaApi, setEmblaApi] = React.useState<CarouselApi | null>(null);
  const isLargeScreen = useMediaQuery('(min-width: 1220px)');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    let isUserInteraction = false;

    // Function to start the automatic scrolling
    const startAutoScroll = () => {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set a new interval
      intervalRef.current = setInterval(() => {
        if (emblaApi && !isUserInteraction) {
          emblaApi.scrollNext();
        }
      }, 8000);
    };

    // Start the automatic scrolling
    startAutoScroll();

    // Add event listeners for user interaction
    const onSelect = () => {
      if (isUserInteraction) {
        // Stop the automatic scrolling when user interacts
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    const onPointerDown = () => {
      isUserInteraction = true;
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('pointerDown', onPointerDown);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      emblaApi.off('select', onSelect);
      emblaApi.off('pointerDown', onPointerDown);
    };
  }, [emblaApi]);

  return (
    <Carousel
      getEmblaApi={setEmblaApi}
      withIndicators={isLargeScreen}
      height={500}
      slideSize="100%"
      slideGap="md"
      loop
      withControls={isLargeScreen}
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
                          link={button.link}
                          openInNewTab={button.openInNewTab}
                          gradient={button.gradient}
                          className={classes.control}
                        />
                      ))}
                    </Group>
                  </div>
                </div>
              </Container>

              {slide.bottomDescription && (
                <Paper className={classes.bottomDescription} p="lg" withBorder>
                  <Text size="sm" fw={500}>
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