const BagianFitur = () => {
  return (
    // Fitur
    <section id="fitur" className="pt-10 pb-10 px-[5%] text-center bg-white">

      {/* Judul */}
      <div className="max-w-4xl mx-auto mb-6">
        <h2 className="text-4xl font-black text-hero uppercase">Fitur Sentix</h2>
      </div>

      {/* Isi Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[

          // Analisis Sentimen
          {
            judul: "Analisis Sentimen",
            deskripsi: "Klasifikasi ulasan menjadi positif, negatif dan netral secara akurat.",
            ikon: (
              <svg className="w-12 h-12 text-navbar mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )
          },

          // Insight Strategis
          {
            judul: "Insight Strategis",
            deskripsi: "Dapatkan insight penting dan rekomendasi untuk meningkatkan bisnis.",
            ikon: (
              <svg className="w-12 h-12 text-navbar mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },

          // Visualisasi Data
          {
            judul: "Visualisasi Data",
            deskripsi: "Data divisualisasikan dengan grafik yang mudah dipahami dan interaktif.",
            ikon: (
              <svg className="w-12 h-12 text-navbar mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12" />
              </svg>
            )
          },

          // Upload Mudah
          {
            judul: "Upload Mudah",
            deskripsi: "Upload data ulasan dengan mudah dalam format CSV atau Excel.",
            ikon: (
              <svg className="w-12 h-12 text-navbar mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )
          }

          // Menampilkan Semua Fitur
        ].map((fitur, indeks) => (
          <div key={indeks} className="pt-5 px-8 pb-8 border border-navbar/5 rounded-2xl shadow-xl bg-white group relative overflow-hidden">

            {/* Garis Dekoratif Pojok Kiri Atas */}
            <div className="absolute top-0 left-0 w-13 h-[3px] bg-hero"></div>
            <div className="absolute top-0 left-0 h-13 w-[3px] bg-hero"></div>

            {/* Garis Dekoratif Pojok Kanan Bawah */}
            <div className="absolute bottom-0 right-0 w-13 h-[3px] bg-hero"></div>
            <div className="absolute bottom-0 right-0 h-13 w-[3px] bg-hero"></div>

            {/* Menampilkan Ikon */}
            <div className="bg-navbar/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              {fitur.ikon}
            </div>

            {/* Menampilkan Judul */}
            <h3 className="text-xl font-bold mb-4 text-slate-900">{fitur.judul}</h3>

            {/* Menampilkan Deskripsi */}
            <p className="text-gray-600 text-sm leading-relaxed">{fitur.deskripsi}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BagianFitur;
