import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { BlogPostGrid } from '../components/BlogPostGrid/BlogPostGrid';
import heroBackground from '../assets/home_hero_bg.jpg';
import { Text, Stack, Divider } from '@mantine/core';

const hero_desc: string = "The American College of Physicians (ACP) is a diverse community of internal medicine specialists and subspecialists united by a commitment to excellence. With 160,000 members in countries across the globe, ACP is the largest medical-specialty society in the world. ACP and its physician members lead the profession in education, standard-setting, and the sharing of knowledge to advance the science and practice of internal medicine.";

const mission_statement: string = "Our Mission: \"To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine.\"";

const Home: React.FC = () => {
  return (
    <>
      <Hero
        title="Welcome"
        gradientText="Oregon Chapter of ACP"
        description={hero_desc}
        rightDescription={mission_statement}
        buttons={[
          {
            text: "Learn More",
            link: "/about",
            gradient: { from: 'yellow', to: 'lime' }
          },
          {
            text: "Volunteer",
            link: "https://www.acponline.org/volunteer",
            openInNewTab: true,
            gradient: { from: 'yellow', to: 'lime' }
          }
        ]}
        rightButtons={[
          {
            text: "Donate",
            link: "https://ami.jotform.com/243045776452056",
            openInNewTab: true,
            gradient: { from: 'yellow', to: 'lime' }
          }
        ]}
        backgroundImage={heroBackground}
        gradientTo="rgb(0, 71, 59)"
        gradientOpacity={0.4}
      />

      <Stack align="center" ta="center" gap="0">
        <Text
          fw={900}
          size="3rem"
          variant="gradient"
          gradient={{ from: 'yellow', to: 'red', deg: 90 }}
          pt="xl"
        >
          Committee Updates
          <Divider
            my="sm"
            style={{
              background: 'linear-gradient(90deg, orange, red)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              height: '2px',
              border: 'none'
            }}
          />
        </Text>
        <Text
          size="md"
          c="dimmed"
          pb="xs"
        >
          Stay informed with the latest news and updates from our committees
        </Text>
        <BlogPostGrid
          showInvisiblePosts={false}
          showAuthorInfo={false}
          showControls={false}
          showCreateCard={false}
        />
      </Stack>
    </>
  );
};

export default Home; 