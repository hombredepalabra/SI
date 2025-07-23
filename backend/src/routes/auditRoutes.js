// src/routes/auditRoutes.js
import express from 'express';
import { 
  getAllAudits, 
  updateAuditLikert,
  getAuditStats 
} from '../controllers/auditController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// Solo el auditor puede ver y calificar
router.get('/', checkRole(['auditor', 'admin']), getAllAudits);
router.put('/:id/likert', checkRole(['auditor']), updateAuditLikert);
router.get('/stats', checkRole(['auditor', 'admin']), getAuditStats);

export default router;
