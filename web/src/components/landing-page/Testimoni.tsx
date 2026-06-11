const BagianTestimoni = () => {
  return (
    // Testimoni
    <section id="testimoni" className="pt-10 pb-10 px-[5%] bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* Judul */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h2 className="text-4xl font-black text-hero uppercase">Testimoni</h2>
        </div>

        {/* Isi Testimoni */}
        <div className="relative flex overflow-hidden">
        {/* Container Animasi Marquee */}
        <div className="flex gap-8 animate-marquee whitespace-nowrap">

          {/* Isi Testimoni */}
          {[1, 2].map((grup) => (
            <div key={grup} className="flex gap-8">
              {[
                {
                  nama: "Rina Kartika",
                  peran: "Owner, Glow Skincare Shop",
                  teks: "Dulu baca ulasan satu-satu, sekarang tinggal upload CSV dan langsung keluar insight-nya. Save banget waktu gue, serius.",
                  inisial: "RK"
                },
                {
                  nama: "Budi Santoso",
                  peran: "Founder, Urban Style",
                  teks: "Analisis sentimennya sangat akurat. Saya bisa tahu produk mana yang harus di-restock lebih banyak.",
                  inisial: "BS"
                },
                {
                  nama: "Siti Aminah",
                  peran: "Marketing Manager, FoodieHub",
                  teks: "Tampilan dashboard-nya sangat keren dan mudah dipahami tim. Sangat direkomendasikan untuk pebisnis online.",
                  inisial: "SA"
                },
                {
                  nama: "Andi Wijaya",
                  peran: "CEO, TechGear Indonesia",
                  teks: "Satu-satunya platform yang memberikan rekomendasi strategis, bukan sekadar data angka saja.",
                  inisial: "AW"
                }

                // Menampilkan Testimoni
              ].map((dataTestimoni, indeks) => (
                <div key={indeks} className="flex flex-col w-[310px] lg:w-[380px] bg-gray-100 border border-gray-200 shadow-sm py-5 lg:py-6 px-6 lg:px-8 rounded-2xl whitespace-normal self-stretch">
                  {/* Icon Bintang */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-5 h-5 text-orange-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Menampilkan Deskripsi */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    "{dataTestimoni.teks}"
                  </p>

                  {/* Kontainer Nama dan Peran */}
                  <div className="flex items-center gap-4 mt-auto">

                    {/* Menampilkan Inisial */}
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-700 font-bold text-base">
                      {dataTestimoni.inisial}
                    </div>

                    {/* Menampilkan Nama dan Peran */}
                    <div>
                      <div className="font-bold text-slate-900 text-base">{dataTestimoni.nama}</div>
                      <div className="text-gray-500 text-xs">{dataTestimoni.peran}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default BagianTestimoni;
