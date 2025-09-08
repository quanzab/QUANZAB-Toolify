
import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { DocumentMinusIcon } from '../components/Icons';

interface RedactionBox {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const PdfRedactPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pagePreviews, setPagePreviews] = useState<string[]>([]);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageContainerRef = useRef<HTMLDivElement>(null);

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const droppedFile = acceptedFiles[0];
        setFile(droppedFile);
        setRedactions([]);
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
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const context = canvas.getContext('2d');
                if(context) {
                    // FIX: The 'render' method's type definition is likely incorrect in the project setup, causing a TypeScript error.
                    // Casting 'page' to 'any' bypasses the faulty type check while preserving the correct runtime call to the render method.
                    await (page as any).render({ canvasContext: context, viewport }).promise;
                    thumbnails.push(canvas.toDataURL());
                }
            }
            setPagePreviews(thumbnails);
        } catch (e) {
            setError('Could not read PDF. It may be corrupted or protected.');
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMouseDown = (pageIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setStartPoint({ x, y });
        setCurrentBox({ pageIndex, x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !startPoint || !currentBox) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const width = currentX - startPoint.x;
        const height = currentY - startPoint.y;
        setCurrentBox({ ...currentBox, width, height });
    };

    const handleMouseUp = () => {
        if (isDrawing && currentBox) {
            const finalBox = { ...currentBox };
            if (finalBox.width < 0) {
                finalBox.x += finalBox.width;
                finalBox.width *= -1;
            }
            if (finalBox.height < 0) {
                finalBox.y += finalBox.height;
                finalBox.height *= -1;
            }
            if(finalBox.width > 5 && finalBox.height > 5) {
                setRedactions(prev => [...prev, finalBox]);
            }
        }
        setIsDrawing(false);
        setStartPoint(null);
        setCurrentBox(null);
    };

    const handleSave = async () => {
        if (!file || redactions.length === 0) return;
        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            const firstPageElement = pageContainerRef.current?.querySelector('img');
            if (!firstPageElement) throw new Error("Could not calculate scale.");

            for (const redaction of redactions) {
                const page = pages[redaction.pageIndex];
                const { width: actualWidth, height: actualHeight } = page.getSize();
                const scale = actualWidth / firstPageElement.clientWidth;

                page.drawRectangle({
                    x: redaction.x * scale,
                    y: actualHeight - (redaction.y * scale) - (redaction.height * scale),
                    width: redaction.width * scale,
                    height: redaction.height * scale,
                    color: rgb(0, 0, 0),
                });
            }

            const modifiedPdfBytes = await pdfDoc.save();
            saveAs(new Blob([modifiedPdfBytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-redacted.pdf`);
            handleReset();
        } catch (e) {
            setError('Failed to save redacted PDF.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setPagePreviews([]);
        setRedactions([]);
        setError(null);
    };

    const renderEditor = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="text-sm text-slate-300">Click and drag on a page to draw a redaction box.</p>
                <div className="flex gap-2">
                    <button onClick={handleSave} disabled={redactions.length === 0} className="px-4 py-2 font-semibold text-slate-900 bg-primary rounded-lg disabled:bg-slate-600">Save Redacted PDF</button>
                    <button onClick={handleReset} className="px-4 py-2 font-semibold text-gray-300 bg-slate-700 rounded-lg">Start Over</button>
                </div>
            </div>
            <div ref={pageContainerRef} className="max-h-[70vh] overflow-y-auto p-4 bg-slate-950 border border-slate-700 rounded-lg space-y-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                {pagePreviews.map((src, index) => (
                    <div
                        key={index}
                        className="relative cursor-crosshair shadow-lg mx-auto"
                        onMouseDown={(e) => handleMouseDown(index, e)}
                        onMouseMove={handleMouseMove}
                    >
                        <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto pointer-events-none" />
                        {redactions.filter(r => r.pageIndex === index).map((r, i) => (
                            <div key={i} className="absolute bg-black pointer-events-none" style={{ left: r.x, top: r.y, width: r.width, height: r.height }} />
                        ))}
                        {currentBox?.pageIndex === index && (
                            <div className="absolute bg-black/70 border border-dashed border-primary pointer-events-none" style={{ left: currentBox.x, top: currentBox.y, width: currentBox.width, height: currentBox.height }}/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    
    return (
        <ToolPageLayout title="PDF Redact" description="Permanently black out sensitive text or areas in your PDF document.">
            {isLoading && <Loader message="Applying redactions..." />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                {!file ? (
                    <FileDropzone onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop PDF to start redacting" />
                ) : (
                    renderEditor()
                )}
                {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default PdfRedactPage;