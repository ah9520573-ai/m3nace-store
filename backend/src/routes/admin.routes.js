import { Router } from 'express';
import { stats, exportSheet } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin-only.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/stats', stats);
router.get('/export/:type', exportSheet);
export default router;
