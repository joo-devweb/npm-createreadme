// © Nathan 2025

import React from 'react';

interface SecurityModalProps {
  isOpen: boolean;
}

export function SecurityModal({ isOpen }: SecurityModalProps): React.ReactNode {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-lg shadow-2xl text-center max-w-md animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Aktivitas Terdeteksi!</h2>
        <p className="text-4xl font-mono font-bold text-red-600 py-4">
          Hayo Kamu Mw Ngapain tuhhh
        </p>
        <p className="text-gray-600">
            Aplikasi ini dilindungi. Akses Anda telah dibatasi karena terdeteksi adanya upaya untuk menginspeksi kode sumber.
        </p>
      </div>
    </div>
  );
}
