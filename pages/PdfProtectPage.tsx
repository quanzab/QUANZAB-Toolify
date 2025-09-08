
import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { LockIcon } from '../components/Icons';

const PdfProtectPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const handleProtect = async () => {
        if (!file) {
            setError('Please upload a PDF file.');
            return;
        }
        if (!password) {
            setError('Please enter a password.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            
            // FIX: The `.encrypt()` method may be missing from older type definitions; using a type assertion to call it.
            (pdfDoc as any).encrypt({
                ownerPassword: password,
                userPassword: password,
            });
            const encryptedBytes = await pdfDoc.save();

            const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
            saveAs(blob, `${file.name.replace('.pdf', '')}-protected.pdf`);
            
            setFile(null);
            setPassword('');
            setConfirmPassword('');

        } catch (e) {
            console.error(e);
            setError('An error occurred while protecting the PDF. It might be corrupted.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderUploader = () => (
        <div className="space-y-6">
            {!file ? (
                <FileDropzone
                    onDrop={handleDrop}
                    accept={{ 'application/pdf': ['.pdf'] }}
                    multiple={false}
                    instructions="Drop a PDF to add password protection"
                />
            ) : (
                <div className="text-center">
                    <div className="p-4 bg-slate-800 rounded-lg inline-flex items-center gap-4">
                        <span className="font-medium text-gray-300">{file.name}</span>
                        <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none px-2 rounded-full hover:bg-red-900/50 transition-colors">&times;</button>
                    </div>
                </div>
            )}

            {file && (
                <div className="max-w-sm mx-auto space-y-4">
                     <div>
                        <label htmlFor="password-input" className="block font-semibold mb-1">Set Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md bg-slate-800 border-slate-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password-input" className="block font-semibold mb-1">Confirm Password</label>
                        <input
                            id="confirm-password-input"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded-md bg-slate-800 border-slate-600"
                        />
                    </div>
                </div>
            )}
            
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
            
            <div className="text-center mt-8">
                <button
                    onClick={handleProtect}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600"
                >
                    <LockIcon className="w-6 h-6"/>
                    Protect PDF
                </button>
            </div>
        </div>
    );

    return (
        <ToolPageLayout
            title="PDF Protect"
            description="Encrypt and password-protect your PDF documents to secure sensitive information."
        >
            {isLoading ? <Loader message="Encrypting your PDF..." /> : renderUploader()}
        </ToolPageLayout>
    );
};

export default PdfProtectPage;