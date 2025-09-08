import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon } from './Icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img src="https://www.quanzab.com/media/quanzab.png" alt="QUANZAB Toolkit Logo" className="h-9 w-auto" />
              <span className="text-2xl font-bold font-heading bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">QUANZAB Toolkit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <a href="/#features" className="px-6 py-3 rounded-xl font-bold text-xl bg-slate-800 transition-all duration-300 hover:scale-105 hover:bg-slate-700 animate-text-flash">Explore Features</a>
            <a href="/#tools" className="px-6 py-3 rounded-xl font-bold text-xl bg-slate-800 transition-all duration-300 hover:scale-105 hover:bg-slate-700 animate-text-flash">Explore Tools</a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-gray-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserIcon className="h-6 w-6" />
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-700" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-sm text-gray-200">Signed in as</p>
                        <p className="text-sm font-medium text-gray-300 truncate">{user?.email}</p>
                      </div>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-700" role="menuitem">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="font-medium text-gray-300 hover:text-white transition-colors duration-200">Sign In</Link>
                <Link to="/signup" className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
                  Get Started
                </Link>
              </>
            )}
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
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            <a href="/#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-lg font-bold text-center bg-slate-800 animate-text-flash">Explore Features</a>
            <a href="/#tools" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-lg font-bold text-center bg-slate-800 animate-text-flash">Explore Tools</a>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-700">
            {isAuthenticated ? (
               <div className="px-2 space-y-1">
                 <div className="px-3 py-2 text-sm text-gray-400 truncate">{user?.email}</div>
                 <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-slate-800">
                    Sign Out
                 </button>
               </div>
            ) : (
                <>
                <div className="flex items-center px-5">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-4 py-2 bg-white text-slate-900 rounded-md font-semibold shadow-md">
                        Get Started
                    </Link>
                </div>
                 <div className="mt-3 px-2 space-y-1">
                   <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="block text-center rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-slate-800">Sign In</Link>
                 </div>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;