import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function requireAuth(req, res, next) {
  const value = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : req.cookies?.token;
  if (!value) return res.status(401).json({ success: false, message: 'Authentication required' });
  try { req.user = jwt.verify(value, env.jwtSecret); next(); } catch { return res.status(401).json({ success: false, message: 'Invalid or expired token' }); }
}
