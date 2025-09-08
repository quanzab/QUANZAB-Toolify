

import React, { useState, useCallback, useRef, useEffect, useImperativeHandle } from 'react';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { PencilIcon, TypeIcon, UndoIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

// A dedicated component for the signature drawing canvas
const SignaturePad = React.forwardRef<
  { clear: () => void; undo: () => void; getSignatureDataUrl: () => string | null },
  { strokeColor?: string; strokeWidth?: number }
>(({ strokeColor = '#0000FF', strokeWidth = 2 }, ref) => {
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
      className="bg-slate-100 dark:bg-slate-700 rounded-lg cursor-crosshair touch-none border border-slate-200 dark:border-slate-600"
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

interface SignaturePlacement {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const PdfSignPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placement, setPlacement] = useState<SignaturePlacement | null>(null);

  const [interaction, setInteraction] = useState<{
    type: 'move' | 'resize';
    startX: number;
    startY: number;
    originalPlacement: SignaturePlacement;
  } | null>(null);

  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [signatureColor, setSignatureColor] = useState('#0000FF');
  const [signatureWidth, setSignatureWidth] = useState(2);
  const signaturePadRef = useRef<{ clear: () => void; undo: () => void; getSignatureDataUrl: () => string | null }>(null);
  
  const [typedText, setTypedText] = useState('Your Name');
  const [selectedFont, setSelectedFont] = useState('Caveat');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
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
      GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@^4.5.136/build/pdf.worker.min.mjs`;

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
          // FIX: The 'render' method's type definition is likely incorrect in the project setup, causing a TypeScript error.
          // Casting 'page' to 'any' bypasses the faulty type check while preserving the correct runtime call to the render method.
          await (page as any).render({ canvasContext: context, viewport: viewport }).promise;
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

  const setSignature = (dataUrl: string, file: File) => {
    setSignaturePreview(dataUrl);
    setSignatureImage(file);
    const img = new Image();
    img.onload = () => setAspectRatio(img.height / img.width);
    img.src = dataUrl;
  };

  const handleSignatureDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const sigFile = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string, sigFile);
      };
      reader.readAsDataURL(sigFile);
    }
  }, []);

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  };
  
  const handleSaveDrawnSignature = async () => {
    const dataUrl = signaturePadRef.current?.getSignatureDataUrl();
    if (dataUrl) {
      const signatureFile = await dataUrlToFile(dataUrl, 'signature.png');
      setSignature(dataUrl, signatureFile);
      setIsDrawModalOpen(false);
    } else {
      alert("Please draw a signature before saving.");
    }
  };
  
  const handleSaveTypedSignature = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = `48px "${selectedFont}", cursive`;
    const textMetrics = ctx.measureText(typedText);
    canvas.width = textMetrics.width + 20;
    canvas.height = 60;

    ctx.font = `48px "${selectedFont}", cursive`;
    ctx.fillStyle = '#0000FF'; // Blue
    ctx.textBaseline = 'middle';
    ctx.fillText(typedText, 10, canvas.height / 2);

    const dataUrl = canvas.toDataURL('image/png');
    const signatureFile = await dataUrlToFile(dataUrl, 'typed-signature.png');
    setSignature(dataUrl, signatureFile);
    setIsTypeModalOpen(false);
  };

  const handlePageClick = (pageIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!signaturePreview) { setError("Please add a signature first."); return; }
    if (placement) return; // Don't place a new one if one already exists

    const rect = event.currentTarget.getBoundingClientRect();
    const initialWidth = 120;
    const initialHeight = initialWidth * aspectRatio;
    
    const x = event.clientX - rect.left - initialWidth / 2;
    const y = event.clientY - rect.top - initialHeight / 2;
    
    setPlacement({ pageIndex, x, y, width: initialWidth, height: initialHeight });
    setError(null);
  };

  const handleInteractionStart = (type: 'move' | 'resize') => (e: React.MouseEvent) => {
    if (!placement) return;
    e.preventDefault();
    e.stopPropagation();
    setInteraction({
      type,
      startX: e.clientX,
      startY: e.clientY,
      originalPlacement: { ...placement },
    });
  };

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    if (!interaction) return;

    const dx = e.clientX - interaction.startX;
    const dy = e.clientY - interaction.startY;

    if (interaction.type === 'move') {
      setPlacement({
        ...interaction.originalPlacement,
        x: interaction.originalPlacement.x + dx,
        y: interaction.originalPlacement.y + dy,
      });
    } else if (interaction.type === 'resize') {
      const newWidth = Math.max(20, interaction.originalPlacement.width + dx);
      setPlacement({
        ...interaction.originalPlacement,
        width: newWidth,
        height: newWidth * aspectRatio,
      });
    }
  }, [interaction, aspectRatio]);

  const handleInteractionEnd = useCallback(() => {
    setInteraction(null);
  }, []);

  useEffect(() => {
    if (interaction) {
      window.addEventListener('mousemove', handleInteractionMove);
      window.addEventListener('mouseup', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [interaction, handleInteractionMove, handleInteractionEnd]);
  
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
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      const previewEl = pageRefs.current[placement.pageIndex];
      if (!previewEl) throw new Error("Could not find page element for sizing.");
      
      const previewWidth = previewEl.clientWidth;
      const previewHeight = previewEl.clientHeight;
      
      const scaleX = pageWidth / previewWidth;
      const scaleY = pageHeight / previewHeight;

      const sigPdfWidth = placement.width * scaleX;
      const sigPdfHeight = placement.height * scaleY;
      const sigPdfX = placement.x * scaleX;
      const sigPdfY = pageHeight - (placement.y * scaleY) - sigPdfHeight;

      page.drawImage(sigImage, {
        x: sigPdfX,
        y: sigPdfY,
        width: sigPdfWidth,
        height: sigPdfHeight,
      });

      const signedPdfBytes = await pdfDoc.save();
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}-signed.pdf`);
      
      performReset();

    } catch (e) {
      console.error(e);
      setError("An error occurred while signing the document. The PDF may be protected.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const performReset = () => {
    setFile(null);
    setSignatureImage(null);
    setSignaturePreview(null);
    setPagePreviews([]);
    setPlacement(null);
    setError(null);
    setInteraction(null);
    setIsResetModalOpen(false);
  };

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };
  
  const renderDrawModal = () => {
    if (!isDrawModalOpen) return null;
    const colors = [{ name: 'Blue', value: '#0000FF' }, { name: 'Black', value: '#000000' }, { name: 'Red', value: '#FF0000' }];
    const widths = [{ name: 'Thin', value: 1 }, { name: 'Medium', value: 2 }, { name: 'Thick', value: 4 }];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Draw Your Signature</h3>
                <SignaturePad ref={signaturePadRef} strokeColor={signatureColor} strokeWidth={signatureWidth} />
                <div className="my-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Color</label>
                        <div className="flex gap-2">{colors.map(color => (<button key={color.name} onClick={() => setSignatureColor(color.value)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${signatureColor === color.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-primary' : ''}`} style={{ backgroundColor: color.value }} aria-label={`Set color to ${color.name}`}></button>))}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Line Width</label>
                         <div className="flex gap-2">{widths.map(width => (<button key={width.name} onClick={() => setSignatureWidth(width.value)} className={`px-3 py-1 text-sm rounded-md transition-colors ${signatureWidth === width.value ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{width.name}</button>))}</div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div>
                         <button onClick={() => signaturePadRef.current?.undo()} className="px-4 py-2 text-sm text-slate-800 dark:text-gray-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 inline-flex items-center gap-2"><UndoIcon className="w-4 h-4" /> Undo</button>
                         <button onClick={() => signaturePadRef.current?.clear()} className="ml-2 px-4 py-2 text-sm text-slate-800 dark:text-gray-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Clear</button>
                    </div>
                    <div>
                        <button onClick={() => setIsDrawModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-gray-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSaveDrawnSignature} className="ml-2 px-6 py-2 text-sm font-semibold text-slate-900 bg-primary rounded-md hover:bg-opacity-90">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  const renderTypeModal = () => {
    if (!isTypeModalOpen) return null;
    const fonts = ['Caveat', 'Dancing Script', 'Pacifico'];
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Pacifico&display=swap');
            `}</style>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Type Your Signature</h3>
                <input type="text" value={typedText} onChange={e => setTypedText(e.target.value)} className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-3xl text-center text-slate-800 dark:text-white" style={{ fontFamily: `"${selectedFont}", cursive` }}/>
                <div className="my-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Choose Style</label>
                    <div className="flex gap-2">{fonts.map(font => (<button key={font} onClick={() => setSelectedFont(font)} className={`px-4 py-2 rounded-md transition-colors text-lg text-slate-800 dark:text-gray-200 ${selectedFont === font ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} style={{ fontFamily: `"${font}", cursive` }}>{font}</button>))}</div>
                </div>
                <div className="flex justify-end items-center mt-6">
                    <button onClick={() => setIsTypeModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-gray-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                    <button onClick={handleSaveTypedSignature} className="ml-2 px-6 py-2 text-sm font-semibold text-slate-900 bg-primary rounded-md hover:bg-opacity-90">Save</button>
                </div>
            </div>
        </div>
    );
  };

  const renderSigner = () => (
    <div className="space-y-6">
      {renderDrawModal()}
      {renderTypeModal()}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">1. Add Signature</h3>
          <div className="space-y-2">
              <FileDropzone onDrop={handleSignatureDrop} accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }} multiple={false} instructions="Drop signature image"/>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <hr className="flex-grow border-slate-300 dark:border-slate-600" /><span>OR</span><hr className="flex-grow border-slate-300 dark:border-slate-600" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setIsDrawModalOpen(true)} className="w-full justify-center inline-flex items-center gap-2 px-4 py-2 text-center font-semibold text-primary bg-white dark:bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm dark:shadow-none"><PencilIcon className="w-5 h-5"/> Draw</button>
                <button onClick={() => setIsTypeModalOpen(true)} className="w-full justify-center inline-flex items-center gap-2 px-4 py-2 text-center font-semibold text-primary bg-white dark:bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm dark:shadow-none"><TypeIcon className="w-5 h-5"/> Type</button>
              </div>
          </div>
          {signaturePreview && (
            <div>
              <p className="font-semibold text-sm mb-2 text-slate-700 dark:text-gray-200">Signature Preview:</p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 relative shadow-sm dark:shadow-none">
                <img src={signaturePreview} alt="Signature" className="max-h-24 mx-auto" style={{ filter: signatureImage?.type.includes('image') ? 'dark:invert(1) dark:grayscale(1) dark:contrast(3)' : '' }}/>
                <button onClick={() => { setSignatureImage(null); setSignaturePreview(null); setPlacement(null); }} className="absolute top-1 right-1 text-red-500 font-bold text-lg leading-none px-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">&times;</button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white">2. Place Signature</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{placement ? 'Drag to move or use the handle to resize.' : 'Click on the document where you want the signature.'}</p>
           <div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4 shadow-inner">
            {pagePreviews.map((src, index) => (
              <div key={index} ref={el => { pageRefs.current[index] = el; }} onClick={(e) => handlePageClick(index, e)} className="relative cursor-pointer shadow-lg mx-auto" style={{ width: '100%' }}>
                <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto" />
                {placement?.pageIndex === index && signaturePreview && (
                    <div className="absolute" style={{ left: placement.x, top: placement.y, width: placement.width, height: placement.height, cursor: 'move' }} onMouseDown={handleInteractionStart('move')}>
                        <img src={signaturePreview} alt="Signature placement" className="w-full h-full pointer-events-none" style={{ filter: 'opacity(0.8)' }}/>
                        <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-primary border-2 border-white rounded-full" style={{ cursor: 'se-resize' }} onMouseDown={handleInteractionStart('resize')}/>
                    </div>
                )}
              </div>
            ))}
           </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">3. Finalize & Download</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleSign} disabled={!placement || isLoading} className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"><PencilIcon className="inline-block w-5 h-5 mr-2" /> Sign & Download</button>
            <button onClick={handleResetClick} className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary">Start Over</button>
        </div>
      </div>
       <ConfirmationModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={performReset}
          title="Start Over?"
          message="Are you sure you want to start over? The current PDF, signature, and placement will be cleared."
          confirmText="Start Over"
        />
    </div>
  );

  return (
    <ToolPageLayout title="eSign PDF" description="Easily sign your documents. Upload, draw, or type your signature, place it, and download the signed file.">
      {isLoading ? ( <Loader message={loadingMessage} /> ) : !file ? ( <FileDropzone onDrop={handlePdfDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drag and drop your PDF here" /> ) : ( renderSigner() )}
    </ToolPageLayout>
  );
};

export default PdfSignPage;