// src/controllers/recordController.js
import Record from '../models/Record.js';

export const getAllRecords = async (req, res) => {
  try {
    const records = await Record.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener registros',
      error: error.message 
    });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el registro',
      error: error.message 
    });
  }
};

export const createRecord = async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al crear el registro',
      error: error.message 
    });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    await record.update(req.body);
    res.json(record);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar el registro',
      error: error.message 
    });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    await record.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar el registro',
      error: error.message 
    });
  }
};
