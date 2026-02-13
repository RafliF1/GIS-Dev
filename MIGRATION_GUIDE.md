# Panduan Migrasi Database (Neon DB ke Lokal / Akun Baru)

Dokumen ini menjelaskan langkah-langkah untuk memindahkan data Anda dari Neon DB saat **Kuota Terlampaui (Quota Exceeded)**.

## Masalah: Quota Exceeded (Limit Tercapai)

Jika Anda melihat error `data transfer quota exceeded` saat menjalankan skrip backup, berarti Neon memblokir akses data via API/ORM.

### Solusi 1: Melalui Dashboard Neon (Menu Tables - Paling Ampuh)

Ini seringkali berhasil meski API diblokir:

1. Login ke [Neon Console](https://console.neon.tech/).
2. Klik menu **Tables** di sidebar kiri.
3. Pilih tabel `places`.
4. Lihat di baris data, klik tombol **Download** (ikon panah bawah) atau **Export**. Pilih format **CSV**.
5. Ulangi untuk tabel lainnya.

### Solusi 2: Cara Manual "Copy-Paste" (Jika Download Gagal)

Jika tombol download juga error:

1. Buka **SQL Editor** di Neon.
2. Jalankan: `SELECT * FROM places;`
3. Klik pada salah satu sel di hasil tabel bawah.
4. Tekan `Ctrl + A` (pilih semua baris) lalu `Ctrl + C` (copy).
5. **Paste** ke Excel atau Google Sheets. Save as CSV. Ini **pasti berhasil** selama data masih bisa tampil di layar.

### Solusi 3: Upgrade Sementara (Rescue Plan)

1. Upgrade akun Neon lama Anda ke **Pro Plan** sebentar saja.
2. Ini akan membuka limit transfer seketika.
3. Lakukan backup cepat pakai skrip `backup_all.ts`.
4. Setelah selesai, **Downgrade** kembali ke Free Plan. Biayanya sangat murah (hanya beberapa sen karena dihitung per jam).

---

## Langkah Pemindahan ke Akun Neon Baru (Atau Lokal)

Setelah Anda berhasil mendapatkan file backup (baik berupa JSON dari skrip atau SQL dari DBeaver/Neon Console), ikuti langkah ini:

### Langkah 1: Siapkan Akun Neon Baru / Database Lokal

1. Buat project baru di akun Neon yang berbeda ATAU buat database baru di PostgreSQL lokal lewat DBeaver.
2. Dapatkan `DATABASE_URL` yang baru.

### Langkah 2: Update file `.env`

Ganti URL lama dengan URL yang baru:

```env
DATABASE_URL="postgresql://user:password@endpoint-baru.neon.tech/neondb?sslmode=require"
```

### Langkah 3: Sinkronisasi Struktur

Jalankan perintah ini agar tabel-tabel dibuat di tempat baru:

```bash
npx prisma db push
```

### Langkah 4: Restore Data

- **Jika pakai file `backup_full_data.json`**:
  ```bash
  npx ts-node scripts/restore_all.ts
  ```
- **Jika pakai file `.sql` dari DBeaver**:
  1. Buka SQL Editor di DBeaver (koneksi ke database baru).
  2. Buka file `.sql` hasil backup tadi, lalu **Execute SQL Script**.

---

---

## Vercel & Database Hosting (Penting!)

**Apakah database lokal bisa masuk ke Vercel?**
Jawabannya: **Tidak bisa secara langsung.**

- **Database Lokal (Localhost)**: Hanya ada di komputer Anda. Vercel (yang ada di internet) tidak bisa melihat atau mengakses komputer Anda.
- **Vercel**: Membutuhkan database yang memiliki **Public URL** agar bisa terhubung.

---

## Tentang NoSQL & File Lokal di Vercel

**Bisakah pakai NoSQL (seperti MongoDB atau file JSON) tanpa koneksi ke Vercel?**

1.  **Jika Maksud Anda File Lokal (JSON/SQLite)**:
    - **Vercel** bersifat _Serverless_ dan _Ephemeral_. Artinya, setiap kali Anda upload kode, Vercel membuat "wadah" baru.
    - Jika Anda menyimpan data ke file `.json` atau `.db` lokal di dalam server Vercel, data tersebut **akan hilang** setiap kali server restart atau ada update kode.
    - Jadi, file lokal **tidak bisa** digunakan untuk database yang datanya terus bertambah (dinamis).

2.  **Jika Maksud Anda NoSQL Cloud (MongoDB Atlas)**:
    - Ini sama seperti Neon. Anda tetap butuh **koneksi internet** dan **URL Database** agar Vercel bisa mengaksesnya.
    - Jika Neon limit, MongoDB Atlas (NoSQL) punya kuota gratis 512MB yang cukup besar untuk tahap belajar.

3.  **Data Statis**:
    - Jika data Anda **tidak pernah berubah** (hanya untuk dibaca), Anda bisa menyimpannya dalam folder `public/data.json` atau folder `data/` di proyek. Ini akan ikut ke Vercel dan bisa dibaca, tapi **tidak bisa diubah/diupdate** oleh user.

**Kesimpulan**: Untuk aplikasi GIS Anda yang datanya dinamis (bisa tambah/edit tempat), Anda **tetap wajib** menggunakan database cloud (SQL seperti Neon/Supabase atau NoSQL seperti MongoDB) yang bisa diakses via internet (Public URL).

---

## Tips Pengembangan Selanjutnya

Untuk menghindari limit Neon di masa depan:

1. Gunakan database **Lokal** untuk pengembangan sehari-hari.
2. Hanya gunakan **Neon** saat aplikasi sudah siap dideploy ke Vercel.
3. Selalu simpan backup berkala menggunakan skrip `scripts/backup_all.ts` atau ekspor manual SEBELUM kuota mendekati limit.

---

## Backup Otomatis (GitHub Actions)

Saya telah menyiapkan skrip yang bisa berjalan setiap hari secara otomatis untuk mem-backup data Anda ke folder `backups/` di GitHub.

### Langkah Persiapan:

1. Push kode terbaru ke GitHub.
2. Buka repo Anda di GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Klik **New repository secret**.
4. Nama: `DATABASE_URL`
5. Value: (Isi dengan URL database Neon Anda yang ada di `.env`).
6. Klik **Add secret**.

### Cara Kerja:

- Skrip akan berjalan setiap hari pukul 07:00 WIB.
- Data akan disimpan ke folder `backups/` dengan nama file berdasarkan waktu.
- File `backup_full_data.json` di root juga akan selalu diupdate dengan versi terbaru.
- Anda bisa menjalankan backup manual kapan saja lewat tab **Actions** di GitHub.
