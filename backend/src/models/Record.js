// src/models/Record.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  categoria: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'pendiente'),
    defaultValue: 'activo'
  }
});

export default Record;
