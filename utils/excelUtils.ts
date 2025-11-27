import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetch a row from Excel dynamically as an object.
 * Safe: handles missing file, missing row, or missing columns gracefully.
 * Assumes first row contains headers (like 'username', 'password').
 *
 * @param filePath Path to Excel file
 * @param row Row number (1-based, 2 means second row of data)
 * @returns Object with key = header, value = cell value, or null if not found
 */
export async function readExcelRow(filePath: string, row: number): Promise<{ [key: string]: string } | null> {
  const fullPath = path.resolve(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Excel file not found: ${fullPath}`);
    return null;
  }

  const XLSX = await import('xlsx');
  const buffer = fs.readFileSync(fullPath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert sheet to array of arrays
  const data = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 }) as any[][];

  if (!data || data.length < 2) {
    console.warn("Excel sheet is empty or missing data rows");
    return null;
  }

  // First row = headers
  const headerRow = data[0] as string[];
  if (!headerRow || headerRow.length === 0) {
    console.warn("Excel sheet missing headers");
    return null;
  }

  // Requested row (1-based)
  const rowData = data[row - 1] as any[];
  if (!rowData) {
    console.warn(`Row ${row} not found in Excel sheet`);
    return null;
  }

  const rowObj: { [key: string]: string } = {};

  headerRow.forEach((key, index) => {
    // Safely assign value only if exists
    rowObj[key] = rowData[index] !== undefined && rowData[index] !== null ? String(rowData[index]) : '';
  });

  return rowObj;
}
