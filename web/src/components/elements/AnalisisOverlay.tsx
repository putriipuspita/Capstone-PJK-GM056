'use client';
import React from 'react';

interface AnalisisOverlayProps {
  sedangMenganalisis: boolean;
  progres: number;
  tahapAnalisis: string;
}

const AnalisisOverlay: React.FC<AnalisisOverlayProps> = ({ sedangMenganalisis, progres, tahapAnalisis }) => {
  if (!sedangMenganalisis) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 text-center space-y-6 scale-in-center transition-all border border-slate-100">

        {/* Animated Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-hero rounded-full border-t-transparent animate-spin"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          ></div>
        </div>

        {/* Tahapan Analisis */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800">Menganalisis Ulasan...</h3>
          <p className="text-xs text-slate-400 font-normal">{tahapAnalisis}</p>
        </div>

        {/* Persentesae Progress */}
        <div className="space-y-4">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-hero h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progres}%` }}
            ></div>
          </div>
          <p className="text-sm font-normal text-slate-400 tracking-tight">{progres}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalisisOverlay;
