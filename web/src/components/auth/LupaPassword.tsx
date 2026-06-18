'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Notifikasi from '../elements/Notifikasi';

const LupaPassword = () => {
  const [email, setEmail] = useState('');
  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'error'>('sukses');
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menangani reset password
  const tanganiReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Gagal memproses permintaan');
      }

      setPesanNotif('Link reset password telah terkirim (jika email terdaftar).');
      setTipeNotif('sukses');
      setShowNotifikasi(true);

      // Redirect ke login setelah
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2500);
    } catch (error) {
      if (error instanceof Error) {
        setPesanNotif(error.message);
      } else {
        setPesanNotif(String(error));
      }
      setTipeNotif('error');
      setShowNotifikasi(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Page Lupa Password
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6 overflow-hidden">

      {/* Komponen Notifikasi */}
      <Notifikasi
        show={showNotifikasi}
        onClose={() => setShowNotifikasi(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />

      {/* Container Kotak Lupa Password */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-6 lg:p-8 border border-slate-200 animate-in fade-in zoom-in duration-500">

        {/* Ikon Kunci */}
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-hero transition-all">
          <svg className="w-15 h-15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Judul & Deskripsi */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-3 uppercase">RESET PASSWORD</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
            Masukan email yang sudah terdaftar dan kami akan kirimkan link untuk mengatur ulang password
          </p>
        </div>

        {/* Formulir Lupa Password */}
        <form onSubmit={tanganiReset} className="space-y-5">
          {/* Input Email */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email Anda"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-hero focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hero text-white py-3.5 rounded-lg font-black text-base hover:bg-navbar transition-all disabled:opacity-50"
          >
            {loading ? 'MENGIRIM...' : 'KIRIM LINK RESET'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LupaPassword;
