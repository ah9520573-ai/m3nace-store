import { API_URL } from './client';
export const mediaUrl = value => value ? (value.startsWith('http') ? value : `${API_URL.replace(/\/api\/?$/, '')}${value}`) : '';
export const formatPKR = value => `Rs. ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
