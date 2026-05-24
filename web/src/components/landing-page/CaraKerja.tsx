const BagianCaraKerja = () => {
  return (
    // Cara Kerja
    <section id="cara-kerja" className="pt-10 pb-10 px-[5%] text-center bg-abu">

      {/* Judul */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-4xl font-black text-hero uppercase">Cara Kerja</h2>
      </div>

      {/* Isi Cara Kerja */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 max-w-6xl mx-auto">
        {[
          // Registrasi
          {
            judul: "Register / Login",
            deskripsi: "Daftar atau masuk untuk mulai menggunakan layanan kami.",
            ikon: (
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )
          },

          // Upload Data
          {
            judul: "Upload Data",
            deskripsi: "Upload file ulasan produk Anda dalam format CSV atau Excel.",
            ikon: (
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )
          },

          // Sistem Analisis
          {
            judul: "Sistem Analisis",
            deskripsi: "Sistem kami akan menganalisis sentimen dari setiap ulasan.",
            ikon: (
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },

          // Dapatkan Insight
          {
            judul: "Dapatkan Insight",
            deskripsi: "Lihat hasil analisis lengkap dan rekomendasi untuk bisnis Anda.",
            ikon: (
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12" />
              </svg>
            )
          }

          // Menampilkan Semua Cara Kerja
        ].map((langkah, indeks) => (
          <div key={indeks} className="flex-1 relative flex flex-col items-center group">
            {indeks < 3 && (
              <div className="hidden lg:block absolute top-9 -translate-y-1/2 left-1/2 w-[calc(100%+3rem)] z-0 pointer-events-none">
                <div className="px-14 flex items-center">
                  <div className="flex-1 h-[2px] bg-navbar/15"></div>
                </div>
              </div>
            )}

            {/* Menampilkan Ikon */}
            <div className="relative z-10 w-[72px] h-[72px] bg-navbar rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 mb-6">
              {langkah.ikon}
            </div>

            {/* Menampilkan Judul */}
            <h3 className="text-[1.3rem] font-bold mb-3 text-slate-900">{langkah.judul}</h3>

            {/* Menampilkan Deskripsi */}
            <p className="text-gray-600 text-sm leading-relaxed max-w-[280px]">{langkah.deskripsi}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BagianCaraKerja;
