import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import OfferingsSection from '../components/OfferingsSection';
import FacilityInfo from '../components/FacilityInfo';

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <OfferingsSection />
      <FacilityInfo />
    </div>
  );
};

export default Home;
