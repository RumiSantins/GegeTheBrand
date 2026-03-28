# 🌿 Gege The Brand - E-commerce Platform

Bienvenido al repositorio central de **Gege The Brand**, una tienda en línea premium diseñada para ofrecer una experiencia de usuario fluida, elegante y moderna.

Este proyecto integra un frontend interactivo de alto rendimiento con un backend robusto para la gestión de productos, pedidos y contenido dinámico.

---

## 📢 Últimas Actualizaciones (Marzo 2026)

- **✨ Rediseño Responsivo del Admin:** El panel de administración ahora es 100% adaptable. Se han implementado pestañas con scroll horizontal, tablas colapsables y controles optimizados para dispositivos móviles y tablets.
- **🔗 Optimización de Página de Enlaces (`/links`):** Correcciones estéticas monumentales. Se centró el branding, se añadieron efectos de cristalería (backdrop-blur) y se actualizaron los accesos directos a redes sociales (Instagram, WhatsApp, TikTok).
- **🔒 Seguridad & CORS:** Se ajustó la configuración del backend para permitir la comunicación segura entre el frontend y la API utilizando la IP pública del servidor en GCP.
- **📦 Automatización de Inventario:** Inclusión de nuevos scripts en Python para la carga masiva de productos y obtención de recursos visuales reales.

---

## 🚀 Características Principales

- **Tienda Dinámica:** Catálogo de productos con variantes, imágenes y filtros.
- **Admin Dashboard Responsivo:** Panel de administración rediseñado para una experiencia fluida tanto en escritorio como en dispositivos móviles y tablets:
  - Navegación por pestañas optimizada (scroll horizontal en móviles).
  - Gestión completa de Productos, Categorías, Slider y Pedidos.
  - Buscador de productos en tiempo real y visualización avanzada de stock.
- **Gestión de Contenido:** Edición dinámica del Hero Slider, Manifesto y secciones editoriales.
- **Página de Enlaces (Linktree-style):** Sección aislada (`/links`) optimizada para redes sociales.
- **Diseño Premium:** Micro-animaciones con Framer Motion, scroll suave con Lenis y soporte total para Dark Mode.
- **Infrastructure Ready:** Configurado con Docker para un despliegue y desarrollo sencillo en la nube (GCP).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Estilos:** Tailwind CSS (Diseño Responsivo)
- **Animaciones:** Framer Motion
- **Navegación:** React Router 7
- **Utilidades:** Lucide React (Iconos), Styled Components, Lenis (Smooth Scroll)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Base de Datos:** SQLite (vía SQLModel/SQLAlchemy)
- **Seguridad:** JWT (JSON Web Tokens) & Password Hashing
- **Gestión de Archivos:** Carga de imágenes local persistente mediante scripts de utilidad.

### Infraestructura
- **Containerización:** Docker & Docker Compose
- **Despliegue:** Optimizado para instancias GCP (Google Cloud Platform).

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
   - **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **Documentación API (Swagger):** [http://localhost:8080/docs](http://localhost:8080/docs)

### 🔐 Credenciales de Acceso (Desarrollo)

Para acceder al **Admin Dashboard** en el entorno de desarrollo local, utiliza las siguientes credenciales configuradas por defecto:

| Usuario | Contraseña |
| :--- | :--- |
| `admin` | `password123` |

> [!IMPORTANT]
> Estas credenciales están configuradas en el archivo `backend/.env`. Se recomienda cambiarlas antes de cualquier despliegue en producción.

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
*El frontend correrá en http://localhost:5173 (Admin en [http://localhost:5173/admin](http://localhost:5173/admin))*

---

## 📂 Estructura del Proyecto

- `/src`: Código fuente del frontend (Componentes, Páginas, Hooks).
- `/backend`: Lógica del servidor, modelos de base de datos y scripts de utilidad.
- `/public`: Activos estáticos públicos para el frontend.
- `/backend/static`: Almacenamiento persistente de imágenes subidas desde el panel de administrador.

---

## 🛠️ Scripts de Utilidad (Backend)

Dentro de la carpeta `backend/` se incluyen scripts para automatizar tareas comunes:

- `add_faldas_shorts.py`: Agrega productos de ejemplo para las categorías de faldas y shorts.
- `fetch_platzi.py`: Obtiene URLs de imágenes de productos desde la API de Platzi para pruebas.
- `fetch_real_images.py`: Consulta APIs externas (FakeStore) para obtener recursos visuales reales.
- `update_images.py`: Utilidad para actualizar masivamente las URLs de imágenes de los productos.
- `list_cats.py`: Script rápido para listar las categorías actuales en la base de datos.
- `seed.py` / `fix_seed_precise.py`: Poblamiento inicial y corrección precisa de la base de datos con categorías y productos base.

---

## 📖 Documentación Específica

Para guías detalladas sobre características particulares, consulta los siguientes archivos:

- [🔗 Guía de Página de Enlaces (Links Page)](file:///c:/apps/gegethebrand/DOCS_LINKS.md): Instrucciones sobre cómo configurar y personalizar la sección de redes sociales.

---
*Gege The Brand - Estilo & Esencia.*
