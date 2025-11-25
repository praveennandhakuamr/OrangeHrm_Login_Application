  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  export async function readExcelData(filePath: string): Promise<Array<{ [key: string]: string }>> {
    const fullPath = path.resolve(__dirname, '..', filePath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Excel file not found: ${fullPath}`);
      return [];
    }

    const XLSX = await import('xlsx');
    const fileBuffer = fs.readFileSync(fullPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    return jsonData as Array<{ [key: string]: string }>;
  }
