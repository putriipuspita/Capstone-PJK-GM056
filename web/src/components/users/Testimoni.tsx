'use client';
import React, { useState } from 'react';
import Notifikasi from '../elements/Notifikasi';

// Komponen Testimoni
const Testimoni = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);

  // State untuk Notifikasi
  const [showNotif, setShowNotif] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'error'>('sukses');

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama || !pesan || rating === 0) {
      setPesanNotif('Harap lengkapi nama, pesan, dan rating bintang.');
      setTipeNotif('error');
      setShowNotif(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nama,
          role: jabatan,
          message: pesan,
          rating: rating
        })
      });

      if (response.ok) {
        setIsOpen(false);
        setNama('');
        setJabatan('');
        setPesan('');
        setRating(0);
        setPesanNotif('Terima kasih, Testimoni telah kami terima.');
        setTipeNotif('sukses');
        setShowNotif(true);
      } else {
        const errorData = await response.json();
        setPesanNotif(errorData.detail || 'Gagal mengirim testimoni.');
        setTipeNotif('error');
        setShowNotif(true);
      }
    } catch (error) {
      setPesanNotif('Terjadi kesalahan jaringan.');
      setTipeNotif('error');
      setShowNotif(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Tombol Testimoni */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: '#fff7D3' }}
        className="fixed bottom-8 right-8 z-[99] text-slate-800 px-5 py-2.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-2.5 border border-orange-200"
      >

        {/* Icon Bintang */}
        <div className="text-yellow-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Teks Label */}
        <span className="font-bold text-[13px] tracking-tight">
          Beri Testimoni
        </span>
      </button>

      {/* Formulir Testimoni */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/40 animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Konten Formulir Testimoni */}
          <div className="relative bg-white p-5 rounded-2xl shadow-2xl max-w-[380px] w-full text-center space-y-2.5 border border-slate-100 animate-in zoom-in duration-300">

            {/* Judul dan Deskripsi Formulir */}
            <div className="text-center space-y-0.5 mb-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Beri Testimoni</h2>
              <p className="text-[11px] text-slate-400 font-medium">Bagikan Pengalaman Setelah Menggunakan Sentix</p>
            </div>

            {/* Formulir Input Testimoni */}
            <form className="space-y-2.5" onSubmit={handleSubmit}>
              {/* Bintang */}
              <div className="flex items-center justify-center py-1.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex gap-1.5 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className={`text-lg transition-all duration-200 transform hover:scale-110 ${(hover || rating) >= star ? 'text-yellow-400' : 'text-slate-200'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Container Input */}
              <div className="space-y-2">
                {/* Input Nama */}
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-slate-700 tracking-tight ml-1">Nama</label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-hero/10 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[12px] placeholder:text-slate-400"
                  />
                </div>

                {/* Input Jabatan */}
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-slate-700 tracking-tight ml-1">Jabatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Owner Toko"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-hero/10 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[12px] placeholder:text-slate-400"
                  />
                </div>

                {/* Input Testimoni */}
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-slate-700 tracking-tight ml-1">Pesan Testimoni</label>
                  <textarea
                    rows={3}
                    placeholder="Apa pendapat kamu tentang layanan kami?"
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-hero/10 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none placeholder:text-[12px] placeholder:text-slate-400"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-100 active:scale-95 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim...' : 'Kirim Testimoni'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifikasi Sukses */}
      <Notifikasi
        show={showNotif}
        onClose={() => setShowNotif(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />
    </>
  );
};

export default Testimoni;
