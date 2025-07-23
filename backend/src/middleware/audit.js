// src/middleware/audit.js
import Audit from '../models/Audit.js';

export const auditAction = (tabla) => {
  return async (req, res, next) => {
    const oldSend = res.send;
    
    res.send = async function(data) {
      try {
        // Solo auditar acciones exitosas (status 2xx)
        if (this.statusCode >= 200 && this.statusCode < 300) {
          let accion = 'consultar';
          switch (req.method) {
            case 'POST': accion = 'crear'; break;
            case 'PUT': case 'PATCH': accion = 'editar'; break;
            case 'DELETE': accion = 'eliminar'; break;
          }

          await Audit.create({
            usuario_id: req.user.id,
            accion,
            tabla,
            detalle: JSON.stringify({
              method: req.method,
              path: req.path,
              body: req.body
            }),
            ip: req.ip
          });
        }
      } catch (error) {
        console.error('Error al registrar auditoría:', error);
      }

      oldSend.apply(res, arguments);
    };

    next();
  };
};
