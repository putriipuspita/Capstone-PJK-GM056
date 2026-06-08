'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PaginationKustom from '../elements/PaginationKustom';
import StatistikKartu from '../elements/StatistikKartu';
import GrafikTrenSentimen from '../elements/GrafikTrenSentimen';

// Data Dummy untuk Grafik Donat
const dataDonat = [
  { name: 'Positif', value: 1248, color: '#10b981' },
  { name: 'Netral', value: 382, color: '#f59e0b' },
  { name: 'Negatif', value: 309, color: '#ef4444' },
];

// Data Dummy untuk Grafik Tren
const dataTren = [
  { name: 'Apr', positif: 620, netral: 380, negatif: 150 },
  { name: 'Mei', positif: 680, netral: 420, negatif: 180 },
  { name: 'Juni', positif: 640, netral: 390, negatif: 160 },
  { name: 'Juli', positif: 780, netral: 380, negatif: 140 },
  { name: 'Agustus', positif: 720, netral: 340, negatif: 160 },
  { name: 'September', positif: 850, netral: 360, negatif: 180 },
];

// Data Dummy untuk Top Aspek
const dataTopAspek = [
  { label: 'Kualitas Produk', jumlah: 842, persen: 43 },
  { label: 'Pengiriman', jumlah: 532, persen: 27 },
  { label: 'Pelayanan', jumlah: 311, persen: 16 },
  { label: 'Harga', jumlah: 254, persen: 13 },
];

// Data Dummy untuk Data Keluhan
const dataKeluhanUtama = [
  { label: 'Pengiriman lama', jumlah: 128 },
  { label: 'Kemasan rusak', jumlah: 72 },
  { label: 'Produk tidak sesuai', jumlah: 58 },
  { label: 'Respon penjual lambat', jumlah: 41 },
];


// Fungsi Pindah Halaman 
export default function Dashboard() {
  const [halamanSaatIni, setHalamanSaatIni] = React.useState(1);
  const [isMounted, setIsMounted] = React.useState(false);
  const itemPerHalaman = 5;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data Dummy untuk Tabel Ringkasan Perbandingan Produk
  const dataTabelMentah = [
    { name: 'Laptop Gaming X', total: 8, pos: 6, neu: 1, neg: 1, rating: 4.8 },
    { name: 'Mouse Wireless Pro', total: 5, pos: 3, neu: 1, neg: 1, rating: 4.2 },
    { name: 'Keyboard Mechanical', total: 12, pos: 10, neu: 1, neg: 1, rating: 4.9 },
    { name: 'Monitor 4K Ultra', total: 4, pos: 3, neu: 0, neg: 1, rating: 4.5 },
    { name: 'Headset RGB Pro', total: 15, pos: 12, neu: 2, neg: 1, rating: 4.7 },
    { name: 'Smartphone Z1', total: 20, pos: 15, neu: 3, neg: 2, rating: 4.6 },
    { name: 'Tablet Air Tab', total: 10, pos: 5, neu: 4, neg: 1, rating: 4.0 },
    { name: 'Smartwatch V2', total: 7, pos: 6, neu: 0, neg: 1, rating: 4.8 },
  ];

  // Pengurutan Positif terbanyak, lalu Rating tertinggi
  const dataTerurut = [...dataTabelMentah].sort((a, b) => {
    if (b.pos !== a.pos) return b.pos - a.pos;
    return b.rating - a.rating;
  });

  // Menghitung Jumlah Halaman & Data Per Halaman Tabel Ringkasan
  const totalHalaman = Math.ceil(dataTerurut.length / itemPerHalaman);
  const itemSaatIni = dataTerurut.slice((halamanSaatIni - 1) * itemPerHalaman, halamanSaatIni * itemPerHalaman);

  // Tampilan Jika Data Kosong
  if (dataTabelMentah.length === 0) {
    return (
      // Container Jika Dashboard MasihKosong
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-700">
        <div className="w-40 h-40 mb-6 relative">
          {/* Efek Lingkaran di Belakang Ikon */}
          <div className="absolute inset-0 bg-hero/5 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-hero/10 rounded-full"></div>

          {/* Ikon Utama */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-20 h-20 text-hero opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>

        {/* Judul dan Deksripsi */}
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
          Selamat Datang di <span className="text-hero">SENTIX</span>
        </h2>
        <p className="text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
          Mulai analisis ulasan produk untuk mendapatkan wawasan mendalam mengenai sentimen pelanggan secara otomatis dan akurat.
        </p>

        {/* Tombol Mulai Analisis */}
        <button
          onClick={() => window.location.href = '/users/upload'}
          className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-black transition-all hover:shadow-2xl hover:shadow-hero/20 active:scale-95"
        >
          Mulai Analisis Pertama
        </button>
      </div>
    );
  }

  // Data Dummy Statistik untuk ditampilkan di kartu
  const dataStatistik = [
    {
      label: 'Total Analisis', value: '1.939', color: 'bg-blue-50', iconColor: 'text-blue-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      label: 'Positif', value: '64.5%', color: 'bg-green-50', iconColor: 'text-green-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: 'Netral', value: '19.8%', color: 'bg-orange-50', iconColor: 'text-orange-500',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 10v1M15 10v1M9 15h6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: 'Negatif', value: '15.7%', color: 'bg-red-50', iconColor: 'text-red-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  return (
    // Halaman Dashboard
    <div className="space-y-6">
      {/* Menampilkan Statistik Utama */}
      <StatistikKartu data={dataStatistik} />

      {/* Grid Container Grafik Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Container Skor Kepuasan */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full md:col-span-5 xl:col-span-4">
          {/* Judul */}
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Skor Kepuasan</h3>

          {/* Container Isi Kotak */}
          <div className="flex flex-row items-center gap-6 h-full">
            {/* Container Grafik Lingkaran */}
            <div className="relative w-32 h-32 flex-shrink-0">
              {/* Gambar Grafik Lingkaran */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-green-500" strokeWidth="3" strokeDasharray="78, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>

              {/* Isi Di Dalam Grafik */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 leading-none">78<span className="text-sm font-bold text-slate-400">/100</span></span>
                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Baik</span>
              </div>
            </div>

            {/* Container Deskripsi Kepuasan*/}
            <div className="text-left flex-1 md:pr-8 xl:pr-0">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Skor kepuasan ini dihitung dari perbandingan sentimen positif dan negatif.
              </p>
            </div>
          </div>
        </div>

        {/*  Container Top Aspek Yang Dibicarakan */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full md:col-span-5 xl:col-span-6">
          {/* Judul */}
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Top Aspek yang Dibicarakan</h3>

          {/* Container Isi Kotak */}
          <div className="space-y-5">
            {/* Logika Jika Isi Panjang Maka Progress Bar Dibawah Teks*/}
            {(() => {
              const isAdaTeksPanjang = dataTopAspek.some(item => item.label.length > 25);

              // Menampilkan Data Top Aspek
              return dataTopAspek.map((item, i) => (
                <div key={i} className="w-full">
                  {isAdaTeksPanjang ? (

                    /* Container Format Progress Bar Dibawah Teks*/
                    <div className="space-y-2">
                      {/* Label dan Persentase Sejajar */}
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[13px] text-slate-600 font-medium leading-relaxed">
                          {item.label}
                        </span>
                        <span className="text-[13px] font-bold text-slate-700 mt-0.5">
                          {item.persen}%
                        </span>
                      </div>

                      {/* Container Progress Bar */}
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.persen}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (


                    /* Container Format Tulisan dan Progress Bar Sebaris */
                    <div className="flex items-center gap-4">
                      {/* Label */}
                      <span className="text-[13px] text-slate-600 font-medium w-28 flex-shrink-0">
                        {item.label}
                      </span>

                      {/* Container Progress Bar */}
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.persen}%` }}
                        ></div>
                      </div>

                      {/* Persentase */}
                      <span className="text-[13px] font-bold text-slate-700 w-10 text-right">
                        {item.persen}%
                      </span>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Container Kotak Keluhan Utama */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full md:col-span-5">
          {/* Judul */}
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Keluhan Utama</h3>

          {/* Container Isi Kotak */}
          <div className="space-y-4">
            {/* Menampilkan Data Keluhan Utama */}
            {dataKeluhanUtama.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                {/* Nomor Dan Label */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-black text-[13px] shadow-sm border border-red-100/50">
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-slate-600 font-medium">{item.label}</span>
                </div>

                {/* Jumlah */}
                <span className="text-[13px] font-bold text-slate-700">{item.jumlah}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Container Grafik Distribusi */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 md:col-span-5">
          {/* Judul */}
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-10">Distribusi Sentimen</h3>

          {/* Container Isi Kotak */}
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 xl:gap-8">
            {/* Container Grafik PieChart */}
            <div className="w-[160px] h-[160px] lg:w-[180px] lg:h-[180px] relative flex-shrink-0">
              {isMounted ? (
                <>
                  {/* Grafik PieChart */}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={dataDonat}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {dataDonat.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Isi Pie Chart */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl lg:text-2xl font-black text-slate-800 leading-none">1.939</p>
                    <p className="text-[0.55rem] lg:text-[0.6rem] text-gray-400 font-bold capitalize mt-1">Total ulasan</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin"></div>
              )}
            </div>

            {/* Container Legenda & Persentase */}
            <div className="space-y-4">
              {/* Menampilkan Data Donut */}
              {dataDonat.map((item, i) => (
                <div key={i} className="flex items-center gap-3 lg:gap-4">

                  {/* Warna & Nama Sentimen */}
                  <div className="flex items-center gap-2 lg:gap-3 w-20 lg:w-20 flex-shrink-0">
                    <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-[4px] lg:rounded-[5px]" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs lg:text-sm font-medium text-slate-500 capitalize">{item.name}</span>
                  </div>

                  {/* Persentase */}
                  <div className="w-12 lg:w-12 flex-shrink-0 text-left">
                    <span className="text-xs lg:text-sm font-medium text-slate-500">{((item.value / 1939) * 100).toFixed(1)}%</span>
                  </div>

                  {/* Jumlah */}
                  <div className="flex-shrink-0 text-left">
                    <span className="text-[0.6rem] lg:text-[0.65rem] text-slate-300 font-bold">({item.value.toLocaleString()})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grafik Tren Sentimen Utama */}
        <GrafikTrenSentimen
          data={dataTren}
          title="Tren Sentimen"
          subtitle="Perkembangan sentimen ulasan dari seluruh produk yang dianalisis"
          className="md:col-span-10"
          rounded="rounded-2xl"
        />
      </div>

      {/* Container Tabel Ringkasan */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Judul */}
        <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Ringkasan Perbandingan Produk</h3>

        {/* Container Isi Tabel Ringkasan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-200">

            {/* Header Tabel */}
            <thead>
              <tr className="text-slate-500 text-sm bg-slate-50/80">
                <th className="py-4 px-4 font-semibold border border-slate-200 sticky left-0 bg-slate-50 z-20">Produk</th>
                <th className="py-4 px-2 font-semibold text-center border border-slate-200">Total Ulasan</th>
                <th className="py-4 px-2 font-semibold text-center border border-slate-200">Positif</th>
                <th className="py-4 px-2 font-semibold text-center border border-slate-200">Netral</th>
                <th className="py-4 px-2 font-semibold text-center border border-slate-200">Negatif</th>
                <th className="py-4 px-4 font-semibold text-center border border-slate-200">Skor Kepuasan</th>
              </tr>
            </thead>

            {/* Isi Tabel Ringkasan Perbandingan Produk */}
            <tbody className="text-sm">
              {itemSaatIni.map((baris, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-all">
                  <td className="py-4 px-4 font-bold text-slate-900 border border-slate-200 sticky left-0 bg-white z-10">{baris.name}</td>
                  <td className="py-4 px-2 text-center font-medium text-slate-500 border border-slate-200">{baris.total}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.pos}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.neu}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.neg}</td>
                  <td className="py-4 px-4 text-center border border-slate-200">
                    <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl font-black text-xs">
                      ⭐ {baris.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination di Bawah Tabel */}
        <PaginationKustom
          halamanSaatIni={halamanSaatIni}
          totalHalaman={totalHalaman}
          setHalamanSaatIni={setHalamanSaatIni}
        />
      </div>
    </div>
  );
}
