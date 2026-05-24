'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

// Komponen Untuk Sidebar
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();

  // Menentukan tab aktif berdasarkan path URL
  const currentTab = pathname === '/users' ? 'dashboard' : pathname.split('/').pop() || 'dashboard';

  // Logika untuk menentukan warna dan gaya tombol berdasarkan halaman yang aktif
  const getLinkClass = (tabName: string) => {
    const base = "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium";
    const active = "bg-white/10 text-white shadow-sm";
    const inactive = "text-white/60 hover:bg-white/5 hover:text-white";
    return `${base} ${currentTab === tabName ? active : inactive}`;
  };

  // Container Sidebar
  return (
    <aside className="w-[240px] md:w-[216px] bg-navbar text-white h-screen sticky top-0 flex flex-col border-r border-white/5">
      {/* Container Logo & Tombol Tutup*/}
      <div className="h-[73px] flex items-center justify-between px-6 md:px-[30px] lg:px-[60px] border-b border-white/20 mb-6">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-[-1.5px] text-gradient-logo block">
          SENTIX
        </Link>

        {/* Tombol Tutup Hanya Muncul di iPad/HP */}
        <button
          onClick={onClose}
          className="xl:hidden p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors"
        >

          {/* Icon Tanda Silang */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {/* Dashboard */}
        <Link href="/users" className={getLinkClass('dashboard')}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>

        {/* Upload Ulasan */}
        <Link href="/users/upload" className={getLinkClass('upload')}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Ulasan
        </Link>

        {/* Riwayat Analisis */}
        <Link href="/users/riwayat" className={getLinkClass('riwayat')}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Riwayat Analisis
        </Link>

        {/* Pengaturan */}
        <Link href="/users/settings" className={getLinkClass('settings')}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pengaturan
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 font-medium transition-all text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Link>
      </div>
    </aside>
  );
};

// Komponen Utama
const Sidebar = ({ onClose }: { onClose?: () => void }) => (
  <Suspense fallback={<aside className="w-[216px] bg-navbar h-screen" />}>
    <SidebarContent onClose={onClose} />
  </Suspense>
);

export default Sidebar;
