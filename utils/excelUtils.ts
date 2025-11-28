import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readExcelCell(filePath: string, row: number, col: number): Promise<string | null> {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return null;

  const XLSX = await import('xlsx');
  const buffer = fs.readFileSync(fullPath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 }) as any[][];

  if (!data[row - 1]) return null;
  return data[row - 1][col - 1] !== undefined ? String(data[row - 1][col - 1]) : '';
}
