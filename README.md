# Lola Davila — Portafolio Editorial Inmersivo

Esta versión transforma la apertura de cada proyecto en una experiencia editorial completa.

## Qué cambia

- Al hacer clic en un proyecto, se abre una página inmersiva a pantalla completa.
- El proyecto comienza con un título enorme mezclando sans y serif.
- Después aparece una portada de pantalla completa.
- Incluye una introducción editorial, conceptos clave y seis momentos fotográficos.
- Las imágenes se mueven suavemente al hacer scroll para crear profundidad.
- Al final aparecen créditos y un enlace visual al siguiente proyecto.
- El menú principal continúa usando una sola tipografía.
- La estructura principal, el hero, el marquee, Archivo, Sobre mí y Contacto se mantienen.

## Archivos

- `index.html`
- `styles.css`
- `script.js`
- `projects.js`
- `README.md`

## Imágenes reales

Cada proyecto ahora acepta:

```js
gallery: [
  "assets/images/mi-proyecto/01.jpg",
  "assets/images/mi-proyecto/02.jpg",
  "assets/images/mi-proyecto/03.jpg"
]
```

También puedes añadir:

```js
keywords: ["Movimiento", "Textura", "Carácter"]
```

La versión actual reutiliza temporalmente las imágenes de portada existentes para mostrar el recorrido.

## Publicación

Reemplaza los cinco archivos en GitHub. Conserva `assets/images/`.
Cloudflare detectará el cambio y publicará automáticamente.
