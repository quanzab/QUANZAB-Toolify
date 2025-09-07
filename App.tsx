
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
const PdfSignPage = lazy(() => import('./pages/PdfSignPage'));
const ToolComingSoonPage = lazy(() => import('./pages/ToolComingSoonPage'));
const InvoiceGeneratorPage = lazy(() => import('./pages/InvoiceGeneratorPage'));
const ReceiptScannerPage = lazy(() => import('./pages/ReceiptScannerPage'));
const TextSummarizerPage = lazy(() => import('./pages/TextSummarizerPage'));
const AiDocumentAnalyzerPage = lazy(() => import('./pages/AiDocumentAnalyzerPage'));
const CrewRosterPlannerPage = lazy(() => import('./pages/CrewRosterPlannerPage'));
const VesselComplianceCheckerPage = lazy(() => import('./pages/VesselComplianceCheckerPage'));
const ParaphraserRewriterPage = lazy(() => import('./pages/ParaphraserRewriterPage'));


// A map of implemented tool paths to their components
// FIX: Changed React.FC to ComponentType to fix type error with React.lazy
const implementedTools: { [key: string]: React.LazyExoticComponent<ComponentType<any>> } = {
  '/pdf-merge': PdfMergePage,
  '/pdf-converter': PdfConverterPage,
  '/pdf-split': PdfSplitPage,
  '/pdf-compress': PdfCompressPage,
  '/pdf-sign': PdfSignPage,
  '/invoice-generator': InvoiceGeneratorPage,
  '/receipt-scanner': ReceiptScannerPage,
  '/text-summarizer': TextSummarizerPage,
  '/ai-document-analyzer': AiDocumentAnalyzerPage,
  '/crew-roster-planner': CrewRosterPlannerPage,
  '/vessel-compliance-checker': VesselComplianceCheckerPage,
  '/paraphraser-rewriter': ParaphraserRewriterPage,
};


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
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