# Dokumentasi Sistem GIS-Blitar (Laporan Lengkap)

Dokumen ini berisi diagram teknis lengkap yang dirancang untuk keperluan laporan praktik/tugas akhir, mencakup DFD dari Level 0 hingga 3, ERD, dan Flowchart sistem yang rinci.

---

## 1. Flowchart Sistem (Detailed Logical Flow)

Flowchart ini membedah alur logika program secara mendalam, termasuk validasi input dan manajemen sesi.

```mermaid
flowchart TD
    Start([Mulai]) --> Role{Pilih Peran}

    %% Alur Public
    Role -- User Publik --> Landing[Halaman Landing]
    Landing --> NavMap[Klik 'Lihat Peta']
    NavMap --> LoadMap[Inisialisasi Leaflet Map]

    LoadMap --> FetchPublic[(Ambil Data Lokasi)]
    FetchPublic --> RenderMarkers[Tampilkan Marker di Peta]

    RenderMarkers --> MapInteraction{Interaksi User?}
    MapInteraction -- Filter Kategori --> FilterProc[Proses Filter Marker Client-side]
    MapInteraction -- Klik Marker --> ShowPopup[Tampilkan Popup Ringkas]
    MapInteraction -- Click Detail --> ShowDetail[Overlay Detail Lokasi & Gambar]

    FilterProc --> RenderMarkers
    ShowDetail --> MapInteraction

    %% Alur Admin
    Role -- Admin --> LoginPath[Halaman Login]
    LoginPath --> InputCred[Input Username & Password]
    InputCred --> ValidateForm{Validasi Form?}
    ValidateForm -- Kosong --> LoginPath
    ValidateForm -- Terisi --> CheckAuth[Verifikasi Database/NextAuth]

    CheckAuth -- Gagal --> ErrorMsg[Tampilkan Pesan Error]
    ErrorMsg --> LoginPath

    CheckAuth -- Berhasil --> CreateSession[Buat Session Admin]
    CreateSession --> AdminDash[Halaman Dashboard Admin]

    AdminDash --> AdminAction{Pilih Aksi}

    %% CRUD Detail
    AdminAction -- Kelola Data --> DataTable[Tabel Data Lokasi]
    DataTable --> CRUD{Operasi?}

    CRUD -- Tambah/Edit --> FormInput[Form Detail Lokasi]
    FormInput --> MediaUpload{Upload Gambar?}
    MediaUpload -- Ya --> CloudStorage[Upload ke Cloud/Public Folder]
    MediaUpload -- Tidak --> DBTransaction
    CloudStorage --> DBTransaction[(Database Transaction: Prisma)]

    CRUD -- Hapus --> ConfirmDelete[Pop-up Konfirmasi]
    ConfirmDelete --> DBDelete[(Database: Delete)]

    DBTransaction --> DataTable
    DBDelete --> DataTable

    AdminAction -- Lihat Statistik --> ShowStats[Generate Chart & Global Stats]
    ShowStats --> AdminDash

    AdminAction -- Logout --> DestroySession[Hapus Session]
    DestroySession --> End([Selesai])
```

---

## 2. Data Flow Diagram (DFD) - Level 0 sampai 3

### DFD Level 0 (Context Diagram)

Menggambarkan batas sistem dan interaksi dengan entitas eksternal.

```mermaid
graph LR
    Admin((Elemen: Admin)) -- 1. Login Credentials<br/>2. Data Lokasi & Media --> GIS[Sistem Informasi Geografis Blitar]
    Public((Elemen: User Publik)) -- 1. Request Peta<br/>2. Filter Kategori --> GIS

    GIS -- 1. Status Auth<br/>2. Laporan Statistik --> Admin
    GIS -- 1. Informasi Geografis<br/>2. Detail Lokasi & Gambar --> Public
```

### DFD Level 1 (Top Level Process)

Membagi sistem menjadi 4 proses utama.

```mermaid
graph TD
    A((Admin)) -- Credentials --> P1[1.0 Proses Autentikasi]
    A -- Data CRUD --> P2[2.0 Manajemen Data Lokasi]
    U((Public)) -- Filter/Request --> P3[3.0 Visualisasi & Interaksi Map]

    P1 -- Session Info --> A
    P1 -- Auth Status --> P2

    P2 -- Read/Write --> DS1[(Database Places & Detail)]
    DS1 -- Place Data --> P3
    P3 -- Geo-Data & Detail --> U

    DS1 -- Raw Data --> P4[4.0 Pelaporan & Statistik]
    P4 -- Visual Stats --> A
```

### DFD Level 2 (Decomposition of 2.0 Maintenance Data)

Fokus pada alur input, edit, dan hapus data.

```mermaid
graph TD
    A((Admin)) -- Form Input --> P2.1[2.1 Tambah Data Baru]
    A -- ID & Data Perubahan --> P2.2[2.2 Perbarui Data]
    A -- ID Lokasi --> P2.3[2.3 Hapus Data]

    P2.1 -- Validasi & Insert --> DS1[(Database)]
    P2.2 -- Find & Update --> DS1
    P2.3 -- Permanent Delete --> DS1

    A -- File Image --> P2.4[2.4 Pengelolaan Media]
    P2.4 -- URL Gambar --> DS1
```

### DFD Level 3 (Decomposition of 2.1 & 2.4 - Detailed Transaction)

Level paling rinci mencakup validasi teknis.

```mermaid
graph TD
    A((Admin)) -- Submit Form --> P2.1.1[2.1.1 Validasi Atribut Data]
    P2.1.1 -- Error --> A
    P2.1.1 -- Valid --> P2.1.2[2.1.2 Konversi Koordinat Lat/Lon]

    A -- Select Image --> P2.4.1[2.4.1 Image compression/Encoding]
    P2.4.1 --> P2.4.2[2.4.2 Upload to File Server]
    P2.4.2 -- Success URL --> P2.1.3[2.1.3 Prisma Database Transaction]

    P2.1.2 -- Lat/Lon Ready --> P2.1.3
    P2.1.3 -- Commit --> DS1[(Database)]
```

---

## 3. Entity Relationship Diagram (ERD) - Relational Model

Struktur data yang digunakan dalam database PostgreSQL via Prisma.

```mermaid
erDiagram
    USER ||--o{ PLACE : "manages (Logically)"
    PLACE ||--|| PLACE_DETAIL : "has 1-to-1"
    PLACE ||--o{ PLACE_IMAGE : "has 1-to-many"

    USER {
        int id PK
        string username "Unique"
        string password "Hashed"
        string name
        datetime createdAt
    }

    PLACE {
        int id PK
        string name
        string description
        string address
        float lat
        float lon
        string category
        datetime createdAt
    }

    PLACE_DETAIL {
        int id PK
        int placeId FK "Unique"
        string accessInfo
        string priceInfo
        string facilities
        string contactInfo
        string webUrl
    }

    PLACE_IMAGE {
        int id PK
        int placeId FK
        string url
        datetime createdAt
    }
```

> [!TIP]
> **Cara Menggunakan dalam Laporan:**
>
> 1. Salin kode `mermaid` di atas ke **[Mermaid Live Editor](https://mermaid.live/)**.
> 2. Unduh hasilnya dalam format **SVG** (untuk kualitas cetak terbaik) atau **PNG**.
> 3. Masukkan ke dalam bab dokumentasi sistem pada laporan Anda.
