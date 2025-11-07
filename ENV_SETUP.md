# Environment Variables Setup

File ini menjelaskan cara setup environment variables untuk aplikasi frontend.

## Setup File .env

Buat file `.env` di folder `frontend/` dengan konten berikut:

```env
# Google Analytics Measurement ID
# Dapatkan dari Google Analytics 4 dashboard
# Format: G-XXXXXXXXXX
# Contoh: VITE_GA_MEASUREMENT_ID=G-ABC123XYZ
VITE_GA_MEASUREMENT_ID=

# API URL (default: http://127.0.0.1:8000/api)
VITE_API_URL=http://127.0.0.1:8000/api

# Midtrans Configuration
VITE_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
VITE_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
```

## Cara Mendapatkan Google Analytics Measurement ID

1. Buka [Google Analytics](https://analytics.google.com/)
2. Pilih property Anda atau buat property baru
3. Klik **Admin** (ikon gear) di sidebar kiri
4. Di kolom **Property**, klik **Data Streams**
5. Pilih stream web Anda atau buat stream baru
6. Salin **Measurement ID** (format: G-XXXXXXXXXX)
7. Paste ke file `.env` sebagai value untuk `VITE_GA_MEASUREMENT_ID`

## Catatan Penting

- File `.env` sudah ditambahkan ke `.gitignore` agar tidak ter-commit ke repository
- Jangan commit file `.env` yang berisi credentials asli
- Untuk production, gunakan environment variables di hosting platform Anda
- Restart development server setelah mengubah file `.env`

## Testing

Setelah setup, Google Analytics akan otomatis ter-load saat aplikasi dijalankan. Cek console browser untuk memastikan tidak ada error.

