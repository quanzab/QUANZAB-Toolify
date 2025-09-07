import React, { Suspense, lazy, ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { tools } from './data/tools';
import Loader from './components/Loader';

const HomePage = lazy(() => import('./pages/HomePage'));
const PdfMergePage = lazy(() => import('./pages/PdfMergePage'));
const PdfConverterPage = lazy(() => import('./pages/PdfConverterPage'));
const PdfSplitPage = lazy(() => import('./pages/PdfSplitPage'));
const PdfCompressPage = lazy(() => import('./pages/PdfCompressPage'));
const ToolComingSoonPage = lazy(() => import('./pages/ToolComingSoonPage'));

// A map of implemented tool paths to their components
// FIX: Changed React.FC to ComponentType to fix type error with React.lazy
const implementedTools: { [key: string]: React.LazyExoticComponent<ComponentType<any>> } = {
  '/pdf-merge': PdfMergePage,
  '/pdf-converter': PdfConverterPage,
  '/pdf-split': PdfSplitPage,
  '/pdf-compress': PdfCompressPage,
};


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex justify-center items-center h-screen w-full"><Loader message="Loading page..." /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {tools.map(tool => {
              const ToolComponent = implementedTools[tool.path];
              if (ToolComponent) {
                return <Route key={tool.path} path={tool.path} element={<ToolComponent />} />;
              }
              return <Route key={tool.path} path={tool.path} element={<ToolComingSoonPage tool={tool} />} />;
            })}
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;