// src/controllers/auditController.js
import Audit from '../models/Audit.js';
import User from '../models/User.js';

export const getAllAudits = async (req, res) => {
  try {
    const audits = await Audit.findAll({
      include: [{
        model: User,
        attributes: ['nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener registros de auditoría',
      error: error.message 
    });
  }
};

export const updateAuditLikert = async (req, res) => {
  try {
    const { id } = req.params;
    const { likert } = req.body;

    if (likert < 1 || likert > 5) {
      return res.status(400).json({ 
        message: 'El valor Likert debe estar entre 1 y 5' 
      });
    }

    const audit = await Audit.findByPk(id);
    if (!audit) {
      return res.status(404).json({ message: 'Registro de auditoría no encontrado' });
    }

    await audit.update({ likert });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar valor Likert',
      error: error.message 
    });
  }
};

export const getAuditStats = async (req, res) => {
  try {
    const stats = await Audit.findAll({
      attributes: [
        'accion',
        [sequelize.fn('COUNT', '*'), 'total']
      ],
      group: ['accion']
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};
