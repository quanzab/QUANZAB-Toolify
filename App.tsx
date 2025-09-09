import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import ProtectedRoute from './components/ProtectedRoute';

// Import all page components
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PdfMergePage from './pages/PdfMergePage';
import PdfSplitPage from './pages/PdfSplitPage';
import PdfCompressPage from './pages/PdfCompressPage';
import PdfConverterPage from './pages/PdfConverterPage';
import ImageToPdfPage from './pages/ImageToPdfPage';
import PdfSignPage from './pages/PdfSignPage';
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage';
import TextSummarizerPage from './pages/TextSummarizerPage';
import ParaphraserRewriterPage from './pages/ParaphraserRewriterPage';
import ReceiptScannerPage from './pages/ReceiptScannerPage';
import AiDocumentAnalyzerPage from './pages/AiDocumentAnalyzerPage';
import ImageBackgroundRemoverPage from './pages/ImageBackgroundRemoverPage';
import ImageEditorPage from './pages/ImageEditorPage';
import ZipCreatorPage from './pages/ZipCreatorPage';
import TaskManagerPage from './pages/TaskManagerPage';
import AiItineraryPlannerPage from './pages/AiItineraryPlannerPage';
import CrewRosterPlannerPage from './pages/CrewRosterPlannerPage';
import VesselComplianceCheckerPage from './pages/VesselComplianceCheckerPage';
import ToolComingSoonPage from './pages/ToolComingSoonPage';
import PdfToWordPage from './pages/PdfToWordPage';
import AiContentGeneratorPage from './pages/AiContentGeneratorPage';
import AiImageGeneratorPage from './pages/AiImageGeneratorPage';
import PlatformFeaturesPage from './pages/PlatformFeaturesPage';
import AiPresentationGeneratorPage from './pages/AiPresentationGeneratorPage';
import AiCodeAssistantPage from './pages/AiCodeAssistantPage';
import PdfAnnotatorPage from './pages/PdfAnnotatorPage';
import AiAudioTranscriberPage from './pages/AiAudioTranscriberPage';
import VideoToGifConverterPage from './pages/VideoToGifConverterPage';
import LanguageTranslatorPage from './pages/LanguageTranslatorPage';
import ProjectPlannerPage from './pages/ProjectPlannerPage';
import PdfWatermarkPage from './pages/PdfWatermarkPage';
import PdfProtectPage from './pages/PdfProtectPage';
import VideoEditorPage from './pages/VideoEditorPage';
import PdfUnlockPage from './pages/PdfUnlockPage';
import PdfRedactPage from './pages/PdfRedactPage';
import AiResearchAssistantPage from './pages/AiResearchAssistantPage';
import AiKeywordExtractorPage from './pages/AiKeywordExtractorPage';
import PdfPageManagerPage from './pages/PdfPageManagerPage';
import AiProofreaderPage from './pages/AiProofreaderPage';

import { tools } from './data/tools';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  '/pdf-merge': PdfMergePage,
  '/pdf-split': PdfSplitPage,
  '/pdf-compress': PdfCompressPage,
  '/pdf-to-image': PdfConverterPage,
  '/image-to-pdf': ImageToPdfPage,
  '/pdf-sign': PdfSignPage,
  '/invoice-generator': InvoiceGeneratorPage,
  '/text-summarizer': TextSummarizerPage,
  '/paraphraser-rewriter': ParaphraserRewriterPage,
  '/receipt-scanner': ReceiptScannerPage,
  '/ai-document-analyzer': AiDocumentAnalyzerPage,
  '/ai-content-generator': AiContentGeneratorPage,
  '/ai-image-generator': AiImageGeneratorPage,
  '/image-background-remover': ImageBackgroundRemoverPage,
  '/image-editor': ImageEditorPage,
  '/zip-creator': ZipCreatorPage,
  '/task-manager': TaskManagerPage,
  '/ai-itinerary-planner': AiItineraryPlannerPage,
  '/crew-roster-planner': CrewRosterPlannerPage,
  '/vessel-compliance-checker': VesselComplianceCheckerPage,
  '/pdf-to-word': PdfToWordPage,
  '/platform-features': PlatformFeaturesPage,
  '/ai-presentation-generator': AiPresentationGeneratorPage,
  '/ai-code-assistant': AiCodeAssistantPage,
  '/pdf-annotator': PdfAnnotatorPage,
  '/ai-audio-transcriber': AiAudioTranscriberPage,
  '/video-to-gif': VideoToGifConverterPage,
  '/language-translator': LanguageTranslatorPage,
  '/project-planner': ProjectPlannerPage,
  '/pdf-watermark': PdfWatermarkPage,
  '/pdf-protect': PdfProtectPage,
  '/video-editor': VideoEditorPage,
  '/pdf-unlock': PdfUnlockPage,
  '/pdf-redact': PdfRedactPage,
  '/ai-research-assistant': AiResearchAssistantPage,
  '/ai-keyword-extractor': AiKeywordExtractorPage,
  '/pdf-page-manager': PdfPageManagerPage,
  '/ai-proofreader': AiProofreaderPage,
};

const App: React.FC = () => {
  return (
    <div className="bg-transparent text-slate-800 dark:text-gray-200 font-sans min-h-screen flex flex-col">
      <CursorGlow />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {tools.map(tool => {
            const Component = componentMap[tool.path];
            // If a component is mapped, use it. Otherwise, use the generic placeholder page.
            const routeElement = Component ? <Component /> : <ToolComingSoonPage tool={tool} />;

            return (
              <Route
                key={tool.path}
                path={tool.path}
                element={
                  tool.premium ? (
                    <ProtectedRoute toolName={tool.name}>
                      {routeElement}
                    </ProtectedRoute>
                  ) : (
                    routeElement
                  )
                }
              />
            );
          })}

        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;