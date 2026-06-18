# SENTIX (Sentiment Analysis)

## 1. Penjelasan Aplikasi Sentix

**Sentix** adalah sebuah platform analitik berbasis kecerdasan buatan (AI) yang dirancang khusus untuk menganalisis sentimen dari ulasan pelanggan. Aplikasi ini membantu pemilik bisnis online dan _e-commerce_ untuk memahami secara mendalam apa yang dipikirkan pelanggan tentang produk mereka-apakah itu respons positif, netral, maupun negatif serta mengekstrak wawasan (_insight_) yang dapat langsung ditindaklanjuti secara otomatis tanpa perlu membaca ribuan ulasan secara manual.

## 2. Latar Belakang Masalah

Di era digital, volume ulasan (_reviews_) pelanggan yang masuk ke sebuah toko sangat masif. Pemilik bisnis seringkali kesulitan dan kewalahan membaca serta mengkategorikan satu per satu ulasan tersebut. Proses manual ini memakan waktu yang sangat lama, menguras tenaga, dan rawan subjektivitas. Akibatnya, banyak keluhan kritis atau keunggulan tersembunyi dari produk yang luput dari pantauan, sehingga pengambilan keputusan bisnis menjadi lambat dan kurang responsif terhadap kebutuhan konsumen nyata.

## 3. Tujuan Proyek

- **Otomatisasi Analisis**: Memproses ratusan hingga ribuan ulasan pelanggan dalam hitungan detik.
- **Pemetaan Sentimen**: Mengkategorikan sentimen pelanggan (Positif, Netral, Negatif) secara akurat.
- **Ekstraksi Topik Utama**: Mengidentifikasi aspek utama yang paling sering dibicarakan (Top Aspects) dan menemukan kelemahan spesifik melalui keluhan utama (Top Complaints).
- **Rekomendasi Berbasis AI**: Memberikan rekomendasi bisnis yang _actionable_ kepada pemilik toko berdasarkan temuan data.


## 4. Teknologi yang Digunakan

Proyek ini dibangun dengan arsitektur **Tri-Service** yang terintegrasi untuk stabilitas maksimal:

- **Frontend**: React.js, Next.js (App Router), TailwindCSS, Recharts (visualisasi data).
- **Core Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL (melalui Supabase PgBouncer dengan NullPool).
- **Insight Microservice**: FastAPI (Python), dirancang khusus untuk melewati pemblokiran IP saat memanggil API pihak ketiga.
- **Machine Learning & AI**: HuggingFace Transformers (Analisis Sentimen), Google GenAI / Gemini (Pembangkitan _Insight_ Strategis).
- **Infrastruktur Hosting**: Vercel (Frontend), Hugging Face Spaces (Core Backend), Vercel (Microservice), Supabase (Database & Auth).

## 5. Fitur Unggulan

- **Dashboard Analitik Dinamis**: Menampilkan metrik seperti Total Ulasan, Skor Kepuasan (0-100), dan Distribusi Sentimen (Donut Chart).
- **Grafik Tren Sentimen**: Memantau perkembangan pergerakan sentimen dengan filter dinamis (1 Bulan, 3 Bulan, 1 Tahun Terakhir).
- **Ekstraksi Keluhan & Kelebihan Utama**: Secara cerdas memisahkan antara apa yang paling disukai pengguna dengan area yang perlu segera diperbaiki.
- **Rekomendasi Strategis (AI)**: Memberikan saran bisnis spesifik dengan mekanisme _fallback_ ke _Rule-Based_ jika AI sedang mengalami _limit_.
- **Pemrosesan Latar Belakang (_Background Queue_)**: Unggah _dataset_ besar tanpa takut aplikasi _freeze_, karena analisis dijalankan secara paralel di latar belakang.

## 6. Arsitektur Tri-Service 

Karena API Google Gemini memblokir IP dari peladen Hugging Face Spaces, aplikasi ini dirancang memecah beban ke 3 tempat:

1. **Frontend (Next.js)** $\rightarrow$ Di-hosting di **Vercel**. Menangani antarmuka UI/UX.
2. **Core Backend (FastAPI)** $\rightarrow$ Di-hosting di **Hugging Face Spaces**. Menangani komputasi berat, pemrosesan antrean CSV latar belakang, dan model _Machine Learning_ (butuh RAM besar 16GB).
3. **Insight Microservice (FastAPI)** $\rightarrow$ Di-hosting di **Vercel**. Menangani permintaan ringan ke API Google Gemini sebagai jembatan agar IP tidak diblokir.

## 7. Cara Instalasi Lokal untuk Development

### Struktur Folder

```text
📦 Capstone-PJK-GM056
 ┣ 📂 backend/                 # Core Backend (FastAPI + ML Models)
 ┃ ┣ 📂 src/                   # Logika utama (API, Database, Service)
 ┃ ┣ 📜 requirements.txt       # Dependensi Backend Utama
 ┃ ┗ 📜 Dockerfile             # Konfigurasi container untuk Hugging Face
 ┣ 📂 insight_microservice/    # Peladen Mikro Khusus Gemini (FastAPI)
 ┃ ┣ 📜 main.py                # Logika pemanggilan API Gemini
 ┃ ┣ 📜 requirements.txt       # Dependensi super ringan (google-genai)
 ┃ ┗ 📜 vercel.json            # Konfigurasi deploy untuk Vercel
 ┗ 📂 web/                     # Frontend App (Next.js 14)
   ┣ 📂 src/                   # Komponen React, Halaman UI, dan Hooks
   ┣ 📜 package.json           # Dependensi Node.js
   ┗ 📜 tailwind.config.ts     # Konfigurasi Styling CSS
```

Pastikan sistem Anda sudah terinstal **Node.js** dan **Python (>=3.9)**.

### A. Clone Repositori

```bash
git clone https://github.com/putriipuspita/Capstone-PJK-GM056.git
```

### B. Persiapan Core Backend

1. Masuk ke direktori backend: `cd backend`
2. Buat dan aktifkan _virtual environment_: `python -m venv .venv` lalu `.venv\Scripts\activate` (Windows)
3. Instal dependensi: `pip install -r requirements.txt`
4. Buat file `.env` dan masukkan variabel (Supabase URL, Key, dll).
5. Jalankan server lokal di port 8000:
   ```bash
   uvicorn src.api_app.main:app --reload --port 8000
   ```

### C. Persiapan Insight Microservice

1. Buka terminal baru, masuk ke direktori microservice: `cd insight_microservice`
2. Aktifkan _virtual environment_ yang sama atau buat baru.
3. Instal dependensi: `pip install -r requirements.txt`
4. Buat file `.env` dan masukkan `GEMINI_API_KEY`.
5. Jalankan server lokal di port 8080:
   ```bash
   uvicorn main:app --reload --port 8080
   ```

### D. Persiapan Frontend

1. Buka terminal baru dan masuk ke direktori web: `cd web`
2. Instal modul _node_: `npm install`
3. Buat file `.env.local` dan tambahkan:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. Jalankan aplikasi web:
   ```bash
   npm run dev
   ```
   _Frontend kini dapat diakses melalui `http://localhost:3000`._

## 8. Kolaborasi Tim

Proyek ini merupakan hasil kerja keras dari tim **Capstone Project PJK-GM056**. Pengembangan dilakukan melalui pendekatan lintas disiplin yang meliputi peran _Front-End Engineering_, _Back-End Engineering_, serta _Machine Learning Engineering_.

## 9. Catatan Penting

- Karena analisis menggunakan pemodelan AI, waktu pemrosesan akan bergantung pada jumlah baris pada CSV yang diunggah. Terdapat pemantauan progres (polling) otomatis di UI.
- API Gemini memiliki batasan penggunaan gratis (_Rate Limit_ / _Daily Limit_). Jika batas tercapai, sistem secara otomatis akan menggunakan rekomendasi _Rule-Based_ sebagai cadangan (_fallback_) agar aplikasi tidak _crash_.
