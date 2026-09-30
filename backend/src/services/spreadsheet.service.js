import fs from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';
import { env } from '../config/env.js';

const locks = new Map();
const dataDir = path.resolve(env.dataDir);
const files = { products: 'products.xlsx', users: 'users.xlsx', orders: 'orders.xlsx' };
const headers = {
  products: ['id','name','description','price','stock','imageUrls','videoUrl','category','createdAt','updatedAt'],
  users: ['id','name','email','passwordHash','role','createdAt'],
  orders: ['orderId','userId','userEmail','items','totalAmount','shippingAddress','paymentMethod','status','createdAt']
};
const filePath = (type) => path.join(dataDir, files[type]);
const withLock = async (type, work) => {
  const previous = locks.get(type) || Promise.resolve();
  const current = previous.then(work, work);
  locks.set(type, current.catch(() => {}));
  return current;
};
export async function ensureWorkbook(type) {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(filePath(type));
    if (type === 'products') {
      const book = XLSX.readFile(filePath(type)); const rows = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: '' });
      if (rows.some(row => row.imageUrl !== undefined || row.imageUrls === undefined || row.updatedAt === undefined)) {
        const migrated = rows.map(row => ({ id: row.id, name: row.name, description: row.description, price: Number(row.price || 0), stock: Number(row.stock || 0), imageUrls: row.imageUrls || (row.imageUrl ? JSON.stringify([row.imageUrl]) : '[]'), videoUrl: row.videoUrl || '', category: row.category || 'Accessories', createdAt: row.createdAt || new Date().toISOString(), updatedAt: row.updatedAt || row.createdAt || new Date().toISOString() }));
        const migratedSheet = XLSX.utils.json_to_sheet(migrated, { header: headers.products }); const migratedBook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(migratedBook, migratedSheet, 'products'); XLSX.writeFile(migratedBook, filePath(type));
      }
    }
  } catch {
    const sheet = XLSX.utils.json_to_sheet([], { header: headers[type] });
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, type);
    XLSX.writeFile(book, filePath(type));
  }
}
export async function readRows(type) {
  await ensureWorkbook(type);
  const book = XLSX.readFile(filePath(type));
  return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: '' });
}
export async function writeRows(type, rows) {
  return withLock(type, async () => {
    return writeRowsUnlocked(type, rows);
  });
}
async function writeRowsUnlocked(type, rows) {
  await fs.mkdir(dataDir, { recursive: true });
  const sheet = XLSX.utils.json_to_sheet(rows, { header: headers[type] });
  const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, type);
  XLSX.writeFile(book, filePath(type)); return rows;
}
export async function insertRow(type, row) { return withLock(type, async () => writeRowsUnlocked(type, [...await readRows(type), row])); }
export async function updateRows(type, predicate, mapper) { return withLock(type, async () => writeRowsUnlocked(type, (await readRows(type)).map(row => predicate(row) ? mapper(row) : row))); }
export async function deleteRows(type, predicate) { return withLock(type, async () => writeRowsUnlocked(type, (await readRows(type)).filter(row => !predicate(row)))); }
export const readSheet = readRows;
export const appendRow = insertRow;
export const updateRow = updateRows;
export const deleteRow = deleteRows;
export { files, filePath, headers };
