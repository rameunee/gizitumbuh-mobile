import { calculateUmur } from './dateHelper.js';
import { calculateZScore, adjustTinggiBadan } from './lmsFormula.js';
import { findLmsParam } from './lms.js';
import { getStatusGiziBbtb, getStatusGiziTbu } from './giziCategory.js';

export function calculateLiveAntropometri({
  namaBalita,
  jenisKelamin,
  tanggalLahir,
  tanggalUkur = new Date(),
  beratBadan,
  tinggiBadan,
  caraUkur = 'berdiri'
}) {
  const { umurBulan, sisaHari, totalHari } = calculateUmur(tanggalLahir, tanggalUkur);
  const tbKoreksi = adjustTinggiBadan(tinggiBadan, caraUkur, umurBulan);
  const tbMeter = tbKoreksi / 100;
  const imt = parseFloat((beratBadan / (tbMeter * tbMeter)).toFixed(2));

  const withinRange = umurBulan >= 0 && umurBulan <= 60;
  const bbtbIndikator = umurBulan <= 24 ? 'bbpb' : 'bbtb';

  let lmsBbu = null;
  let lmsTbu = null;
  let lmsBbtb = null;
  let lmsImtu = null;

  if (withinRange) {
    lmsBbu = findLmsParam('bbu', jenisKelamin, umurBulan);
    lmsTbu = findLmsParam('tbu', jenisKelamin, umurBulan);
    lmsBbtb = findLmsParam(bbtbIndikator, jenisKelamin, tbKoreksi);
    lmsImtu = findLmsParam('imtu', jenisKelamin, umurBulan);
  }

  let zscoreBbu = null;
  let zscoreTbu = null;
  let zscoreBbtb = null;
  let zscoreImtu = null;

  if (lmsBbu) {
    const raw = calculateZScore(beratBadan, Number(lmsBbu.L), Number(lmsBbu.M), Number(lmsBbu.S));
    zscoreBbu = raw === null ? null : parseFloat(raw.toFixed(2));
  }
  if (lmsTbu) {
    const raw = calculateZScore(tbKoreksi, Number(lmsTbu.L), Number(lmsTbu.M), Number(lmsTbu.S));
    zscoreTbu = raw === null ? null : parseFloat(raw.toFixed(2));
  }
  if (lmsBbtb) {
    const raw = calculateZScore(beratBadan, Number(lmsBbtb.L), Number(lmsBbtb.M), Number(lmsBbtb.S));
    zscoreBbtb = raw === null ? null : parseFloat(raw.toFixed(2));
  }
  if (lmsImtu) {
    const raw = calculateZScore(imt, Number(lmsImtu.L), Number(lmsImtu.M), Number(lmsImtu.S));
    zscoreImtu = raw === null ? null : parseFloat(raw.toFixed(2));
  }

  const bbIdealMin = 0;
  const bbIdealMaks = 0;

  const statusGiziBbtb = getStatusGiziBbtb(zscoreBbtb ?? zscoreImtu);
  const statusGiziTbu = getStatusGiziTbu(zscoreTbu);

  let saran = 'Pantau tumbuh kembang anak secara berkala di Posyandu. Konfirmasikan hasil dengan kader/tenaga kesehatan.';
  const primaryScore = zscoreBbtb ?? zscoreImtu;

  if (primaryScore !== null) {
    if (primaryScore < -2) {
      saran = 'Hasil menunjukkan risiko gizi kurang/pendek. Segera konfirmasikan ke kader dan puskesmas untuk penilaian lebih lanjut.';
    } else if (primaryScore > 2) {
      saran = 'Hasil menunjukkan risiko gizi lebih. Konfirmasikan ke kader dan puskesmas untuk penilaian lebih lanjut.';
    } else {
      saran = 'Pertahankan pola makan gizi seimbang dan rutin pantau tumbuh kembang di Posyandu setiap bulan.';
    }
  }
  saran = saran + ' Aplikasi bukan pengganti penilaian klinis oleh tenaga kesehatan.';

  return {
    namaBalita,
    umur: { bulan: umurBulan, hari: sisaHari, totalHari },
    antropometri: {
      beratBadan,
      tinggiBadanAsli: tinggiBadan,
      tinggiBadanKoreksi: tbKoreksi,
      caraUkur,
      imt
    },
    zscore: { bbu: zscoreBbu, tbu: zscoreTbu, bbtb: zscoreBbtb, imtu: zscoreImtu },
    statusGizi: statusGiziBbtb,
    statusGiziTbu,
    bbIdeal: { min: bbIdealMin, maks: bbIdealMaks, satuan: 'kg' },
    saran
  };
}