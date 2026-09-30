import dotenv from 'dotenv';
dotenv.config();

const requiredProductionVars = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missingProductionVars = requiredProductionVars.filter(name => !process.env[name]);
if (process.env.NODE_ENV === 'production' && missingProductionVars.length) {
  console.error(`Missing required production environment variables: ${missingProductionVars.join(', ')}`);
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'https://m3nace-store-frontend.onrender.com',
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  dataDir: process.env.DATA_DIR || 'data',
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
};
