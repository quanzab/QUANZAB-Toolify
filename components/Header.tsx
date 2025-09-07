import React, { useState } from 'react';
import { Category } from '../types';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img src="https://www.quanzab.com/media/quanzab.png" alt="QUANZAB Toolify Logo" className="h-9 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <a href="#features" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Features</a>
            <a href="#tools" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Use Cases</a>
            <a href="#" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Accuracy</a>
            <a href="#" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Pricing</a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a href="#" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Sign In</a>
            <a href="#" className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800">Features</a>
            <a href="#tools" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800">Use Cases</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800">How It Works</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800">Accuracy</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800">Pricing</a>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-700">
            <div className="flex items-center px-5">
              <a href="#" className="w-full text-center px-4 py-2 bg-white text-slate-900 rounded-md font-semibold shadow-md">
                Get Started
              </a>
            </div>
             <div className="mt-3 px-2 space-y-1">
               <a href="#" className="block text-center rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-slate-800">Sign In</a>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;