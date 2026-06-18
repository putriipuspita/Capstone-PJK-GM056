'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Notifikasi from '../elements/Notifikasi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lihatPassword, setLihatPassword] = useState(false);
  
  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'error'>('sukses');
  const [loading, setLoading] = useState(false);

  const tanganiLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Email atau password salah');
      }

      // Simpan token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setPesanNotif('Login berhasil!');
      setTipeNotif('sukses');
      setShowNotifikasi(true);

      setTimeout(() => {
        window.location.href = '/users';
      }, 1500);
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
    // Login Page
    <div className="min-h-screen md:h-screen w-full flex flex-col lg:flex-row bg-white md:overflow-hidden lg:overflow-hidden">

      <Notifikasi
        show={showNotifikasi}
        onClose={() => setShowNotifikasi(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />

      {/* Container Gambar dan Logo */}
      <div className="lg:w-[60%] h-auto md:h-[55vh] lg:h-full flex flex-col bg-white relative pt-8 md:pt-0 lg:pt-0">
        {/* Logo Sentix */}
        <div className="absolute top-4 left-6 z-20">
          <Link href="/" className="text-3xl font-black tracking-[-2px] text-hero inline-block">
            SENTIX
          </Link>
        </div>

        {/* Gambar Ilustrasi */}
        <div className="w-full flex items-center justify-center p-6 md:p-8 lg:p-12 mt-4 md:mt-0 md:h-full">
          <img
            src="/ilustrasi2.png"
            alt="Ilustrasi Sentix"
            className="w-full h-auto max-h-[300px] md:max-h-[420px] lg:max-h-[480px] object-contain animate-in zoom-in duration-1000"
          />
        </div>
      </div>

      {/* Container Formulir Login */}
      <div className="lg:w-[40%] bg-hero p-6 py-10 md:p-10 lg:p-12 h-auto md:h-[45vh] lg:h-full flex flex-col justify-center border-l border-white/5 shadow-[inset_20px_0_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-sm mx-auto w-full px-2">
          {/* Judul & Deskripsi */}
          <div className="mb-8 md:mb-6 lg:mb-10 text-center">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-1 uppercase">LOGIN</h2>
            <p className="text-white/70 text-sm font-medium">Masuk Untuk Mengelola Data Ulasan</p>
          </div>

          {/* Formulir Login */}
          <form onSubmit={tanganiLogin} className="space-y-4 md:space-y-3 lg:space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full bg-white/10 border-2 border-white/40 focus:border-white focus:bg-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-all placeholder:text-white/60 placeholder:font-normal"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white ml-1">Password</label>
              <div className="relative">
                <input
                  type={lihatPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full bg-white/10 border-2 border-white/40 focus:border-white focus:bg-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-all placeholder:text-white/60 placeholder:font-normal"
                />

                {/* Button Lihat Password */}
                <button
                  type="button"
                  onClick={() => setLihatPassword(!lihatPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                >

                  {/* Fungsi Lihat Password */}
                  {lihatPassword ?
                    // Icon Mata Terbuka
                    (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) :

                    // Icon Mata Tertutup
                    (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                </button>
              </div>

              {/* Lupa Password */}
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" title="Lupa?" className="text-[11px] font-bold text-white hover:text-[#FFD6D4] transition-colors">Lupa Password?</Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-hero py-3 rounded-xl font-black text-base shadow-2xl shadow-black/10 hover:bg-slate-50 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? 'MEMPROSES...' : 'MASUK'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-white/90">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-white font-bold hover:text-[#FFD6D4] transition-colors">
                Daftar
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
