import React from 'react';
import Hero from '../components/Hero';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import CtaBanner from '../components/CtaBanner';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl -mt-20 relative z-10 mb-20">
          <ToolGrid />
          <TrustSection />
          <CtaBanner />
        </div>
      </div>
    </>
  );
};

export default HomePage;