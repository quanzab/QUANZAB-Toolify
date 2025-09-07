import React from 'react';
import Hero from '../components/Hero';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import CtaBanner from '../components/CtaBanner';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ToolGrid />
      <TrustSection />
      <CtaBanner />
    </>
  );
};

export default HomePage;