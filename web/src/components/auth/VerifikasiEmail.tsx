'use client';

import React, { useState, useRef, useEffect } from 'react';
import Notifikasi from '../elements/Notifikasi';

const VerifikasiEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sisaWaktu, setSisaWaktu] = useState(59);
  const refInput = useRef<(HTMLInputElement | null)[]>([]);

  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'error'>('sukses');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Ambil email dari session storage saat komponen dimount
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('verify_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Logika Penghitung Waktu
  useEffect(() => {
    const intervalWaktu = setInterval(() => {
      setSisaWaktu((sebelumnya) => (sebelumnya > 0 ? sebelumnya - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalWaktu);
  }, []);

  useEffect(() => {
    if (refInput.current[0]) {
      refInput.current[0].focus();
    }
  }, []);

  // Fungsi untuk menangani input OTP per kotak
  const tanganiInput = (nilai: string, indeks: number) => {
    if (isNaN(Number(nilai))) return;

    const otpBaru = [...otp];
    otpBaru[indeks] = nilai.substring(nilai.length - 1);
    setOtp(otpBaru);

    if (nilai && indeks < 5 && refInput.current[indeks + 1]) {
      refInput.current[indeks + 1]?.focus();
    }
  };

  // Fungsi untuk menangani penghapusan input (Backspace)
  const tanganiBackspace = (e: React.KeyboardEvent<HTMLInputElement>, indeks: number) => {
    if (e.key === 'Backspace' && !otp[indeks] && indeks > 0 && refInput.current[indeks - 1]) {
      refInput.current[indeks - 1]?.focus();
    }
  };

  // Fungsi untuk memvalidasi dan mengirim kode OTP
  const verifikasiKode = async (e: React.FormEvent) => {
    e.preventDefault();
    const kodeLengkap = otp.join('');

    // Jika kode kurang dari 6 digit
    if (kodeLengkap.length < 6) {
      setPesanNotif('Masukkan 6 digit kode OTP secara lengkap.');
      setTipeNotif('error');
      setShowNotifikasi(true);
      return;
    }

    if (!email) {
      setPesanNotif('Email tidak ditemukan, silakan register ulang.');
      setTipeNotif('error');
      setShowNotifikasi(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: kodeLengkap,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Kode OTP tidak valid atau kadaluarsa');
      }

      // Jika berhasil verifikasi
      setPesanNotif('Verifikasi berhasil silahkan login.');
      setTipeNotif('sukses');
      setShowNotifikasi(true);

      // Redirect ke login
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

  const kirimUlang = async () => {
    if (!email) {
      setPesanNotif('Email tidak ditemukan, silakan register ulang.');
      setTipeNotif('error');
      setShowNotifikasi(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Terjadi kesalahan saat mengirim ulang OTP');
      }

      setPesanNotif('Kode OTP baru telah dikirim ke email Anda.');
      setTipeNotif('sukses');
      setShowNotifikasi(true);
      setSisaWaktu(59);
    } catch (error) {
      if (error instanceof Error) {
        setPesanNotif(error.message);
      } else {
        setPesanNotif(String(error));
      }
      setTipeNotif('error');
      setShowNotifikasi(true);
    }
  };

  return (
    // Page Verifikasi Email
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6 overflow-hidden">

      {/* Notifikasi */}
      <Notifikasi
        show={showNotifikasi}
        onClose={() => setShowNotifikasi(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />

      {/* Container Kotak Verifikasi Email*/}
      <div className="w-full max-w-[350px] bg-white rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-6 lg:p-8 border border-slate-200 text-center animate-in fade-in zoom-in duration-500">

        {/* Gambar Email */}
        <div className="mb-4">
          <img
            src="/email.png"
            alt="Verifikasi Email"
            className="w-24 h-24 mx-auto object-contain"
          />
        </div>

        {/* Judul */}
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2 uppercase">VERIFIKASI EMAIL</h2>

        {/* Deskripsi */}
        <p className="text-slate-500 font-medium text-xs leading-relaxed mb-8 px-1">
          Kami telah mengirimkan 6 digit kode OTP ke <span className="text-slate-800 font-bold">{email || 'email Anda'}</span>. Silakan masukkan kode di bawah ini.
        </p>

        {/* Formulir Verifikasi Email */}
        <form onSubmit={verifikasiKode} className="space-y-8">
          {/* Container Input OTP */}
          <div className="flex justify-center gap-2">
            {otp.map((angka, indeks) => (
              <input
                key={indeks}
                type="text"
                maxLength={1}
                value={angka}
                ref={(el) => { refInput.current[indeks] = el; }}
                onChange={(e) => tanganiInput(e.target.value, indeks)}
                onKeyDown={(e) => tanganiBackspace(e, indeks)}
                className="w-10 h-12 text-xl font-black text-hero bg-slate-50 border-2 border-slate-100 focus:border-hero focus:bg-white rounded-lg text-center outline-none transition-all"
              />
            ))}
          </div>

          {/* Container Button dan Deskripsi Kirim Ulang */}
          <div className="space-y-4">
            {/* Button Verifikasi */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hero text-white py-2.5 rounded-lg font-black text-sm hover:bg-navbar transition-all disabled:opacity-50"
            >
              {loading ? 'MEMVERIFIKASI...' : 'VERIFIKASI SEKARANG'}
            </button>

            {/* Deskripsi Kirim Ulang */}
            <p className="text-xs font-medium text-slate-500">
              Tidak menerima kode?{' '}
              {sisaWaktu > 0 ? (
                <span className="text-slate-400 font-bold">Kirim ulang dalam {sisaWaktu}s</span>
              ) : (
                <button type="button" onClick={kirimUlang} className="text-hero font-bold hover:opacity-80 transition-opacity focus:outline-none">
                  Kirim Ulang
                </button>
              )}
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};

export default VerifikasiEmail;
