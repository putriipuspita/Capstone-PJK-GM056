# SENTIX - Sentiment Analysis Dashboard (Capstone Project)

Selamat datang di repositori proyek Capstone **SENTIX**. Proyek ini mengintegrasikan model analisis sentimen ulasan produk Tokopedia dengan dashboard web interaktif untuk membantu pemilik toko memahami feedback pelanggan.

---

## 📁 Struktur Repositori

Repositori ini menggunakan struktur monorepo yang memisahkan bagian Model AI dan Aplikasi Web:

* **[`web/`](./web)**: Aplikasi web frontend interaktif yang dibangun menggunakan **Next.js**, **Tailwind CSS**, dan **Recharts** untuk visualisasi data sentimen.
* **[`model/`](./model)**: Berisi Jupyter Notebook (`.ipynb`) untuk pelatihan model analisis sentimen, kamus pembersihan teks (`slang.csv`), serta dataset latih.

---

## 🚀 Cara Menjalankan Proyek

### 1. Menjalankan Website (Frontend)
Untuk menjalankan dashboard web secara lokal di komputer Anda:

```bash
# Masuk ke folder web
cd web

# Instal dependensi/pustaka
npm install

# Jalankan server lokal
npm run dev
```
Setelah berjalan, buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 2. Membuka Model Sentiment Analysis
Untuk membuka atau mengedit model klasifikasi sentimen:
1. Pastikan Anda memiliki **Python** dan **Jupyter Notebook/Lab** atau **VS Code** dengan ekstensi Jupyter.
2. Buka folder `model/` dan jalankan notebook `analisissentimen.ipynb`.

---

## 👥 Anggota Kelompok
* **Putri Puspita** (Frontend Developer & Integrator)
* *Silakan tambahkan nama anggota kelompok Anda di sini*
