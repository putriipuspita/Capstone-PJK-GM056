'use client';
import React from 'react';

interface KonfirmasiProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  judul: string;
  pesan: string;
}

const Konfirmasi: React.FC<KonfirmasiProps> = ({ isOpen, onClose, onConfirm, judul, pesan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay Kartu */}
      <div className="absolute inset-0 bg-slate-900/40 animate-in fade-in duration-300" onClick={onClose}></div>

      {/* Container Hapus*/}
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-[320px] w-full text-center space-y-4 border border-slate-100 animate-in zoom-in duration-300">
        {/* Warning Icon */}
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Judul dan Pesan */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">{judul}</h3>
          <p className="text-[12px] text-slate-500 leading-relaxed px-1">{pesan}</p>
        </div>

        {/* Container Batal dan Hapus */}
        <div className="flex flex-row gap-3 pt-2">
          {/* Tombol Batal */}
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95"
          >
            Batal
          </button>

          {/* Tombol Hapus */}
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            Hapus
          </button>
        </div>

      </div>

    </div>
  );
};

export default Konfirmasi;
