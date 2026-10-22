export function calculateZScore(Y, L, M, S) {
  if (!Number.isFinite(Y) || !Number.isFinite(L) || !Number.isFinite(M) || !Number.isFinite(S) || M === 0 || S === 0) {
    return null;
  }
  if (L !== 0) {
    return (Math.pow(Y / M, L) - 1) / (L * S);
  }
  return Math.log(Y / M) / S;
}

export function adjustTinggiBadan(tb, caraUkur, umurBulan) {
  let adjustedTb = parseFloat(tb);
  if (umurBulan <= 24 && caraUkur === 'berdiri') {
    adjustedTb += 0.7;
  } else if (umurBulan > 24 && caraUkur === 'telentang') {
    adjustedTb -= 0.7;
  }
  return adjustedTb;
}