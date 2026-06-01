'use client';

import React, { useState } from 'react';
import Notifikasi from '../elements/Notifikasi';

const ResetPassword = () => {
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [lihatPassword, setLihatPassword] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);

  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'error'>('sukses');

  // Fungsi menangani ubah password
  const tanganiSimpan = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordBaru !== konfirmasiPassword) {
      setPesanNotif('Konfirmasi password tidak cocok.');
      setTipeNotif('error');
      setShowNotifikasi(true);
      return;
    }

    // Validasi panjang password
    if (passwordBaru.length < 6) {
      setPesanNotif('Password minimal 6 karakter.');
      setTipeNotif('error');
      setShowNotifikasi(true);
      return;
    }

    // Jika validasi sukses
    setPesanNotif('Password berhasil diubah.');
    setTipeNotif('sukses');
    setShowNotifikasi(true);

    // Redirect ke login
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 2500);
  };

  return (
    // Page Reset Password
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6 overflow-hidden">

      {/* Notifikasi */}
      <Notifikasi
        show={showNotifikasi}
        onClose={() => setShowNotifikasi(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />

      {/* Container Kotak Reset Password */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-6 lg:p-8 border border-slate-200 animate-in fade-in zoom-in duration-500">

        {/* Judul */}
        <div className="text-center mb-6">
          <h2 className="text-[22px] font-black text-slate-800 tracking-tight mb-2 uppercase">BUAT PASSWORD BARU</h2>
        </div>

        {/* Formulir Reset Password */}
        <form onSubmit={tanganiSimpan} className="space-y-4">

          {/* Password Baru */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password Baru</label>
            <div className="relative">
              <input
                type={lihatPassword ? "text" : "password"}
                required
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                placeholder="Masukkan Password Baru"
                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-hero focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal pr-12"
              />

              {/* Button Lihat Password */}
              <button
                type="button"
                onClick={() => setLihatPassword(!lihatPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hero transition-colors"
              >

                {/* Tampilkan Icon Sesuai Kondisi Password */}
                {lihatPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={lihatKonfirmasi ? "text" : "password"}
                required
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi Password Baru"
                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-hero focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal pr-12"
              />

              {/* Button Lihat Password */}
              <button
                type="button"
                onClick={() => setLihatKonfirmasi(!lihatKonfirmasi)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hero transition-colors"
              >

                {/* Tampilkan Icon Sesuai Kondisi Password */}
                {lihatKonfirmasi ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-hero text-white py-2.5 rounded-lg font-black text-sm hover:bg-navbar transition-all mt-4 shadow-[0_10px_30px_-10px_rgba(255,107,107,0.5)]"
          >
            SIMPAN PASSWORD
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
