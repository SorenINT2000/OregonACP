import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import { HeroCarousel } from '../components/HeroCarousel/HeroCarousel';
import homeHeroBg1 from '../assets/home_hero_bg1.jpg';
import homeHeroBg2 from '../assets/home_hero_bg2.jpg';
import homeHeroBg from '../assets/home_hero_bg.jpg';
import '@mantine/carousel/styles.css';

const aboutSlides = [
  {
    title: "About",
    gradientText: "Oregon ACP",
    description: "The American College of Physicians (ACP) is a diverse community of internal medicine specialists and subspecialists united by a commitment to excellence.",
    backgroundImage: homeHeroBg1,
    bottomDescription: "With 160,000 members worldwide, ACP is the largest medical-specialty society in the world."
  },
  {
    title: "Our",
    gradientText: "Mission",
    description: "To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine.",
    backgroundImage: homeHeroBg2,
    bottomDescription: "Leading the profession in education, standard-setting, and knowledge sharing."
  },
  {
    title: "Join Our",
    gradientText: "Community",
    description: "Become part of a network of healthcare professionals dedicated to advancing internal medicine and improving patient care.",
    backgroundImage: homeHeroBg,
    bottomDescription: "Connect with fellow physicians and stay updated with the latest medical advancements."
  }
];

const About: React.FC = () => {
  return (
    <>
      <HeroCarousel
        slides={aboutSlides}
        buttons={[
          {
            text: "Join Now",
            onClick: () => console.log("Join Now clicked"),
            gradient: { from: 'blue', to: 'cyan' },
            size: 'xl'
          },
          {
            text: "Learn More",
            onClick: () => console.log("Learn More clicked"),
            gradient: { from: 'pink', to: 'yellow' },
            size: 'xl'
          }
        ]}
        gradientTo="rgb(0, 96, 80)"
        gradientOpacity={0.5}
      />
      <Container size="xl" py="xl">
        <Title order={2} mb="md">About Us</Title>
        <Text size="lg" c="dimmed">
          Learn more about Oregon ACP and our mission to support healthcare professionals and patients across Oregon.
        </Text>
      </Container>
    </>
  );
};

export default About; 