const path = require('path');
const ExcelJS = require('D:/Workspace/Project/gizitumbuh/node_modules/exceljs');

const DATA_DIR = 'D:/Workspace/Project/gizitumbuh/prisma/seeds/data';
const OUT_FILE = path.join(__dirname, '..', 'frontend', 'src', 'data', 'lms.json');

const SOURCES = [
  { file: 'wfa_boys.xlsx', indikator: 'bbu', jenisKelamin: 'L', xCol: 'Month' },
  { file: 'wfa_girls.xlsx', indikator: 'bbu', jenisKelamin: 'P', xCol: 'Month' },
  { file: 'lhfa_boys_0_2.xlsx', indikator: 'tbu', jenisKelamin: 'L', xCol: 'Month' },
  { file: 'lhfa_boys_2_5.xlsx', indikator: 'tbu', jenisKelamin: 'L', xCol: 'Month' },
  { file: 'lhfa_girls_0_2.xlsx', indikator: 'tbu', jenisKelamin: 'P', xCol: 'Month' },
  { file: 'lhfa_girls_2_5.xlsx', indikator: 'tbu', jenisKelamin: 'P', xCol: 'Month' },
  { file: 'bfa_boys_0_2.xlsx', indikator: 'imtu', jenisKelamin: 'L', xCol: 'Month' },
  { file: 'bfa_boys_2_5.xlsx', indikator: 'imtu', jenisKelamin: 'L', xCol: 'Month' },
  { file: 'bfa_girls_0_2.xlsx', indikator: 'imtu', jenisKelamin: 'P', xCol: 'Month' },
  { file: 'bfa_girls_2_5.xlsx', indikator: 'imtu', jenisKelamin: 'P', xCol: 'Month' },
  { file: 'wfl_boys.xlsx', indikator: 'bbpb', jenisKelamin: 'L', xCol: 'Length' },
  { file: 'wfl_girls.xlsx', indikator: 'bbpb', jenisKelamin: 'P', xCol: 'Length' },
  { file: 'wfh_boys.xlsx', indikator: 'bbtb', jenisKelamin: 'L', xCol: 'Height' },
  { file: 'wfh_girls.xlsx', indikator: 'bbtb', jenisKelamin: 'P', xCol: 'Height' },
];

async function readSource(src) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(DATA_DIR, src.file));
  const ws = wb.worksheets[0];
  const header = ws.getRow(1).values;
  const idx = {};
  header.forEach((h, i) => { if (h) idx[String(h).trim()] = i; });
  const records = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const x = row.getCell(idx[src.xCol]).value;
    const L = row.getCell(idx['L']).value;
    const M = row.getCell(idx['M']).value;
    const S = row.getCell(idx['S']).value;
    if (x === null || x === undefined || L === null || M === null || S === null) return;
    records.push({
      indikator: src.indikator,
      jenisKelamin: src.jenisKelamin,
      xValue: Number(x),
      L: Number(L),
      M: Number(M),
      S: Number(S),
    });
  });
  return records;
}

async function main() {
  const fs = require('fs');
  const all = [];
  for (const src of SOURCES) {
    const recs = await readSource(src);
    console.log(`${src.file}: ${recs.length} baris`);
    all.push(...recs);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(all));
  console.log(`Total ${all.length} baris -> ${OUT_FILE}`);
}

main().catch((e) => { console.error(e); process.exit(1); });