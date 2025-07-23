import User from './src/models/User.js';
import sequelize from './src/config/database.js';

const initializeDB = async () => {
  try {
    // Sincronizar la base de datos
    await sequelize.sync();

    // Crear usuario administrador por defecto
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      await User.create({
        nombre: 'Administrador',
        email: 'admin@example.com',
        password: 'admin123',
        rol: 'admin'
      });
      console.log('Usuario administrador creado exitosamente');
    }

    // Crear otros usuarios de ejemplo
    const users = [
      {
        nombre: 'Operador',
        email: 'operador@example.com',
        password: 'operador123',
        rol: 'operador'
      },
      {
        nombre: 'Usuario',
        email: 'usuario@example.com',
        password: 'usuario123',
        rol: 'usuario'
      },
      {
        nombre: 'Auditor',
        email: 'auditor@example.com',
        password: 'auditor123',
        rol: 'auditor'
      }
    ];

    for (const userData of users) {
      const exists = await User.findOne({ where: { email: userData.email } });
      if (!exists) {
        await User.create(userData);
        console.log(`Usuario ${userData.rol} creado exitosamente`);
      }
    }

    console.log('Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

initializeDB();
