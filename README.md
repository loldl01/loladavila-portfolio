# Lola Davila — Fashion Portfolio | Capítulos editoriales

Esta versión toma los archivos base entregados por Lola y reconstruye exclusivamente
la sección de proyectos como una secuencia de capítulos editoriales.

## Qué cambió

- Cada proyecto ahora es un capítulo de gran formato.
- Los títulos tienen mucho más aire y jerarquía.
- Cada capítulo combina una imagen principal, una imagen secundaria y una frase.
- Hay cuatro composiciones controladas que se repiten automáticamente al añadir proyectos.
- Ya no se muestran tarjetas dentro de cajas ni spreads con bordes redondeados.
- Se mantiene el hero, el menú, el marquee, el archivo arrastrable, el cursor rojo,
  la sección Sobre mí y Contacto.
- El menú continúa usando una sola tipografía.

## Archivos modificados

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

`projects.js` conserva los mismos datos y el mismo sistema de orden.

## Agregar proyectos

Añade un nuevo objeto en `projects.js`. La web asignará automáticamente una de las
cuatro composiciones de capítulo según su posición.

## Publicación

Reemplaza los cinco archivos en GitHub. No borres tu carpeta `assets/images/`.
Cloudflare volverá a publicar automáticamente.
