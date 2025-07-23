// Script para crear usuarios de ejemplo en la tabla 'usuarios'
// Uso: node init_users.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./siapp.sqlite');

const usuarios = [
  { username: 'admin', password: 'admin123', rol: 'admin' },
  { username: 'operador', password: 'operador123', rol: 'operador' },
  { username: 'usuario', password: 'usuario123', rol: 'usuario' },
  { username: 'auditor', password: 'auditor123', rol: 'auditor' }
];

usuarios.forEach(u => {
  db.run(
    'INSERT OR IGNORE INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
    [u.username, u.password, u.rol],
    err => {
      if (err) console.log('Error:', err.message);
    }
  );
});

db.close();
console.log('Usuarios de ejemplo insertados.');
