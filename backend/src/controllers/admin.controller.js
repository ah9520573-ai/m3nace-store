import { readRows, filePath, files } from '../services/spreadsheet.service.js';
export async function stats(req, res) {
  const [products, orders, users] = await Promise.all([readRows('products'), readRows('orders'), readRows('users')]);
  res.json({ success: true, stats: { products: products.length, orders: orders.length, users: users.filter(user => user.role === 'user').length, revenue: orders.filter(order => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.totalAmount || 0), 0), lowStock: products.filter(product => Number(product.stock) <= 5), recentOrders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) } });
}
export function exportSheet(req, res) {
  const file = files[req.params.type];
  if (!file) return res.status(404).json({ success: false, message: 'Unknown spreadsheet type' });
  return res.download(filePath(req.params.type), file);
}
