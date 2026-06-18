'use client';

import React, { useState, useEffect } from 'react';
import ScrollbarKustom from '../elements/ScrollbarKustom';
import Testimoni from './Testimoni';
import StatistikKartu from '../elements/StatistikKartu';
import GrafikTrenSentimen from '../elements/GrafikTrenSentimen';

interface PropertiDashboardProduk {
  namaProduk: string;
  analysisId?: string;
  productId?: string;
}

interface AnalysisResult {
  analysis_id: string;
  product_name: string;
  file_name: string;
  total_reviews: number;
  summary: {
    positif: number;
    netral: number;
    negatif: number;
    positif_percentage: number;
    netral_percentage: number;
    negatif_percentage: number;
    satisfaction_score: number;
  };
  trends: {
    name: string;
    positif: number;
    netral: number;
    negatif: number;
  }[];
  complaints: {
    label: string;
    jumlah: number;
    persen: number;
  }[];
  strengths: string[];
  recommendations: {
    judul: string;
    deskripsi: string;
  }[];
}

const DashboardProduk: React.FC<PropertiDashboardProduk> = ({ namaProduk, analysisId, productId }) => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId && !productId) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/analysis/${analysisId}`;
        if (productId && !analysisId) {
          url = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/dashboard`;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          window.location.href = '/auth/login';
          return;
        }

        if (res.ok) {
          const resultData = await res.json();
          setData(resultData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [analysisId, productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-hero animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat analisis produk...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <svg className="w-20 h-20 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Data Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 font-medium">Analisis tidak dapat ditemukan atau belum selesai.</p>
        <button onClick={() => window.location.href = '/users/riwayat'} className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all hover:shadow-xl">
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  // Data statistik dari summary
  const dataStatistik = [
    {
      label: 'Total Ulasan', value: data.total_reviews.toLocaleString(), color: 'bg-blue-50', iconColor: 'text-blue-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      label: 'Positif', value: `${data.summary.positif_percentage}%`, color: 'bg-green-50', iconColor: 'text-green-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: 'Netral', value: `${data.summary.netral_percentage}%`, color: 'bg-orange-50', iconColor: 'text-orange-500',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 10v1M15 10v1M9 15h6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: 'Negatif', value: `${data.summary.negatif_percentage}%`, color: 'bg-red-50', iconColor: 'text-red-500',
      icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  // Data Keluhan Utama
  const dataKeluhan = data.complaints || [];

  // Data Kelebihan Produk
  const dataKelebihan = data.strengths || [];

  // Data Tren
  const dataTren = data.trends || [];

  // Data Rekomendasi
  const dataRekomendasi = (data.recommendations || []).map((rec, i) => {
    const colors = [
      { warna: 'bg-red-50', aksen: 'text-red-600' },
      { warna: 'bg-amber-50', aksen: 'text-amber-600' },
      { warna: 'bg-green-50', aksen: 'text-green-600' },
      { warna: 'bg-blue-50', aksen: 'text-blue-600' },
      { warna: 'bg-purple-50', aksen: 'text-purple-600' },
    ];
    return {
      judul: rec.judul,
      deskripsi: rec.deskripsi,
      ...colors[i % colors.length]
    };
  });

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
          Hasil Analisis Produk {data.product_name}
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
            <p className="text-xs text-slate-400 font-medium mt-1">Berdasarkan frekuensi sentimen negatif</p>
          </div>

          {/* Container Isi Keluhan */}
          <div className="space-y-4 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {dataKeluhan.length > 0 ? dataKeluhan.map((item, i) => (
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
            )) : (
              <p className="text-sm text-slate-400">Belum ada keluhan yang tercatat.</p>
            )}
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
            {dataKelebihan.length > 0 ? dataKelebihan.map((poin, i) => (
              <div key={i} className="flex items-start gap-4 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2.5"></div>
                <p className="flex-1 text-sm text-slate-600 font-medium leading-loose">{poin}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-400">Belum ada kelebihan yang tercatat.</p>
            )}
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
          {dataRekomendasi.length > 0 ? dataRekomendasi.map((item, i) => (
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
          )) : (
            <p className="text-sm text-slate-400">Belum ada rekomendasi yang tersedia.</p>
          )}
        </div>
      </div>

      {/* Tombol Feedback Melayang */}
      <Testimoni />
    </div>
  );
};

export default DashboardProduk;
