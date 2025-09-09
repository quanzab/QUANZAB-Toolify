import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal';

// Icons for buttons
const RotateIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TrashIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);


interface PageState {
  originalIndex: number;
  thumbnail: string;
  rotation: number;
}

const PdfPageManagerPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pages, setPages] = useState<PageState[]>([]);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

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
            const arrayBuffer = await droppedFile.arrayBuffer();
            const loadingTask = getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;
            const pageStates: PageState[] = [];

            for (let i = 0; i < pdf.numPages; i++) {
                const page = await pdf.getPage(i + 1);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                if (context) {
                    await (page as any).render({ canvasContext: context, viewport }).promise;
                    pageStates.push({
                        originalIndex: i,
                        thumbnail: canvas.toDataURL(),
                        rotation: 0,
                    });
                }
            }
            setPages(pageStates);
        } catch (e) {
            setError('Could not read the PDF. It may be corrupted or protected.');
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRotate = (index: number) => {
        setPages(prev => prev.map((page, i) =>
            i === index ? { ...page, rotation: (page.rotation + 90) % 360 } : page
        ));
    };

    const handleDelete = (index: number) => {
        setPages(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newPages = [...pages];
        const draggedItemContent = newPages.splice(dragItem.current, 1)[0];
        newPages.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setPages(newPages);
    };

    const handleSave = async () => {
        if (!file || pages.length === 0) {
            setError("No pages to save.");
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Applying changes...');
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const newPdfDoc = await PDFDocument.create();

            const indicesToCopy = pages.map(p => p.originalIndex);
            const copiedPages = await newPdfDoc.copyPages(pdfDoc, indicesToCopy);

            pages.forEach((pageState, newIndex) => {
                const copiedPage = copiedPages[newIndex];
                copiedPage.setRotation(degrees(pageState.rotation));
                newPdfDoc.addPage(copiedPage);
            });

            const newPdfBytes = await newPdfDoc.save();
            saveAs(new Blob([newPdfBytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-edited.pdf`);
            performReset();
        } catch (e) {
            setError('Failed to save the modified PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    const performReset = () => {
        setFile(null);
        setPages([]);
        setError(null);
        setIsResetModalOpen(false);
    };

    const renderEditor = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-800 dark:text-gray-300">File: {file?.name}</p>
                <div className="flex gap-2">
                    <button onClick={() => setIsResetModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm">Start Over</button>
                    <button onClick={handleSave} disabled={pages.length === 0} className="px-6 py-2 text-sm font-semibold bg-primary text-slate-900 rounded-lg disabled:bg-slate-600 shadow-sm">Save PDF</button>
                </div>
            </div>
            
            <p className="text-center text-slate-500 dark:text-slate-400">Drag & drop to reorder pages. Use buttons to rotate or delete.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow-inner">
                {pages.map((page, index) => (
                    <div
                        key={`${page.originalIndex}-${index}`}
                        className="relative group cursor-grab active:cursor-grabbing text-center space-y-2 p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-md"
                        draggable
                        onDragStart={() => dragItem.current = index}
                        onDragEnter={() => dragOverItem.current = index}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <img src={page.thumbnail} alt={`Page ${index + 1}`} className="w-full h-auto rounded-sm shadow-lg transition-transform" style={{ transform: `rotate(${page.rotation}deg)` }}/>
                        <p className="text-sm font-bold text-slate-800 dark:text-gray-300">Page {index + 1}</p>
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => handleRotate(index)} className="p-2 bg-slate-900/80 rounded-full text-white hover:bg-primary hover:text-slate-900" aria-label="Rotate Page">
                                <RotateIcon className="w-6 h-6" />
                            </button>
                            <button onClick={() => handleDelete(index)} className="p-2 bg-slate-900/80 rounded-full text-red-500 hover:bg-red-500 hover:text-white" aria-label="Delete Page">
                                <TrashIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmationModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={performReset} title="Start Over?" message="Are you sure? All changes will be lost." confirmText="Start Over" />
        </div>
    );

    return (
        <ToolPageLayout title="PDF Page Manager" description="Reorder, rotate, and delete pages in your PDF document.">
            {isLoading && <Loader message={loadingMessage} />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                {!file ? (
                    <FileDropzone onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop a PDF to manage its pages" />
                ) : (
                    renderEditor()
                )}
                {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default PdfPageManagerPage;
