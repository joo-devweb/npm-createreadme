// © Nathan 2025

import React, { useState, useRef, useEffect } from 'react';
import { ExtractedPackageFiles, AiReadmeResult, PreflightCheck } from '../types';

interface ResultsDisplayProps {
    files: ExtractedPackageFiles;
    analysis: AiReadmeResult;
    onReset: () => void;
}

export function ResultsDisplay({ files, analysis, onReset }: ResultsDisplayProps): React.ReactNode {
    const publishCommand = files.isScoped ? 'npm publish --access public' : 'npm publish';
    const [commandCopied, setCommandCopied] = useState(false);
    const [readmeCopied, setReadmeCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (textareaRef.current) {
          // Adjust height to fit content
          textareaRef.current.style.height = '0px';
          const scrollHeight = textareaRef.current.scrollHeight;
          textareaRef.current.style.height = scrollHeight + 'px';
        }
      }, [analysis.readmeContent]);

    const handleCommandCopy = () => {
        navigator.clipboard.writeText(publishCommand);
        setCommandCopied(true);
        setTimeout(() => setCommandCopied(false), 2000);
    };
    
    const handleReadmeCopy = () => {
        navigator.clipboard.writeText(analysis.readmeContent);
        setReadmeCopied(true);
        setTimeout(() => setReadmeCopied(false), 2000);
    };

    return (
        <div className="w-full animate-fade-in space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">1. Pemeriksaan Pra-Publikasi</h3>
                <Checklist checks={files.preflightCheck} />
            </div>

            <div>
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">2. README.md (Dihasilkan oleh AI)</h3>
                     <button onClick={handleReadmeCopy} className="bg-gray-200 hover:bg-gray-300 text-black text-xs font-semibold py-1 px-3 rounded">
                        {readmeCopied ? 'Disalin!' : 'Salin README'}
                    </button>
                 </div>
                <textarea
                    ref={textareaRef}
                    readOnly
                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono resize-none overflow-hidden"
                    value={analysis.readmeContent}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">3. Jalankan Perintah Ini</h3>
                <p className="text-sm text-gray-600 mb-2">Salin dan jalankan perintah berikut di terminal Anda dari direktori root paket Anda:</p>
                <div className="bg-black text-white font-mono text-sm rounded-lg p-4 flex items-center justify-between">
                    <span>$ {publishCommand}</span>
                    <button onClick={handleCommandCopy} className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-3 rounded">
                        {commandCopied ? 'Disalin!' : 'Salin'}
                    </button>
                </div>
            </div>

            <div className="text-center pt-4">
                <button
                    onClick={onReset}
                    className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                >
                    Analisis Paket Lain
                </button>
            </div>
        </div>
    );
};

const Checklist = ({ checks }: { checks: PreflightCheck }) => {
    const CheckItem = ({ label, isChecked, requiredText }: { label: string, isChecked: boolean, requiredText?: string }) => (
        <li className={`flex items-center text-sm ${isChecked ? 'text-black' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${isChecked ? 'text-green-500' : 'text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 {isChecked ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            </svg>
            <span className="font-mono">{label}</span>
            {!isChecked && <span className="ml-2 text-xs font-semibold">{requiredText || '(Disarankan)'}</span>}
        </li>
    );

    return (
        <ul className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <CheckItem label="package.json: name" isChecked={checks.hasName} />
            <CheckItem label="package.json: version" isChecked={checks.hasVersion} />
            <CheckItem label="package.json: main" isChecked={checks.hasMain} />
            <CheckItem label="package.json: description" isChecked={checks.hasDescription} />
            <CheckItem label="package.json: repository" isChecked={checks.hasRepository} />
            <CheckItem label="package.json: license" isChecked={checks.hasLicense} requiredText="(Wajib GNU)" />
        </ul>
    );
};
