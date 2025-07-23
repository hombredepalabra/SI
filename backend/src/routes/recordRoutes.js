// src/routes/recordRoutes.js
import express from 'express';
import { 
  getAllRecords, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../controllers/recordController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

// Middleware para auditar todas las acciones en registros
router.use(verifyToken, auditAction('registros'));

// Rutas con permisos por rol
router.get('/', getAllRecords);
router.get('/:id', getRecordById);
router.post('/', checkRole(['admin', 'usuario']), createRecord);
router.put('/:id', checkRole(['admin', 'operador']), updateRecord);
router.delete('/:id', checkRole(['admin', 'operador']), deleteRecord);

export default router;
