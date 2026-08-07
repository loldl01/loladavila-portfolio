import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/scripts\/$/, "");
const imageRoot = join(root, "Assets", "Images");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const sharedRole = "Fashion Styling / Creative Production";
const sharedResponsibilities = "Fashion styling, production coordination and visual consistency.";

const definitions = [
  {
    folder: "01", slug: "modern-menswear", title: "Modern Menswear", selected: true,
    description: "Tailored and casual menswear set against a textured charcoal backdrop. Full-length looks and close portraits bring proportion, layering and fabric contrast into focus.",
    featured: ["17476740_0.jpg", "Relleno generativo 10.jpg", "Relleno generativo 2.jpg", "extra_6 (1).jpg"]
  },
  {
    folder: "FRESH", slug: "fresh", title: "Fresh", selected: true,
    description: "White and sky-blue styling photographed in clean, direct studio light. Relaxed silhouettes and small gestures give the sequence a light, contemporary energy.",
    featured: ["1 (1).jpg", "11.jpg", "16.jpg", "20.jpg"]
  },
  {
    folder: "TEXTURAS", slug: "textures", title: "Textures", selected: true,
    description: "A tactile study of drape, skin, knit and soft neutral layers. Cropped details alternate with wider portraits to emphasize material and touch.",
    year: 2025,
    featured: ["17495823_16174.jpg", "17497922_16314.jpg", "2.jpg", "6.jpg"]
  },
  {
    folder: "07", slug: "street-study", title: "Street Study", selected: true,
    description: "Denim and relaxed urban layers photographed in an industrial exterior. Low angles, seated poses and concrete structures add movement and scale.",
    featured: ["1.jpg", "10 (1).jpg", "13.jpg", "6.jpg"]
  },
  {
    folder: "06", slug: "neutral-edit", title: "Neutral Edit", selected: true,
    description: "A studio edit moving between monochrome tailoring, softened pastels and clean negative space. The sequence highlights silhouette, line and controlled styling variation.",
    featured: ["17409469_0 (1).jpg", "17760976_0.jpg", "IMG_1183.JPG", "IMG_1189.JPG"]
  },
  {
    folder: "BLACK:WHIT3", slug: "monochrome-study", title: "Monochrome Study", selected: true,
    description: "Black-and-white styling explored through sharp tailoring, fluid shapes and graphic contrast. Tonal lighting keeps attention on silhouette and construction.",
    featured: ["DSC_8196.jpg", "IMG_8604.JPG", "IMG_8607.JPG", "PLP_FALSO_308 (1).jpg"]
  },
  {
    folder: "COLOR", slug: "color-study", title: "Color Study", selected: true,
    description: "Pastel pink and saturated blue create a playful studio tension. Clean styling, pattern and crisp color blocking shape the visual rhythm.",
    year: 2022,
    featured: ["0.jpg", "15.jpg", "2F1F7196-FBF9-487A-8313-A22F26D0A644.jpg", "8.jpg"]
  },
  {
    folder: "ETEREAL", slug: "ethereal", title: "Ethereal", selected: true,
    description: "Soft neutrals and powder pinks frame fluid dresses, delicate texture and close portraiture. Rotated poses and quiet gestures create an airy editorial pace.",
    year: 2024,
    featured: ["PLP_FALSO_313.jpg", "PLP_FALSO_316 (1).jpg", "PLP_FALSO_325.jpg", "PLP_FALSO_327.jpg"]
  },
  {
    folder: "02", slug: "casual-menswear", title: "Casual Menswear", selected: false,
    description: "Relaxed menswear built through dark knitwear, jackets and understated layers. A warm neutral set keeps the focus on styling and pose.",
    year: 2025,
    featured: ["17527186_0.jpg"]
  },
  {
    folder: "03", slug: "graphic-menswear", title: "Graphic Menswear", selected: false,
    description: "Layered sportswear and casual separates photographed against a graphic two-tone backdrop. Strong color breaks and upright silhouettes unify the series.",
    featured: ["17741822_2.jpg"]
  },
  {
    folder: "04", slug: "outerwear-study", title: "Outerwear Study", selected: false,
    description: "Technical outerwear is reduced to silhouette, volume and close product detail. The pale studio setting keeps the visual language direct and functional.",
    year: 2026,
    featured: ["17684544_0188.jpg"]
  },
  {
    folder: "OUTSIDE", slug: "outside", title: "Outside", selected: false,
    description: "Black-and-white looks meet strong road markings and open daylight. The location adds graphic diagonals and movement to a restrained palette.",
    year: 2025,
    featured: ["17151036_0.jpg"]
  },
  {
    folder: "DENIM", slug: "denim", title: "Denim", selected: false,
    description: "Coordinated denim looks explored through group portraiture and tonal blue styling. The sequence balances casual movement with a clean studio finish.",
    featured: ["63CA29B8-EEE7-4D46-934C-2A5199554AB5.jpg"]
  },
  {
    folder: "DETALLES", slug: "details", title: "Details", selected: false,
    description: "Close crops bring accessories, print and surface detail forward. The reduced framing turns small styling decisions into the central image.",
    featured: ["17590889_0.jpg"]
  },
  {
    folder: "FRIO", slug: "cold-study", title: "Cold Study", selected: false,
    description: "Structured outerwear and group portraiture presented in a stark studio setting. Dark layers and direct poses create a compact cold-weather study.",
    year: 2022,
    featured: ["_DSC6238.JPG"]
  },
  {
    folder: "GREEN", slug: "green-study", title: "Green Study", selected: false,
    description: "Olive and moss tones connect casual menswear and softly styled pairings. Repeated color creates continuity across varied silhouettes and compositions.",
    year: 2023,
    featured: ["2a.jpg"]
  },
  {
    folder: "OPTICAL", slug: "optical", title: "Optical", selected: false,
    description: "Bold print and elongated silhouettes stand against a saturated blue backdrop. Repetition and contrast give the studio series a graphic pulse.",
    year: 2026,
    featured: ["17785066_0.jpg"]
  },
  {
    folder: "HOJA_DE_CONTACTO", slug: "contact-sheets", title: "Contact Sheets", selected: false,
    description: "Contact sheets reveal sequencing, variation and image selection across studio productions. The overview makes the visual editing process visible.",
    featured: ["NEW BOHEME 1.jpg"]
  }
];

function extension(name) {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  const startOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset + 8 < buffer.length) {
    while (offset < buffer.length && buffer[offset] !== 0xff) offset += 1;
    while (offset < buffer.length && buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (startOfFrame.has(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3)
      };
    }
    offset += length;
  }
  return null;
}

function imageDimensions(buffer, file) {
  const ext = extension(file);
  if (ext === ".jpg" || ext === ".jpeg") return jpegDimensions(buffer);
  if (ext === ".png" && buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  throw new Error(`Dimension reader does not support ${file}`);
}

const projects = [];
const dimensions = {};
for (const [index, definition] of definitions.entries()) {
  const folderPath = join(imageRoot, definition.folder);
  const files = (await readdir(folderPath, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && supported.has(extension(entry.name)))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));

  if (!files.length) throw new Error(`No compatible web images found in ${definition.folder}`);
  for (const featured of definition.featured) {
    if (!files.includes(featured)) throw new Error(`Missing featured image: ${definition.folder}/${featured}`);
  }

  const toPath = (file) => `Assets/Images/${definition.folder}/${file}`;
  for (const file of files) {
    const path = toPath(file);
    const size = imageDimensions(await readFile(join(folderPath, file)), path);
    if (!size?.width || !size?.height) throw new Error(`Could not read image dimensions: ${path}`);
    dimensions[path] = size;
  }

  projects.push({
    order: index + 1,
    folder: definition.folder,
    slug: definition.slug,
    title: definition.title,
    selected: definition.selected,
    description: definition.description,
    role: sharedRole,
    responsibilities: sharedResponsibilities,
    ...(definition.year ? { year: definition.year } : {}),
    featured: definition.featured.map(toPath),
    images: files.map(toPath)
  });
}

const backstageFolder = "BACKSTAGE";
const backstageFolderPath = join(imageRoot, backstageFolder);
const backstageFiles = (await readdir(backstageFolderPath, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supported.has(extension(entry.name)))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));

if (!backstageFiles.length) throw new Error("No compatible web images found in BACKSTAGE");

const backstageImages = [];
for (const file of backstageFiles) {
  const path = `Assets/Images/${backstageFolder}/${file}`;
  const size = imageDimensions(await readFile(join(backstageFolderPath, file)), path);
  if (!size?.width || !size?.height) throw new Error(`Could not read image dimensions: ${path}`);
  dimensions[path] = size;
  if (size.height >= size.width) backstageImages.push(path);
}

if (!backstageImages.length) throw new Error("No portrait images found in BACKSTAGE");

const data = `/* Generated by scripts/build-projects.mjs. */\nwindow.PORTFOLIO_PROJECTS = ${JSON.stringify(projects, null, 2)};\nwindow.PORTFOLIO_BACKSTAGE_IMAGES = ${JSON.stringify(backstageImages, null, 2)};\nwindow.PORTFOLIO_IMAGE_DIMENSIONS = ${JSON.stringify(dimensions, null, 2)};\n`;
await writeFile(join(root, "projects.js"), data, "utf8");

const projectDirectory = join(root, "projects");
await mkdir(projectDirectory, { recursive: true });

for (const project of projects) {
  const html = `<!doctype html>
<html lang="en" dir="ltr" translate="no">
<head>
  <meta charset="utf-8">
  <meta http-equiv="content-language" content="en">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${project.title} — a visual production by Lola Davila.">
  <meta name="theme-color" content="#070707">
  <title>${project.title} — Lola Davila</title>
  <link rel="canonical" href="https://loladavila-portfolio.pages.dev/projects/${project.slug}.html">
  <link rel="alternate" hreflang="en" href="https://loladavila-portfolio.pages.dev/projects/${project.slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://loladavila-portfolio.pages.dev/projects/${project.slug}.html">
  <link rel="manifest" href="/manifest.json">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Lola Davila">
  <meta property="og:title" content="${project.title} — Lola Davila">
  <meta property="og:description" content="${project.title} — a visual production by Lola Davila.">
  <meta property="og:url" content="https://loladavila-portfolio.pages.dev/projects/${project.slug}.html">
  <meta property="og:image" content="https://loladavila-portfolio.pages.dev/${encodeURI(project.featured[0])}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${project.title} — Lola Davila">
  <meta name="twitter:description" content="${project.title} — a visual production by Lola Davila.">
  <meta name="twitter:image" content="https://loladavila-portfolio.pages.dev/${encodeURI(project.featured[0])}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Bodoni+Moda:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css?v=20260807-en-hero">
  <script src="../projects.js?v=20260807-about" defer></script>
  <script src="../project-page.js?v=20260807-about" defer></script>
</head>
<body data-project="${project.slug}">
  <div class="cursor" aria-hidden="true"></div>
  <header class="site-header">
    <a class="mini-brand" href="/" aria-label="Lola Davila home">LD</a>
    <nav class="desktop-nav" aria-label="Primary navigation">
      <a href="/#work">SELECTED WORK</a>
      <a href="/#archive">ARCHIVE</a>
      <a href="/#about">ABOUT ME</a>
      <a href="/#contact">CONTACT</a>
      <a href="https://instagram.com/loladl_st" target="_blank" rel="noopener noreferrer">IG</a>
    </nav>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu">MENU</button>
  </header>
  <aside id="mobile-menu" class="mobile-menu" aria-hidden="true">
    <button class="mobile-menu-close" type="button">CLOSE</button>
    <nav aria-label="Mobile navigation">
      <a href="/#work">SELECTED WORK</a>
      <a href="/#archive">ARCHIVE</a>
      <a href="/#about">ABOUT ME</a>
      <a href="/#contact">CONTACT</a>
      <a href="https://instagram.com/loladl_st" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
    </nav>
  </aside>
  <main id="project-content" class="project-page"></main>
</body>
</html>
`;
  await writeFile(join(projectDirectory, `${project.slug}.html`), html, "utf8");
}

const imageCount = projects.reduce((sum, project) => sum + project.images.length, 0);
console.log(`Generated ${projects.length} project pages with ${imageCount} compatible images.`);
