'use client';
import React, { useEffect, useState } from 'react';

// Definisi data yang dibutuhkan oleh komponen Notifikasi
interface NotifikasiProps {
  show: boolean;
  onClose: () => void;
  pesan: string;
  tipe?: 'sukses' | 'info' | 'error';
}

const Notifikasi: React.FC<NotifikasiProps> = ({ show, onClose, pesan, tipe = 'sukses' }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsMounted(true); // Mount elemen di luar layar

      // Waktu muncul notifikasi
      const inTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      // Waktu keluar notifikasi
      const outTimer = setTimeout(() => {
        setIsVisible(false);

        // Waktu animasi selesai
        setTimeout(() => {
          setIsMounted(false);
          onClose();
        }, 500);
      }, 2000);

      return () => {
        clearTimeout(inTimer);
        clearTimeout(outTimer);
      };
    }
  }, [show]);

  if (!isMounted) return null;

  return (
    // Container Notifikasi
    <div
      className={`fixed top-6 right-0 z-[2000] transition-transform duration-500 ease-in-out ${isVisible ? 'translate-x-[-2rem]' : 'translate-x-[120%]'
        }`}
    >
      {/* Kartu Notifikasi */}
      <div className={`bg-white/95 backdrop-blur-md border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl flex items-stretch max-w-[320px] overflow-hidden ${tipe === 'error' ? 'border-red-100' : tipe === 'info' ? 'border-blue-100' : 'border-emerald-100'
        }`}>

        {/* Garis Aksen Samping*/}
        <div className={`w-1.5 ${
          tipe === 'error' ? 'bg-red-500' : tipe === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
        }`} />

        {/* Area Teks Pesan */}
        <div className="px-6 py-5 flex items-center justify-center flex-1">
          <p className="text-[14px] font-bold text-slate-800 tracking-tight text-center leading-relaxed">
            {pesan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
