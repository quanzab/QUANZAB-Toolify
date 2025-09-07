import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';
import { Category } from '../types';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2">
              <img src="https://www.quanzab.com/media/quanzab1.png" alt="QUANZAB Toolify Logo" className="h-8 w-auto" />
              <span className="text-2xl font-bold font-heading text-brand-dark dark:text-white">QUANZAB Toolify</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {Object.values(Category).map(cat => (
              <a href="#" key={cat} className="font-medium text-brand-dark dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors duration-200">{cat.split(' ')[0]}</a>
            ))}
             <a href="#" className="font-medium text-brand-dark dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors duration-200">API</a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a href="#" className="font-medium text-brand-dark dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors duration-200">Sign In</a>
            <a href="#" className="px-4 py-2 text-white bg-brand-primary hover:bg-blue-800 rounded-md font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary">
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
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {Object.values(Category).map(cat => (
              <a href="#" key={cat} className="block px-3 py-2 rounded-md text-base font-medium text-brand-dark dark:text-gray-200 hover:bg-brand-light dark:hover:bg-gray-800">{cat}</a>
            ))}
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-brand-dark dark:text-gray-200 hover:bg-brand-light dark:hover:bg-gray-800">API</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-5">
              <a href="#" className="w-full text-center px-4 py-2 text-white bg-brand-primary hover:bg-blue-800 rounded-md font-semibold shadow-md">
                Get Started
              </a>
            </div>
             <div className="mt-3 px-2 space-y-1">
               <a href="#" className="block text-center rounded-md px-3 py-2 text-base font-medium text-brand-dark dark:text-gray-200 hover:bg-brand-light dark:hover:bg-gray-800">Sign In</a>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;