import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const signToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' });
export const publicUser = ({ passwordHash, ...user }) => user;
