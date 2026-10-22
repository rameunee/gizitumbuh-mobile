export function calculateUmur(tanggalLahir, tanggalUkur = new Date()) {
  const birth = new Date(tanggalLahir);
  const measure = new Date(tanggalUkur);

  if (measure < birth) {
    return { totalHari: Math.floor((measure - birth) / 86400000), umurBulan: 0, sisaHari: 0 };
  }

  let years = measure.getFullYear() - birth.getFullYear();
  let months = measure.getMonth() - birth.getMonth();
  let days = measure.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(measure.getFullYear(), measure.getMonth(), 0);
    days = prevMonth.getDate() - birth.getDate() + measure.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const base = new Date(birth.getFullYear(), birth.getMonth() + totalMonths, birth.getDate());
  const sisaHari = Math.floor((measure - base) / 86400000);
  const totalHari = Math.floor((measure - birth) / 86400000);

  return { totalHari, umurBulan: totalMonths, sisaHari };
}