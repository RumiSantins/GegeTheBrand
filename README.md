# 🌿 Gege The Brand - E-commerce Platform

Bienvenido al repositorio central de **Gege The Brand**, una tienda en línea premium diseñada para ofrecer una experiencia de usuario fluida, elegante y moderna.

Este proyecto integra un frontend interactivo de alto rendimiento con un backend robusto para la gestión de productos, pedidos y contenido dinámico.

---

## 🚀 Características Principales

- **Tienda Dinámica:** Catálogo de productos con variantes, imágenes y filtros.
- **Admin Dashboard:** Panel de administración completo para gestionar:
  - Productos y Categorías.
  - Hero Slider (Carrusel principal).
  - Editorial & Manifesto (Contenido de marca).
  - Configuración del sitio y pedidos.
- **Página de Enlaces (Linktree-style):** Sección aislada (`/links`) optimizada para redes sociales.
- **Diseño Premium:** Micro-animaciones con Framer Motion, scroll suave con Lenis y soporte total para Dark Mode.
- **Infrastructure Ready:** Configurado con Docker para un despliegue y desarrollo sencillo.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Navegación:** React Router 7
- **Utilidades:** Lucide React (Iconos), Styled Components, Lenis (Smooth Scroll)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Base de Datos:** SQLite (vía SQLModel/SQLAlchemy)
- **Seguridad:** JWT (JSON Web Tokens) & Password Hashing
- **Gestión de Archivos:** Carga de imágenes local persistente

### Infraestructura
- **Containerización:** Docker & Docker Compose

---

## ⚙️ Cómo Levantar el Proyecto

La forma más sencilla de ejecutar todo el ecosistema (Frontend + Backend) es utilizando Docker Compose.

1. **Clonar el repositorio:**
   ```bash
   git clone <repo-url>
   cd gegethebrand
   ```

2. **Iniciar con Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Accesos Locales:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **Documentación API (Swagger):** [http://localhost:8080/docs](http://localhost:8080/docs)

### Desarrollo Local (Sin Docker)

Si prefieres ejecutar los servicios manualmente:

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*El backend correrá en http://localhost:8000*

#### 2. Frontend (React + Vite)
```bash
# Desde la raíz del proyecto
npm install
npm run dev
```
*El frontend correrá en http://localhost:5173*

---

## 📂 Estructura del Proyecto

- `/src`: Código fuente del frontend (Componentes, Páginas, Hooks).
- `/backend`: Lógica del servidor, modelos de base de datos y scripts de utilidad.
- `/public`: Activos estáticos públicos para el frontend.
- `/backend/static`: Almacenamiento persistente de imágenes subidas desde el panel de administrador.

---

## 📖 Documentación Específica

Para guías detalladas sobre características particulares, consulta los siguientes archivos:

- [🔗 Guía de Página de Enlaces (Links Page)](file:///c:/apps/gegethebrand/DOCS_LINKS.md): Instrucciones sobre cómo configurar y personalizar la sección de redes sociales.

---
*Gege The Brand - Estilo & Esencia.*
