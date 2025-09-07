

import React, { useState, useCallback, useRef, useEffect, useImperativeHandle } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { PencilIcon, TypeIcon, UndoIcon } from '../components/Icons';

// A dedicated component for the signature drawing canvas
const SignaturePad = React.forwardRef<
  { clear: () => void; undo: () => void; getSignatureDataUrl: () => string | null },
  { strokeColor?: string; strokeWidth?: number }
>(({ strokeColor = '#000000', strokeWidth = 2 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<[number, number][][]>([]);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);

  const getCoords = (e: MouseEvent | TouchEvent): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
    if (e.touches[0]) {
      return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    }
    return null;
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;
    setIsDrawing(true);
    setCurrentPath([coords]);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;
    setCurrentPath(prev => [...prev, coords]);
  };

  const endDrawing = () => {
    if (!isDrawing || currentPath.length === 0) return;
    setIsDrawing(false);
    setPaths(prev => [...prev, currentPath]);
    setCurrentPath([]);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const allPaths = [...paths, currentPath];

    allPaths.forEach(path => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      path.forEach(point => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    });
  }, [paths, currentPath, strokeColor, strokeWidth]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPaths([]);
      setCurrentPath([]);
    },
    undo: () => {
      setPaths(prev => prev.slice(0, -1));
    },
    getSignatureDataUrl: () => {
      const canvas = canvasRef.current;
      if (!canvas || paths.length === 0) return null;

      // Find bounding box to trim whitespace
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      paths.flat().forEach(([x, y]) => {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
      });
      
      const padding = 10;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      const trimmedWidth = maxX - minX;
      const trimmedHeight = maxY - minY;

      if (trimmedWidth <= 0 || trimmedHeight <= 0) return null;

      const trimmedCanvas = document.createElement('canvas');
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;
      const trimmedCtx = trimmedCanvas.getContext('2d');
      if (!trimmedCtx) return null;
      
      trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
      
      return trimmedCanvas.toDataURL('image/png');
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="bg-slate-100 rounded-lg cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
    />
  );
});

const PdfSignPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placement, setPlacement] = useState<{ pageIndex: number; x: number; y: number } | null>(null);

  // State for drawing modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureColor, setSignatureColor] = useState('#0000FF'); // Default Blue
  const [signatureWidth, setSignatureWidth] = useState(2); // Default Medium
  const signaturePadRef = useRef<{ clear: () => void; undo: () => void; getSignatureDataUrl: () => string | null }>(null);
  
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePdfDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const droppedFile = acceptedFiles[0];
    setFile(droppedFile);
    setError(null);
    setPlacement(null);
    setIsLoading(true);
    setLoadingMessage('Generating page previews...');

    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

      const arrayBuffer = await droppedFile.arrayBuffer();
      const loadingTask = getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const thumbnails: string[] = [];
      pageRefs.current = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page.render({ canvas, canvasContext: context, viewport: viewport }).promise;
          thumbnails.push(canvas.toDataURL());
        }
      }
      setPagePreviews(thumbnails);
    } catch (e) {
      console.error(e);
      setError('Could not read the PDF file. It might be corrupted or protected.');
      setFile(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleSignatureDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const sigFile = acceptedFiles[0];
      setSignatureImage(sigFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(sigFile);
    }
  }, []);

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  };
  
  const handleSaveSignature = async () => {
    const dataUrl = signaturePadRef.current?.getSignatureDataUrl();
    if (dataUrl) {
      setSignaturePreview(dataUrl);
      const signatureFile = await dataUrlToFile(dataUrl, 'signature.png');
      setSignatureImage(signatureFile);
      setIsModalOpen(false);
    } else {
      // Handle case where canvas is empty
      alert("Please draw a signature before saving.");
    }
  };

  const handlePageClick = (pageIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!signaturePreview) {
      setError("Please add a signature first.");
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPlacement({ pageIndex, x, y });
    setError(null);
  };
  
  const handleSign = async () => {
    if (!file || !signatureImage || !placement) {
      setError("Please upload a PDF, a signature, and click on the document to place it.");
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Applying signature...');
    setError(null);

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      
      const sigBytes = await signatureImage.arrayBuffer();
      const sigImage = signatureImage.type === 'image/png'
        ? await pdfDoc.embedPng(sigBytes)
        : await pdfDoc.embedJpg(sigBytes);

      const page = pdfDoc.getPages()[placement.pageIndex];
      const { width, height } = page.getSize();
      
      const previewEl = pageRefs.current[placement.pageIndex];
      if (!previewEl) throw new Error("Could not find page element for sizing.");
      
      const previewWidth = previewEl.clientWidth;
      
      // Define a consistent signature size on the PDF document (e.g., 120px wide)
      const sigPdfWidth = 120;
      const sigPdfHeight = (sigPdfWidth / sigImage.width) * sigImage.height;
      
      // Convert click coordinates on the preview to PDF coordinates
      const scaledX = (placement.x / previewWidth) * width;
      const scaledY = height - ((placement.y / previewWidth) * width) - sigPdfHeight; // Adjust for aspect ratio of preview vs pdf

      page.drawImage(sigImage, {
        x: scaledX - (sigPdfWidth / 2), // Center the signature on the click
        y: scaledY + (sigPdfHeight / 2),
        width: sigPdfWidth,
        height: sigPdfHeight,
      });

      const signedPdfBytes = await pdfDoc.save();
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}-signed.pdf`);
      
      handleReset();

    } catch (e) {
      console.error(e);
      setError("An error occurred while signing the document. The PDF may be protected.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setSignatureImage(null);
    setSignaturePreview(null);
    setPagePreviews([]);
    setPlacement(null);
    setError(null);
  };

  const renderSignatureModal = () => {
    if (!isModalOpen) return null;
    
    const colors = [
        { name: 'Blue', value: '#0000FF' },
        { name: 'Black', value: '#000000' },
        { name: 'Red', value: '#FF0000' },
    ];
    
    const widths = [
        { name: 'Thin', value: 1 },
        { name: 'Medium', value: 2 },
        { name: 'Thick', value: 4 },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg">
                <h3 className="text-xl font-bold text-white mb-4">Draw Your Signature</h3>
                <SignaturePad ref={signaturePadRef} strokeColor={signatureColor} strokeWidth={signatureWidth} />
                
                <div className="my-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Color</label>
                        <div className="flex gap-2">
                            {colors.map(color => (
                                <button key={color.name} onClick={() => setSignatureColor(color.value)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${signatureColor === color.value ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-primary' : ''}`} style={{ backgroundColor: color.value }} aria-label={`Set color to ${color.name}`}></button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Line Width</label>
                         <div className="flex gap-2">
                            {widths.map(width => (
                                <button key={width.name} onClick={() => setSignatureWidth(width.value)} className={`px-3 py-1 text-sm rounded-md transition-colors ${signatureWidth === width.value ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>{width.name}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div>
                         <button onClick={() => signaturePadRef.current?.undo()} className="px-4 py-2 text-sm text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 inline-flex items-center gap-2"><UndoIcon className="w-4 h-4" /> Undo</button>
                         <button onClick={() => signaturePadRef.current?.clear()} className="ml-2 px-4 py-2 text-sm text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600">Clear</button>
                    </div>
                    <div>
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-300 rounded-md hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSaveSignature} className="ml-2 px-6 py-2 text-sm font-semibold text-slate-900 bg-primary rounded-md hover:bg-opacity-90">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderSigner = () => (
    <div className="space-y-6">
      {renderSignatureModal()}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg">1. Add Signature</h3>
          <div className="space-y-2">
              <FileDropzone 
                onDrop={handleSignatureDrop}
                accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }}
                multiple={false}
                instructions="Drop signature image"
              />
              <div className="flex items-center gap-2 text-slate-400">
                  <hr className="flex-grow border-slate-600" />
                  <span>OR</span>
                  <hr className="flex-grow border-slate-600" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="w-full justify-center inline-flex items-center gap-2 px-4 py-2 text-center font-semibold text-primary bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-700 transition-colors duration-300">
                  <PencilIcon className="w-5 h-5"/> Draw Signature
              </button>
          </div>
          {signaturePreview && (
            <div>
              <p className="font-semibold text-sm mb-2">Signature Preview:</p>
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <img src={signaturePreview} alt="Signature" className="max-h-24 mx-auto" style={{ filter: signatureImage?.type.includes('image') ? 'invert(1) grayscale(1) contrast(3)' : '' }}/>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
           <h3 className="font-bold text-lg">2. Place Signature</h3>
           <p className="text-slate-400 text-sm mb-2">Click on the document where you want to place the signature.</p>
           <div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-950 border border-slate-700 rounded-lg space-y-4">
            {pagePreviews.map((src, index) => (
              <div 
                key={index} 
                // FIX: The ref callback should not return a value. Changed to a block body.
                ref={el => { pageRefs.current[index] = el; }}
                onClick={(e) => handlePageClick(index, e)}
                className="relative cursor-pointer shadow-lg mx-auto"
                style={{ width: '100%' }}
              >
                <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto" />
                {placement?.pageIndex === index && signaturePreview && (
                  <img 
                    src={signaturePreview} 
                    alt="Signature placement" 
                    className="absolute pointer-events-none"
                    style={{ 
                      left: `${placement.x}px`, 
                      top: `${placement.y}px`, 
                      width: '120px', 
                      transform: 'translate(-50%, -50%)',
                      filter: signatureImage?.type.includes('image') ? 'opacity(0.7) invert(1) grayscale(1) contrast(3)' : 'opacity(0.7)',
                    }} 
                  />
                )}
              </div>
            ))}
           </div>
        </div>
      </div>
       {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
      <div className="mt-6 pt-6 border-t border-slate-700 text-center space-y-4">
        <h3 className="font-bold text-lg">3. Finalize & Download</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                onClick={handleSign}
                disabled={!placement || isLoading}
                className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
            >
                <PencilIcon className="inline-block w-5 h-5 mr-2" />
                Sign & Download
            </button>
            <button onClick={handleReset} className="font-semibold text-slate-400 hover:text-primary">
                Start Over
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="eSign PDF"
      description="Easily sign your documents. Upload or draw your signature, and download the signed file securely."
    >
      {isLoading ? (
        <Loader message={loadingMessage} />
       ) : !file ? (
        <FileDropzone 
          onDrop={handlePdfDrop}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          instructions="Drag and drop your PDF here"
        />
      ) : (
        renderSigner()
      )}
    </ToolPageLayout>
  );
};

export default PdfSignPage;