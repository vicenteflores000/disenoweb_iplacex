# Luz & Bloom — Sitio Web Artesanal

Versión final del sitio web desarrollado para el emprendimiento **Luz & Bloom**, dedicado a la elaboración artesanal de velas aromáticas, jabones botánicos y sales de baño relajantes.

Proyecto correspondiente al **Examen Final** de la asignatura **Diseño Web**.

## Enlace de despliegue (Netlify)

- **Sitio en producción:** https://disenoweb-iplacex-lb0o.netlify.app/

## Estructura del proyecto

```text
.
├── index.html               # Portada, propuesta artesanal y líneas de productos
├── nosotros.html            # Historia, misión, visión y enfoque principal
├── productos.html           # Catálogo interactivo (10 productos) y materias primas
├── contacto.html            # Canales de atención y formulario de solicitud vía WhatsApp
├── css/
│   └── estilos.css          # Hoja de estilos personalizada (paleta cálida Luz & Bloom)
├── js/
│   └── app.js               # Lógica JavaScript y manejo de eventos del DOM
├── img/                     # 22 recursos gráficos y fotografías de productos
└── vendor/
    └── bootstrap/           # Bootstrap 5.3.3 compilado localmente (CSS y JS)
```

## Tecnologías utilizadas

- **HTML5** (`header`, `nav`, `main`, `section`, `article`, `footer`) y atributos de accesibilidad (`aria-label`, `aria-current`, `aria-live`).
- **CSS3 + Bootstrap 5.3.3** integrado localmente para diseño responsivo (escritorio, tablet y móvil) con variables CSS personalizadas en `css/estilos.css`.
- **JavaScript** sin dependencias externas adicionales en `js/app.js`.

## Funcionalidades JavaScript y eventos implementados

1. **Catálogo interactivo (`productos.html`):**
   - Filtro por categoría (`Todos`, `Velas y Bombones`, `Jabones`, `Sales de Baño`) mediante eventos `click`.
   - Buscador en tiempo real con evento `input` y normalización de texto (ignora mayúsculas y tildes).
   - Contador dinámico de resultados, ocultamiento automático de secciones vacías y botón para limpiar búsqueda.
   - Botón **"Solicitar este producto"** que redirige a `contacto.html` precargando línea, aroma y producto mediante `URLSearchParams`.
2. **Formulario de contacto y pedidos (`contacto.html`):**
   - Precarga automática desde parámetros de URL.
   - Validación interactiva campo por campo (`blur` e `input`) con retroalimentación visual.
   - Vista previa en vivo del resumen del pedido (`input` y `change`).
   - Evento `submit` con `preventDefault()` que valida los datos y genera un enlace formateado hacia el WhatsApp oficial de la marca (`+56 9 3054 9400`), además de limpieza completa en `reset`.
3. **Botón flotante "Volver arriba" (todas las páginas):**
   - Aparece al superar 240 px de desplazamiento (`scroll`) y retorna suavemente al inicio (`click`).

## Visualización local

Basta con abrir `index.html` en cualquier navegador web.

## Autor

- **Vicente Flores Arriaza** — Diseño, maquetación HTML5, adaptación de estilos CSS/Bootstrap, programación JavaScript, organización del repositorio y despliegue en Netlify.
