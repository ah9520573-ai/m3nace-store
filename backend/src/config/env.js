import dotenv from 'dotenv';
dotenv.config();
export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  adminEmail: process.env.ADMIN_EMAIL || 'ahmadmehdi505@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || '9773.ahmad'
};
