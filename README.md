# GIS Kawasan Blitar (WebGIS)

Aplikasi Sistem Informasi Geografis (GIS) yang interaktif untuk memetakan kawasan strategis di Blitar (Hotel, Cafe, Wisata). Dibangun dengan teknologi modern untuk pengelolaan data spasial yang efisien dan visualisasi yang menarik.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) dengan PostgreSQL
- **Peta**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Autentikasi**: [NextAuth.js](https://next-auth.js.org/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Visualisasi Data**: [Recharts](https://recharts.org/)

## ✨ Fitur Utama

- **Peta Interaktif**: Visualisasi marker lokasi dengan fitur clustering dan filter kategori.
- **Admin Dashboard**: Kelola data lokasi (CRUD), pantau statistik global, dan manajemen akses.
- **Detail Lokasi**: Informasi lengkap mencakup koordinat, fasilitas, jam operasional, dan galeri gambar.
- **Responsive Design**: UI premium yang optimal di berbagai ukuran layar (Desktop & Mobile).
- **Auto-Backup**: Sistem backup data otomatis untuk keamanan informasi.

## 📊 Dokumentasi Arsitektur

Untuk memahami alur kerja aplikasi secara mendalam, silakan lihat file [DOKUMENTASI_DIAGRAM.md](DOKUMENTASI_DIAGRAM.md). File tersebut berisi:

- **Entity Relationship Diagram (ERD)**: Struktur database.
- **Flowchart**: Alur logika sistem untuk level Public & Admin.
- **Data Flow Diagram (DFD)**: Aliran data dari Level 0 hingga Level 3.

## 🛠️ Panduan Instalasi (Getting Started)

### Prasyarat

- [Node.js](https://nodejs.org/) (v18 ke atas)
- [PostgreSQL](https://www.postgresql.org/) database

### Langkah Instalasi

1.  **Clone Repository**

    ```bash
    git clone https://github.com/RafliF1/GIS-Dev.git
    cd GIS-Dev
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env` dan sesuaikan variabel koneksi database serta NextAuth.

4.  **Setup Database**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```

## 📂 Struktur Project

- `app/`: Routing dan halaman utama (App Router).
- `components/`: Komponen UI (Map, Forms, Landing Page elements).
- `lib/`: Konfigurasi Core (Prisma client, Auth options).
- `prisma/`: Schema database dan definisi model.
- `public/`: Aset statis seperti gambar dan ikon.
- `scripts/`: Script utilitas (seperti automasi backup).
