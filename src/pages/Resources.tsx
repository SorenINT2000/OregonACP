import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { PDFViewer } from '../components/PDFViewer/PDFViewer';
import heroBackground from '../assets/resources_hero_bg.jpg';
import { LinkGrid } from '../components/LinkGrid/LinkGrid';
import ohsu from '../assets/ohsu.png';
import prov from '../assets/prov.png';
import sam from '../assets/sam.png';
import oha from '../assets/oha.png';
import owp from '../assets/owp.png';
import odhs from '../assets/odhs.png';
import leg from '../assets/leg.png';

const links = [
  {
    img: ohsu,
    title: 'Oregon Health & Science University',
    description:
      'The Oregon Health & Science University is a public research university focusing on health sciences in Portland, Oregon.',
    link: 'https://www.ohsu.edu/health',
  },
  {
    img: prov,
    title: 'Portland Medical Center',
    description:
      'The Portland Medical Center is a full-service medical center specializing in cancer and cardiac care.',
    link: 'https://www.providence.org/locations/or/portland-medical-center'
  },
  {
    img: odhs,
    title: 'Oregon Department of Human Services',
    description:
      'Oregon\'s principal agency for helping Oregonians achieve well-being and independence.',
    link: 'https://www.oregon.gov/odhs/pages/default.aspx'
  },
  {
    img: owp,
    title: 'Oregon Wellness Program',
    description:
      'Promotes Oregon Healthcare Professionals\' wellbeing through education, counseling & telemedicine services, and research.',
    link: 'https://oregonwellnessprogram.org/'
  },
  {
    img: prov,
    title: 'St. Vincent Medical Center',
    description:
      'A nonprofit network of hospitals, health plans, physicians, clinics and affiliated health services',
    link: 'https://www.providence.org/locations/or/st-vincent-medical-center'
  },
  {
    img: sam,
    title: 'Samaritan Health Services',
    description:
      'A nonprofit integrated delivery healthcare system consisting of five hospitals, over 110 physician clinics, and multiple health insurance plans in Oregon.',
    link: 'https://samhealth.org/'
  },
  {
    img: oha,
    title: 'Oregon Health Authority',
    description:
      'A government agency in the U.S. state of Oregon that oversees the state\'s public health system.',
    link: 'https://www.oregon.gov/oha/pages/index.aspx'
  },
  {
    img: leg,
    title: 'Legacy Health',
    description:
      'A nonprofit health system based in the Portland and Vancouver metro area and mid-Willamette Valley in Oregon.',
    link: 'https://www.legacyhealth.org/'
  },
];

const Resources: React.FC = () => {
  return (
    <>
      <Hero
        title="Resources"
        gradientText="Oregon Chapter of ACP"
        description="Access important documents, guidelines, and resources for Oregon Chapter members. From bylaws to newsletters, find everything you need to stay informed and engaged with our chapter's activities and governance."
        backgroundImage={heroBackground}
        gradientTo="rgb(0, 71, 59)"
        gradientOpacity={0.5}
      />
      
      <PDFViewer
        title="Oregon ACP Bylaws 2024"
        description="Official bylaws governing the Oregon Chapter of ACP, including organizational structure, membership requirements, and operational guidelines."
        pdfPath="/assets/OregonBylaws2024.pdf"
      />
      
      <PDFViewer
        title="Oregon ACP DEI Policy"
        description="Our commitment to diversity, equity, and inclusion, outlining our chapter's policies and initiatives to foster a more inclusive healthcare environment."
        pdfPath="/assets/DEIPolicy.pdf"
      />
      
      <PDFViewer
        title="Oregon ACP Strategic Plan 2024-2028"
        description="Our strategic plan for the Oregon Chapter of ACP, outlining our goals and initiatives for the next four years."
        pdfPath="/assets/StrategicPlan.pdf"
      />
      
      <LinkGrid 
        title="Local Resources" 
        description="Connect with major healthcare organizations across Oregon, including hospital systems, health authorities, and medical centers. Access their latest updates, services, and resources to stay informed about healthcare developments in our region." 
        links={links} 
      />
    </>
  );
};

export default Resources; 