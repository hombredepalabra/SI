# SI-App Frontend

## Archivos principales
- `login.html`: Formulario de inicio de sesión.
- `dashboard.html`: Redirige al archivo según el rol del usuario.
- `admin.html`: Panel para administrador (CRUD completo de registros).
- `operador.html`: Panel para operador (editar y eliminar registros).
- `usuario.html`: Panel para usuario (agregar y consultar registros).
- `auditor.html`: Panel para auditor (ver historial y calificar con Likert).

## Notas
- Todos los archivos usan Bootstrap para el estilo.
- El acceso a cada archivo está protegido por el backend según el rol.
- El backend sirve estos archivos automáticamente.
