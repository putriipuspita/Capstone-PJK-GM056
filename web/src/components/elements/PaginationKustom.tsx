'use client';
import React from 'react';

// Definisi data yang dibutuhkan oleh komponen PaginationKustom
interface PaginationProps {
  halamanSaatIni: number;
  totalHalaman: number;
  setHalamanSaatIni: React.Dispatch<React.SetStateAction<number>>;
  totalItem?: number;
  itemPerHalaman?: number;
}

export default function PaginationKustom({ halamanSaatIni, totalHalaman, setHalamanSaatIni, totalItem, itemPerHalaman = 5 }: PaginationProps) {
  // Menghitung angka urutan data yang sedang ditampilkan
  const start = totalItem === 0 ? 0 : (halamanSaatIni - 1) * itemPerHalaman + 1;
  const end = Math.min(halamanSaatIni * itemPerHalaman, totalItem || 0);

  return (
    // Container Pagination
    <div className={`flex items-center ${totalItem !== undefined ? 'justify-between' : 'justify-end'} mt-6`}>

      {/* Keterangan Jumlah Data */}
      {totalItem !== undefined && (
        <p className="text-[13px] font-medium text-slate-500">
          Menampilkan <span className="font-bold text-slate-700">{start}-{end}</span> dari <span className="font-bold text-slate-700">{totalItem}</span> data
        </p>
      )}

      {/* Container Tombol Navigasi */}
      <div className="flex gap-2 items-center">
        {/* Tombol Sebelumnya (Prev) */}
        <button
          onClick={() => setHalamanSaatIni((sebelumnya: number) => Math.max(1, sebelumnya - 1))}
          disabled={halamanSaatIni === 1}
          className={`p-2 rounded-lg transition-all ${halamanSaatIni === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Container Nomor Halaman */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalHalaman }).map((_, i) => (
            // Tombol Angka Halaman
            <button
              key={i}
              onClick={() => setHalamanSaatIni(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${halamanSaatIni === i + 1 ? 'bg-[#fff7D3] text-slate-800 shadow-sm border border-orange-100/50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Tombol Selanjutnya (Next) */}
        <button
          onClick={() => setHalamanSaatIni((sebelumnya: number) => Math.min(totalHalaman, sebelumnya + 1))}
          disabled={halamanSaatIni === totalHalaman || totalHalaman === 0}
          className={`p-2 rounded-lg transition-all ${halamanSaatIni === totalHalaman || totalHalaman === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
