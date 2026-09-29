import { randomUUID } from 'node:crypto';
export const createId = () => randomUUID();
export const now = () => new Date().toISOString();
export const parseJson = (value, fallback = {}) => { try { return JSON.parse(value); } catch { return fallback; } };
