import React from 'react';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import CtaBanner from '../components/CtaBanner';

const HomePage: React.FC = () => {
  return (
    <>
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="absolute -top-40 -right-40 w-[50rem] h-[50rem] bg-gradient-to-tr from-purple/20 to-cyan/20 rounded-full blur-3xl opacity-30 animate-[spin_30s_linear_infinite]"></div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple to-cyan opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        </div>
        
        <main id="tools" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column (Hero Content) */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
                Unlock Your Document
                <span className="block bg-gradient-to-r from-cyan to-purple text-transparent bg-clip-text mt-2 sm:mt-3">Potential</span>
              </h1>
              <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-400">
                Merge, Convert, Sign, Analyze, and More. Our comprehensive suite of AI-powered tools allows you to run experiments in minutes, not months.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#tools"
                  className="w-full sm:w-auto inline-block px-8 py-3 text-lg font-semibold text-slate-900 bg-white rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  Try For Free
                </a>
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-block px-8 py-3 text-lg font-semibold text-white bg-white/10 border-2 border-white/20 rounded-lg hover:bg-white/20 transition-colors duration-300"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right Column (ToolGrid) */}
            <div className="bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
              <ToolGrid />
            </div>
          </div>
        </main>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl mb-20">
            <TrustSection />
            <CtaBanner />
         </div>
      </div>
    </>
  );
};

export default HomePage;