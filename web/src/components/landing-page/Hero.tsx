'use client';

import Link from 'next/link';

const BagianHero = () => {
  return (
    // Bagian Hero
    <header id="beranda" className="bg-hero text-white px-[5%] pt-14 md:pt-10 lg:pt-10 pb-10 flex items-center xl:min-h-[85vh] overflow-hidden">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-6 md:gap-10 lg:gap-16">

        {/* Container Teks */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-5 z-10 mt-4 md:mt-0">

          {/* Judul Hero */}
          <h1 className="text-3xl md:text-4xl lg:text-[3.5rem] leading-[1.15] lg:leading-[1.1] font-black tracking-[-1px] text-white">
            Pahami Pelanggan, <br className="hidden md:block" />
            <span className="text-white/90">Tingkatkan Penjualan</span>
          </h1>

          {/* Deskripsi Hero */}
          <p className="text-sm md:text-base text-white/80 max-w-[500px] leading-relaxed px-4 md:px-0">
            Ubah ribuan komentar pelanggan menjadi wawasan bisnis yang berharga
            dengan teknologi Analisis Sentimen berbasis AI.
          </p>

          {/* Tombol Hero */}
          <div className="mt-4 md:mt-2 w-full md:w-auto px-6 md:px-0">
            <Link href="/auth/login" className="inline-block w-full md:w-auto text-center px-10 py-4 text-base font-bold text-hero bg-white rounded-xl hover:bg-slate-50 hover:-translate-y-1 transition-all shadow-xl shadow-black/10">
              Coba Sekarang
            </Link>
          </div>
        </div>

        {/* Container Gambar (Mockup)*/}
        <div className="flex-1 relative flex justify-center items-center [perspective:1000px] w-full max-w-[340px] md:max-w-none scale-[0.95] md:scale-90 lg:scale-100 transition-transform mt-4 md:mt-0">

          {/* Kartu Mockup Positif */}
          <div className="absolute -top-4 md:-top-6 lg:-top-10 -left-4 md:-left-6 lg:-left-12 bg-white p-3 rounded-lg shadow-lg max-w-[140px] lg:max-w-[170px] text-[0.65rem] lg:text-[0.75rem] text-slate-800 border-l-4 border-green-600 animate-melayang-kartu z-10">
            <div className="text-green-600 font-bold mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Positif
            </div>
            <p className="italic text-slate-500">"Produknya bagus banget"</p>
          </div>

          {/* Kartu Mockup Negatif */}
          <div className="absolute top-12 lg:top-8 -right-2 md:-right-4 lg:-right-8 bg-white p-3 rounded-lg shadow-lg max-w-[140px] lg:max-w-[170px] text-[0.65rem] lg:text-[0.75rem] text-slate-800 border-l-4 border-red-600 animate-melayang-kartu z-10 [animation-delay:1s]">
            <div className="text-red-600 font-bold mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              Negatif
            </div>
            <p className="italic text-slate-500">"Pengiriman lambat"</p>
          </div>

          {/* Kartu Mockup Netral */}
          <div className="absolute -bottom-4 md:-bottom-6 lg:-bottom-8 -left-0 md:-left-2 lg:-left-5 bg-white p-3 rounded-lg shadow-lg max-w-[140px] lg:max-w-[170px] text-[0.65rem] lg:text-[0.75rem] text-slate-800 border-l-4 border-yellow-500 animate-melayang-kartu z-10 [animation-delay:2s]">
            <div className="text-yellow-500 font-bold mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              Netral
            </div>
            <p className="italic text-slate-500">"Biasa aja sih"</p>
          </div>

          {/* Mockup Dashboard Utama */}
          <div className="bg-white w-full max-w-[380px] md:max-w-[400px] lg:max-w-[420px] rounded-2xl p-5 shadow-2xl text-slate-800 relative rotate-[-3deg] animate-melayang">
            {/* Total Ulasan */}
            <div className="flex gap-2.5 mb-5 border-b border-slate-50 pb-4">
              <div className="bg-slate-50 p-2.5 rounded-xl flex-1">
                <p className="text-[0.65rem] text-slate-400 mb-0.5">Total Ulasan</p>
                <h4 className="text-lg font-bold">1,247</h4>
              </div>

              {/* Positif */}
              <div className="bg-green-50 p-2.5 rounded-xl flex-1">
                <p className="text-[0.65rem] text-slate-400 mb-0.5">Positif</p>
                <h4 className="text-lg font-bold text-green-600">68%</h4>
              </div>

              {/* Negatif */}
              <div className="bg-red-50 p-2.5 rounded-xl flex-1">
                <p className="text-[0.65rem] text-slate-400 mb-0.5">Negatif</p>
                <h4 className="text-lg font-bold text-red-600">10%</h4>
              </div>
            </div>

            {/* Distribusi Sentimen */}
            <div className="mt-4 space-y-3">
              <p className="text-[0.75rem] text-slate-400 mb-2">Distribusi Sentimen</p>
              {[
                { label: 'Positif', color: 'bg-green-600', text: 'text-green-600', val: 'w-[68%]', count: '848' },
                { label: 'Netral', color: 'bg-yellow-500', text: 'text-yellow-500', val: 'w-[22%]', count: '274' },
                { label: 'Negatif', color: 'bg-red-600', text: 'text-red-600', val: 'w-[10%]', count: '125' }

                // Menampilkan Distribusi Sentimen
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {/* Label Sentimen */}
                  <div className={`w-10 text-[0.7rem] ${item.text} font-bold`}>{item.label}</div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} ${item.val}`}></div>
                  </div>

                  {/* Jumlah Sentimen */}
                  <div className="w-8 text-[0.7rem] text-slate-300 text-right font-medium">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BagianHero;
