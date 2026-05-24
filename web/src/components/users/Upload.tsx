'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AnalisisOverlay from '../elements/AnalisisOverlay';

const Upload = () => {
  const navigasi = useRouter();
  const [sedangMenyeret, setSedangMenyeret] = useState(false);
  const [namaProduk, setNamaProduk] = useState('');
  const [sedangMenganalisis, setSedangMenganalisis] = useState(false);
  const [progres, setProgres] = useState(0);
  const [tahapAnalisis, setTahapAnalisis] = useState('Membaca data ulasan...');
  const refInputFile = useRef<HTMLInputElement>(null);

  // Fungsi Tombol Batal
  const tanganiBatal = () => {
    setNamaProduk('');
    if (refInputFile.current) {
      refInputFile.current.value = '';
    }
  };

  // Fungsi Tombol Mulai Analisis
  const mulaiAnalisis = () => {
    if (!namaProduk) {
      alert('Silakan masukkan nama produk terlebih dahulu');
      return;
    }

    setSedangMenganalisis(true);
    setProgres(0);
    setTahapAnalisis('Membaca data ulasan...');

    // Fungsi Loading
    const selangWaktu = setInterval(() => {
      setProgres((sebelumnya) => {
        const progresBerikutnya = sebelumnya + Math.floor(Math.random() * 10) + 2;
        const progresSaatIni = progresBerikutnya > 100 ? 100 : progresBerikutnya;

        // Fungsi Selesai Loading
        if (progresSaatIni >= 100) {
          clearInterval(selangWaktu);
          setTimeout(() => {
            setSedangMenganalisis(false);
            navigasi.push(`/users/dashboard-produk?p=${encodeURIComponent(namaProduk)}`);
          }, 800);
          return 100;
        }

        // Fungsi Tahap Analisis
        if (progresSaatIni < 30) {
          setTahapAnalisis('Membaca data ulasan...');
        } else if (progresSaatIni < 60) {
          setTahapAnalisis('Menganalisis sentimen...');
        } else if (progresSaatIni < 90) {
          setTahapAnalisis('Mengkategorikan topik...');
        } else {
          setTahapAnalisis('Menyusun dashboard hasil...');
        }

        return progresSaatIni;
      });
    }, 400);
  };


  return (
    // Halaman Upload
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 relative">

      {/* Tampilan Saat Loading */}
      <AnalisisOverlay
        sedangMenganalisis={sedangMenganalisis}
        progres={progres}
        tahapAnalisis={tahapAnalisis}
      />

      {/* Container Isi Halaman Upload */}
      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 items-start transition-all duration-500 ${sedangMenganalisis ? 'opacity-50 pointer-events-none' : ''}`}>

        {/* Container Upload */}
        <div className="lg:col-span-3 bg-white pt-7 pb-10 px-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">

          {/* Input Nama Produk */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 tracking-tight text-base">Nama Produk</h3>
            <input
              type="text"
              placeholder="Contoh: Sepatu Lari Nike Air Max"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-hero/20 focus:bg-white rounded-2xl px-5 py-4 text-sm outline-none transition-all"
              value={namaProduk}
              onChange={(e) => setNamaProduk(e.target.value)}
            />
          </div>

          {/* Upload File */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 tracking-tight text-base">Upload file ulasan</h3>

            {/* Drag and Drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setSedangMenyeret(true); }}
              onDragLeave={() => setSedangMenyeret(false)}
              onDrop={(e) => { e.preventDefault(); setSedangMenyeret(false); }}
              className={`
                relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center group
                ${sedangMenyeret ? 'border-hero bg-hero/5 scale-[1.01]' : 'border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-white'}
              `}
            >

              {/* Ikon Upload */}
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-slate-400 group-hover:bg-hero/10 group-hover:text-hero transition-all duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>

              {/* Deskripsi */}
              <h3 className="text-base font-bold text-slate-700 mb-2 tracking-tight">Drag & drop file disini</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">atau</p>

              {/* Input File */}
              <input
                ref={refInputFile}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".csv,.xlsx,.xls"
              />

              {/* Tombol Pilih File */}
              <button className="bg-hero text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg shadow-hero/20 hover:scale-105 active:scale-95 transition-all">
                Pilih File
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row gap-4">
            {/* Tombol Batal */}
            <button
              onClick={tanganiBatal}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all order-2 md:order-1"
            >
              Batal
            </button>

            {/* Tombol Mulai Analisis */}
            <button
              onClick={mulaiAnalisis}
              className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black hover:shadow-xl transition-all order-1 md:order-2"
            >
              Mulai Analisis
            </button>
          </div>
        </div>

        {/* Container Panduan */}
        <div className="lg:col-span-1 p-8 rounded-xl border border-[#ffede5] sticky top-28 self-start" style={{ backgroundColor: '#fff7f3' }}>
          {/* Judul */}
          <h4 className="font-bold text-orange-900 text-sm mb-2 pb-2 border-b border-orange-200/50">Panduan Format</h4>

          {/* Container Isis */}
          <ul className="space-y-3">
            {/* Panduan 1 */}
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
              <div className="text-xs text-orange-800/80 leading-relaxed font-medium text-justify">
                File harus memiliki kolom :
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Tanggal</li>
                  <li>Review</li>
                  <li>Rating</li>
                </ul>
              </div>
            </li>

            {/* Panduan 2 */}
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
              <div className="text-xs text-orange-800/80 leading-relaxed font-medium text-justify">
                Format yang didukung: <b>.csv</b>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;
