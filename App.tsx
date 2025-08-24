// © Nathan 2025

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { BotDetector } from './components/BotDetector';
import { generateReadme } from './services/geminiService';
import { Status, ExtractedPackageFiles, AiReadmeResult } from './types';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { Verification } from './components/Verification';
import { SecurityModal } from './components/SecurityModal';
import { ResultsDisplay } from './components/ResultsDisplay';

function App(): React.ReactNode {
  const [status, setStatus] = useState<Status>(Status.Verifying);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedPackageFiles | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiReadmeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const handleVerificationSuccess = useCallback(() => {
    setStatus(Status.AwaitingUpload);
  }, []);

  const handleFileUpload = useCallback((files: ExtractedPackageFiles) => {
    setExtractedFiles(files);
    setStatus(Status.Analyzing);
    setError(null);
    runAiAnalysis(files);
  }, []);
  
  const runAiAnalysis = useCallback(async (files: ExtractedPackageFiles) => {
     try {
        const analysis = await generateReadme(files.packageJsonContent, files.mainFileContent);
        setAiAnalysis(analysis);
        setStatus(Status.ReadyToPublish);
     } catch (err) {
        console.error(err);
        setError("Gagal menghasilkan analisis AI. API Key mungkin tidak valid atau terjadi masalah jaringan.");
        setStatus(Status.Error);
     }
  }, []);

  const handleReset = useCallback(() => {
    setStatus(Status.Verifying);
    setExtractedFiles(null);
    setAiAnalysis(null);
    setError(null);
  }, []);
  
  const handleDetection = useCallback(() => {
    setIsSecurityModalOpen(true);
  }, []);

  const renderContent = () => {
    switch (status) {
      case Status.Verifying:
        return <Verification onVerified={handleVerificationSuccess} />;
      
      case Status.AwaitingUpload:
        return <FileUpload onUploadSuccess={handleFileUpload} setAppError={setError} disabled={false} />;
      
      case Status.Analyzing:
        return (
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                <p className="mt-4 font-semibold">AI sedang menganalisis paket Anda...</p>
                <p className="text-sm text-gray-600">Menulis file README.md yang profesional.</p>
            </div>
        )

      case Status.ReadyToPublish:
        if (!extractedFiles || !aiAnalysis) return null;
        return <ResultsDisplay files={extractedFiles} analysis={aiAnalysis} onReset={handleReset} />;

      case Status.Error:
         return (
            <div className="text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                 <button
                    onClick={handleReset}
                    className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                >
                    Coba Lagi
                </button>
            </div>
         )

      default:
        return null;
    }
  };

  return (
    <>
      <BotDetector onDetect={handleDetection} />
      <SecurityModal isOpen={isSecurityModalOpen} />
      <div className="flex flex-col min-h-screen bg-white text-black font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-2xl border-2 border-black min-h-[450px] flex justify-center items-center">
             {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;