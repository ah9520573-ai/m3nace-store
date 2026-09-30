import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { readRows, insertRow, updateRows } from '../services/spreadsheet.service.js';
import { env } from '../config/env.js'; import { publicUser, signToken } from '../utils/token.js';
const normalizeEmail = email => {
	const [localPart, domainPart] = email.trim().toLowerCase().split('@');
	if (domainPart === 'googlemail.com') return `${localPart.split('+')[0].replace(/\./g, '')}@gmail.com`;
	if (domainPart === 'gmail.com') return `${localPart.split('+')[0].replace(/\./g, '')}@gmail.com`;
	return `${localPart}@${domainPart}`;
};
const sendAuth = (res, user, status = 200) => res.status(status).json({ success: true, user: publicUser(user), token: signToken(user) });
export async function register(req, res) { const { name, email, password } = req.body; const users = await readRows('users'); if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ success:false, message:'Email already registered' }); const user = { id: randomUUID(), name, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role:'user', createdAt:new Date().toISOString() }; await insertRow('users', user); sendAuth(res, user, 201); }
export async function login(req, res) { const { email, password } = req.body; const normalizedEmail = normalizeEmail(email); const user = (await readRows('users')).find(u => normalizeEmail(u.email) === normalizedEmail); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success:false, message:'Invalid email or password' }); sendAuth(res, user); }
export async function me(req, res) { const user = (await readRows('users')).find(u => u.id === req.user.id); if (!user) return res.status(401).json({ success:false, message:'User not found' }); res.json({ success:true, user: publicUser(user) }); }
export async function updateProfile(req, res) { const users = await readRows('users'); const current = users.find(u => u.id === req.user.id); if (!current) return res.status(404).json({ success:false, message:'User not found' }); const next = { ...current, name: req.body.name?.trim() || current.name }; if (req.body.password) next.passwordHash = await bcrypt.hash(req.body.password, 12); await updateRows('users', u => u.id === current.id, () => next); res.json({ success:true, user:publicUser(next) }); }
export async function seedAdmin() { const users = await readRows('users'); const passwordHash = await bcrypt.hash(env.adminPassword, 12); const email = normalizeEmail(env.adminEmail); const admin = users.find(user => user.role === 'admin'); if (!admin) { await insertRow('users', { id:randomUUID(), name:'Ahmad', email, passwordHash, role:'admin', createdAt:new Date().toISOString() }); console.log(`Admin account created: ${email}`); } else { await updateRows('users', user => user.id === admin.id, user => ({ ...user, email, passwordHash })); console.log(`Admin account updated: ${email}`); } }
