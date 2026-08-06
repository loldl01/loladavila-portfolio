# Lola Davila Fashion Portfolio — V04

Cambios principales:

- Se eliminó el nombre pequeño de la esquina superior izquierda.
- El cursor rojo ya no muestra la palabra OPEN.
- El menú inicial activa fondos visuales distintos al pasar el cursor.
- Se añadió una serif display con carácter editorial.
- Se mezclan tipografías en títulos, menú, archivo y proyectos.
- Se mantiene el nombre grande y su movimiento.
- Se conserva la composición irregular de las imágenes.

## Archivos a reemplazar en GitHub

- index.html
- styles.css
- script.js
- projects.js
- README.md

Cloudflare volverá a publicar automáticamente.

## Imágenes del menú

Por ahora los fondos del menú son composiciones provisionales.

Más adelante se pueden reemplazar por imágenes reales con CSS, por ejemplo:

```css
.preview-work {
  background-image:
    linear-gradient(90deg, rgba(0,0,0,.2), rgba(0,0,0,.75)),
    url("assets/images/menu-work.jpg");
}
```
