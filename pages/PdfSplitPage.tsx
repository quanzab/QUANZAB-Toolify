import React, { useState, useCallback, useMemo } from 'react';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal';

type SplitMode = 'select' | 'range';

const PdfSplitPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<SplitMode>('select');
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [range, setRange] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const droppedFile = acceptedFiles[0];
    setFile(droppedFile);
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Generating page previews...');
    
    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) return;
        const loadingTask = getDocument(event.target.result as ArrayBuffer);
        const pdf = await loadingTask.promise;
        const thumbnails: string[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (context) {
            // FIX: The 'render' method's type definition is likely incorrect in the project setup, causing a TypeScript error.
            // Casting 'page' to 'any' bypasses the faulty type check while preserving the correct runtime call to the render method.
            await (page as any).render({ canvasContext: context, viewport: viewport }).promise;
            thumbnails.push(canvas.toDataURL());
          }
        }
        setPageThumbnails(thumbnails);
      };
      reader.readAsArrayBuffer(droppedFile);
    } catch (e) {
      console.error(e);
      setError('Could not read the PDF file. It might be corrupted or protected.');
      setFile(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);
  
  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageIndex)) {
        newSet.delete(pageIndex);
      } else {
        newSet.add(pageIndex);
      }
      return newSet;
    });
  };

  const parseRange = (rangeStr: string, totalPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(part => part.trim()).filter(Boolean);

    for (const part of parts) {
      if (!/^[0-9]+(-[0-9]+)?$/.test(part)) {
          throw new Error(`Invalid format for "${part}". Use numbers like '5' or ranges like '2-4'.`);
      }

      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (start > end) {
            throw new Error(`Invalid range: "${part}". The start page cannot be greater than the end page.`);
        }
        if (start < 1 || end > totalPages) {
            throw new Error(`Range "${part}" is out of bounds. This document has ${totalPages} pages (1-${totalPages}).`);
        }

        for (let i = start; i <= end; i++) {
            pages.add(i - 1); // 0-indexed
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (pageNum < 1 || pageNum > totalPages) {
            throw new Error(`Page number "${pageNum}" is out of bounds. This document has ${totalPages} pages (1-${totalPages}).`);
        }
        pages.add(pageNum - 1); // 0-indexed
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };
  
  const pageCount = useMemo(() => pageThumbnails.length, [pageThumbnails]);
  
  const handleSplit = async () => {
    if (!file) return;

    let pagesToExtract: number[] = [];
    setError(null);

    try {
        if (mode === 'select') {
          pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b);
        } else {
          pagesToExtract = parseRange(range, pageCount);
        }
    
        if (pagesToExtract.length === 0) {
          setError('Please select at least one page to extract.');
          return;
        }

    } catch (e: any) {
        setError(e.message);
        return;
    }

    setIsLoading(true);
    setLoadingMessage('Splitting your PDF...');
    
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}-split.pdf`);

      // Reset state
      performReset();
    } catch (e: any) {
      console.error(e);
      if (e && e.name === 'PDFEncryptedError') {
           setError('Could not split the PDF. The file may be password-protected. Please remove protection and try again.');
      } else {
           setError(e.message || 'An error occurred while splitting the PDF.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const performReset = () => {
    setFile(null);
    setPageThumbnails([]);
    setSelectedPages(new Set());
    setRange('');
    setError(null);
    setIsResetModalOpen(false);
  };

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <Loader message={loadingMessage || 'Loading...'} />;
    }

    if (!file) {
      return (
        <FileDropzone
          onDrop={handleDrop}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          instructions="Drag 'n' drop a PDF file here"
        />
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
           <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-lg shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-gray-300">File:</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400 truncate max-w-xs">{file.name}</span>
           </div>
           <button onClick={handleResetClick} className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Start Over</button>
        </div>
        
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-700 mb-4">
          <button onClick={() => setMode('select')} className={`px-6 py-3 font-semibold transition-colors ${mode === 'select' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 dark:text-gray-400 hover:text-primary'}`}>Select Pages</button>
          <button onClick={() => setMode('range')} className={`px-6 py-3 font-semibold transition-colors ${mode === 'range' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 dark:text-gray-400 hover:text-primary'}`}>Extract by Range</button>
        </div>

        {mode === 'select' && (
          <div>
             <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPages.size} of {pageCount} pages selected.</p>
                <div>
                    <button onClick={() => setSelectedPages(new Set(Array.from({length: pageCount}, (_, i) => i)))} className="mr-2 text-sm font-semibold text-primary hover:underline">Select All</button>
                    <button onClick={() => setSelectedPages(new Set())} className="text-sm font-semibold text-gray-500 hover:underline">Clear</button>
                </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700">
              {pageThumbnails.map((src, index) => (
                <div key={index} onClick={() => togglePageSelection(index)} className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${selectedPages.has(index) ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}>
                  <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto" />
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{index + 1}</div>
                  {selectedPages.has(index) && (
                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'range' && (
          <div className="p-4">
            <label htmlFor="range-input" className="block font-semibold text-slate-800 dark:text-gray-200 mb-2">Pages to extract</label>
            <input
              id="range-input"
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g., 1-3, 5, 8-10"
              className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Enter page numbers or ranges separated by commas. This document has {pageCount} pages.</p>
          </div>
        )}
        
        {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
        
        <div className="mt-8 text-center">
            <button
              onClick={handleSplit}
              className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
            >
              Split PDF
            </button>
        </div>
        
        <ConfirmationModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={performReset}
          title="Start Over?"
          message="Are you sure you want to start over? The current PDF and your selections will be cleared."
          confirmText="Start Over"
        />

      </div>
    );
  };
  
  return (
    <ToolPageLayout
      title="PDF Split"
      description="Extract specific pages or ranges from your PDF. Select pages visually or enter page numbers to create a new document."
    >
      {renderContent()}
    </ToolPageLayout>
  );
};

export default PdfSplitPage;