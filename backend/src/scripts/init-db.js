import User from '../models/User.js';
import sequelize from '../config/database.js';

async function initDatabase() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: true });

    // Crear usuarios iniciales
    const users = [
      {
        nombre: 'Administrador',
        email: 'admin@example.com',
        password: 'admin123',
        rol: 'admin'
      },
      {
        nombre: 'Usuario Regular',
        email: 'user@example.com',
        password: 'user123',
        rol: 'usuario'
      },
      {
        nombre: 'Operador',
        email: 'operator@example.com',
        password: 'operator123',
        rol: 'operador'
      },
      {
        nombre: 'Auditor',
        email: 'auditor@example.com',
        password: 'auditor123',
        rol: 'auditor'
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`Usuario creado: ${userData.email} (${userData.rol})`);
    }

    console.log('Base de datos inicializada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
