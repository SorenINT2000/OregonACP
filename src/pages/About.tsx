import React from 'react';
import { Container, Title, Text, Paper, List, Image } from '@mantine/core';
import {
  IconHeart,
  IconMessageCircleUser,
  IconHeartHandshake,
  IconCalendar,
  IconMessageCircle,
  IconCheckbox,
  IconStethoscope,
  IconStar,
  IconFlag,
  IconScale,
  IconActivity,
} from '@tabler/icons-react';
import { HeroCarousel } from '../components/HeroCarousel/HeroCarousel';
import homeHeroBg1 from '../assets/home_hero_bg1.jpg';
import homeHeroBg2 from '../assets/home_hero_bg2.jpg';
import homeHeroBg from '../assets/home_hero_bg.jpg';
import mike from '../assets/mike.png';
import schafir from '../assets/schafir.jpg';
import '@mantine/carousel/styles.css';

const aboutSlides = [
  {
    title: "About",
    gradientText: "Oregon ACP",
    description: "The American College of Physicians (ACP) is a diverse community of internal medicine specialists and subspecialists united by a commitment to excellence.",
    backgroundImage: homeHeroBg1,
    bottomDescription: "With 160,000 members worldwide, ACP is the largest medical-specialty society in the world.",
    buttons: [
      { text: 'Events', onClick: () => window.location.href = '/events', gradient: { from: 'purple', to: 'indigo' } },
      { text: 'Contact Us', onClick: () => window.location.href = '/contact', gradient: { from: 'grape', to: 'violet' } }
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
      {
        text: 'Volunteer',
        link: 'https://www.acponline.org/volunteer',
        openInNewTab: true,
        gradient: { from: 'green', to: 'teal' }
      },
      {
        text: 'Join Now',
        link: 'https://www.acponline.org/join',
        openInNewTab: true,
        gradient: { from: 'blue', to: 'cyan' }
      }
    ]
  }
];

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
          <Title order={2} mb="md" ta="center">Governor's Welcome</Title>
          <div style={{ position: 'relative' }}>
            <Image
              src={schafir}
              alt="Alex Schafir MD FACP"
              radius="md"
              style={{
                float: 'left',
                width: '250px',
                marginRight: '20px',
                marginBottom: '10px'
              }}
            />
            <Text size="lg" ta="left" mb="md">
              Dear Colleagues,
            </Text>
            <Text size="lg" ta="left" mb="md">
              Welcome to the Oregon Chapter of the American College of Physicians, the professional home for 1600 Oregon internal medicine physicians, including about 40% of those in practice. Our chapter has a strong history of supporting the goals of the ACP to promote better patient care, professional education and community, and engagement with policy makers, patients, and peers about active issues in our healthcare environment. Have these activities ever been more important? This website has many resources to support you and, consequently, the people we serve. If you are an internal medicine physician in Oregon and not yet an ACP member, I invite you to browse these pages and learn how ACP can make your professional life easier, richer, and more rewarding.
            </Text>
            <Text size="lg" ta="left" mb="md">
              The American College of Physicians, founded in 1915, is the nation's largest medical specialty organization representing over 160,000 internal medicine physicians–doctors for adults–whether generalist or subspecialist, practicing or retired, resident or student, trained in the US or abroad. ACP has about 20 dedicated international chapters, and members in 170 countries.
            </Text>
            <Text size="lg" ta="left" mb="md">
              As Governor of the Oregon Chapter, I have the responsibility for responding to your needs; representing our chapter to the national organization and employing our influence on its activities; encouraging membership and advancement to Fellowship; recognizing our volunteer members' special achievements; encouraging input and action on national and local political issues that overlap with the scope of internal medicine; hosting local scientific meetings and CME events; and encouraging students and residents to participate in local and national college activities.
            </Text>
            <Text size="lg" ta="left" mb="md">
              As a new governor (with a term of four years) I am lucky to have inherited a vibrant chapter whose members–all volunteer–have a national reputation for energy, creativity, commitment, and leadership. What motivates us? I suspect many will agree that it is the collegial encouragement to be the best and most fulfilled physician-citizens we can be.
            </Text>
            <Text size="lg" ta="left" mb="md">
              This site is your link to internal medicine physicians in Oregon and the nation. Check the site regularly for updates, activities, and contact information for myself, other chapter leaders, and our Executive Director Mike Oechsner (866.460.5880 office@oregonacp.org.)
            </Text>
            <Text size="lg" ta="left" mb="md">
              If you have ideas for this site, for the chapter, or–critically–for how the chapter can enhance your professional life and the health of our patients, then I would like to hear from you at alex.schafir@oregonacp.org.
            </Text>
            <Text size="lg" ta="left" mb="md">
              Please introduce yourself at any one of our many chapter events, including the Oregon Annual Scientific Meeting in the Fall and the national Internal Medicine Meeting.
            </Text>
            <Text size="lg" ta="left" mb="md">
              With gratitude for your work,
            </Text>
            <Text size="lg" ta="left" mb="md">
              Alex Schafir MD FACP<br />
              Governor
            </Text>
          </div>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">About OregonACP's Executive Director</Title>
          <div style={{ position: 'relative' }}>
            <Image
              src={mike}
              alt="Mike Oechsner"
              radius="md"
              style={{
                float: 'left',
                width: '250px',
                marginRight: '20px',
                marginBottom: '10px'
              }}
            />
            <Text size="lg" ta="left" mb="md">
              Mike Oechsner MBA CAE CMP serves as the Executive Director for Oregon ACP, bringing over two decades of experience in the non-profit sector. As Vice President of Team Development with Association Management Inc. (AMI), he leads our chapter with a dedicated servant leadership approach.
            </Text>
            <Text size="lg" ta="left" mb="md">
              With extensive experience in conference and event management for audiences of over 3,000 attendees, Mike has successfully impacted funding at the state legislature level and serves as a respected leader and advisory board member with the Washington Office of the Superintendent of Public Instruction.
            </Text>
            <Text size="lg" ta="left" mb="md">
              A lifelong learner and teacher at heart, Mike holds a Bachelor's Degree in Education and a Master's Degree in Business Administration. His diverse background includes experience in the hospitality sector, having served as Senior Sales Manager for Martin Resorts and worked with Red Lion Hotels in Convention Sales.
            </Text>
            <Text size="lg" ta="left" mb="md">
              Beyond his professional role, Mike is an avid scuba diver and outdoor enthusiast. He takes pride in managing a memorial scholarship established in 1991 for his father, which has awarded over $200,000 to support student athletes and continues to hold an annual benefit slowpitch tournament.
            </Text>
          </div>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Our Mission and Vision</Title>
          <Text size="lg" ta="left" mb="md">
            The Oregon Chapter of the American College of Physicians (ACP) is dedicated to advancing internal medicine by fostering a community of excellence, collaboration, and continuous learning.
          </Text>
          <Text size="lg" ta="left" mb="md">
            <strong>Our Vision:</strong> "To be recognized globally as the leader in promoting quality patient care, advocacy, education and career fulfillment in internal medicine and its subspecialties."
          </Text>
          <Text size="lg" ta="left" mb="md">
            <strong>Our Mission:</strong> "To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine."
          </Text>
          <Text size="lg" ta="left" mb="md">
            We envision a vibrant network where every member—from established physicians and specialists to trainees and medical students—finds opportunities to grow, connect, and lead in a changing healthcare landscape.
          </Text>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Who We Are</Title>
          <Text size="lg" ta="left" mb="md">
            As part of the nation's largest and most respected medical specialty organization, our chapter unites more than 1,800 members across Oregon.
          </Text>
          <Text size="lg" ta="left" mb="md">
            These include practicing internists, subspecialists, resident and fellow physicians, and medical students.
          </Text>
          <Text size="lg" ta="left" mb="md">
            We serve as the local arm of ACP, translating national policies and best practices into actionable strategies that benefit our local communities.
          </Text>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">College Goals</Title>
          <Text size="lg" ta="left" mb="md">
            <strong>The American College of Physicians has established the following goals:</strong>
          </Text>
          <List
            spacing="xs"
            size="sm"
            center
            icon={<IconCheckbox />}
          >
            <List.Item mb="md">
              <Text>To establish and promote the highest clinical standards and ethical ideals;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To promote and respect diversity, inclusion, and equity in all aspects of the profession;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To welcome, consider and respect the many diverse voices of internal medicine and its subspecialties and work together for the benefit of the public, patients, our members, and our profession;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To serve the professional needs of the membership, support healthy lives for physicians, enhance career satisfaction and advance internal medicine as a career;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To advocate responsible positions on individual health and on public policy related to health care for the benefit of the public, patients, the medical profession, and our members;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To be the foremost comprehensive education and information resource for all internists;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To recognize excellence and distinguished contributions across internal medicine;</Text>
            </List.Item>
            <List.Item mb="md">
              <Text>To promote and conduct research to enhance the quality of practice, the education and continuing education of internists, and the significance of internal medicine to physicians and the public.</Text>
            </List.Item>
          </List>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder mb="md">
          <Title order={2} mb="md" ta="center">Core Values</Title>
          <Text size="lg" ta="left" mb="md">
            <strong>Our core values guide how we act as we move toward achieving our vision:</strong>
          </Text>
          <List>
            <List.Item icon={<IconStar size={24} />} mb="md">
              <Text><strong>Excellence:</strong> We strive for excellence and maintain the highest ethical and professional standards.</Text>
            </List.Item>
            <List.Item icon={<IconStethoscope size={24} />} mb="md">
              <Text><strong>Professionalism:</strong> We work with expertise, commitment, integrity, and humility.</Text>
            </List.Item>
            <List.Item icon={<IconFlag size={24} />} mb="md">
              <Text><strong>Leadership:</strong> We recognize and inspire leadership that upholds the highest standards of patient care, professionalism, education, policy development, and advocacy.</Text>
            </List.Item>
            <List.Item icon={<IconHeart size={24} />} mb="md">
              <Text><strong>Compassion:</strong> We respect the dignity of others and are sensitive and empathic to their needs.</Text>
            </List.Item>
            <List.Item icon={<IconMessageCircleUser size={24} />} mb="md">
              <Text><strong>Inclusion:</strong> We embrace diversity and inclusion to foster engagement, belonging, and respect in all that we do.</Text>
            </List.Item>
            <List.Item icon={<IconScale size={24} />} mb="md">
              <Text><strong>Equity and Justice:</strong> We create a just and equitable culture without barriers or limits to our members, patients, and the profession.</Text>
            </List.Item>
            <List.Item icon={<IconActivity size={24} />} mb="md">
              <Text><strong>Wellbeing:</strong> We cultivate a culture of caring for and about each other, and we advocate for and create systems changes that promote personal and professional fulfillment.</Text>
            </List.Item>
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
            <List.Item icon={<IconCalendar size={24} />} mb="md">Hosted annual scientific meetings and CME events that bring together leading experts and emerging clinicians.</List.Item>
            <List.Item icon={<IconMessageCircle size={24} />} mb="md">Played a vital role in advocacy, translating the national priorities of ACP into tangible changes at the state and local levels.</List.Item>
            <List.Item icon={<IconHeartHandshake size={24} />} mb="md">Embraced innovative initiatives in digital learning and diversity, ensuring that every physician is equipped to meet the challenges of modern healthcare.</List.Item>
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