'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaginationKustom from '../elements/PaginationKustom';
import Konfirmasi from '../elements/Konfirmasi';
import Notifikasi from '../elements/Notifikasi';

// Data Dummy dari Database
const dataRiwayatMentah = [
  { id: 1, nama: 'Laptop Gaming X', tanggal: '11 Mei 2026', ulasan: 1250, skor: 78, status: 'Baik' },
  { id: 2, nama: 'Mouse Wireless Pro', tanggal: '10 Mei 2026', ulasan: 840, skor: 65, status: 'Cukup' },
  { id: 3, nama: 'Keyboard Mechanical', tanggal: '08 Mei 2026', ulasan: 2100, skor: 92, status: 'Sangat Baik' },
  { id: 4, nama: 'Monitor 4K Ultra', tanggal: '05 Mei 2026', ulasan: 450, skor: 45, status: 'Buruk' },
  { id: 5, nama: 'Headset RGB Pro', tanggal: '01 Mei 2026', ulasan: 1800, skor: 85, status: 'Baik' },
];

export default function Riwayat() {
  const router = useRouter();
  const paramPencarian = useSearchParams();
  const filterProdukUrl = paramPencarian.get('p') || 'semua';

  const [katakunci, setKatakunci] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);

  // State untuk Modal Konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemTerpilih, setItemTerpilih] = useState<{ id: number, nama: string } | null>(null);

  // State untuk Notifikasi (Pop Up)
  const [showNotif, setShowNotif] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');

  // Logika Filter Pencarian & Status
  const dataTampil = dataRiwayatMentah.filter(item => {
    const cocokKataKunci = item.nama.toLowerCase().includes(katakunci.toLowerCase());
    const cocokStatus = filterStatus === 'semua' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const cocokProdukNavbar = filterProdukUrl === 'semua' || item.nama === filterProdukUrl;

    return cocokKataKunci && cocokStatus && cocokProdukNavbar;
  });

  const totalHalaman = Math.ceil(dataTampil.length / 5);

  // Fungsi Aksi Lihat Analisis
  const tanganiLihat = (namaProduk: string) => {
    router.push(`/users/dashboard-produk?p=${encodeURIComponent(namaProduk)}`);
  };

  // Fungsi Aksi Hapus
  const bukaModalHapus = (id: number, nama: string) => {
    setItemTerpilih({ id, nama });
    setIsModalOpen(true);
  };

  // Fungsi Menampilkan Konfirmasi Hapus
  const konfirmasiHapus = () => {
    const namaHapus = itemTerpilih?.nama;
    setIsModalOpen(false);
    setItemTerpilih(null);
    setPesanNotif(`Riwayat "${namaHapus}" berhasil dihapus`);
    setShowNotif(true);
  };

  // Tampilan Jika Data Riwayat Kosong Total
  if (dataRiwayatMentah.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-700">
        {/* Container Icon */}
        <div className="w-40 h-40 mb-6 relative">
          <div className="absolute inset-0 bg-hero/5 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-hero/10 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-20 h-20 text-hero opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
          Belum Ada Riwayat Analisis
        </h2>

        {/* Deskripsi */}
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed font-medium text-sm">
          Kamu belum pernah melakukan analisis produk apa pun. Mulai unggah data ulasan sekarang untuk melihat riwayatnya di sini.
        </p>

        {/* Tombol Mulai Analisis */}
        <button
          onClick={() => router.push('/users/upload')}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all hover:shadow-xl hover:shadow-hero/20 active:scale-95"
        >
          Mulai Analisis
        </button>
      </div>
    );
  }

  return (
    // Halaman Riwayat
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        {/* Container Search dan Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari nama dataset atau produk..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              value={katakunci}
              onChange={(e) => setKatakunci(e.target.value)}
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 hidden md:block">Filter Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1.5 pl-3 pr-8 appearance-none outline-none cursor-pointer"
            >
              <option value="semua">Semua Status</option>
              <option value="sangat baik">Sangat Baik</option>
              <option value="baik">Baik</option>
              <option value="cukup">Cukup</option>
              <option value="buruk">Buruk</option>
            </select>
          </div>
        </div>

        {/* Container Tabel */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">

            {/* Header Tabel */}
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-bold">
                <th className="py-4 px-6 whitespace-nowrap sticky left-0 bg-slate-50 z-20 border-r border-slate-200">Nama Produk</th>
                <th className="py-4 px-6 whitespace-nowrap">Tanggal Analisis</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Total Ulasan</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Skor</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>

            {/* Isi Tabel */}
            <tbody>
              {dataTampil.map((baris) => {
                // Pengaturan Warna Teks
                let warnaTeks = 'text-slate-600';
                if (baris.status.includes('Baik')) warnaTeks = 'text-green-600';
                if (baris.status === 'Cukup') warnaTeks = 'text-orange-600';
                if (baris.status === 'Buruk') warnaTeks = 'text-red-600';

                // Isi Tabel
                return (
                  <tr key={baris.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-0">
                    <td className="py-4 px-6 text-[13px] text-slate-600 font-medium leading-loose sticky left-0 bg-white z-10 border-r border-slate-100">{baris.nama}</td>
                    <td className="py-4 px-6 text-[13px] text-slate-600 font-medium leading-loose">{baris.tanggal}</td>
                    <td className="py-4 px-6 text-center text-[13px] text-slate-600 font-medium leading-loose">{baris.ulasan.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-[13px] text-slate-600 font-medium leading-loose">{baris.skor}/100</td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <span className={`font-bold text-[11px] ${warnaTeks}`}>
                        {baris.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        {/* Lihat Dashboard Produk */}
                        <div className="relative group/tooltip">
                          {/* Tombol Lihat Dashboard Produk */}
                          <button
                            onClick={() => tanganiLihat(baris.nama)}
                            className="p-2.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-xl transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl">
                            Lihat Analisis
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                          </div>
                        </div>

                        {/* Hapus */}
                        <div className="relative group/tooltip">
                          {/* Tombol Hapus */}
                          <button
                            onClick={() => bukaModalHapus(baris.id, baris.nama)}
                            className="p-2.5 text-red-500 bg-red-50 border border-red-100 rounded-xl transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100 active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl">
                            Hapus Data
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pesan Jika Tidak Ada Data Untuk Search dan Filter */}
          {dataTampil.length === 0 && dataRiwayatMentah.length > 0 && (
            <div className="py-10 text-center bg-slate-50/50">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-slate-500 font-bold text-sm">Data tidak ditemukan</p>
            </div>
          )}
        </div>

        {/* Tombol Halaman Sebelumnya dan Selanjutnya */}
        <PaginationKustom
          halamanSaatIni={halamanSaatIni}
          totalHalaman={totalHalaman}
          setHalamanSaatIni={setHalamanSaatIni}
          totalItem={dataTampil.length}
        />
      </div>

      {/* Konfirmasi Hapus */}
      <Konfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={konfirmasiHapus}
        judul="Hapus Riwayat Analisis?"
        pesan={`Apakah Anda yakin ingin menghapus riwayat analisis untuk "${itemTerpilih?.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
      />

      {/* Menampilkan Notifikasi */}
      <Notifikasi
        show={showNotif}
        onClose={() => setShowNotif(false)}
        pesan={pesanNotif}
        tipe="sukses"
      />
    </div>
  );
}
