'use client';

import React from 'react';
import ScrollbarKustom from '../elements/ScrollbarKustom';
import Testimoni from './Testimoni';
import StatistikKartu from '../elements/StatistikKartu';
import GrafikTrenSentimen from '../elements/GrafikTrenSentimen';

// Data Dummy untuk Grafik Tren Sentimen Produk (Bulanan)
const dataTren = [
  { name: 'Jan', positif: 10, netral: 3, negatif: 2 },
  { name: 'Feb', positif: 12, netral: 4, negatif: 3 },
  { name: 'Mar', positif: 11, netral: 5, negatif: 4 },
  { name: 'Apr', positif: 15, netral: 4, negatif: 2 },
  { name: 'Mei', positif: 14, netral: 3, negatif: 3 },
  { name: 'Jun', positif: 18, netral: 6, negatif: 5 },
];

interface PropertiDashboardProduk {
  namaProduk: string;
}

const DashboardProduk: React.FC<PropertiDashboardProduk> = ({ namaProduk }) => {
  // Data dummy untuk statistik
  const dataStatistik = [
    {
      label: 'Total Ulasan', value: '124', color: 'bg-blue-50', iconColor: 'text-blue-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      label: 'Positif', value: '80', color: 'bg-green-50', iconColor: 'text-green-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: 'Netral', value: '25', color: 'bg-orange-50', iconColor: 'text-orange-500',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 10v1M15 10v1M9 15h6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: 'Negatif', value: '19', color: 'bg-red-50', iconColor: 'text-red-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  // Data untuk Keluhan Utama
  const dataKeluhan = [
    { label: 'Pengiriman barang sangat lama melebihi estimasi waktu yang diberikan di aplikasi, ditambah lagi nomor resi sulit dilacak oleh pelanggan', jumlah: 128, persen: 32 },
    { label: 'Kemasan rusak', jumlah: 72, persen: 18 },
    { label: 'Produk tidak sesuai', jumlah: 58, persen: 15 },
    { label: 'Respon penjual lambat', jumlah: 41, persen: 10 },
    { label: 'Ukuran tidak sesuai', jumlah: 33, persen: 8 },
  ];

  // Data untuk Kelebihan Produk
  const dataKelebihan = [
    "Kualitas bahan produk sangat premium, jahitannya luar biasa rapi, dan warnanya tidak luntur sama sekali meskipun sudah dicuci berkali-kali menggunakan mesin cuci.",
    "Pengiriman cepat dan tepat waktu",
    "Harga terjangkau dibanding kompetitor",
    "Respon penjual ramah dan membantu",
    "Produk sesuai dengan deskripsi foto"
  ];

  // Data Rekomendasi
  const dataRekomendasi = [
    {
      judul: 'Perbaiki Pengiriman',
      deskripsi: 'Banyak pelanggan mengeluhkan pengiriman yang lama. Pertimbangkan untuk bekerja sama dengan ekspedisi yang lebih cepat.',
      warna: 'bg-red-50',
      aksen: 'text-red-600'
    },
    {
      judul: 'Perhatikan Kemasan',
      deskripsi: 'Kemasan rusak cukup sering dikeluhkan. Gunakan packaging yang lebih aman dan tebal untuk melindungi produk.',
      warna: 'bg-amber-50',
      aksen: 'text-amber-600'
    },
    {
      judul: 'Pertahankan Kualitas',
      deskripsi: 'Pelanggan puas dengan kualitas produk. Pertahankan standar kualitas yang sudah sangat baik ini! ',
      warna: 'bg-green-50',
      aksen: 'text-green-600'
    }
  ];

  // Fungsi untuk mengatur grid rekomendasi
  const kelasGridRekomendasi = dataRekomendasi.length === 2 || dataRekomendasi.length === 4
    ? 'md:grid-cols-2'
    : 'md:grid-cols-3';

  return (
    // Halaman Dashboard Produk
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ScrollbarKustom />

      {/* Container Judul */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        {/* Judul */}
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Hasil Analisis Produk {namaProduk}
        </h2>
      </div>

      {/* Menampilkan Statistik Utama */}
      <StatistikKartu data={dataStatistik} />

      {/* Container Keluhan Utama & Kelebihan Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Card Keluhan Utama */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">

          {/* Judul dan Deskripsi Keluhan */}
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Keluhan Utama</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Berdasarkan frekuensi dan sentimen negatif</p>
          </div>

          {/* Container Isi Keluhan */}
          <div className="space-y-4 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {dataKeluhan.map((item, i) => (
              <div key={i} className="py-1.5">
                {/* Label */}
                <p className="text-sm text-slate-600 font-medium leading-loose mb-1.5">
                  {item.label}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-1000"
                      style={{ width: `${item.persen}%` }}
                    ></div>
                  </div>

                  {/* Jumlah & Persentase */}
                  <span className="text-xs font-medium text-slate-600 whitespace-nowrap w-[68px] text-right">
                    {item.jumlah} ({item.persen}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Container Kelebihan Produk */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          {/* Judul & Deskripsi Kelebihan */}
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Kelebihan Produk</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Aspek dengan sentimen positif tertinggi</p>
          </div>

          {/* Container Isi Kelebihan */}
          <div className="space-y-4 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {dataKelebihan.map((poin, i) => (
              <div key={i} className="flex items-start gap-4 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2.5"></div>
                <p className="flex-1 text-sm text-slate-600 font-medium leading-loose">{poin}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grafik Tren Sentimen Produk */}
      <GrafikTrenSentimen
        data={dataTren}
        title="Tren Sentimen Produk"
        subtitle="Perkembangan sentimen ulasan produk ini per bulan"
      />

      {/* Container Rekomendasi Toko */}
      <div className="space-y-6 pt-4">
        {/* Judul & Deskripsi Rekomendasi */}
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Rekomendasi Untuk Toko</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Saran yang dapat membantu meningkatkan kepuasan pelanggan</p>
        </div>

        {/* Container Isi Rekomendasi */}
        <div className={`grid grid-cols-1 ${kelasGridRekomendasi} gap-6`}>
          {dataRekomendasi.map((item, i) => (
            <div key={i} className={`${item.warna} p-8 rounded-2xl border border-white/50 shadow-sm flex flex-col gap-6 hover:shadow-md transition-all`}>

              {/* Nomor Rekomendasi */}
              <div className={`w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm text-2xl font-black ${item.aksen}`}>
                {i + 1}
              </div>

              {/* Judul & Isi Rekomendasi */}
              <div className="space-y-3">
                <h4 className={`text-base font-black ${item.aksen} tracking-tight`}>{item.judul}</h4>
                <p className="text-sm text-slate-600/80 font-normal leading-loose">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Feedback Melayang */}
      <Testimoni />
    </div>
  );
};

export default DashboardProduk;
