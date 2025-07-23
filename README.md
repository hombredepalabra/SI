# Sistema de Información y Auditoría ArCH

Sistema de gestión y auditoría desarrollado con Node.js, React y SQLite. Una aplicación web moderna que permite gestionar registros con diferentes niveles de acceso y un completo sistema de auditoría.

## Requisitos Previos

- Node.js (v14 o superior)
- npm (viene con Node.js)
- SQLite (viene incluido en el proyecto)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/hombredepalabra/SI.git
cd SI-App
```

2. Instala las dependencias del backend:
```bash
cd backend
npm install
```

3. Instala las dependencias del frontend:
```bash
cd ../frontend
npm install
```

## Configuración Inicial

1. Inicializa la base de datos (desde la carpeta backend):
```bash
cd backend
node init-db.js
```

Este script creará los siguientes usuarios por defecto:
- Admin: admin@example.com / admin123
- Operador: operador@example.com / operador123
- Usuario: usuario@example.com / usuario123
- Auditor: auditor@example.com / auditor123

## Ejecutar el Proyecto

1. Inicia el backend (desde la carpeta backend):
```bash
cd backend
npm run dev
```

2. En otra terminal, inicia el frontend (desde la carpeta frontend):
```bash
cd frontend
npm run dev
```

3. Abre tu navegador en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Características Principales

- Sistema de autenticación con diferentes roles
- CRUD completo de registros
- Panel de estadísticas
- Sistema de auditoría
- Filtrado y búsqueda de registros
- Interfaz responsiva con Tailwind CSS

## Estructura del Proyecto

```
SI-App/
├── backend/              # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuración de la base de datos
│   │   ├── controllers/ # Controladores de la API
│   │   ├── middleware/  # Middleware de autenticación
│   │   ├── models/      # Modelos de la base de datos
│   │   └── routes/      # Rutas de la API
│   └── init-db.js       # Script de inicialización
│
└── frontend/            # Cliente React + Vite
    ├── src/
    │   ├── components/  # Componentes React
    │   ├── pages/       # Páginas de la aplicación
    │   ├── services/    # Servicios de API
    │   └── context/     # Contextos de React
    └── vite.config.js   # Configuración de Vite
```

## Tecnologías Utilizadas

- Backend:
  - Node.js
  - Express
  - SQLite
  - Sequelize
  - JSON Web Tokens

- Frontend:
  - React
  - Vite
  - TailwindCSS
  - Axios
  - React Router

## Contribuir

Si deseas contribuir al proyecto:

1. Haz un Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
