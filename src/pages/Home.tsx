import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { PDFViewer } from '../components/PDFViewer/PDFViewer';
import { BlogPostGrid } from '../components/BlogPostGrid/BlogPostGrid';
import heroBackground from '../assets/home_hero_bg.jpg';

const hero_desc: string = "The American College of Physicians (ACP) is a diverse community of internal medicine specialists and subspecialists united by a commitment to excellence. With 160,000 members in countries across the globe, ACP is the largest medical-specialty society in the world. ACP and its physician members lead the profession in education, standard-setting, and the sharing of knowledge to advance the science and practice of internal medicine.";

const mission_statement: string = "To enhance the quality and effectiveness of health care by fostering excellence and professionalism in the practice of medicine.";

const Home: React.FC = () => {
  return (
    <>
      <Hero
        title="Welcome"
        gradientText="Oregon Chapter of ACP"
        description={hero_desc}
        rightDescription={`"${mission_statement}"`}
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
      <PDFViewer
        title="Governor's Newsletter"
        description="Stay updated with the latest news from the Oregon Chapter of ACP"
        pdfPath="/assets/GovNewsletter.pdf"
      />
      <BlogPostGrid
        title="Latest Updates"
        description="Stay informed with the latest news and updates from our committees"
        isAdmin={false}
      />
    </>
  );
};

export default Home; 