'use client';

import Link from 'next/link';
import { useState } from 'react';

const NavigasiLanding = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Navbar
    <nav className="relative sticky top-0 z-[1000] bg-navbar text-white border-b border-white/10 px-[5%]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between py-1.5 md:py-3 w-full">

        {/* Logo */}
        <div className="flex-1 flex justify-start z-[110]">
          <div className="text-2xl font-black tracking-[-1.5px] text-gradient-logo">
            Sentix
          </div>
        </div>

        {/* Menu Desktop (iPad/Laptop) */}
        <div className="hidden md:flex flex-none justify-center gap-6 lg:gap-10">
          <Link href="#beranda" className="font-medium text-white/95 hover:text-white transition-all text-[0.85rem] lg:text-[0.9rem]">Home</Link>
          <Link href="#fitur" className="font-medium text-white/95 hover:text-white transition-all text-[0.85rem] lg:text-[0.9rem]">Fitur</Link>
          <Link href="#cara-kerja" className="font-medium text-white/95 hover:text-white transition-all text-[0.85rem] lg:text-[0.9rem]">Cara Kerja</Link>
          <Link href="#testimoni" className="font-medium text-white/95 hover:text-white transition-all text-[0.85rem] lg:text-[0.9rem]">Testimoni</Link>
        </div>

        {/* Tombol Desktop (iPad/Laptop) */}
        <div className="hidden md:flex flex-1 justify-end gap-3 lg:gap-4">
          <Link href="/auth/login" className="px-4 lg:px-5 py-1.5 font-semibold text-white border border-white/40 rounded-md hover:bg-white/10 text-sm">
            Masuk
          </Link>
          <Link href="/auth/register" className="px-4 lg:px-5 py-1.5 font-semibold text-hero bg-white rounded-md hover:bg-slate-50 text-sm">
            Daftar
          </Link>
        </div>

        {/* Container Hamburger Menu (Tampilan Mobile)*/}
        <div className="md:hidden flex items-center z-[1100]">

          {/* Tombol Hamburger Menu */}
          <button
            className="p-4 -mr-4 text-white focus:outline-none bg-transparent cursor-pointer touch-manipulation active:scale-95 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >

            {/* Icon Hamburger Menu */}
            <div className="w-7 h-7 flex items-center justify-center">
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          absolute top-full left-0 w-full bg-navbar z-[950] flex flex-col items-start pt-0 pb-4 px-[5%] gap-2 transition-all duration-500 ease-in-out md:hidden border-b border-white/10 shadow-xl
          ${isOpen ? 'translate-y-0 opacity-100 visible pointer-events-auto' : '-translate-y-4 opacity-0 invisible pointer-events-none'}
        `}>
          <Link onClick={() => setIsOpen(false)} href="#beranda" className="text-lg font-bold text-white w-full py-1">Home</Link>
          <Link onClick={() => setIsOpen(false)} href="#fitur" className="text-lg font-bold text-white w-full py-1">Fitur</Link>
          <Link onClick={() => setIsOpen(false)} href="#cara-kerja" className="text-lg font-bold text-white w-full py-1">Cara Kerja</Link>
          <Link onClick={() => setIsOpen(false)} href="#testimoni" className="text-lg font-bold text-white w-full py-1">Testimoni</Link>

          {/* Tombol Auth Khusus Mobile */}
          <div className="w-full flex flex-col gap-3 mt-2 pt-4 border-t border-white/10">
            <Link onClick={() => setIsOpen(false)} href="/auth/login" className="w-full text-center px-4 py-2.5 font-bold text-white border-2 border-white/40 rounded-xl hover:bg-white/10 transition-colors">
              Masuk
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/auth/register" className="w-full text-center px-4 py-2.5 font-bold text-hero bg-white rounded-xl hover:bg-slate-50 transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigasiLanding;
