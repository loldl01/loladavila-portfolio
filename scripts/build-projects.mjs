import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/scripts\/$/, "");
const imageRoot = join(root, "Assets", "Images");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const definitions = [
  {
    folder: "01", slug: "modern-menswear", title: "Modern Menswear", selected: true,
    description: "Tailored and casual menswear set against a textured charcoal backdrop. Full-length looks and close portraits bring proportion, layering and fabric contrast into focus.",
    featured: ["17476740_0.jpg", "Relleno generativo 10.jpg", "Relleno generativo 2.jpg", "extra_6 (1).jpg", "extraaa_5 (1).jpg"]
  },
  {
    folder: "06", slug: "neutral-edit", title: "Neutral Edit", selected: true,
    description: "A studio edit moving between monochrome tailoring, softened pastels and clean negative space. The sequence highlights silhouette, line and controlled styling variation.",
    featured: ["17409469_0 (1).jpg", "17760976_0.jpg", "17761350_0.jpg", "IMG_1183.JPG", "IMG_1189.JPG"]
  },
  {
    folder: "BLACK:WHIT3", slug: "monochrome-study", title: "Monochrome Study", selected: true,
    description: "Black-and-white styling explored through sharp tailoring, fluid shapes and graphic contrast. Tonal lighting keeps attention on silhouette and construction.",
    featured: ["DSC_8196.jpg", "IMG_8604.JPG", "IMG_8607.JPG", "PLP_FALSO_307.jpg", "PLP_FALSO_308 (1).jpg"]
  },
  {
    folder: "COLOR", slug: "color-study", title: "Color Study", selected: true,
    description: "Pastel pink and saturated blue create a playful studio tension. Clean styling, pattern and crisp color blocking shape the visual rhythm.",
    featured: ["0.jpg", "15.jpg", "2F1F7196-FBF9-487A-8313-A22F26D0A644.jpg", "8.jpg", "92096228-B677-4AA3-89A4-5FF97E91420C.jpg"]
  },
  {
    folder: "ETEREAL", slug: "ethereal", title: "Ethereal", selected: true,
    description: "Soft neutrals and powder pinks frame fluid dresses, delicate texture and close portraiture. Rotated poses and quiet gestures create an airy editorial pace.",
    featured: ["PLP_FALSO_313.jpg", "PLP_FALSO_316 (1).jpg", "PLP_FALSO_320 (1).jpg", "PLP_FALSO_325.jpg", "PLP_FALSO_327.jpg"]
  },
  {
    folder: "FRESH", slug: "fresh", title: "Fresh", selected: true,
    description: "White and sky-blue styling photographed in clean, direct studio light. Relaxed silhouettes and small gestures give the sequence a light, contemporary energy.",
    featured: ["1 (1).jpg", "11.jpg", "16.jpg", "20.jpg", "portrait-02.jpg"]
  },
  {
    folder: "OUTSIDE", slug: "outside", title: "Outside", selected: true,
    description: "Black-and-white looks meet strong road markings and open daylight. The location adds graphic diagonals and movement to a restrained palette.",
    featured: ["17151036_0.jpg", "17629797_1.jpg", "17631265_0.jpg", "17665650_0.jpg", "17665691_0.jpg"]
  },
  {
    folder: "TEXTURAS", slug: "textures", title: "Textures", selected: true,
    description: "A tactile study of drape, skin, knit and soft neutral layers. Cropped details alternate with wider portraits to emphasize material and touch.",
    featured: ["17495823_16174.jpg", "17497922_16314.jpg", "17502060_16142.jpg", "2.jpg", "6.jpg"]
  },
  {
    folder: "02", slug: "casual-menswear", title: "Casual Menswear", selected: false,
    description: "Relaxed menswear built through dark knitwear, jackets and understated layers. A warm neutral set keeps the focus on styling and pose.",
    featured: ["17527186_0.jpg", "17527210_0.jpg", "17562299_0.jpg", "17614623_0.jpg", "17628952_0.jpg"]
  },
  {
    folder: "03", slug: "graphic-menswear", title: "Graphic Menswear", selected: false,
    description: "Layered sportswear and casual separates photographed against a graphic two-tone backdrop. Strong color breaks and upright silhouettes unify the series.",
    featured: ["17741822_2.jpg", "17741882_0.jpg", "17741892_2.jpg", "17741920_0.jpg", "17741937_0.jpg"]
  },
  {
    folder: "04", slug: "outerwear-study", title: "Outerwear Study", selected: false,
    description: "Technical outerwear is reduced to silhouette, volume and close product detail. The pale studio setting keeps the visual language direct and functional.",
    featured: ["17684544_0188.jpg", "17684554_0755.jpg", "17684966_0977.jpg", "17684966_0992 2.jpg", "17684966_1052.jpg"]
  },
  {
    folder: "07", slug: "street-study", title: "Street Study", selected: false,
    description: "Denim and relaxed urban layers photographed in an industrial exterior. Low angles, seated poses and concrete structures add movement and scale.",
    featured: ["1.jpg", "10 (1).jpg", "11 (1).jpg", "13.jpg", "6.jpg"]
  },
  {
    folder: "BASICOS", slug: "essentials", title: "Essentials", selected: false,
    description: "Colorful everyday pieces brought together in energetic group compositions. The white background and varied poses keep the styling clear and approachable.",
    featured: ["IMG_5391.JPG", "IMG_5394.JPG", "IMG_5395.JPG", "IMG_5410.JPG", "IMG_5424.JPG"]
  },
  {
    folder: "DENIM", slug: "denim", title: "Denim", selected: false,
    description: "Coordinated denim looks explored through group portraiture and tonal blue styling. The sequence balances casual movement with a clean studio finish.",
    featured: ["63CA29B8-EEE7-4D46-934C-2A5199554AB5.jpg", "D5E6CCCC-E4E6-4E03-80B5-A0346ABCC2DF.jpg", "IMG_7645.JPG"]
  },
  {
    folder: "DETALLES", slug: "details", title: "Details", selected: false,
    description: "Close crops bring accessories, print and surface detail forward. The reduced framing turns small styling decisions into the central image.",
    featured: ["17590889_0.jpg", "2 (1).jpg"]
  },
  {
    folder: "FRIO", slug: "cold-study", title: "Cold Study", selected: false,
    description: "Structured outerwear and group portraiture presented in a stark studio setting. Dark layers and direct poses create a compact cold-weather study.",
    featured: ["_DSC6238.JPG", "_DSC6285.JPG"]
  },
  {
    folder: "GREEN", slug: "green-study", title: "Green Study", selected: false,
    description: "Olive and moss tones connect casual menswear and softly styled pairings. Repeated color creates continuity across varied silhouettes and compositions.",
    featured: ["2a.jpg", "3a.jpg", "6 (3).jpg", "6a.jpg", "9.jpg"]
  },
  {
    folder: "OPTICAL", slug: "optical", title: "Optical", selected: false,
    description: "Bold print and elongated silhouettes stand against a saturated blue backdrop. Repetition and contrast give the studio series a graphic pulse.",
    featured: ["17785066_0.jpg", "17785114_0.jpg", "17785162_0.jpg", "17785193_0.jpg", "17785443_0.jpg"]
  },
  {
    folder: "BACKSTAGE", slug: "backstage", title: "Backstage", selected: false,
    description: "A process view of makeup, fittings, styling adjustments and the working studio. These frames document the coordination behind the finished image.",
    featured: ["16644878_1087.jpg", "17409657_0932.jpg", "17590944_0749 1.jpg", "2E87E05D-B0E1-4B97-89CF-2ABA677ED45F.jpg"]
  },
  {
    folder: "HOJA_DE_CONTACTO", slug: "contact-sheets", title: "Contact Sheets", selected: false,
    description: "Contact sheets reveal sequencing, variation and image selection across studio productions. The overview makes the visual editing process visible.",
    featured: ["NEW BOHEME 1.jpg", "SARTORIAL_1.jpg", "Screenshot 2025-03-24 at 15.02.18.png", "Screenshot 2025-03-24 at 15.36.08.png"]
  }
];

function extension(name) {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

const projects = [];
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
  projects.push({
    order: index + 1,
    folder: definition.folder,
    slug: definition.slug,
    title: definition.title,
    selected: definition.selected,
    description: definition.description,
    featured: definition.featured.map(toPath),
    images: files.map(toPath)
  });
}

const data = `/* Generated by scripts/build-projects.mjs. */\nwindow.PORTFOLIO_PROJECTS = ${JSON.stringify(projects, null, 2)};\n`;
await writeFile(join(root, "projects.js"), data, "utf8");

const projectDirectory = join(root, "projects");
await mkdir(projectDirectory, { recursive: true });

for (const project of projects) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${project.title} — a visual production by Lola Davila.">
  <meta name="theme-color" content="#070707">
  <title>${project.title} — Lola Davila</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <script src="../projects.js" defer></script>
  <script src="../project-page.js" defer></script>
</head>
<body data-project="${project.slug}">
  <div class="cursor" aria-hidden="true"></div>
  <header class="site-header">
    <a class="mini-brand" href="../index.html" aria-label="Lola Davila home">LD</a>
    <nav class="desktop-nav" aria-label="Primary navigation">
      <a href="../index.html#work">SELECTED WORK</a>
      <a href="../index.html#archive">ARCHIVE</a>
      <a href="../index.html#about">EXPERIENCE</a>
      <a href="../index.html#contact">CONTACT</a>
      <a href="https://instagram.com/loladl_st" target="_blank" rel="noopener noreferrer">IG</a>
    </nav>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu">MENU</button>
  </header>
  <aside id="mobile-menu" class="mobile-menu" aria-hidden="true">
    <button class="mobile-menu-close" type="button">CLOSE</button>
    <nav aria-label="Mobile navigation">
      <a href="../index.html#work">SELECTED WORK</a>
      <a href="../index.html#archive">ARCHIVE</a>
      <a href="../index.html#about">EXPERIENCE</a>
      <a href="../index.html#contact">CONTACT</a>
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
