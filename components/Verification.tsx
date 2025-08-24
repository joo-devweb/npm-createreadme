// © Nathan 2025

import React, { useState } from 'react';

interface VerificationProps {
  onVerified: () => void;
}

export function Verification({ onVerified }: VerificationProps): React.ReactNode {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="text-center w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Verifikasi Keamanan</h2>
        <p className="text-gray-600 mb-6">Untuk melindungi layanan kami, harap konfirmasi bahwa Anda bukan bot.</p>
        <div className="flex items-center justify-center mb-6">
            <input
                id="robot-check"
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="robot-check" className="ml-3 block text-md font-medium text-gray-700">
                Anda Bukan Bot kan?
            </label>
        </div>
        <button
            onClick={onVerified}
            disabled={!isChecked}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800"
        >
            Lanjutkan
        </button>
    </div>
  );
}
