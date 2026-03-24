# 🔗 Gege The Brand - Página de Enlaces (Linktree-style)

Esta es una sección aislada de la tienda diseñada específicamente para ser compartida en perfiles de redes sociales (Instagram, TikTok, WhatsApp, etc.). Permite centralizar todos los puntos de contacto importantes en una sola URL elegante y optimizada.

## 🚀 Características Principales

- **Aislamiento Total:** La página ` /links` no carga el Header ni el Footer principal del sitio, eliminando distracciones y enfocando la atención del usuario en los enlaces.
- **Branding Coherente:** Mantiene la estética premium de **GEGE THE BRAND** con tipografías serif, fondos suaves y micro-animaciones.
- **Diseño Móvil-Primero:** Optimizada para dispositivos móviles, que es desde donde vendrá la mayoría del tráfico de redes sociales.
- **Versatilidad:** Funciona como un punto de entrada dinámico hacia diferentes secciones de la tienda o redes externas.
- **Soporte Dark Mode:** Totalmente compatible con el tema oscuro/claro del sitio.

## 🛠️ Enlaces Disponibles (Configuración Actual)

La página viene pre-configurada con los siguientes accesos:

1.  **Nuestra Tienda:** Dirige a la página principal (`/`).
2.  **Instagram:** Enlace externo al perfil oficial.
3.  **WhatsApp:** Enlace directo para contacto rápido.
4.  **TikTok:** Enlace al perfil de contenido de video.
5.  **Catálogo Cuidado Personal:** Enlace filtrado directamente a la categoría de productos más popular.

## ⚙️ Cómo Personalizar los Enlaces

Para cambiar los nombres, iconos o URLs de los botones, debes editar el archivo:   
`src/pages/Links.jsx`

Busca la constante `socialLinks`:
```javascript
const socialLinks = [
  {
    name: 'Nombre del Botón',
    url: '/tu-ruta-o-url-externa',
    icon: <IconoCorrespondiente />,
    highlight: true // Si quieres que el botón destaque en blanco/negro
  },
  // ... más enlaces
];
```

## 💻 Cómo Levantar el Proyecto

Para ver la página en tu entorno local:

1.  Asegúrate de tener las dependencias instaladas:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
3.  Navega a: `http://localhost:5173/links`

## 📦 Despliegue

Una vez que el sitio esté en producción, la URL será simplemente:  
`gegethebrand.com/links`

---
*Creado para Gege The Brand - Estilo & Esencia.*
