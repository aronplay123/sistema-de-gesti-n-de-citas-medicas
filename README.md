# Sistema de Gestión de Citas Médicas — Arquitectura de la Información

Este repo es una demo para la asignatura de Arquitectura de la Información. El proyecto ahora usa páginas raíz (multi-page) y también incluye utilidades para una SPA si deseas reutilizarlas.

## Sitemap (resumido)

-- Inicio (Landing) — `landing.html`
-- Citas — `citas.html`
-- Pacientes — `pacientes.html`
-- Historiales — `historiales.html`
-- Dashboard — `dashboard.html`
-- Configuración — `configuracion.html`

Archivos estáticos:
- `img/` — imágenes y logos
- `css/` — estilos
- `js/` — lógica (incluye `main.js` para navegación dinámica)

## Cómo añadir una nueva página (fragment)

1. Crear `nueva-pagina.html` con el contenido HTML de la página. Incluye un encabezado `h1` o `h2` como título.
2. En `index.html` añade un enlace en la navegación con: `href="nueva-pagina.html"`.
3. En `js/main.js` añade un entry opcional en `pageInitializers` si necesitas inicialización JS para esa página.
4. Añade un título amigable si quieres que cambie el `document.title` cuando uses la SPA (`pageTitles['nueva-pagina.html'] = 'Nombre — MediCare'`) o simplemente ajusta el `<title>` de la página raíz.

## Notas y recomendaciones

- Este repo ahora usa páginas raíz (multi-page). Los fragments en `pages/` han sido eliminados y las páginas completas están en la raíz.
- Hay un archivo `dashboard.html` en la raíz (página completa).
- Se agregó un "skip link" y breadcrumbs dinámicos para mejorar la accesibilidad. Al cargar un fragmento, el foco se moverá al primer encabezado.

Si quieres, puedo crear un `sitemap.json` o migrar el duplicado `dashboard.html` según prefieras.

---
Hecho automáticamente: mejoras de accesibilidad y documentación básica.
