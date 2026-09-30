import { BACKEND_ORIGIN } from './client';
export const mediaUrl = value => value ? (/^(https?:|data:|blob:)/i.test(value) ? value : `${BACKEND_ORIGIN}${value}`) : '';
export const formatPKR = value => `Rs. ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
