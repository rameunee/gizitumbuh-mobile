import lmsData from '../data/lms.json' with { type: 'json' };

export function findLmsParam(indikator, jenisKelamin, xVal) {
  const num = Number(xVal);
  if (!Number.isFinite(num)) return null;
  const isHeightBased = indikator === 'bbpb' || indikator === 'bbtb';
  const rounded = isHeightBased ? Math.round(num * 2) / 2 : Math.round(num);

  return lmsData.find((row) =>
    row.indikator === indikator &&
    row.jenisKelamin === jenisKelamin &&
    Number(row.xValue) === rounded
  ) || null;
}