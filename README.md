# 🍔 TFG - Restaurante de Hamburguesas

Este proyecto es una aplicación web para la gestión y presentación de un restaurante de hamburguesas, desarrollada como parte de mi Trabajo de Fin de Grado de DAM. Está compuesta por un **frontend en React** y un **backend en Laravel**, integrando tecnologías modernas tanto para la parte visual como para la lógica del servidor.

🔗 **Repositorio GitHub**: [https://github.com/OscarBarrera89/TFG-DAM]

---

## 📁 Estructura del Proyecto

TFG-DAM/
├── backend-laravel/ → Proyecto Laravel (PHP)
├── frontend-react/ → Proyecto React (JavaScript)


---

## Tecnologías utilizadas

### Front-End (React)
- **React**
- **MUI (Material UI)**: diseño de componentes modernos
- **Zustand**: gestión de estado global
- **React Router**: navegación entre páginas

### Back-End (Laravel)
- **Laravel**
- **MySQL**
- **Migrations y Seeders**
- **Docker**

---

## Back-End

### Clonar el repositorio.
```bash
git clone https://github.com/OscarBarrera89/TFG-DAM.git

cd backend-laravel
composer install         # Instala dependencias de PHP
cp .env                  # Copia archivo de entorno
php artisan migrate      # Crea las tablas en la base de datos
```
### Ejecutar el servidor:
```bash
cd backend-laravel
php artisan serve
```
### Ver las rutas disponibles:
```
php artisan route:list
```
## Frontend
```bash
git clone https://github.com/OscarBarrera89/TFG-DAM.git

cd frontend-react
npm install  # Instala node_modules y dependencias
```
### Iniciar en modo desarrollo:
```bash
npm run dev
```
### Generar build de producción:
```bash
npm run build
```


