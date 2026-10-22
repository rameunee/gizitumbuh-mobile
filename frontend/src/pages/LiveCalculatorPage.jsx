import React, { useState } from 'react';
import { StatusGiziCard } from '../components/StatusGiziCard.jsx';
import { calculateLiveAntropometri } from '../utils/zscore.js';

export const LiveCalculatorPage = () => {
  const [formData, setFormData] = useState({
    namaBalita: '',
    jenisKelamin: 'L',
    tanggalLahir: '',
    tanggalUkur: new Date().toISOString().split('T')[0],
    beratBadan: '',
    tinggiBadan: '',
    caraUkur: 'berdiri'
  });

  const [hasilKalkulasi, setHasilKalkulasi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.tanggalLahir) throw new Error('Tanggal lahir wajib diisi');
      const payload = {
        ...formData,
        beratBadan: parseFloat(formData.beratBadan),
        tinggiBadan: parseFloat(formData.tinggiBadan)
      };

      const result = calculateLiveAntropometri(payload);
      setHasilKalkulasi(result);
    } catch (err) {
      setError(err.message || 'Gagal menghitung kalkulasi gizi');
    } finally {
      setLoading(false);
    }
  };

  const resetCalculation = () => {
    setFormData({
      namaBalita: '',
      jenisKelamin: 'L',
      tanggalLahir: '',
      tanggalUkur: new Date().toISOString().split('T')[0],
      beratBadan: '',
      tinggiBadan: '',
      caraUkur: 'berdiri'
    });
    setHasilKalkulasi(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 text-white p-6 md:p-7 rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-3xl md:text-4xl font-black text-center tracking-tight drop-shadow-sm">
            GiziTumbuh
          </h1>
          <p className="text-sm md:text-base text-sky-50 text-center mt-1 font-medium">
            Menghitung Status Gizi Balita
          </p>
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] md:text-xs font-medium text-sky-50 border border-white/20">
              Standar Antropometri Anak KEMENKES-RI / WHO
            </span>
          </div>
          <p className="text-[11px] text-sky-100/80 text-center mt-3 max-w-xl mx-auto leading-relaxed">
            Hitung Z-Score dan status gizi balita secara offline tanpa menyimpan data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Input Data Antropometri
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Balita</label>
                <input
                  type="text"
                  name="namaBalita"
                  value={formData.namaBalita}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Riefi"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cara Pengukuran</label>
                  <select
                    name="caraUkur"
                    value={formData.caraUkur}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
                  >
                    <option value="berdiri">Berdiri</option>
                    <option value="telentang">Telentang (Berbaring)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pengukuran</label>
                  <input
                    type="date"
                    name="tanggalUkur"
                    value={formData.tanggalUkur}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="beratBadan"
                    value={formData.beratBadan}
                    onChange={handleChange}
                    placeholder="Contoh: 12.5"
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Panjang/Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="tinggiBadan"
                    value={formData.tinggiBadan}
                    onChange={handleChange}
                    placeholder="Contoh: 85.0"
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghitung...</span>
                  </>
                ) : (
                  <span>Hitung Z-Score Sekarang</span>
                )}
              </button>

              <button
                type="button"
                onClick={resetCalculation}
                className="w-full bg-white hover:bg-slate-50 text-sky-700 font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm border border-sky-200 flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Mulai Perhitungan Baru</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {hasilKalkulasi ? (
              <StatusGiziCard
                data={{
                  namaBalita: hasilKalkulasi.namaBalita,
                  umurBulan: hasilKalkulasi.umur.bulan,
                  jenisKelamin: formData.jenisKelamin,
                  beratBadan: hasilKalkulasi.antropometri.beratBadan,
                  tinggiBadan: hasilKalkulasi.antropometri.tinggiBadanAsli,
                  statusGiziBbtb: hasilKalkulasi.statusGizi,
                  statusGiziTbu: hasilKalkulasi.statusGiziTbu,
                  zscoreBbu: hasilKalkulasi.zscore.bbu ?? 0,
                  zscoreTbu: hasilKalkulasi.zscore.tbu ?? 0,
                  zscoreBbtb: hasilKalkulasi.zscore.bbtb ?? hasilKalkulasi.zscore.imtu ?? 0,
                  zscoreImtu: hasilKalkulasi.zscore.imtu ?? 0,
                  bbIdealMin: hasilKalkulasi.bbIdeal.min,
                  bbIdealMaks: hasilKalkulasi.bbIdeal.maks,
                  saran: hasilKalkulasi.saran
                }}
              />
            ) : (
              <div className="w-full bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
                <p className="text-sm font-semibold text-slate-500">Belum Ada Hasil Kalkulasi</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Isi formulir di atas dan klik tombol untuk menampilkan analisis gizi balita secara langsung.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-2 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-sm">
          <p className="text-xs text-slate-500">
            <a
              href="https://gizitumbuh.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-700 hover:text-sky-900 transition-colors"
            >
              GiziTumbuh
            </a>
            <span className="mx-2 text-slate-300">•</span>
            <span>© 2026 Daifi Afrila Riefi</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="font-medium text-slate-600">Versi 2.5.0</span>
          </p>
        </footer>
      </div>
    </div>
  );
};