# AGENTS.md - GiziTumbuh Android (Offline)

## 1. Status Terakhir
- Frontend dipangkas menjadi live calculator saja (tanpa login, dashboard, CRUD, laporan).
- Logika perhitungan offline diporting ke frontend: umur kalender, koreksi cara ukur, lookup LMS, Z-score, kategori gizi, saran.
- Data LMS WHO resmi (854 baris) dibundel sebagai `frontend/src/data/lms.json`.
- PWA ditambahkan: `manifest.json`, `sw.js`, ikon, registrasi service worker.
- Konfigurasi Capacitor disiapkan (`capacitor.config.json`, `package.json`, folder `android/` dan `ios/`).
- Dukungan iOS ditambahkan (`@capacitor/ios`, folder `ios/`, workflow GitHub Actions).
- Validasi perbandingan frontend vs backend: hasil Z-score identik untuk sampel uji.
- Frontend production build berhasil (`npm run build`).
- Environment Android siap: Android Studio SDK + Temurin JDK 17.
- Debug APK berhasil dibuild: `android/app/build/outputs/apk/debug/app-debug.apk` (±3.8 MB).
- Release APK/AAB belum dibuat (butuh signing keystore).

## 2. Struktur Utama
- `frontend/src/pages/LiveCalculatorPage.jsx` — UI kalkulator offline.
- `frontend/src/utils/zscore.js` — orkestrasi perhitungan live.
- `frontend/src/utils/dateHelper.js`, `lmsFormula.js`, `lms.js`, `giziCategory.js` — logika & lookup LMS lokal.
- `frontend/src/data/lms.json` — data LMS WHO resmi.
- `frontend/public/manifest.json`, `sw.js`, `icon.svg` — PWA offline.
- `capacitor.config.json`, `android/` — pembungkusan Android.

## 3. Tugas Selanjutnya
- Uji mode offline di browser/emulator.
- Siapkan Android Studio + SDK untuk build APK/AAB.
- Tambahkan test acuan WHO/Permenkes (batas umur, interval 0,5 cm, ambang Z-score).
- Optimasi bundle dan ikon aplikasi final.

## 4. Perintah Verifikasi
```bash
cd frontend
npm install
npm run build
npm run dev

cd ..
npm run build:web
npx cap sync android
```