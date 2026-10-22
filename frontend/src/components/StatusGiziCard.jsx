import React from 'react';
import { getStatusGiziBbu, getStatusGiziTbu, getStatusGiziBbtb } from '../utils/giziCategory.js';

// Helper warna badge berdasarkan kategori status gizi
const getStatusBadgeColor = (status) => {
  const lowerStatus = status?.toLowerCase() || '';
  if (lowerStatus.includes('normal') || lowerStatus.includes('baik')) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
  if (lowerStatus.includes('kurang') || lowerStatus.includes('risiko') || lowerStatus.includes('lebih')) {
    return 'bg-amber-100 text-amber-800 border-amber-300';
  }
  if (lowerStatus.includes('buruk') || lowerStatus.includes('obesitas') || lowerStatus.includes('sangat')) {
    return 'bg-rose-100 text-rose-800 border-rose-300';
  }
  return 'bg-slate-100 text-slate-800 border-slate-300';
};

export const StatusGiziCard = ({ data }) => {
  const {
    namaBalita = 'Balita',
    umurBulan = 0,
    jenisKelamin = 'L',
    beratBadan = 0,
    tinggiBadan = 0,
    statusGiziBbtb = 'Belum Ada Data',
    statusGiziTbu = 'Belum Ada Data',
    statusGiziBbu = 'Belum Ada Data',
    zscoreBbu = 0,
    zscoreTbu = 0,
    zscoreBbtb = 0,
    zscoreImtu = 0,
    bbIdealMin = 0,
    bbIdealMaks = 0,
    saran = 'Tetap pantau tumbuh kembang anak secara berkala.'
  } = data || {};

  const kategoriBbu = getStatusGiziBbu(zscoreBbu);
  const kategoriTbu = getStatusGiziTbu(zscoreTbu);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-md w-full font-sans">
      {/* Header Profile Balita */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{namaBalita}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {umurBulan} Bulan
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
            statusGiziBbtb
          )}`}
        >
          {statusGiziBbtb}
        </span>
      </div>

      {/* Grid Metric Antropometri */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 block">Berat / Tinggi</span>
          <span className="text-base font-bold text-slate-800">
            {beratBadan} kg <span className="text-xs font-normal text-slate-400">/ {tinggiBadan} cm</span>
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 block">Z-Score (BB/TB)</span>
          <span className={`text-base font-bold ${zscoreBbtb < -2 || zscoreBbtb > 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {zscoreBbtb > 0 ? `+${zscoreBbtb}` : zscoreBbtb} SD
          </span>
        </div>
      </div>

      {/* Kategori Status Gizi per Indikator */}
      <div className="mb-4 space-y-2">
        <div className="text-xs font-semibold text-slate-700 mb-1">Kategori Status Gizi:</div>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <span className="font-medium text-slate-600">Berat Badan menurut Umur</span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] ${getStatusBadgeColor(kategoriBbu)}`}>
              {kategoriBbu}
            </span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <span className="font-medium text-slate-600">Tinggi Badan menurut Umur</span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] ${getStatusBadgeColor(kategoriTbu)}`}>
              {kategoriTbu}
            </span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <span className="font-medium text-slate-600">Indeks Massa Tubuh menurut Umur</span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] ${getStatusBadgeColor(getStatusGiziBbtb(zscoreImtu))}`}>
              {getStatusGiziBbtb(zscoreImtu)}
            </span>
          </div>
        </div>
      </div>

      {/* Estimasi BB Ideal (dinonaktifkan - bukan acuan resmi) */}
      {bbIdealMaks > 0 && (
      <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 mb-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-sky-900">Rentang Berat Badan Ideal:</span>
          <span className="font-bold text-sky-700">{bbIdealMin} kg - {bbIdealMaks} kg</span>
        </div>
        <div className="w-full bg-sky-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(((beratBadan - bbIdealMin) / (bbIdealMaks - bbIdealMin)) * 100, 10),
                100
              )}%`
            }}
          />
        </div>
      </div>
      )}

      {/* Rekomendasi & Saran */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
        <span className="font-bold block mb-0.5 text-amber-950">Rekomendasi Tindakan:</span>
        {saran}
      </div>
    </div>
  );
};
