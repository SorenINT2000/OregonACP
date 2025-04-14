import React from 'react';
import { Container, Title, Text, Paper, List } from '@mantine/core';
import { IconHeart, IconSchool, IconKey, IconMessageCircleUser, IconHeartHandshake, IconCalendar, IconMessageCircle } from '@tabler/icons-react';
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
    bottomDescription: "With 160,000 members worldwide, ACP is the largest medical-specialty society in the world.",
    buttons: [
      { 
        text: 'Join Now', 
        link: 'https://www.acponline.org/join',
        openInNewTab: true,
        gradient: { from: 'blue', to: 'cyan' } 
      }
    ]
  },
  {
    title: "Our",
    gradientText: "Mission",
    description: "To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine.",
    backgroundImage: homeHeroBg2,
    bottomDescription: "Leading the profession in education, standard-setting, and knowledge sharing.",
    buttons: [
      { 
        text: 'Volunteer', 
        link: 'https://www.acponline.org/volunteer',
        openInNewTab: true,
        gradient: { from: 'green', to: 'teal' } 
      },
      { 
        text: 'Donate', 
        link: 'https://ami.jotform.com/243045776452056',
        openInNewTab: true,
        gradient: { from: 'orange', to: 'red' } 
      }
    ]
  },
  {
    title: "Join Our",
    gradientText: "Community",
    description: "Become part of a network of healthcare professionals dedicated to advancing internal medicine and improving patient care.",
    backgroundImage: homeHeroBg,
    bottomDescription: "Connect with fellow physicians and stay updated with the latest medical advancements.",
    buttons: [
      { text: 'Events', onClick: () => window.location.href = '/events', gradient: { from: 'purple', to: 'indigo' } },
      { text: 'Contact Us', onClick: () => window.location.href = '/contact', gradient: { from: 'grape', to: 'violet' } }
    ]
  }
];


const mission_and_vision: string = `The Oregon Chapter of the American College of Physicians (ACP) is dedicated to advancing internal medicine by fostering a community of excellence, collaboration, and continuous learning. Our mission is to enhance patient care and professional fulfillment for internists in Oregon through high-quality education, innovative clinical research, effective advocacy, and an unwavering commitment to diversity and inclusion.\n
  We envision a vibrant network where every member—from established physicians and specialists to trainees and medical students—finds opportunities to grow, connect, and lead in a changing healthcare landscape.`;


const who_we_are: string = `As part of the nation's largest and most respected medical specialty organization, our chapter unites more than 1,800 members across Oregon. These include practicing internists, subspecialists, resident and fellow physicians, and medical students. We serve as the local arm of ACP, translating national policies and best practices into actionable strategies that benefit our local communities.`;


const About: React.FC = () => {
  return (
    <>
      <HeroCarousel
        slides={aboutSlides}
        gradientTo="rgb(0, 71, 59)"
        gradientOpacity={0.5}
      />
      <Container size="lg" py="xl">
        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Our Mission and Vision</Title>
          {mission_and_vision.split('\n').map((par, index) => (
            <Text key={index} size="lg" ta="left" mb="md">
              {par}
            </Text>
          ))}
        </Paper>
        
        
        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Who We Are</Title>
          <Text size="lg" ta="left" mb="md">
            {who_we_are}
          </Text>
        </Paper>
        
        
        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Our Values</Title>
          <Text size="lg" ta="left" mb="md">
            We are commited to:
          </Text>
          <List>
            <List.Item icon={<IconHeart size={24}/>} mb="md"><strong>Excellence in Patient Care:</strong> We promote evidence-based practices and cutting-edge clinical education to ensure that every patient receives the best possible care.</List.Item>
            <List.Item icon={<IconSchool size={24}/>} mb="md"><strong>Commitment to Education:</strong> Through regular scientific meetings, continuing medical education (CME) events, and professional development workshops, we support lifelong learning and skill enhancement.</List.Item>
            <List.Item icon={<IconKey size={24}/>} mb="md"><strong>Advocacy and Leadership:</strong> Our chapter actively engages with policymakers, hospital networks, and peer organizations to champion improvements in healthcare delivery and internal medicine.</List.Item>
            <List.Item icon={<IconMessageCircleUser size={24}/>} mb="md"><strong>Diversity, Equity, and Inclusion:</strong> Recognizing that diverse perspectives lead to innovative solutions, we are dedicated to creating an inclusive environment that reflects the community we serve.</List.Item>
            <List.Item icon={<IconHeartHandshake size={24}/>} mb="md"><strong>Collaboration and Community:</strong> We value open communication, mentorship, and collaboration among our members, fostering a strong sense of community and shared purpose.</List.Item>
          </List>
        </Paper>


        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Our History</Title>
          <Text size="lg" ta="left" mb="md">
            Rooted in the longstanding tradition of the American College of Physicians—founded in 1915—the Oregon Chapter has grown and evolved to meet the unique needs of internists in our state.
            Though detailed historical records are a testament to many decades of dedicated service, our modern chapter proudly continues that legacy by offering robust educational programs, advocacy initiatives, and recognition awards that honor contributions to the field of internal medicine.
          </Text>
          <Text size="lg" ta="left" mb="md">
            Over the years, our chapter has:
          </Text>
          <List>
            <List.Item icon={<IconCalendar size={24}/>} mb="md">Hosted annual scientific meetings and CME events that bring together leading experts and emerging clinicians.</List.Item>
            <List.Item icon={<IconMessageCircle size={24}/>} mb="md">Played a vital role in advocacy, translating the national priorities of ACP into tangible changes at the state and local levels.</List.Item>
            <List.Item icon={<IconHeartHandshake size={24}/>} mb="md">Embraced innovative initiatives in digital learning and diversity, ensuring that every physician is equipped to meet the challenges of modern healthcare.</List.Item>
          </List>
        </Paper>
        
        
        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">What We Offer</Title>
          <Text size="lg" ta="left" mb="md" fw={700}>
            Educational Opportunities
          </Text>
          <Text size="lg" ta="left" mb="md">
            We provide a range of learning events—from local scientific meetings and hands-on workshops to webinars and mentorship programs—that are designed to keep our members at the forefront of medical innovation and best practices.
          </Text>
          <Text size="lg" ta="left" mb="md" fw={700}>
            Advocacy and Public Policy
          </Text>
          <Text size="lg" ta="left" mb="md">
            Our chapter champions the interests of Oregon's internists through active participation in local and national policy dialogues. Whether it's addressing regulatory challenges, enhancing access to quality care, or promoting ethical medical practices, we work tirelessly to make your voice heard.
          </Text>
          <Text size="lg" ta="left" mb="md" fw={700}>
            Networking and Professional Growth
          </Text>
          <Text size="lg" ta="left" mb="md">
            Join a supportive community where you can exchange ideas, seek advice, and build lasting professional relationships. Through both formal leadership programs and informal networking events, we create an environment where every member can thrive.
          </Text>
        </Paper>
      </Container>
    </>
  );
};

export default About;