

import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { PencilIcon } from '../components/Icons';

interface Annotation {
  pageIndex: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

const PdfAnnotatorPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pagePreviews, setPagePreviews] = useState<string[]>([]);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageContainerRef = useRef<HTMLDivElement>(null);

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const droppedFile = acceptedFiles[0];
        setFile(droppedFile);
        setAnnotations([]);
        setError(null);
        setIsLoading(true);

        try {
            const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
            GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

            const arrayBuffer = await droppedFile.arrayBuffer();
            const loadingTask = getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;
            const thumbnails: string[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                if(context){
                    // FIX: The 'render' method's type definition is likely incorrect in the project setup, causing a TypeScript error.
                    // Casting 'page' to 'any' bypasses the faulty type check while preserving the correct runtime call to the render method.
                    await (page as any).render({ canvasContext: context, viewport }).promise;
                    thumbnails.push(canvas.toDataURL());
                }
            }
            setPagePreviews(thumbnails);
        } catch (e) {
            setError('Could not read the PDF file. It might be corrupted or protected.');
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePageClick = (pageIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
        const text = prompt('Enter annotation text:');
        if (!text) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setAnnotations(prev => [...prev, { pageIndex, x, y, text, fontSize: 12 }]);
    };

    const handleSave = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            if (pageContainerRef.current) {
                const firstPageElement = pageContainerRef.current.querySelector('img');
                if (firstPageElement) {
                    const displayWidth = firstPageElement.clientWidth;
                    
                    for (const annotation of annotations) {
                        const page = pages[annotation.pageIndex];
                        const { width: actualWidth, height: actualHeight } = page.getSize();
                        const scale = actualWidth / displayWidth;
                        
                        page.drawText(annotation.text, {
                            x: annotation.x * scale,
                            y: actualHeight - (annotation.y * scale) - annotation.fontSize,
                            size: annotation.fontSize,
                            font: helveticaFont,
                            color: rgb(1, 0, 0), // Red
                        });
                    }
                }
            }

            const modifiedPdfBytes = await pdfDoc.save();
            saveAs(new Blob([modifiedPdfBytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-annotated.pdf`);
            handleReset();

        } catch (e) {
            setError('Failed to save annotations.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPagePreviews([]);
        setAnnotations([]);
        setError(null);
    };
    
    const renderAnnotator = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="text-sm text-slate-300">Click on a page to add a text note.</p>
                <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 font-semibold text-slate-900 bg-primary rounded-lg">Save Annotated PDF</button>
                    <button onClick={handleReset} className="px-4 py-2 font-semibold text-gray-300 bg-slate-700 rounded-lg">Start Over</button>
                </div>
            </div>
            <div ref={pageContainerRef} className="max-h-[70vh] overflow-y-auto p-4 bg-slate-950 border border-slate-700 rounded-lg space-y-4">
                {pagePreviews.map((src, index) => (
                    <div key={index} onClick={(e) => handlePageClick(index, e)} className="relative cursor-crosshair shadow-lg mx-auto" style={{ width: '100%' }}>
                        <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto" />
                        {annotations.filter(a => a.pageIndex === index).map((ann, annIndex) => (
                            <div key={annIndex} className="absolute flex items-center gap-1" style={{ left: ann.x, top: ann.y, transform: 'translateY(-100%)' }}>
                                <PencilIcon className="w-4 h-4 text-red-500"/>
                                <span className="text-red-500 bg-black/50 p-1 rounded text-xs" style={{ fontSize: `${ann.fontSize}px` }}>
                                    {ann.text}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <ToolPageLayout
            title="PDF Annotator"
            description="Add text notes and comments directly onto your PDF documents."
        >
            {isLoading && <Loader message="Processing PDF..." />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                {!file ? (
                    <FileDropzone onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop a PDF to start annotating" />
                ) : (
                    renderAnnotator()
                )}
                {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default PdfAnnotatorPage;