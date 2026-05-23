# SIMS PPOB API — Nutech Take Home Test

REST API untuk simulasi layanan PPOB (Payment Point Online Bank) menggunakan **Node.js + Express + PostgreSQL**.

---

## Stack

| Layer      | Tech                         |
|------------|------------------------------|
| Runtime    | Node.js                      |
| Framework  | Express.js                   |
| Database   | PostgreSQL (raw query + prepared statement) |
| Auth       | JWT (12 jam expiry)          |
| Upload     | Multer (jpeg/png only)       |

---

## Struktur Proyek

```
nutech-ppob-api/
├── database/
│   ├── ddl.sql          # Skema tabel
│   └── seed.sql         # Data awal banner & services
├── src/
│   ├── controllers/     # Business logic per modul
│   ├── db/pool.js       # Koneksi PostgreSQL
│   ├── middlewares/     # auth, upload, errorHandler
│   ├── routes/          # Definisi endpoint
│   └── app.js           # Setup Express
├── uploads/             # Profile image yang diupload
├── index.js             # Entry point
└── .env.example
```

---

## Setup Lokal

### 1. Clone & install

```bash
git clone <repo-url>
cd nutech-ppob-api
npm install
```

### 2. Buat file `.env`

```bash
cp .env.example .env
```

Isi sesuai konfigurasi database PostgreSQL kamu:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=nutech_ppob
JWT_SECRET=ganti_dengan_secret_yang_panjang
JWT_EXPIRES_IN=12h
BASE_URL=http://localhost:3000
```

### 3. Inisialisasi database

```bash
psql -U postgres -c "CREATE DATABASE nutech_ppob;"
psql -U postgres -d nutech_ppob -f database/ddl.sql
psql -U postgres -d nutech_ppob -f database/seed.sql
```

### 4. Jalankan server

```bash
npm run dev   # development (nodemon)
npm start     # production
```

---

## Endpoint Summary

### Module Membership

| Method | Endpoint           | Auth   | Deskripsi              |
|--------|--------------------|--------|------------------------|
| POST   | /registration      | ✗      | Registrasi user        |
| POST   | /login             | ✗      | Login, dapat JWT       |
| GET    | /profile           | Bearer | Get profile            |
| PUT    | /profile/update    | Bearer | Update nama            |
| PUT    | /profile/image     | Bearer | Upload foto profil     |

### Module Information

| Method | Endpoint   | Auth   | Deskripsi            |
|--------|------------|--------|----------------------|
| GET    | /banner    | ✗      | List banner          |
| GET    | /services  | Bearer | List layanan PPOB    |

### Module Transaction

| Method | Endpoint             | Auth   | Deskripsi              |
|--------|----------------------|--------|------------------------|
| GET    | /balance             | Bearer | Cek saldo              |
| POST   | /topup               | Bearer | Top up saldo           |
| POST   | /transaction         | Bearer | Bayar layanan          |
| GET    | /transaction/history | Bearer | Riwayat transaksi      |

---

## Deploy ke Railway

1. Push repo ke GitHub
2. Buka [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Tambahkan service **PostgreSQL** dari Railway
4. Set environment variables sesuai `.env.example`
5. Jalankan DDL + seed via Railway shell atau migrasi manual
6. Set `BASE_URL` ke URL Railway yang digenerate

---

## Catatan Teknis

- Semua query ke database menggunakan **raw query dengan prepared statement** (`$1, $2, ...`) via `node-postgres`.
- Top up dan transaksi menggunakan **database transaction** (`BEGIN / COMMIT / ROLLBACK`) untuk menjaga konsistensi saldo.
- Invoice number digenerate otomatis dengan format `INV{YYYYMMDD}-{6 digit random}`.
- Password di-hash menggunakan **bcryptjs** sebelum disimpan.
- Upload foto profil hanya menerima **jpeg dan png**, divalidasi di level multer.
