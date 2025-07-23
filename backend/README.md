# SI-App Backend

## Instrucciones de uso

1. Instala las dependencias:
   ```
npm install
   ```
2. Inicia el servidor:
   ```
node app.js
   ```
3. El backend se ejecuta en `http://localhost:3000` y sirve los archivos del frontend.

## Notas
- La base de datos SQLite se crea automáticamente en el archivo `siapp.sqlite`.
- Puedes crear usuarios manualmente en la tabla `usuarios` usando SQLite o agregando un endpoint temporal para registro si lo deseas.
- El sistema de roles y auditoría está implementado según la descripción del proyecto.

## Estructura de carpetas
- `backend/`: Código del servidor Node.js y base de datos.
- `frontend/`: Archivos HTML, JS y recursos del cliente.

---

# SI-App Frontend

- Accede a `http://localhost:3000/` para iniciar sesión.
- El dashboard redirige automáticamente según el rol del usuario.
- Cada archivo HTML corresponde a un rol y sus permisos.
