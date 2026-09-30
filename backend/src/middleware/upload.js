import multer from 'multer'; import path from 'node:path'; import fs from 'node:fs'; import { env } from '../config/env.js';
const imageDirectory = path.resolve(env.uploadDir, 'products/images'); const videoDirectory = path.resolve(env.uploadDir, 'products/videos'); fs.mkdirSync(imageDirectory, { recursive: true }); fs.mkdirSync(videoDirectory, { recursive: true });
const storage = multer.diskStorage({ destination: (_, file, cb) => cb(null, file.fieldname === 'video' ? videoDirectory : imageDirectory), filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`) });
const fileFilter = (_, file, cb) => { const image = /^image\/(jpeg|png|webp)$/.test(file.mimetype); const video = /^video\/(mp4|webm)$/.test(file.mimetype); cb(null, file.fieldname === 'video' ? video : image); };
export const upload = multer({ storage, fileFilter, limits: { files: 7, fileSize: 30 * 1024 * 1024 } });
export const productMediaUpload = upload.fields([{ name: 'images', maxCount: 6 }, { name: 'video', maxCount: 1 }]);
export { imageDirectory, videoDirectory };
