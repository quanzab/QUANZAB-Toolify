

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { PencilIcon, TypeIcon, UploadIcon } from '../components/Icons';

type SignatureMode = 'draw' | 'type' | 'upload';
const signatureFonts: Record<string, StandardFonts> = {
  'Caveat': StandardFonts.Helvetica,
  'Dancing Script': StandardFonts.TimesRoman,
  'Satisfy': StandardFonts.Courier,
};


// Signature Pad component for drawing
const SignaturePad: React.FC<{ onSave: (dataUrl: string) => void, color: string }> = ({ onSave, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [color]);

    const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        if ('touches' in event) {
            return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
        }
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoords(event);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const { x, y } = getCoords(event);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.closePath();
        setIsDrawing(false);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    const handleSave = () => {
        if (canvasRef.current && hasDrawn) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onSave(dataUrl);
        }
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                width={400}
                height={200}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <div className="flex justify-between mt-2">
                <button onClick={handleClear} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-primary">Clear</button>
                <button onClick={handleSave} disabled={!hasDrawn} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-800 disabled:bg-gray-400">Save Signature</button>
            </div>
        </div>
    );
};


// Signature creation modal
const SignatureModal: React.FC<{ onClose: () => void; onSave: (dataUrl: string) => void; }> = ({ onClose, onSave }) => {
    const [mode, setMode] = useState<SignatureMode>('draw');
    const [typedText, setTypedText] = useState('');
    const [font, setFont] = useState(Object.keys(signatureFonts)[0]);
    const [color, setColor] = useState('#000000'); // Black

    const handleSaveTyped = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.font = `48px "${font}"`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
        onSave(canvas.toDataURL('image/png'));
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onSave(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-heading text-brand-dark dark:text-white">Create Signature</h3>
                    <button onClick={onClose} className="text-2xl font-bold">&times;</button>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <button onClick={() => setMode('draw')} className={`px-4 py-2 font-semibold ${mode === 'draw' ? 'border-b-2 border-brand-primary text-brand-primary' : ''}`}>Draw</button>
                    <button onClick={() => setMode('type')} className={`px-4 py-2 font-semibold ${mode === 'type' ? 'border-b-2 border-brand-primary text-brand-primary' : ''}`}>Type</button>
                    <button onClick={() => setMode('upload')} className={`px-4 py-2 font-semibold ${mode === 'upload' ? 'border-b-2 border-brand-primary text-brand-primary' : ''}`}>Upload</button>
                </div>
                
                <div className="mb-4">
                    <label htmlFor="color-picker" className="text-sm font-medium mr-2">Color:</label>
                    <input id="color-picker" type="color" value={color} onChange={e => setColor(e.target.value)} />
                </div>

                {mode === 'draw' && <SignaturePad onSave={onSave} color={color}/>}
                
                {mode === 'type' && (
                    <div>
                        <input
                            type="text"
                            value={typedText}
                            onChange={(e) => setTypedText(e.target.value)}
                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            style={{ fontFamily: font, fontSize: '2rem', color }}
                            placeholder="Type your name"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <select value={font} onChange={e => setFont(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                                {Object.keys(signatureFonts).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <button onClick={handleSaveTyped} disabled={!typedText} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-800 disabled:bg-gray-400">Save Signature</button>
                        </div>
                    </div>
                )}

                {mode === 'upload' && (
                    <div>
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                           <UploadIcon className="w-8 h-8"/>
                            <span className="mt-2 text-base leading-normal">Select an image file</span>
                            <input type='file' accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Page Component
const PdfSignPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    // FIX: Store page dimensions along with the data URL to correctly calculate signature coordinates.
    const [pdfPages, setPdfPages] = useState<{ src: string, width: number, height: number }[]>([]);
    const [pdfDimensions, setPdfDimensions] = useState<{ width: number, height: number }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [placedItems, setPlacedItems] = useState<any[]>([]);

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const droppedFile = acceptedFiles[0];
        setFile(droppedFile);
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Preparing your document...');

        try {
            const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
            GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

            const arrayBuffer = await droppedFile.arrayBuffer();
            const loadingTask = getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;
            
            const thumbnails: { src: string, width: number, height: number }[] = [];
            const dimensions: { width: number, height: number }[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                dimensions.push({ width: page.view[2], height: page.view[3] });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                if (context) {
                    // FIX: The type definitions for this version of pdfjs-dist require the 'canvas' property in render parameters.
                    await page.render({ canvas, canvasContext: context, viewport }).promise;
                    thumbnails.push({ src: canvas.toDataURL(), width: viewport.width, height: viewport.height });
                }
            }
            setPdfPages(thumbnails);
            setPdfDimensions(dimensions);
        } catch (e) {
            setError('Could not read PDF. It might be corrupted or protected.');
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const addItemToPage = (pageIndex: number, itemType: 'signature' | 'text') => {
        let newItem: any;
        if (itemType === 'signature' && signature) {
            newItem = { id: Date.now(), type: 'signature', pageIndex, x: 20, y: 20, width: 150, height: 75, data: signature };
        } else if (itemType === 'text') {
            newItem = { id: Date.now(), type: 'text', pageIndex, x: 20, y: 20, width: 200, height: 40, data: 'Type something...' };
        }
        if (newItem) {
            setPlacedItems(prev => [...prev, newItem]);
        }
    };

    const updateItem = (id: number, updates: any) => {
        setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteItem = (id: number) => {
        setPlacedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleApplySignatures = async () => {
        if (!file || placedItems.length === 0) return;
        setIsLoading(true);
        setLoadingMessage('Applying signatures...');
        try {
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();

            for (const item of placedItems) {
                const page = pages[item.pageIndex];
                const { width: pageWidth, height: pageHeight } = page.getSize();

                // FIX: Correctly calculate the scaling factor between the displayed thumbnail and the actual PDF page size.
                // The original implementation was buggy and would result in incorrect signature placement.
                const pageViewData = pdfPages[item.pageIndex];
                if (!pageViewData) {
                    continue;
                }
                const viewWidth = pageViewData.width;
                const scale = viewWidth > 0 ? pageWidth / viewWidth : 1;

                const pdfX = item.x * scale;
                const pdfY = pageHeight - ((item.y + item.height) * scale);
                const pdfWidth = item.width * scale;
                const pdfHeight = item.height * scale;
                
                if (item.type === 'signature') {
                    const pngImageBytes = await fetch(item.data).then(res => res.arrayBuffer());
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    page.drawImage(pngImage, { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight });
                } else if (item.type === 'text') {
                    page.drawText(item.data, {
                        x: pdfX,
                        y: pdfY + (pdfHeight * 0.2), // Adjust baseline
                        size: pdfHeight * 0.8,
                        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                        color: rgb(0, 0, 0),
                    });
                }
            }
            
            // FIX: The `flatten` method does not exist on `PDFDocument` and is not necessary here.
            // Drawing images and text directly onto the page makes them a permanent part of the content.
            const pdfBytes = await pdfDoc.save();
            saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${file.name.replace('.pdf', '')}-signed.pdf`);
            setFile(null);
            setPdfPages([]);
            setPlacedItems([]);
            setSignature(null);
        } catch(e) {
            console.error(e);
            setError("Failed to apply signatures. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <ToolPageLayout title="Sign PDF" description="Sign documents securely."><Loader message={loadingMessage} /></ToolPageLayout>;

    return (
        <ToolPageLayout title="Sign PDF" description="Upload your document, add your signature, and download.">
            {!file ? (
                <FileDropzone onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop your PDF here to start signing" />
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-72 flex-shrink-0 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 self-start">
                        <h3 className="font-bold text-lg mb-4">Tools</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold mb-2">My Signature</p>
                                {signature ? (
                                    <div className="p-2 border border-dashed border-gray-400 rounded-md bg-white dark:bg-gray-700">
                                        <img src={signature} alt="Signature" className="max-w-full h-auto" />
                                        <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-brand-primary w-full text-center mt-2">Change</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsModalOpen(true)} className="w-full p-4 border-2 border-dashed rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Add Signature</button>
                                )}
                            </div>
                             <button onClick={() => addItemToPage(0, 'text')} className="w-full flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <TypeIcon className="w-5 h-5"/> Add Text
                            </button>
                        </div>
                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button onClick={handleApplySignatures} disabled={placedItems.length === 0} className="w-full px-6 py-3 text-lg font-semibold text-white bg-brand-primary rounded-lg shadow-lg hover:bg-blue-800 disabled:bg-gray-400">
                                Apply & Sign
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Document will be flattened to prevent edits.</p>

                    </aside>

                    {/* Document Viewer */}
                    <main className="flex-grow bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg overflow-auto">
                        <div className="space-y-4 mx-auto">
                            {pdfPages.map((pageData, index) => (
                                <div key={index} onDoubleClick={() => signature && addItemToPage(index, 'signature')} className="relative shadow-lg mx-auto" style={{ width: 'fit-content' }}>
                                    <img src={pageData.src} alt={`Page ${index + 1}`} />
                                    {placedItems.filter(item => item.pageIndex === index).map(item => (
                                        <div key={item.id} style={{ position: 'absolute', left: item.x, top: item.y, width: item.width, height: item.height, border: '1px dashed blue' }}
                                             onMouseDown={(e) => { e.preventDefault(); /* Logic for drag/resize start */ }}
                                        >
                                            {item.type === 'signature' && <img src={item.data} alt="signature" className="w-full h-full" />}
                                            {item.type === 'text' && (
                                                <input type="text" value={item.data} onChange={(e) => updateItem(item.id, {data: e.target.value})} className="w-full h-full bg-transparent border-none text-2xl"/>
                                            )}
                                            <button onClick={() => deleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            )}
            {isModalOpen && <SignatureModal onClose={() => setIsModalOpen(false)} onSave={(data) => { setSignature(data); setIsModalOpen(false); }} />}
        </ToolPageLayout>
    );
};

export default PdfSignPage;
