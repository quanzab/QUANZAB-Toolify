import React from 'react';
import Hero from '../components/Hero';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import CtaBanner from '../components/CtaBanner';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      
      <main id="tools" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
                An Entire Suite of Tools, Right Here.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Everything you need to enhance productivity and streamline your workflows.
            </p>
        </div>
        <div className="bg-slate-950/60 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <ToolGrid />
        </div>
      </main>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
         <TrustSection />
      </div>

      <CtaBanner />
    </>
  );
};

export default HomePage;