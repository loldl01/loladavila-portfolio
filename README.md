# Lola Davila — Fashion Stylist Portfolio

Sitio estático (HTML/CSS/JS puro, sin frameworks ni build step).
Listo para subir a GitHub y publicar con Cloudflare Pages.

## Estructura

```
loladavila-portfolio/
├── index.html
├── css/style.css
├── js/
│   ├── gallery-data.js   ← aquí defines tus colecciones/producciones
│   └── script.js
├── images/
│   ├── hero/
│   │   ├── cover.jpg     ← foto de portada (mujer rapada)
│   │   └── about.jpg     ← foto de la sección "About"
│   └── work/
│       └── <slug-coleccion>/01.jpg, 02.jpg...
└── README.md
```

## 1. Agregar tu foto de portada

Reemplaza `images/hero/cover.jpg` con la foto elegida (la de la mujer
con cabeza rapada). El nombre y `object-position` ya están listos —
si la foto necesita otro encuadre, ajusta en `style.css`:
`.hero-media img { object-position: center 20%; }`

## 2. Agregar tu foto de "About"

Reemplaza `images/hero/about.jpg`.

## 3. Editar tu reseña (bio)

Abre `index.html`, busca `<!-- ABOUT -->` y edita el texto dentro de
`.about-lede` y `.about-body`. También puedes cambiar "Based in".

## 4. Subir tus fotos de trabajo (90+)

1. Crea una carpeta por cada producción/estilo dentro de `images/work/`,
   por ejemplo:
   ```
   images/work/monochrome-editorial/01.jpg
   images/work/monochrome-editorial/02.jpg
   images/work/studio-campaign/01.jpg
   ```
2. Abre `js/gallery-data.js` y agrega/edita un bloque por colección
   con el mismo `slug` (nombre de carpeta) y la lista de archivos.
3. Guarda — el sitio arma automáticamente la grilla, los filtros por
   colección y el lightbox (click para ampliar, flechas para navegar).

> Si me compartes la carpeta completa con tus fotos, yo selecciono las
> mejores 50+, las agrupo por producción/estilo y te dejo este archivo
> ya completado con los nombres reales — solo tendrías que copiar las
> carpetas de fotos dentro de `images/work/`.

## 5. Cargos / roles de la barra roja en movimiento

Están en `index.html` dentro de `<!-- ROLES MARQUEE -->`. Edita, agrega
o quita `<span>ROL</span>` según tus títulos profesionales reales
(actualmente: Fashion Stylist, Wardrobe Stylist, Editorial Styling,
Creative Direction, Set Stylist, Personal Styling, Campaign Styling,
Runway Styling).

## 6. Redes / contacto

Ya están enlazados:
- Instagram: `@loladl_st` → https://instagram.com/loladl_st
- Email: `loladavilast@gmail.com`

## Subir a GitHub

```bash
cd loladavila-portfolio
git init
git add .
git commit -m "Portfolio inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## Publicar en Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → Pages →
   Connect to Git → selecciona tu repositorio.
2. Framework preset: **None**.
3. Build command: (vacío / none).
4. Output directory: `/` (raíz del repo).
5. Deploy.

Cada `git push` a `main` vuelve a publicar el sitio automáticamente.

## Notas técnicas

- Sin dependencias externas salvo Google Fonts (Fraunces, Archivo,
  Archivo Expanded, IBM Plex Mono).
- Cursor rojo personalizado, barra roja en movimiento con los cargos,
  nombre en movimiento superpuesto a la foto de portada (mix-blend-mode),
  galería agrupada por colección con filtros y lightbox, animaciones
  de aparición al hacer scroll, responsive completo, y respeta
  `prefers-reduced-motion`.
- Mientras no agregues fotos reales, cada espacio de imagen muestra un
  placeholder oscuro indicando exactamente la ruta esperada (ej.
  `images/work/monochrome-editorial/01.jpg`), así siempre sabes dónde
  colocar cada archivo.
