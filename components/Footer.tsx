import React from 'react';

const Footer: React.FC = () => {
  const linkSections = [
    {
      title: 'Tools',
      links: ['PDF Merge', 'PDF Split', 'PDF Compress', 'PDF Converter', 'Invoice Generator', 'Text Summarizer', 'AI Document Analyzer'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact Us'],
    },
    {
      title: 'Resources',
      links: ['API Documentation', 'Developer Hub', 'Help Center', 'System Status', 'White Labeling'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Impressum'],
    },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
             <a href="#" className="flex items-center space-x-3">
                <img src="https://www.quanzab.com/media/quanzab.png" alt="QUANZAB Toolkit Logo" className="h-9 w-auto" />
                <span className="text-2xl font-bold font-heading bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 text-transparent bg-clip-text">QUANZAB Toolkit</span>
            </a>
            <p className="mt-4 text-slate-600 dark:text-gray-400">Your all-in-one productivity suite.</p>
          </div>
          {linkSections.map(section => (
            <div key={section.title}>
              <h3 className="font-bold font-heading tracking-wider uppercase mb-4 text-sm text-slate-500 dark:text-gray-400">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 text-base">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-gray-400">&copy; {new Date().getFullYear()} QUANZAB Toolkit. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {/* Social Icons Placeholder */}
            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"><span className="sr-only">Twitter</span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"><span className="sr-only">GitHub</span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;