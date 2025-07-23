// app.js - Backend principal para SI-App
// Uso: node app.js

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de sesión
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './' }),
  secret: 'si-app-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Inicialización de la base de datos
const db = new sqlite3.Database('./siapp.sqlite', (err) => {
  if (err) throw err;
  console.log('Conectado a SQLite');
});

// Crear tablas si no existen
const createTables = () => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    rol TEXT CHECK(rol IN ('admin','operador','usuario','auditor'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    descripcion TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    accion TEXT,
    tabla TEXT,
    fecha_hora TEXT,
    valor_likert INTEGER
  )`);
};
createTables();

// Middleware para verificar autenticación
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
}

// Middleware para verificar rol
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}

// Registrar acción en auditoría
function registrarAuditoria(usuario, accion, tabla, valor_likert = null) {
  const fecha_hora = new Date().toISOString();
  db.run(
    'INSERT INTO auditoria (usuario, accion, tabla, fecha_hora, valor_likert) VALUES (?, ?, ?, ?, ?)',
    [usuario, accion, tabla, fecha_hora, valor_likert]
  );
}

// Endpoint: Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: 'Error de servidor' });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    req.session.user = { id: user.id, username: user.username, rol: user.rol };
    registrarAuditoria(user.username, 'login', 'usuarios');
    res.json({ rol: user.rol });
  });
});

// Endpoint: Logout
app.post('/api/logout', requireLogin, (req, res) => {
  registrarAuditoria(req.session.user.username, 'logout', 'usuarios');
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Endpoint: Obtener usuario actual
app.get('/api/me', requireLogin, (req, res) => {
  res.json(req.session.user);
});

// CRUD Registros
app.get('/api/registros', requireLogin, (req, res) => {
  db.all('SELECT * FROM registros', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar registros' });
    registrarAuditoria(req.session.user.username, 'consultar', 'registros');
    res.json(rows);
  });
});

app.post('/api/registros', requireLogin, requireRole(['admin', 'usuario']), (req, res) => {
  const { nombre, descripcion } = req.body;
  db.run('INSERT INTO registros (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], function(err) {
    if (err) return res.status(500).json({ error: 'Error al crear registro' });
    registrarAuditoria(req.session.user.username, 'crear', 'registros');
    res.json({ id: this.lastID });
  });
});

app.put('/api/registros/:id', requireLogin, requireRole(['admin', 'operador']), (req, res) => {
  const { nombre, descripcion } = req.body;
  db.run('UPDATE registros SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al modificar registro' });
    registrarAuditoria(req.session.user.username, 'modificar', 'registros');
    res.json({ ok: true });
  });
});

app.delete('/api/registros/:id', requireLogin, requireRole(['admin', 'operador']), (req, res) => {
  db.run('DELETE FROM registros WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar registro' });
    registrarAuditoria(req.session.user.username, 'eliminar', 'registros');
    res.json({ ok: true });
  });
});

// Auditoría: solo auditor puede ver y calificar
app.get('/api/auditoria', requireLogin, requireRole(['auditor']), (req, res) => {
  db.all('SELECT * FROM auditoria', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar auditoría' });
    res.json(rows);
  });
});

app.post('/api/auditoria/likert', requireLogin, requireRole(['auditor']), (req, res) => {
  const { id, valor_likert } = req.body;
  db.run('UPDATE auditoria SET valor_likert = ? WHERE id = ?', [valor_likert, id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al calificar' });
    res.json({ ok: true });
  });
});

// Redirección por rol (usado por dashboard.html)
app.get('/api/redirect', requireLogin, (req, res) => {
  const rol = req.session.user.rol;
  res.json({ redirect: `${rol}.html` });
});

// Servir archivos frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
