import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
          src="https://static.vecteezy.com/system/resources/previews/050/841/022/mp4/two-folders-with-paper-and-a-paper-clip-free-video.mp4"
          poster="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%201920%201080%22%3E%3Crect%20width%3D%221920%22%20height%3D%221080%22%20fill%3D%22%23020617%22%2F%3E%3C%2Fsvg%3E"
        />
        <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold font-heading text-slate-50 dark:text-white tracking-tight">
          Your All-in-One
          <span className="block bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mt-2 sm:mt-4">AI Productivity Suite</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 dark:text-gray-300">
         From complex document analysis to creative text generation, accomplish more with our intelligent, integrated toolkit.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tools"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Explore AI Tools
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;