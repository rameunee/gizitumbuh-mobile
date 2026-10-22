export function getStatusGiziBbtb(zscore) {
  if (zscore === null || zscore === undefined) return 'Di luar cakupan standar WHO 0-60 Bulan';
  if (zscore < -3) return 'Gizi Buruk (Severely Wasted)';
  if (zscore >= -3 && zscore < -2) return 'Gizi Kurang (Wasted)';
  if (zscore >= -2 && zscore <= 1) return 'Gizi Baik (Normal)';
  if (zscore > 1 && zscore <= 2) return 'Berisiko Gizi Lebih';
  if (zscore > 2 && zscore <= 3) return 'Gizi Lebih (Overweight)';
  return 'Obesitas (Obese)';
}

export function getStatusGiziTbu(zscore) {
  if (zscore === null || zscore === undefined) return 'Di luar cakupan standar WHO 0-60 Bulan';
  if (zscore < -3) return 'Sangat pendek';
  if (zscore >= -3 && zscore < -2) return 'Pendek';
  if (zscore >= -2 && zscore <= 3) return 'Normal';
  return 'Tinggi';
}

export function getStatusGiziBbu(zscore) {
  if (zscore === null || zscore === undefined) return 'Di luar cakupan standar WHO 0-60 Bulan';
  if (zscore < -3) return 'Berat Badan Sangat Kurang';
  if (zscore >= -3 && zscore < -2) return 'Berat Badan Kurang';
  if (zscore >= -2 && zscore <= 1) return 'Berat Badan Normal';
  return 'Risiko Berat Badan Lebih';
}
