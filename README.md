# Lola Davila — Fashion Portfolio V03

Esta versión incluye:

- Fondo negro
- Tipografía estilo C
- Cursor rojo
- Nombre gigante con movimiento al hacer scroll
- Navegación visible desde el inicio
- Galería libre e irregular
- Apertura real de proyectos en pantalla completa
- Sistema fácil para cambiar el orden de los proyectos
- Secciones Work, Archive, About y Contact
- Versión responsive para móvil

## Archivos

- `index.html`: estructura del sitio
- `styles.css`: diseño y layout
- `projects.js`: contenido y orden de los proyectos
- `script.js`: interacciones, cursor, menú y visor de proyectos

## Cómo cambiar el orden

Abre `projects.js`.

Cada proyecto tiene:

```js
order: 1
```

Cambia esos números. El proyecto con `order: 1` aparece primero.

## Cómo añadir un proyecto

Copia uno de los bloques dentro de `projects.js`, pégalo al final y cambia:

- `id`
- `order`
- `title`
- `category`
- `year`
- `client`
- `description`
- `color`

## Cómo subir imágenes reales

Esta versión usa colores provisionales para que puedas probar el diseño sin tener imágenes todavía.

En la siguiente etapa podemos reemplazar cada bloque de color por archivos reales como:

```text
assets/images/editorial-noir/cover.jpg
assets/images/editorial-noir/01.jpg
assets/images/editorial-noir/02.jpg
```

## Publicación

Reemplaza en GitHub estos archivos:

- `index.html`
- `styles.css`
- `projects.js`
- `script.js`
- `README.md`

Cloudflare publicará la actualización automáticamente.
