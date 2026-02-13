# Panduan Backup Database (Otomatis & Manual)

Dokumen ini menjelaskan cara menjaga keamanan data Anda melalui sistem backup otomatis di GitHub dan cara melakukan backup manual ke laptop sendiri.

---

## 1. Backup Otomatis (GitHub Actions)

Saya telah menyiapkan sistem yang akan berjalan otomatis setiap hari untuk mem-backup data Anda ke folder `backups/` di repository GitHub.

### Langkah Persiapan (Wajib):

1. Push kode terbaru ke GitHub.
2. Buka repository Anda di GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Klik **New repository secret**.
4. Nama: `DATABASE_URL`
5. Value: (Salin URL database Neon dari file `.env` Anda).
6. Klik **Add secret**.

### Cara Kerja:

- **Otomatis**: Skrip berjalan setiap hari pukul **07:00 WIB** (00:00 UTC).
- **Hasil**: Data disimpan ke folder `backups/` di GitHub dengan nama file berdasarkan waktu (history).
- **Manual (GitHub)**: Anda bisa memicu backup kapan saja lewat tab **Actions** -> pilih **Database Backup** -> klik **Run workflow**.

---

## 2. Backup Manual (Lokal)

Jika Anda ingin menyimpan salinan data langsung ke laptop sendiri (tanpa lewat GitHub), ikuti langkah ini:

### Perintah Terminal:

Jalankan perintah ini di terminal proyek Anda:

```bash
npx ts-node scripts/backup_all.ts
```

### Hasil:

- File backup akan tersimpan di dalam folder `backups/` di laptop Anda.
- File `backup_full_data.json` di root proyek juga akan diperbarui dengan data terbaru.

---

## 3. Cara Memulihkan Data (Restore)

Jika Anda ingin memasukkan kembali data hasil backup ke database (misal pindah akun Neon atau pindah ke lokal), gunakan perintah:

```bash
npx ts-node scripts/restore_all.ts
```

_Pastikan file `backup_full_data.json` sudah ada di root proyek sebelum menjalankan perintah ini._
