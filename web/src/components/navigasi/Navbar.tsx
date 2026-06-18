'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const KontenNavbar = (props: { onToggleSidebar?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const paramPencarian = useSearchParams();

  // Deteksi tampilan berdasarkan pathname
  const tampilan = pathname === '/users' ? 'dashboard' : pathname.split('/').pop() || 'dashboard';
  const produkTerpilih = paramPencarian.get('p') || 'semua';

  // State untuk daftar produk
  const [daftarProduk, setDaftarProduk] = useState<{ id: string, name: string }[]>([]);

  // Fetch daftar produk dari API
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDaftarProduk(data);
        }
      } catch (err) {
        console.error('Gagal mengambil daftar produk:', err);
      }
    };
    fetchProduk();
  }, []);

  // Fungsi saat dropdown filter berubah
  const gantiProduk = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    // Jika sedang di halaman riwayat, hanya menampilkan filter tabel riwayat
    if (tampilan === 'riwayat') {
      if (value === 'semua') {
        router.push(`/users/riwayat`);
      } else {
        const [id, ...nameParts] = value.split(':');
        const name = nameParts.join(':');
        router.push(`/users/riwayat?p=${encodeURIComponent(name)}`);
      }
    } else {
      // Jika di dashboard, pindah ke dashboard-produk
      if (value === 'semua') {
        router.push('/users');
      } else {
        const [id, ...nameParts] = value.split(':');
        const name = nameParts.join(':');
        router.push(`/users/dashboard-produk?product_id=${id}&p=${encodeURIComponent(name)}`);
      }
    }
  };

  // Pemetaan Judul dan Deskripsi Halaman
  const infoHalaman = {
    dashboard: {
      judul: 'Dashboard',
      deskripsi: 'Rangkuman Hasil Analisis Sentimen Ulasan Produk'
    },
    upload: {
      judul: 'Upload Ulasan',
      deskripsi: 'Unggah Dataset Ulasan Produk Untuk Dianalisis'
    },
    riwayat: {
      judul: 'Riwayat Analisis',
      deskripsi: 'Daftar Riwayat Analisis Yang Telah Dilakukan'
    },
    'dashboard-produk': {
      judul: 'Dashboard Produk',
      deskripsi: 'Insight dan Rekomendasi Perbaikan Produk Berbasis Analisis AI'
    },
    settings: {
      judul: 'Pengaturan',
      deskripsi: 'Kelola Profil Dan Preferensi Akun'
    }
  };

  // Menampilkan Judul dan Deskripsi Sesuai Halaman
  const saatIni = infoHalaman[tampilan as keyof typeof infoHalaman] || infoHalaman.dashboard;

  // Menampilkan Filter Produk Sesuai Halaman
  const adaFilter = tampilan === 'dashboard' || tampilan === 'riwayat' || tampilan === 'dashboard-produk';

  return (
    // Header Navbar
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 px-4 md:px-8 sticky top-0 z-50 flex items-center justify-between">

      {/* Container Nama Halaman, Deksripsi dan Hamburger Menu */}
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger - Muncul di iPad & HP */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onToggleSidebar?.();
          }}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          aria-label="Menu"
        >

          {/* Ikon Hamburger Menu */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Nama Halaman dan Deksripsi */}
        <div>
          <h2 className="font-black text-xl md:text-2xl text-hero leading-tight">{saatIni.judul}</h2>
          <p className="hidden md:block text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1">{saatIni.deskripsi}</p>
        </div>
      </div>

      {/* Container Filter dan Foto Profil */}
      <div className="flex items-center gap-6">
        {/* Filter  */}
        {(tampilan === 'dashboard' || tampilan === 'riwayat' || tampilan === 'dashboard-produk') && (
          <select
            value={produkTerpilih === 'semua' ? 'semua' : daftarProduk.find(p => p.name === produkTerpilih) ? `${daftarProduk.find(p => p.name === produkTerpilih)?.id}:${produkTerpilih}` : 'semua'}
            onChange={gantiProduk}
            className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] md:text-xs font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 md:w-auto py-1 md:py-1.5 pl-2 md:pl-3 pr-8 md:pr-10 appearance-none outline-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:10px] md:bg-[length:14px] bg-[right_0.5rem_center] md:bg-[right_0.75rem_center] bg-no-repeat transition-all hover:bg-slate-100"
          >
            <option value="semua">Semua Produk</option>
            {daftarProduk.map((produk) => (
              <option key={produk.id} value={`${produk.id}:${produk.name}`}>
                {produk.name}
              </option>
            ))}
          </select>
        )}

        {/* Container Foto Profil dan Nama Toko */}
        <div className="flex items-center gap-3">
          {/* Nama Toko */}
          <div className="hidden md:flex bg-hero px-3 py-1.5 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-white capitalize tracking-wide">Sentix shop</p>
          </div>

          {/* Foto Profil */}
          <div className={`${adaFilter ? 'hidden md:flex' : 'flex'} w-9 h-9 rounded-full bg-hero/10 items-center justify-center border border-hero/20`}>
            <svg className="w-5 h-5 text-hero" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

      </div>
    </header>
  );
};


// Komponen Pembungkus (Wrapper) untuk Suspense
const Navbar = (props: { onToggleSidebar?: () => void }) => (
  <Suspense fallback={<div className="bg-white border-b border-gray-100 py-4 px-8" />}>
    <KontenNavbar {...props} />
  </Suspense>
);

export default Navbar;
