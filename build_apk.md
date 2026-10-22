# Telaah & Rencana: Aplikasi Android Offline — Kalkulator Gizi Live (GiziTumbuh)

> Status: **dokumen telaah — belum ada coding**. Dibuat sebelum implementasi.

---

## 1. Ringkasan Rekomendasi

**Gunakan pendekatan Hybrid (PWA + Capacitor) atau Native ringan**, dengan **data LMS WHO resmi dibundel lokal (offline)**. Karena fitur utama hanya *live calculator* (tanpa simpan data), aplikasi dapat berjalan 100% offline asalkan tabel LMS dan logika perhitungan tersedia di perangkat.

**Rekomendasi utama:**
- **Opsi A (cepat, low-risk): PWA + Capacitor** → bungkus frontend React yang sudah ada menjadi APK, tambahkan Service Worker + cache data LMS.
- **Opsi B (lebih native): Flutter/Kotlin** → port logika & UI native, lebih berat tapi performa & UX lebih baik.

Untuk petugas desa dengan sinyal buruk, **Opsi A** paling realistis (reuse kode, offline cache, distribusi APK).

---

## 2. Ruang Lingkup Aplikasi Android (Offline)

### Fitur yang harus ada (MVP)
- Input antropometri balita (nama, JK, tgl lahir, tgl ukur, BB, TB, cara ukur).
- Hitung umur (bulan penuh kalender).
- Koreksi cara ukur (+0,7 / -0,7 cm).
- Lookup LMS WHO (BB/U, TB/U, BB/TB atau BB/PB, IMT/U).
- Hitung Z-score + kategori gizi.
- Tampilkan saran tindak lanjut aman + disclaimer.
- **Tanpa simpan data** (sesuai live calculator) → tidak perlu sinkronisasi.

### Fitur yang TIDAK perlu (untuk MVP offline)
- Login, dashboard, CRUD balita, laporan Excel, audit log, manajemen user.

---

## 3. Data yang Harus Dibundel (Offline)

### Sumber data resmi
- **WHO Child Growth Standards** (0–5 tahun): L/M/S untuk BB/U, TB/U, IMT/U (bulanan), BB/PB (45–110 cm, 0,5 cm), BB/TB (65–120 cm, 0,5 cm).
- **Permenkes No. 2/2020**: tabel SD untuk verifikasi kategori.

### Bentuk data di perangkat
- **SQLite/Room** atau **JSON terkompresi** (854+ baris) yang di-load ke memori saat startup.
- Pastikan resolusi 0,5 cm untuk BB/PB & BB/TB.
- Sertakan metadata versi standar (mis. “WHO 2006 + Permenkes 2/2020”) agar hasil dapat ditelusuri.

---

## 4. Logika yang Harus Dipindahkan (Porting)

1. **Perhitungan umur** (bulan penuh kalender, tolak tanggal ukur sebelum lahir).
2. **Koreksi cara ukur** (batas 24 bulan: `<=24` PB, `>24` TB).
3. **Lookup LMS** tanpa fallback di luar rentang (return null → tampilkan “di luar cakupan”).
4. **Formula Z-score LMS** (guard division by zero).
5. **Kategori gizi** (BB/U, TB/U, BB/TB, IMT/U) sesuai ambang ±3, ±2, +1, +2, +3 SD.
6. **Saran aman** + disclaimer “bukan pengganti penilaian klinis”.

---

## 5. Persiapan Teknis & Tooling

### A. Opsi A — PWA + Capacitor (disarankan untuk MVP)
**Tools:**
- Node.js, npm, Vite (sudah ada).
- Android Studio (SDK + emulator).
- Capacitor CLI (`@capacitor/core`, `@capacitor/android`).

**Langkah:**
1. Pisahkan proyek baru: salin folder `frontend/` (hanya kalkulator live + komponen terkait).
2. Hapus dependensi backend (API calls) → gunakan data LMS lokal.
3. Tambahkan Service Worker + manifest (PWA) untuk cache offline.
4. Install Capacitor, tambahkan platform Android.
5. Build web → sync → build APK/AAB di Android Studio.
6. Uji di emulator & perangkat fisik.

**Kelebihan:** reuse kode, cepat, offline cache mudah.  
**Kekurangan:** performa WebView, ukuran bundle.

### B. Opsi B — Flutter (native)
**Tools:** Flutter SDK, Android Studio, Dart.

**Langkah:**
1. Buat proyek Flutter baru.
2. Port logika perhitungan ke Dart.
3. Bundel data LMS (JSON/SQLite) di assets.
4. Bangun UI native.
5. Build APK/AAB.

**Kelebihan:** performa & UX native.  
**Kekurangan:** porting ulang, maintenance paralel.

---

## 6. Pemisahan Koding ke Proyek Baru (Disarankan)

### Struktur proyek baru (Opsi A)
```
gizitumbuh-android/
├── frontend/          # copy dari gizitumbuh/frontend (hanya live calculator)
│   ├── src/
│   │   ├── pages/LiveCalculatorPage.jsx
│   │   ├── components/StatusGiziCard.jsx
│   │   ├── utils/giziCategory.js
│   │   ├── utils/lms.js (data LMS lokal)
│   │   └── config/offline.js
│   ├── public/manifest.json
│   └── vite.config.js
├── data/              # LMS WHO (JSON/SQLite)
├── capacitor.config.ts
└── android/           # generated
```

### Prinsip pemisahan
- **Jangan** bawa backend Express/Prisma/MySQL.
- **Jangan** bawa fitur dashboard/admin.
- **Bawa** hanya logika kalkulator + data LMS + kategori + saran.
- Simpan data LMS dalam file statis (JSON) yang di-bundle di `public/` atau `assets/`.

---

## 7. Penyimpanan Data LMS Offline

### Opsi 1: JSON terkompresi (paling sederhana)
- Konversi `who_lms_standards` (854+ baris) ke `lms.json`.
- Load saat startup, simpan di memori (cache).
- Ukuran kecil (~100–200 KB), aman.

### Opsi 2: SQLite lokal (lebih skalabel)
- Bundel file `.db` di assets.
- Query dengan filter indikator/jenis kelamin/xValue.
- Cocok jika data bertambah (mis. 5–19 tahun).

**Rekomendasi:** Opsi 1 untuk MVP, Opsi 2 jika nanti diperluas.

---

## 8. Validasi & Pengujian (Wajib Sebelum Rilis)

Buat tes acuan berdasarkan Permenkes/WHO:
- BB/U L/P pada umur 0, 1, 6, 60 bulan.
- PB/U pada 24 bulan & TB/U setelah 24 bulan + koreksi cara ukur.
- BB/PB & BB/TB pada interval 0,5 cm.
- Kategori tepat di ambang -3, -2, +1, +2, +3 SD.
- Umur 2 bulan 29 hari, tanggal ukur sebelum lahir, umur >60 bulan.
- Hasil Z-score dibandingkan data L/M/S resmi.
- Kriteria lulus: tidak ada Z-score presisi bila acuan tidak tersedia; tidak ada fallback senyap.

---

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data LMS salah/interpolasi | Gunakan berkas WHO resmi (Excel) yang sudah diunduh; verifikasi dengan Permenkes. |
| Umur/koreksi salah | Port logika yang sudah diperbaiki; uji batas 24 bulan. |
| Aplikasi tampak mendiagnosis | Saran aman + disclaimer “bukan pengganti penilaian klinis”. |
| Ukuran APK besar | Kompres JSON; gunakan ProGuard/R8 (native). |
| Distribusi di luar Play Store | Sideload APK dengan panduan; atau publish ke Play Store (butuh akun developer). |

---

## 10. Langkah Deploy (Android)

1. **Build APK/AAB** di Android Studio.
2. **Uji** di emulator + perangkat fisik (offline mode).
3. **Distribusi**:
   - Sideload APK (untuk petugas internal), atau
   - Upload AAB ke Google Play Console (jika publik).
4. **Versioning**: ikuti semver (mis. 1.0.0).
5. **Update data LMS**: rilis versi baru jika standar berubah.

---

## 11. Keputusan yang Perlu Anda Tentukan

1. **Opsi build**: PWA+Capacitor (cepat) atau Flutter (native)?
2. **Distribusi**: sideload APK atau Play Store?
3. **Fitur tambahan**: simpan riwayat lokal (offline) atau tetap live calculator saja?
4. **Bahasa**: Indonesia saja atau multi-bahasa?

---

## 12. Langkah Selanjutnya (Jika Disetujui)

1. Buat proyek baru (salin frontend kalkulator + data LMS).
2. Port logika perhitungan ke lingkungan target.
3. Tambahkan Service Worker / cache offline (jika PWA).
4. Build & uji offline.
5. Siapkan panduan instalasi untuk petugas desa.

> **Catatan:** Dokumen ini hanya telaah; belum ada coding. Setelah Anda menentukan opsi, saya siap membantu implementasi.