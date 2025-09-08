

import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import { useDropzone, FileRejection } from 'react-dropzone';
import JSZip from 'jszip';
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { useHistoryState } from '../hooks/useHistoryState';
import { UndoIcon, RedoIcon, UploadIcon, DownloadIcon, ZipIcon, TrustedIcon, ChevronDownIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

// A new component for the renaming UI
const RenamePanel: React.FC<{
  originalFiles: File[];
  renamedFiles: File[];
  onRename: (type: 'prefix' | 'suffix' | 'sequential', value: string) => void;
  onReset: () => void;
}> = ({ originalFiles, renamedFiles, onRename, onReset }) => {
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [sequentialName, setSequentialName] = useState('document');

  return (
    <div className="mt-6 p-6 border-t-2 border-dashed border-slate-200 dark:border-slate-600">
      <h4 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-4">Batch Rename Original Files</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Renaming Controls */}
        <div className="space-y-4">
          {/* Prefix */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Add Prefix</label>
            <div className="flex">
              <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g., ProjectA_" className="flex-grow px-3 py-2 border rounded-l-md bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
              <button onClick={() => { onRename('prefix', prefix); setPrefix(''); }} disabled={!prefix} className="px-4 py-2 bg-primary text-slate-900 font-semibold rounded-r-md hover:bg-opacity-90 disabled:bg-gray-400">Apply</button>
            </div>
          </div>
          {/* Suffix */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Add Suffix</label>
            <div className="flex">
              <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g., _final" className="flex-grow px-3 py-2 border rounded-l-md bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
              <button onClick={() => { onRename('suffix', suffix); setSuffix(''); }} disabled={!suffix} className="px-4 py-2 bg-primary text-slate-900 font-semibold rounded-r-md hover:bg-opacity-90 disabled:bg-gray-400">Apply</button>
            </div>
          </div>
          {/* Sequential */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Sequential Rename</label>
            <div className="flex">
              <input type="text" value={sequentialName} onChange={(e) => setSequentialName(e.target.value)} className="flex-grow px-3 py-2 border rounded-l-md bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
              <button onClick={() => onRename('sequential', sequentialName)} disabled={!sequentialName} className="px-4 py-2 bg-primary text-slate-900 font-semibold rounded-r-md hover:bg-opacity-90 disabled:bg-gray-400">Apply</button>
            </div>
          </div>
           <button onClick={onReset} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            Reset Names
          </button>
        </div>
        {/* File Preview */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto shadow-inner">
          <p className="text-sm font-semibold mb-2 text-slate-800 dark:text-gray-200">Filename Preview</p>
          <ul className="text-sm space-y-1">
            {originalFiles.slice(0, 10).map((file, index) => (
              <li key={index} className="flex items-center text-slate-500 dark:text-slate-400">
                <span className="truncate w-1/2 pr-2">{file.name}</span>
                <span>&rarr;</span>
                <span className="truncate w-1/2 pl-2 font-medium text-slate-700 dark:text-gray-300">{renamedFiles[index]?.name || file.name}</span>
              </li>
            ))}
            {originalFiles.length > 10 && <li className="text-gray-500">...and {originalFiles.length - 10} more.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};


const PdfMergePage: React.FC = () => {
  const [files, { set: setFiles, undo, redo, canUndo, canRedo }] = useHistoryState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mergeResult, setMergeResult] = useState<{
    blob: Blob;
    originalFiles: File[];
    thumbnails: string[];
    pageCount: number;
  } | null>(null);
  const [fileName, { set: setFileName, undo: undoFileName, redo: redoFileName, canUndo: canUndoFileName, canRedo: canRedoFileName }] = useHistoryState('merged.pdf');

  // State for the bulk rename feature
  const [renamedOriginalFiles, setRenamedOriginalFiles] = useState<File[]>([]);
  const [isRenamePanelOpen, setIsRenamePanelOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setMergeResult(null); // Reset on new file drop
    setError(null); // Clear previous errors

    if (fileRejections.length > 0) {
      setError('Upload failed. Please ensure all files are PDFs and under 50MB.');
    }
    
    if (acceptedFiles.length > 0) {
      const newFiles = [...files, ...acceptedFiles].filter(
        (file, index, self) => index === self.findIndex(f => f.name === file.name && f.size === file.size)
      );
      setFiles(newFiles);
    }
  }, [files, setFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    noClick: true,
    maxSize: MAX_SIZE,
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newFiles = [...files];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setFiles(newFiles);
    }
    if (direction === 'down' && index < files.length - 1) {
      const newFiles = [...files];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      setFiles(newFiles);
    }
  };

  const generatePdfPreview = async (pdfBlob: Blob): Promise<{ thumbnails: string[], pageCount: number }> => {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
    GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    
    const thumbnails: string[] = [];
    const numPagesToShow = Math.min(pageCount, 4);

    for (let i = 1; i <= numPagesToShow; i++) {
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
    return { thumbnails, pageCount };
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least two PDF files to merge.');
      return;
    }

    setLoadingMessage('Merging your PDFs...');
    setIsLoading(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
              mergedPdf.addPage(page);
            });
        } catch (e: any) {
             if (e && e.name === 'PDFEncryptedError') {
                throw new Error(`Error: The file "${file.name}" is encrypted. Please remove password protection and try again.`);
            }
            throw new Error(`Error processing "${file.name}": It may be corrupted or in an unsupported format.`);
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      setLoadingMessage('Generating preview...');
      const { thumbnails, pageCount } = await generatePdfPreview(blob);

      setMergeResult({
        blob,
        originalFiles: files,
        thumbnails,
        pageCount,
      });
      setFileName('merged.pdf');
      setRenamedOriginalFiles(files);
      setIsRenamePanelOpen(false);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred during the merge process.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/[/\\?%*:|"<>]/g, '-');
    setFileName(newName);
  };

  const handleFileNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let currentName = e.target.value.trim();
    if (currentName && !currentName.toLowerCase().endsWith('.pdf')) {
        setFileName(`${currentName}.pdf`);
    } else if (!currentName) {
        setFileName('merged.pdf');
    }
  };

  const handleDownloadMerged = () => {
    if (mergeResult) {
      saveAs(mergeResult.blob, fileName || 'merged.pdf');
    }
  };

  const handleDownloadZip = async () => {
    if (!mergeResult) return;
    setLoadingMessage('Creating ZIP file...');
    setIsLoading(true);
    setError(null);
    try {
      const zip = new JSZip();
      zip.file(fileName || 'merged.pdf', mergeResult.blob);
      const originalsFolder = zip.folder('original_files');
      if (originalsFolder) {
        const filesToZip = renamedOriginalFiles.length > 0 ? renamedOriginalFiles : mergeResult.originalFiles;
        for (const file of filesToZip) {
          originalsFolder.file(file.name, file);
        }
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'merged_files.zip');
    } catch (e) {
      console.error(e);
      setError('Failed to create ZIP file. Please try downloading the merged PDF directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameOriginals = (type: 'prefix' | 'suffix' | 'sequential', value: string) => {
    if (!mergeResult) return;
  
    const sourceFiles = renamedOriginalFiles;
    let newFiles: File[] = [];
  
    if (type === 'prefix') {
      newFiles = sourceFiles.map(file => {
        const newName = `${value}${file.name}`;
        return new File([file], newName, { type: file.type });
      });
    } else if (type === 'suffix') {
      newFiles = sourceFiles.map(file => {
        const dotIndex = file.name.lastIndexOf('.');
        if (dotIndex === -1) {
          return new File([file], `${file.name}${value}`, { type: file.type });
        }
        const name = file.name.substring(0, dotIndex);
        const extension = file.name.substring(dotIndex);
        return new File([file], `${name}${value}${extension}`, { type: file.type });
      });
    } else if (type === 'sequential') {
      newFiles = sourceFiles.map((file, index) => {
        const dotIndex = file.name.lastIndexOf('.');
        const extension = dotIndex === -1 ? '.pdf' : file.name.substring(dotIndex);
        const newName = `${value}_${index + 1}${extension}`;
        return new File([file], newName, { type: file.type });
      });
    }
  
    setRenamedOriginalFiles(newFiles);
  };
  
  const performReset = () => {
    setFiles([]);
    setMergeResult(null);
    setError(null);
    setFileName('merged.pdf');
    setRenamedOriginalFiles([]);
    setIsRenamePanelOpen(false);
    setIsResetModalOpen(false);
  };

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  }

  const renderUploaderView = () => (
    <>
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-transparent shadow-inner hover:border-primary/70 hover:bg-slate-200 dark:hover:bg-slate-800/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-xl font-semibold text-slate-700 dark:text-gray-200 mb-2">
            {isDragActive ? 'Drop files to upload' : "Drag and drop PDFs to merge"}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-4">or</p>
          <button
            type="button"
            onClick={open}
            className="px-8 py-3 font-semibold text-slate-900 bg-primary rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Select Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">Files to Merge (in order):</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Undo"
              >
                <UndoIcon className="w-5 h-5 text-slate-600 dark:text-gray-300" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Redo"
              >
                <RedoIcon className="w-5 h-5 text-slate-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          <ul className="space-y-3">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                <span className="font-medium text-slate-800 dark:text-gray-300 truncate pr-4">{index + 1}. {file.name}</span>
                <div className="flex-shrink-0 flex items-center gap-2">
                   <button onClick={() => handleMoveFile(index, 'up')} disabled={index === 0} className="p-1 rounded-full text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                  </button>
                  <button onClick={() => handleMoveFile(index, 'down')} disabled={index === files.length - 1} className="p-1 rounded-full text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <button onClick={() => handleRemoveFile(index)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}

      <div className="mt-8 text-center">
        <button
          onClick={handleMerge}
          disabled={files.length < 2}
          className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
        >
          Merge PDFs
        </button>
      </div>
    </>
  );

  const renderResultView = () => {
    if (!mergeResult) return null;
    return (
      <div className="py-8">
        <div className="text-center mb-6">
          <TrustedIcon className="w-16 h-16 mx-auto text-accent" />
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-4">Merge Successful!</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{mergeResult.originalFiles.length} files were combined into one PDF with {mergeResult.pageCount} pages.</p>
        </div>
        
        <div className="my-8">
          <h3 className="text-left font-semibold text-slate-800 dark:text-gray-200 mb-2">
            Document Preview ({mergeResult.pageCount} pages total)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto shadow-inner">
            {mergeResult.thumbnails.map((src, index) => (
              <div key={index} className="relative rounded-md overflow-hidden shadow-md">
                <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto" />
                <div className="absolute top-1 right-1 bg-black/50 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{index + 1}</div>
              </div>
            ))}
            {mergeResult.pageCount > mergeResult.thumbnails.length && (
                <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md bg-slate-200 dark:bg-slate-700">
                    <p>...and {mergeResult.pageCount - mergeResult.thumbnails.length} more pages.</p>
                </div>
            )}
          </div>
        </div>

        <div className="my-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="filename" className="block font-semibold text-slate-800 dark:text-gray-200">
              Customize Filename:
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={undoFileName}
                disabled={!canUndoFileName}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Undo filename change"
              >
                <UndoIcon className="w-4 h-4 text-slate-600 dark:text-gray-300" />
              </button>
              <button
                onClick={redoFileName}
                disabled={!canRedoFileName}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Redo filename change"
              >
                <RedoIcon className="w-4 h-4 text-slate-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          <input
            id="filename"
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            onBlur={handleFileNameBlur}
            className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary transition-colors shadow-sm dark:shadow-none"
            aria-label="Customize the filename for the merged PDF"
          />
        </div>

        {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button onClick={handleDownloadMerged} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
            <DownloadIcon className="w-6 h-6" />
            Download Merged PDF
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadZip} className="inline-flex items-center justify-center gap-3 px-8 py-3 text-lg font-semibold text-primary bg-slate-200 dark:bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-300 shadow-sm dark:shadow-none">
                <ZipIcon className="w-6 h-6" />
                Download as ZIP
            </button>
            <button 
              onClick={() => setIsRenamePanelOpen(!isRenamePanelOpen)}
              className="p-3 bg-accent text-white rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Rename original files"
            >
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${isRenamePanelOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {isRenamePanelOpen && (
          <RenamePanel
            originalFiles={mergeResult.originalFiles}
            renamedFiles={renamedOriginalFiles}
            onRename={handleRenameOriginals}
            onReset={() => setRenamedOriginalFiles(mergeResult.originalFiles)}
          />
        )}


        <div className="mt-8 text-center">
          <button onClick={handleResetClick} className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            Merge More Files
          </button>
        </div>
        
        <ConfirmationModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={performReset}
          title="Start Over?"
          message="Are you sure you want to start over? All uploaded files and the merged result will be cleared."
          confirmText="Start Over"
        />
      </div>
    );
  };

  return (
    <ToolPageLayout
      title="PDF Merge"
      description="Combine multiple PDF files into a single document. Drag and drop to upload, reorder, and merge."
    >
      {isLoading ? <Loader message={loadingMessage} /> : (mergeResult ? renderResultView() : renderUploaderView())}
    </ToolPageLayout>
  );
};

export default PdfMergePage;