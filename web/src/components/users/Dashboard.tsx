'use client';
import React from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PaginationKustom from '../elements/PaginationKustom';
import StatistikKartu from '../elements/StatistikKartu';
import GrafikTrenSentimen from '../elements/GrafikTrenSentimen';

interface DashboardData {
  summary: {
    total_reviews: number;
    positive: number;
    neutral: number;
    negative: number;
    positive_percentage: number;
    neutral_percentage: number;
    negative_percentage: number;
    satisfaction_score: number;
  };
  trends: {
    period: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
  top_aspects: {
    label: string;
    jumlah: number;
    persen: number;
  }[];
  top_complaints: {
    label: string;
    jumlah: number;
    persen: number;
  }[];
  products: {
    analysis_id: string;
    product_name: string;
    total_reviews: number;
    positive: number;
    neutral: number;
    negative: number;
    satisfaction_score: number;
  }[];
}

export default function Dashboard() {
  const [halamanSaatIni, setHalamanSaatIni] = React.useState(1);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const itemPerHalaman = 5;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store'
        });
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/auth/login';
          return;
        }
        if (!response.ok) {
          throw new Error('Gagal mengambil data dashboard');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-hero animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  // Tampilan Jika Data Kosong
  if (!dashboardData || dashboardData.summary.total_reviews === 0) {
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

  // Pengurutan Positif terbanyak, lalu Rating tertinggi
  const dataTerurut = [...dashboardData.products].sort((a, b) => {
    if (b.positive !== a.positive) return b.positive - a.positive;
    return b.satisfaction_score - a.satisfaction_score;
  });

  // Menghitung Jumlah Halaman & Data Per Halaman Tabel Ringkasan
  const totalHalaman = Math.ceil(dataTerurut.length / itemPerHalaman) || 1;
  const itemSaatIni = dataTerurut.slice((halamanSaatIni - 1) * itemPerHalaman, halamanSaatIni * itemPerHalaman);

  const dataDonat = [
    { name: 'Positif', value: dashboardData.summary.positive, color: '#10b981' },
    { name: 'Netral', value: dashboardData.summary.neutral, color: '#f59e0b' },
    { name: 'Negatif', value: dashboardData.summary.negative, color: '#ef4444' },
  ];

  const dataTren = dashboardData.trends.map(t => ({
    name: t.period,
    positif: t.positive,
    netral: t.neutral,
    negatif: t.negative
  }));

  const dataTopAspek = dashboardData.top_aspects;
  const dataKeluhanUtama = dashboardData.top_complaints;

  // Data Statistik untuk ditampilkan di kartu
  const dataStatistik = [
    {
      label: 'Total Analisis', value: dashboardData.summary.total_reviews.toLocaleString(), color: 'bg-blue-50', iconColor: 'text-blue-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      label: 'Positif', value: `${dashboardData.summary.positive_percentage}%`, color: 'bg-green-50', iconColor: 'text-green-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: 'Netral', value: `${dashboardData.summary.neutral_percentage}%`, color: 'bg-orange-50', iconColor: 'text-orange-500',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 10v1M15 10v1M9 15h6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: 'Negatif', value: `${dashboardData.summary.negative_percentage}%`, color: 'bg-red-50', iconColor: 'text-red-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  // Hitung persentase untuk lingkaran kepuasan
  const kepuasanDashArray = `${dashboardData.summary.satisfaction_score}, 100`;

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
                <path className="text-green-500" strokeWidth="3" strokeDasharray={kepuasanDashArray} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>

              {/* Isi Di Dalam Grafik */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 leading-none">{dashboardData.summary.satisfaction_score}<span className="text-sm font-bold text-slate-400">/100</span></span>
                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Skor</span>
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
            {dataTopAspek.length === 0 && (
              <p className="text-sm text-slate-400">Belum ada data aspek yang dibicarakan.</p>
            )}
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
            {dataKeluhanUtama.length === 0 && (
              <p className="text-sm text-slate-400">Belum ada data keluhan utama.</p>
            )}
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
                <p className="text-xl lg:text-2xl font-black text-slate-800 leading-none">{dashboardData.summary.total_reviews.toLocaleString()}</p>
                <p className="text-[0.55rem] lg:text-[0.6rem] text-gray-400 font-bold capitalize mt-1">Total ulasan</p>
              </div>
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
                    <span className="text-xs lg:text-sm font-medium text-slate-500">
                      {dashboardData.summary.total_reviews > 0 ? ((item.value / dashboardData.summary.total_reviews) * 100).toFixed(1) : 0}%
                    </span>
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
                  <td className="py-4 px-4 font-bold text-slate-900 border border-slate-200 sticky left-0 bg-white z-10">
                    <Link href={`/users/dashboard-produk?id=${baris.analysis_id}&p=${encodeURIComponent(baris.product_name)}`} className="hover:text-hero transition-colors">
                      {baris.product_name}
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center font-medium text-slate-500 border border-slate-200">{baris.total_reviews}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.positive}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.neutral}</td>
                  <td className="py-4 px-2 text-center text-slate-500 font-medium border border-slate-200">{baris.negative}</td>
                  <td className="py-4 px-4 text-center border border-slate-200">
                    <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl font-black text-xs">
                      ⭐ {baris.satisfaction_score}
                    </span>
                  </td>
                </tr>
              ))}
              {itemSaatIni.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 border border-slate-200">Belum ada data produk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination di Bawah Tabel */}
        {totalHalaman > 1 && (
          <PaginationKustom
            halamanSaatIni={halamanSaatIni}
            totalHalaman={totalHalaman}
            setHalamanSaatIni={setHalamanSaatIni}
          />
        )}
      </div>
    </div>
  );
}
