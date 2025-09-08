
import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import ConfirmationModal from '../components/ConfirmationModal';

type CompressionLevel = 'high' | 'medium' | 'low';

const compressionLevels = {
  high: { quality: 0.9, scale: 2.5, label: 'High Quality (Larger File)', description: 'Best for retaining detail in images and text.' },
  medium: { quality: 0.7, scale: 2.0, label: 'Good Quality (Recommended)', description: 'A good balance between file size and quality.' },
  low: { quality: 0.5, scale: 1.5, label: 'Low Quality (Smallest File)', description: 'Significantly reduces file size, suitable for screen reading.' },
};

const PdfCompressPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState('');
    const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
    const [result, setResult] = useState<{ originalSize: number; compressedSize: number; blob: Blob; fileName: string } | null>(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setResult(null);
        }
    }, []);

    const handleCompress = async () => {
        if (!file) {
            setError('Please select a PDF file to compress.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setProgress('Initializing compression engine...');

        try {
            const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
            GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

            const { quality, scale } = compressionLevels[compressionLevel];
            
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = getDocument(arrayBuffer);
            const sourcePdf = await loadingTask.promise;
            
            const newPdfDoc = await PDFDocument.create();

            for (let i = 1; i <= sourcePdf.numPages; i++) {
                setProgress(`Processing page ${i} of ${sourcePdf.numPages}...`);
                const page = await sourcePdf.getPage(i);
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                
                if (!context) {
                    throw new Error('Could not create canvas context.');
                }
                
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvas, canvasContext: context, viewport }).promise;

                const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
                const jpegBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
                
                const jpegImage = await newPdfDoc.embedJpg(jpegBytes);
                
                const { width, height } = page.getViewport({ scale: 1 });
                const newPage = newPdfDoc.addPage([width, height]);
                newPage.drawImage(jpegImage, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                });
            }

            setProgress('Finalizing compressed file...');
            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            setResult({
                originalSize: file.size,
                compressedSize: blob.size,
                blob,
                fileName: `${file.name.replace(/\.pdf$/i, '')}-compressed.pdf`
            });

            setFile(null);

        } catch (e: any) {
            console.error(e);
            if (e && e.name === 'PasswordException') {
                setError('Could not compress the PDF. The file appears to be password-protected.');
            } else {
                setError('An error occurred during compression. The PDF might be corrupted or in an unsupported format.');
            }
        } finally {
            setIsLoading(false);
            setProgress('');
        }
    };

    const performReset = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setCompressionLevel('medium');
        setIsResetModalOpen(false);
    };

    const handleResetClick = () => {
        setIsResetModalOpen(true);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const renderResult = () => {
        if (!result) return null;
        const reduction = ((result.originalSize - result.compressedSize) / result.originalSize) * 100;
        return (
             <div className="text-center">
                <h3 className="text-2xl font-bold text-accent mb-4">Compression Successful!</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-400">Original Size</p>
                        <p className="text-xl font-semibold text-gray-200">{formatBytes(result.originalSize)}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-400">Compressed Size</p>
                        <p className="text-xl font-semibold text-gray-200">{formatBytes(result.compressedSize)}</p>
                    </div>
                    <div className="p-4 bg-green-900/50 rounded-lg">
                        <p className="text-sm text-green-300">Reduction</p>
                        <p className="text-xl font-bold text-green-200">{reduction.toFixed(1)}%</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                     <button
                        onClick={() => saveAs(result.blob, result.fileName)}
                        className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                        Download Compressed PDF
                    </button>
                    <button
                        onClick={handleResetClick}
                        className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-primary bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-700 transition-colors duration-300"
                    >
                        Compress Another
                    </button>
                </div>

                <ConfirmationModal
                  isOpen={isResetModalOpen}
                  onClose={() => setIsResetModalOpen(false)}
                  onConfirm={performReset}
                  title="Compress Another File?"
                  message="This will clear the current compressed file result. Are you sure you want to continue?"
                  confirmText="Continue"
                />
            </div>
        );
    };

    const renderUploader = () => {
        return (
            <fieldset disabled={isLoading}>
                {!file ? (
                    <FileDropzone
                        onDrop={handleDrop}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        multiple={false}
                        instructions="Drag 'n' drop a PDF file to compress"
                    />
                ) : (
                    <div className="text-center">
                        <div className={`p-4 bg-slate-800 rounded-lg inline-flex items-center gap-4 ${isLoading ? 'animate-pulse' : ''}`}>
                            <span className="font-medium text-gray-300">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none px-2 rounded-full hover:bg-red-900/50 transition-colors">&times;</button>
                        </div>
                    </div>
                )}
                
                <div className="my-8">
                    <h3 className="text-lg font-semibold text-center text-gray-200 mb-4">Choose Compression Level</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(Object.keys(compressionLevels) as CompressionLevel[]).map(level => (
                            <div key={level} onClick={() => setCompressionLevel(level)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${compressionLevel === level ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-500'}`}>
                                <h4 className="font-bold text-gray-100">{compressionLevels[level].label}</h4>
                                <p className="text-sm text-slate-400 mt-1">{compressionLevels[level].description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 my-6 bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-200">
                    <p><strong>Important:</strong> This process converts each page into an image to reduce file size. As a result, text in the compressed PDF will not be selectable or searchable.</p>
                </div>

                {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}

                <div className="mt-8 text-center">
                    <button
                        onClick={handleCompress}
                        disabled={!file || isLoading}
                        className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center min-h-[56px] min-w-[220px]"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{progress || 'Compressing...'}</span>
                            </>
                        ) : (
                            <span>Compress PDF</span>
                        )}
                    </button>
                </div>
            </fieldset>
        );
    };

    return (
        <ToolPageLayout
            title="PDF Compressor"
            description="Reduce the file size of your PDFs while maintaining a balance of quality and size. Choose a compression level to suit your needs."
        >
            {result ? renderResult() : renderUploader()}
        </ToolPageLayout>
    );
};

export default PdfCompressPage;