import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

interface Metadata {
    [key: string]: string | undefined;
}

const PdfMetadataViewerPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const droppedFile = acceptedFiles[0];
        setFile(droppedFile);
        setMetadata(null);
        setError(null);
        setIsLoading(true);

        try {
            const pdfBytes = await droppedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

            const formatDate = (date: Date | undefined) => date?.toLocaleString() || undefined;

            const data: Metadata = {
                'File Name': droppedFile.name,
                'File Size': `${(droppedFile.size / 1024).toFixed(2)} KB`,
                'Page Count': pdfDoc.getPageCount().toString(),
                Title: pdfDoc.getTitle(),
                Author: pdfDoc.getAuthor(),
                Subject: pdfDoc.getSubject(),
                Keywords: pdfDoc.getKeywords(),
                Producer: pdfDoc.getProducer(),
                Creator: pdfDoc.getCreator(),
                'Creation Date': formatDate(pdfDoc.getCreationDate()),
                'Modification Date': formatDate(pdfDoc.getModificationDate()),
            };

            setMetadata(data);

        } catch (e: any) {
            console.error(e);
            setError(e.name === 'PDFInvalidPasswordError' 
                ? 'The PDF is password-protected and cannot be read.'
                : 'Could not read the PDF file. It might be corrupted.');
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCopy = () => {
        if (!metadata) return;
        const textToCopy = Object.entries(metadata)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
            
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleReset = () => {
        setFile(null);
        setMetadata(null);
        setError(null);
    };

    const renderResults = () => {
        if (!metadata) return null;
        return (
            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Document Properties</h3>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm"
                    >
                        {copied ? 'Copied!' : 'Copy All'}
                    </button>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {Object.entries(metadata).map(([key, value]) => (
                            value ? (
                                <li key={key} className="px-4 py-3 grid grid-cols-3 gap-4">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-300 col-span-1">{key}</span>
                                    <span className="text-sm text-slate-800 dark:text-gray-200 col-span-2 break-words">{value}</span>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>
                 <div className="mt-6 text-center">
                    <button onClick={handleReset} className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                        Check another file
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <ToolPageLayout
            title="PDF Metadata Viewer"
            description="View and extract metadata like author, subject, and creation date from a PDF file."
        >
            {isLoading && <Loader message="Analyzing PDF..." />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                {!file ? (
                    <FileDropzone onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} instructions="Drop a PDF to view its metadata" />
                ) : (
                    <>
                        <div className="text-center">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex items-center gap-4 shadow-sm dark:shadow-none">
                                <span className="font-medium text-slate-800 dark:text-gray-300">{file.name}</span>
                            </div>
                        </div>
                        {renderResults()}
                    </>
                )}
                 {error && <p className="text-red-500 text-center font-semibold mt-4">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default PdfMetadataViewerPage;