# Lola Davila — Fashion Portfolio (V08)

Reescritura completa del sitio, inspirada en la dirección visual de
petrmenhart.xyz, gougoucore.com y el personal de lskn en Readymag:
tipografía enorme, collage de imágenes con leve rotación, cursor
personalizado con inercia, y texto en movimiento continuo (marquee).

## Qué cambia en esta versión

- **Un solo `styles.css` limpio.** Se eliminaron todos los parches en
  cascada (`V06`, `V07`, reglas con `!important` repetidas) y se
  reescribió como una sola hoja consolidada, más fácil de mantener.
- **Marquee (ticker) nuevo** entre el hero y la sección de trabajo,
  con texto en movimiento infinito — típico de portafolios editoriales.
- **Cursor con inercia.** El punto rojo ahora sigue al mouse con un
  suave "lag" en vez de saltar instantáneamente.
- **Reveal on scroll.** Los títulos de sección aparecen con una
  transición suave al entrar en pantalla (usa `IntersectionObserver`,
  sin librerías externas).
- **Archivo arrastrable.** La sección "Archive" ahora es una tira
  horizontal que se puede arrastrar con el mouse, la rueda o el dedo
  (touch), en vez de una grilla estática.
- **Navegación unificada.** Todo el menú (desktop, hero y mobile) usa
  una sola tipografía, sin mezclas que antes rompían el alineado.
- Se mantiene el mismo contenido, los mismos 8 proyectos y la misma
  identidad de marca (negro / rojo, Archivo Black + Fraunces + DM Sans).

## Archivos

- `index.html` — estructura de la página.
- `styles.css` — todos los estilos.
- `script.js` — interacciones (proyectos, visor, menú, cursor, drag, reveal).
- `projects.js` — datos de los 8 proyectos (editá acá título, categoría,
  año, cliente, descripción, color e imagen de cada uno).

## Imágenes

El sitio espera imágenes en `assets/images/`:

- `project-01.jpg` … `project-08.jpg` — una por proyecto (referenciadas
  desde `projects.js`, campo `image`).
- `menu-work.jpg`, `menu-archive.jpg`, `menu-about.jpg`,
  `menu-contact.jpg` — fondos que aparecen al pasar el mouse sobre el
  menú del hero.

Si una imagen no existe todavía, el proyecto se ve igual gracias a un
color de fondo de respaldo (`color` en `projects.js`), así que podés
subir el código primero y agregar fotos después.

## Cómo subirlo a GitHub Pages

1. Creá un repositorio nuevo en GitHub (o usá uno existente).
2. Subí estos 4 archivos (`index.html`, `styles.css`, `script.js`,
   `projects.js`) más tu carpeta `assets/images/` a la raíz del repo.
3. En el repo: **Settings → Pages → Branch**, elegí `main` (o `master`)
   y la carpeta `/root`, guardá.
4. En un par de minutos GitHub te da una URL tipo
   `https://tuusuario.github.io/tu-repo/` con el sitio publicado.

No hace falta build ni instalar nada: es HTML/CSS/JS puro.
