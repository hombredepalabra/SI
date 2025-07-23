// src/controllers/authController.js
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const user = await User.create({
      nombre,
      email,
      password,
      rol
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};
