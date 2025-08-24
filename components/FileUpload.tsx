// © Nathan 2025

import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { ExtractedPackageFiles, PreflightCheck } from '../types';

interface FileUploadProps {
  onUploadSuccess: (files: ExtractedPackageFiles) => void;
  setAppError: (error: string) => void;
  disabled: boolean;
}

export function FileUpload({ onUploadSuccess, setAppError, disabled }: FileUploadProps): React.ReactNode {
  const [isDragging, setIsDragging] = useState(false);

  const processZipFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setAppError("Harap unggah file .zip yang valid.");
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const packageJsonFile = zip.file(/^(?!.*node_modules\/).*package\.json$/)[0];

      if (!packageJsonFile) {
        throw new Error("File package.json tidak ditemukan di dalam arsip .zip.");
      }

      const packageJsonContent = await packageJsonFile.async('string');
      const packageJson = JSON.parse(packageJsonContent);

      const mainFilePath = packageJson.main || 'index.js';
      const mainFileMatches = zip.file(new RegExp(`^/?(?!.*node_modules/).*${mainFilePath.replace('./', '')}$`));

      if (!mainFileMatches || mainFileMatches.length === 0) {
        throw new Error(`File utama '${mainFilePath}' tidak ditemukan di dalam arsip .zip.`);
      }

      const mainFile = mainFileMatches[0];
      const mainFileContent = await mainFile.async('string');
      const isScoped = packageJson.name ? packageJson.name.startsWith('@') : false;

      const preflightCheck: PreflightCheck = {
        hasName: !!packageJson.name,
        hasVersion: !!packageJson.version,
        hasMain: !!packageJson.main,
        hasDescription: !!packageJson.description,
        hasRepository: !!packageJson.repository,
        hasLicense: !!(packageJson.license && typeof packageJson.license === 'string' && packageJson.license.toLowerCase().includes('gnu')),
      };

      onUploadSuccess({
        packageName: packageJson.name || 'N/A',
        packageVersion: packageJson.version || 'N/A',
        packageJsonContent,
        mainFileContent,
        mainFilePath,
        isScoped,
        preflightCheck,
      });
    } catch (err) {
        if (err instanceof Error) {
            setAppError(`Gagal memproses file .zip: ${err.message}`);
        } else {
            setAppError("Terjadi kesalahan yang tidak diketahui saat memproses file.");
        }
    }
  }, [onUploadSuccess, setAppError]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processZipFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        processZipFile(e.target.files[0]);
    }
  };

  return (
    <div className="text-center w-full">
        <label
            htmlFor="file-upload"
            className={`relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300 ${isDragging ? 'bg-gray-100' : 'bg-white'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <UploadIcon />
            <span className="mt-2 block font-semibold text-black">
                Unggah paket .zip Anda
            </span>
            <span className="mt-1 block text-sm text-gray-500">
                Tarik dan lepas, atau klik untuk memilih file
            </span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".zip" onChange={handleFileChange} disabled={disabled} />
        </label>
    </div>
  );
}

function UploadIcon(): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    )
}