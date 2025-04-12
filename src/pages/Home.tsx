import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { PDFViewer } from '../components/PDFViewer/PDFViewer';
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
            onClick: () => console.log("Learn More clicked"),
            gradient: { from: 'yellow', to: 'lime' },
            size: 'xl'
          },
          {
            text: "Volunteer",
            onClick: () => console.log("Volunteer clicked"),
            gradient: { from: 'yellow', to: 'lime' },
            size: 'xl'
          }
        ]}
        rightButtons={[
          {
            text: "Donate",
            onClick: () => window.open('https://store.acponline.org/ebiz/products-services/product-details/productid/337419348', '_blank'),
            gradient: { from: 'blue', to: 'cyan' },
            size: 'xl'
          }
        ]}
        backgroundImage={heroBackground}
        gradientTo="rgb(0, 96, 80)"
        gradientOpacity={0.5}
      />
      <PDFViewer
        title="Governor's Newsletter"
        description="Stay updated with the latest news from the Oregon Chapter of ACP"
        pdfPath="/assets/GovNewsletter.pdf"
      />
    </>
  );
};

export default Home; 