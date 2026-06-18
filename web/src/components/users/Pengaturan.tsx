'use client';

import React, { useState, useRef } from 'react';
import Konfirmasi from '../elements/Konfirmasi';
import Notifikasi from '../elements/Notifikasi';


const Pengaturan = () => {
  const [isEditingProfil, setIsEditingProfil] = useState(false);
  const [isEditingKeamanan, setIsEditingKeamanan] = useState(false);
  const [isModalDataOpen, setIsModalDataOpen] = useState(false);
  const [isModalAkunOpen, setIsModalAkunOpen] = useState(false);

  // State untuk Toggle Password
  const [lihatPasswordLama, setLihatPasswordLama] = useState(false);
  const [lihatPasswordBaru, setLihatPasswordBaru] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);

  // State untuk Notifikasi
  const [showNotif, setShowNotif] = useState(false);
  const [pesanNotif, setPesanNotif] = useState('');
  const [tipeNotif, setTipeNotif] = useState<'sukses' | 'info' | 'error'>('sukses');

  // State Data
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    store_name: '',
    email: '',
    profile_image_url: ''
  });
  const [editStoreName, setEditStoreName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil Data Profil
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            store_name: data.store_name,
            email: data.email,
            profile_image_url: data.profile_image_url || ''
          });
          setEditStoreName(data.store_name);
          setEditEmail(data.email);
        } else if (res.status === 401) {
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fungsi klik input file
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, profile_image_url: data.message }));
        triggerNotif('Foto profil berhasil diperbarui', 'sukses');
      } else {
        triggerNotif('Gagal mengunggah foto profil', 'error');
      }
    } catch (error) {
      triggerNotif('Terjadi kesalahan saat mengunggah foto', 'error');
    }
  };

  // Fungsi Pemicu Notifikasi
  const triggerNotif = (pesan: string, tipe: 'sukses' | 'info' | 'error' = 'sukses') => {
    setPesanNotif(pesan);
    setTipeNotif(tipe);
    setShowNotif(true);
  };

  // Fungsi simpan profil
  const handleSimpanProfil = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ store_name: editStoreName, email: editEmail })
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...profile,
          store_name: data.store_name,
          email: data.email
        });
        setIsEditingProfil(false);
        triggerNotif('Profil toko berhasil diperbarui', 'sukses');
      } else {
        triggerNotif('Gagal memperbarui profil', 'error');
      }
    } catch (error) {
      triggerNotif('Terjadi kesalahan jaringan', 'error');
    }
  };

  // Fungsi simpan password
  const handleSimpanKeamanan = async () => {
    if (passwordBaru !== konfirmasiPassword) {
      triggerNotif('Konfirmasi password tidak cocok', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: passwordLama, new_password: passwordBaru })
      });

      if (res.ok) {
        setPasswordLama('');
        setPasswordBaru('');
        setKonfirmasiPassword('');
        setIsEditingKeamanan(false);
        triggerNotif('Password berhasil diubah', 'sukses');
      } else {
        triggerNotif('Gagal mengubah password. Pastikan password lama benar.', 'error');
      }
    } catch (error) {
      triggerNotif('Terjadi kesalahan jaringan', 'error');
    }
  };

  // Fungsi hapus data
  const handleBersihkanData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/data`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsModalDataOpen(false);
        triggerNotif('Seluruh data riwayat berhasil dibersihkan', 'info');
      } else {
        triggerNotif('Gagal membersihkan data', 'error');
      }
    } catch (error) {
      triggerNotif('Terjadi kesalahan', 'error');
    }
  };

  // Fungsi hapus akun
  const handleHapusAkun = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsModalAkunOpen(false);
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      } else {
        triggerNotif('Gagal menghapus akun', 'error');
      }
    } catch (error) {
      triggerNotif('Terjadi kesalahan', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-hero animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    // Halaman Pengaturan
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">

      {/* Container Profil dan Keamanan*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Container Profil Toko */}
        <div className={`bg-white rounded-3xl border shadow-sm p-8 flex flex-col transition-all duration-300 ${isEditingProfil ? 'border-hero ring-4 ring-hero/5' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Profil Toko</h2>

            {/* Fungsi Ketika Mode Edit */}
            {!isEditingProfil ?
              // Button edit
              (
                <button
                  onClick={() => setIsEditingProfil(true)}
                  className="bg-slate-900 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-black transition-all active:scale-95"
                >
                  Edit Profil
                </button>
              ) :

              // Container Tombol Batal dan Simpan
              (
                <div className="flex gap-2">
                  {/* Tombol Batal */}
                  <button
                    onClick={() => setIsEditingProfil(false)}
                    className="px-3 md:px-5 py-2 md:py-2.5 bg-slate-100 text-slate-500 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>

                  {/* Tombol Simpan */}
                  <button
                    onClick={handleSimpanProfil}
                    className="px-3 md:px-5 py-2 md:py-2.5 bg-hero text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-red-700 transition-all"
                  >
                    Simpan
                  </button>
                </div>
              )}
          </div>

          {/* Container Isi Profil */}
          <div className="flex-1 space-y-8">
            {/* Container Poto Profile dan Nama Toko */}
            <div className="flex items-center gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">

              {/* Container Poto Profile */}
              <div className="relative group">
                {/* Icon Profil */}
                <div className="w-16 h-16 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden text-slate-300">
                  {profile.profile_image_url ? (
                    <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                {/* Mode Edit Poto Profile */}
                {isEditingProfil && (
                  <button
                    onClick={handleUploadClick}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all animate-in fade-in"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              {/* Container Nama & Toko */}
              <div className="space-y-0.5">
                <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight">{profile.store_name}</h3>
                <p className="text-slate-500 text-sm font-medium">{profile.email}</p>
              </div>
            </div>

            {/* Container Formulir Profile*/}
            <div className="space-y-6">
              {/* Input Nama Toko */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold ml-1 text-slate-700 transition-colors">Nama Toko</label>
                <input
                  type="text"
                  disabled={!isEditingProfil}
                  value={isEditingProfil ? editStoreName : profile.store_name}
                  onChange={(e) => setEditStoreName(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none transition-all ${isEditingProfil ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-50/50 border-transparent text-slate-500'}`}
                />
              </div>

              {/* Input Email Toko */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold ml-1 text-slate-700 transition-colors">Email Toko</label>
                <input
                  type="email"
                  disabled={!isEditingProfil}
                  value={isEditingProfil ? editEmail : profile.email}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none transition-all ${isEditingProfil ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-50/50 border-transparent text-slate-500'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Container Keamanan */}
        <div className={`bg-white rounded-3xl border shadow-sm p-8 flex flex-col transition-all duration-300 ${isEditingKeamanan ? 'border-hero ring-4 ring-hero/5' : 'border-slate-100'}`}>
          {/* Container Judul dan Tombol Edit */}
          <div className="flex items-center justify-between mb-6">
            {/* Judul */}
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Keamanan</h2>

            {/* Fungsi Ketika Mode */}
            {!isEditingKeamanan ?
              // Tombol Edit
              (
                <button
                  onClick={() => setIsEditingKeamanan(true)}
                  className="bg-slate-900 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-black transition-all active:scale-95"
                >
                  Ubah Password
                </button>
              ) :

              // Container Tombol Batal & Simpan
              (
                <div className="flex gap-2">
                  {/* Tombol Batal */}
                  <button
                    onClick={() => setIsEditingKeamanan(false)}
                    className="px-3 md:px-5 py-2 md:py-2.5 bg-slate-100 text-slate-500 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>

                  {/* Tombol Simpan */}
                  <button
                    onClick={handleSimpanKeamanan}
                    className="px-3 md:px-5 py-2 md:py-2.5 bg-hero text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-red-700 transition-all"
                  >
                    Simpan
                  </button>
                </div>
              )}
          </div>

          {/* Container Formulir */}
          <div className="flex-1 flex flex-col justify-center space-y-7">
            {/* Input Password Saat Ini */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1 text-slate-700 transition-colors">Password Saat Ini</label>
              <div className="relative">
                <input
                  type={lihatPasswordLama ? "text" : "password"}
                  disabled={!isEditingKeamanan}
                  placeholder="Masukkan password saat ini"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 placeholder:font-normal ${isEditingKeamanan ? 'bg-white border-slate-200 text-slate-800 font-semibold' : 'bg-slate-50/50 border-transparent text-slate-500 font-semibold'}`}
                />
                {isEditingKeamanan && (
                  <button
                    type="button"
                    onClick={() => setLihatPasswordLama(!lihatPasswordLama)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hero transition-colors"
                  >
                    {lihatPasswordLama ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Input Password Baru */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1 text-slate-700 transition-colors">Password Baru</label>
              <div className="relative">
                <input
                  type={lihatPasswordBaru ? "text" : "password"}
                  disabled={!isEditingKeamanan}
                  placeholder="Minimal 8 karakter"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 placeholder:font-normal ${isEditingKeamanan ? 'bg-white border-slate-200 text-slate-800 font-semibold' : 'bg-slate-50/50 border-transparent text-slate-500 font-semibold'}`}
                />
                {isEditingKeamanan && (
                  <button
                    type="button"
                    onClick={() => setLihatPasswordBaru(!lihatPasswordBaru)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hero transition-colors"
                  >
                    {lihatPasswordBaru ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Input Konfirmasi Password Baru */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1 text-slate-700 transition-colors">Konfirmasi Password Baru</label>
              <div className="relative">
                <input
                  type={lihatKonfirmasi ? "text" : "password"}
                  disabled={!isEditingKeamanan}
                  placeholder="Ulangi password baru"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-2.5 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 placeholder:font-normal ${isEditingKeamanan ? 'bg-white border-slate-200 text-slate-800 font-semibold' : 'bg-slate-50/50 border-transparent text-slate-500 font-semibold'}`}
                />
                {isEditingKeamanan && (
                  <button
                    type="button"
                    onClick={() => setLihatKonfirmasi(!lihatKonfirmasi)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hero transition-colors"
                  >

                    {/* Icon Mata untuk Toggle Password */}
                    {lihatKonfirmasi ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Container Kelola Data*/}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        {/* Judul */}
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Kelola Data</h2>

        {/* Container Isi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hapus Data */}
          <div className="p-7 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col justify-between">
            {/* Judul dan Deksripsi Hapus Data */}
            <div className="mb-6">
              <h4 className="font-bold text-orange-900 mb-1.5">Hapus Data</h4>
              <p className="text-[11px] text-orange-800/70 font-semibold leading-relaxed max-w-[90%]">
                Seluruh data hasil analisis, riwayat, dan file yang diunggah akan dihapus secara permanen dari sistem.
              </p>
            </div>

            {/* Tombol Hapus Data */}
            <button
              onClick={() => setIsModalDataOpen(true)}
              className="w-fit px-4 md:px-6 py-2 md:py-2.5 bg-orange-200 text-orange-900 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-orange-300 transition-all"
            >
              Bersihkan Data
            </button>
          </div>

          {/* Hapus Akun */}
          <div className="p-7 rounded-2xl bg-red-50 border border-red-100 flex flex-col justify-between">

            {/* Judul dan Deksripsi Hapus Akun */}
            <div className="mb-6">
              <h4 className="font-bold text-red-900 mb-1.5">Hapus Akun</h4>
              <p className="text-[11px] text-red-900/70 font-semibold leading-relaxed max-w-[90%]">
                Akun beserta seluruh data terkait akan dihapus secara permanen dan tidak dapat dipulihkan kembali.
              </p>
            </div>

            {/* Tombol Hapus Akun */}
            <button
              onClick={() => setIsModalAkunOpen(true)}
              className="w-fit px-4 md:px-6 py-2 md:py-2.5 bg-red-200 text-red-900 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black hover:bg-red-300 transition-all"
            >
              Hapus Akun Permanen
            </button>
          </div>
        </div>
      </div>

      {/* Konfirmasi Hapus Data */}
      <Konfirmasi
        isOpen={isModalDataOpen}
        onClose={() => setIsModalDataOpen(false)}
        onConfirm={handleBersihkanData}
        judul="Bersihkan Data?"
        pesan="Seluruh data hasil analisis, riwayat, dan file yang diunggah akan dihapus secara permanen dari sistem."
      />

      {/* Konfirmasi Hapus Akun */}
      <Konfirmasi
        isOpen={isModalAkunOpen}
        onClose={() => setIsModalAkunOpen(false)}
        onConfirm={handleHapusAkun}
        judul="Hapus Akun Permanen?"
        pesan="Akun beserta seluruh data terkait akan dihapus secara permanen dan tidak dapat dipulihkan kembali."
      />

      {/* Notifikasi */}
      <Notifikasi
        show={showNotif}
        onClose={() => setShowNotif(false)}
        pesan={pesanNotif}
        tipe={tipeNotif}
      />

    </div>
  );
};

export default Pengaturan;
