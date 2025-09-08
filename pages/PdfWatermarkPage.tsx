
import React, { useState, useCallback } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { WatermarkIcon } from '../components/Icons';

type WatermarkType = 'text' | 'image';

const PdfWatermarkPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
    const [text, setText] = useState('CONFIDENTIAL');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [opacity, setOpacity] = useState(0.5);
    const [fontSize, setFontSize] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePdfDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const handleImageDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const wmFile = acceptedFiles[0];
            setImageFile(wmFile);
            setImagePreview(URL.createObjectURL(wmFile));
        }
    }, []);
    
    const handleApplyWatermark = async () => {
        if (!file) { setError('Please upload a PDF file.'); return; }
        if (watermarkType === 'text' && !text.trim()) { setError('Please enter watermark text.'); return; }
        if (watermarkType === 'image' && !imageFile) { setError('Please upload a watermark image.'); return; }

        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            
            let watermarkImage;
            if (watermarkType === 'image' && imageFile) {
                const imageBytes = await imageFile.arrayBuffer();
                watermarkImage = imageFile.type === 'image/png'
                    ? await pdfDoc.embedPng(imageBytes)
                    : await pdfDoc.embedJpg(imageBytes);
            }
            
            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();
                
                if (watermarkType === 'text') {
                    page.drawText(text, {
                        x: width / 2 - (text.length * fontSize / 4),
                        y: height / 2 - fontSize / 2,
                        size: fontSize,
                        color: rgb(0.5, 0.5, 0.5), // Gray color for watermark
                        opacity: opacity,
                        rotate: degrees(-45),
                    });
                } else if (watermarkImage) {
                    const imgDims = watermarkImage.scale(0.5);
                    page.drawImage(watermarkImage, {
                        x: width / 2 - imgDims.width / 2,
                        y: height / 2 - imgDims.height / 2,
                        width: imgDims.width,
                        height: imgDims.height,
                        opacity: opacity,
                    });
                }
            }
            
            const watermarkedBytes = await pdfDoc.save();
            const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
            saveAs(blob, `${file.name.replace('.pdf', '')}-watermarked.pdf`);

            setFile(null);

        } catch (e) {
            console.error(e);
            setError('An error occurred. The PDF might be corrupted or protected.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderOptions = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-md dark:shadow-none">
            <div>
                <h3 className="font-semibold mb-2 text-slate-800 dark:text-gray-200">Watermark Type</h3>
                <div className="flex gap-2">
                    <button onClick={() => setWatermarkType('text')} className={`px-4 py-2 rounded-md font-semibold ${watermarkType === 'text' ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm'}`}>Text</button>
                    <button onClick={() => setWatermarkType('image')} className={`px-4 py-2 rounded-md font-semibold ${watermarkType === 'image' ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm'}`}>Image</button>
                </div>
            </div>
            <div>
                <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Opacity ({Math.round(opacity * 100)}%)</label>
                <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full" />
            </div>

            {watermarkType === 'text' && (
                <>
                    <div>
                        <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Text</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Font Size</label>
                        <input type="number" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary" />
                    </div>
                </>
            )}

            {watermarkType === 'image' && (
                <div className="md:col-span-2">
                    <label className="block font-semibold mb-1 text-slate-800 dark:text-gray-200">Watermark Image</label>
                    {!imageFile ? (
                        <FileDropzone onDrop={handleImageDrop} accept={{'image/*': ['.png', '.jpg']}} multiple={false} instructions="Drop watermark image" />
                    ) : (
                         <div className="flex items-center gap-4">
                            <img src={imagePreview!} alt="Watermark preview" className="h-16 w-16 object-contain bg-white p-1 rounded-md shadow-sm" />
                            <span className="text-slate-800 dark:text-gray-200">{imageFile.name}</span>
                            <button onClick={() => {setImageFile(null); setImagePreview(null)}} className="text-red-500 font-bold">&times;</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
    return (
        <ToolPageLayout title="PDF Watermarker" description="Add a text or image watermark to every page of your PDF document.">
            {isLoading ? <Loader message="Applying watermark..." /> : (
                <div className="space-y-6">
                    {!file ? (
                        <FileDropzone onDrop={handlePdfDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop PDF here to add watermark" />
                    ) : (
                        <div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex items-center gap-4 shadow-sm dark:shadow-none">
                                <span className="font-medium text-slate-800 dark:text-gray-300">{file.name}</span>
                                <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold text-2xl">&times;</button>
                            </div>
                            {renderOptions()}
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center font-semibold mt-4">{error}</p>}
                    <div className="text-center mt-8">
                        <button onClick={handleApplyWatermark} disabled={!file} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
                            <WatermarkIcon className="w-6 h-6"/> Apply Watermark
                        </button>
                    </div>
                </div>
            )}
        </ToolPageLayout>
    );
};

export default PdfWatermarkPage;
