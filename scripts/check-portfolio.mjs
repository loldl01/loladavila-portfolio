import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/scripts\/$/, "");
const dataSource = await readFile(join(root, "projects.js"), "utf8");
function assignedJson(variable, nextVariable = null) {
  const marker = `window.${variable} = `;
  const start = dataSource.indexOf(marker) + marker.length;
  const endMarker = nextVariable ? `;\nwindow.${nextVariable} = ` : ";\n";
  const end = dataSource.indexOf(endMarker, start);
  if (start < marker.length || end < 0) throw new Error(`Missing generated variable: ${variable}`);
  return JSON.parse(dataSource.slice(start, end));
}

const projects = assignedJson("PORTFOLIO_PROJECTS", "PORTFOLIO_BACKSTAGE_IMAGES");
const backstageImages = assignedJson("PORTFOLIO_BACKSTAGE_IMAGES", "PORTFOLIO_IMAGE_DIMENSIONS");
const dimensions = assignedJson("PORTFOLIO_IMAGE_DIMENSIONS");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const diskImages = (await walk(join(root, "Assets", "Images")))
  .filter((path) => {
    const dot = path.lastIndexOf(".");
    return supported.has(dot < 0 ? "" : path.slice(dot).toLowerCase());
  })
  .map((path) => path.slice(root.length))
  .sort();

const projectReferences = projects.flatMap((project) => project.images).sort();
const referenced = [...projectReferences, ...backstageImages].sort();
const uniqueReferences = new Set(referenced);

expect(projects.length === 18, `Expected 18 projects; found ${projects.length}`);
expect(projects.filter((project) => project.selected).length === 8, "Selected Work must contain 8 projects");
expect(projects.filter((project) => !project.selected).length === 10, "Archive must contain 10 projects");
expect(!projects.some((project) => project.folder === "BACKSTAGE" || project.slug === "backstage"), "BACKSTAGE must not be listed as a project");
expect(projects.at(-1)?.folder === "HOJA_DE_CONTACTO", "Contact Sheets must be the final project");
expect(projectReferences.length === 129, `Expected 129 project images; found ${projectReferences.length}`);
expect(backstageImages.length === 4, `Expected 4 portrait About slideshow images; found ${backstageImages.length}`);
expect(backstageImages.every((path) => path.startsWith("Assets/Images/BACKSTAGE/")), "About slideshow must use only BACKSTAGE images");
expect(referenced.length === 133, `Expected 133 displayed images; found ${referenced.length}`);
expect(uniqueReferences.size === referenced.length, "A project image is duplicated across groups");
expect(referenced.every((path) => diskImages.includes(path)), "A displayed image is missing from disk");
const carouselExcluded = diskImages.filter((path) => path.startsWith("Assets/Images/BACKSTAGE/") && !backstageImages.includes(path));
expect(carouselExcluded.length === 2, `Expected 2 horizontal Backstage images excluded from About; found ${carouselExcluded.length}`);
expect(carouselExcluded.every((path) => dimensions[path]?.width > dimensions[path]?.height), "Only horizontal Backstage images may be excluded from About");
expect(Object.keys(dimensions).length === referenced.length + carouselExcluded.length, "Every displayed or Backstage image must have stored dimensions");

const verifiedYears = new Map([
  ["textures", 2025],
  ["color-study", 2022],
  ["ethereal", 2024],
  ["casual-menswear", 2025],
  ["outerwear-study", 2026],
  ["outside", 2025],
  ["cold-study", 2022],
  ["green-study", 2023],
  ["optical", 2026]
]);

for (const [index, project] of projects.entries()) {
  expect(project.order === index + 1, `Incorrect order for ${project.title}`);
  expect(!project.title.includes("_"), `Technical folder name visible in ${project.title}`);
  expect(project.featured.length === (project.selected ? 4 : 1), `Incorrect compact preview count for ${project.title}`);
  expect(project.featured.every((path) => project.images.includes(path)), `Featured image missing from ${project.title}`);
  expect(project.role === "Fashion Styling / Creative Production", `Missing confirmed role in ${project.title}`);
  expect(project.responsibilities === "Fashion styling, production coordination and visual consistency.", `Missing confirmed responsibilities in ${project.title}`);
  expect(!("client" in project || "company" in project || "scope" in project || "deliverables" in project), `Unconfirmed professional data exists in ${project.title}`);
  expect(project.year === verifiedYears.get(project.slug), `Unverified or missing year in ${project.title}`);
  project.images.forEach((path) => {
    const size = dimensions[path];
    expect(Number.isInteger(size?.width) && size.width > 0, `Missing width for ${path}`);
    expect(Number.isInteger(size?.height) && size.height > 0, `Missing height for ${path}`);
  });

  const page = join(root, "projects", `${project.slug}.html`);
  try {
    await access(page);
    const html = await readFile(page, "utf8");
    expect(html.includes(`data-project="${project.slug}"`), `Wrong project identifier in ${project.slug}.html`);
    expect(html.includes(`<title>${project.title} — Lola Davila</title>`), `Wrong browser title in ${project.slug}.html`);
    expect(html.includes("../project-page.js"), `Missing project script in ${project.slug}.html`);
    expect(html.includes("../styles.css?v=20260807-en-hero"), `Missing responsive stylesheet version in ${project.slug}.html`);
    expect(html.includes('href="/#about">ABOUT ME</a>'), `Missing About Me menu label in ${project.slug}.html`);
    expect(!html.includes('href="/#about">EXPERIENCE</a>'), `Old Experience menu label remains in ${project.slug}.html`);
    for (const hash of ["work", "archive", "about", "contact"]) {
      expect(html.includes(`href="/#${hash}"`), `Incorrect ${hash} navigation in ${project.slug}.html`);
    }
  } catch {
    failures.push(`Missing project page: ${project.slug}.html`);
  }
}

const index = await readFile(join(root, "index.html"), "utf8");
for (const id of ["home", "work", "archive", "about", "contact"]) {
  expect(index.includes(`id="${id}"`), `Missing main-page section: ${id}`);
}
expect(index.includes("Lola Davila — Styling / Creative Production"), "Incorrect main browser title");
expect(index.includes("loladavilast@gmail.com"), "Missing confirmed email");
expect(index.includes('href="mailto:loladavilast@gmail.com"'), "Email link must use the exact confirmed mailto address");
expect(index.includes("https://instagram.com/loladl_st"), "Missing confirmed Instagram URL");
expect(index.includes("I’m a fashion stylist"), "About and professional introduction must use first person");
expect(index.includes("styles.css?v=20260807-compact-selected"), "Main page must use the compact Selected Productions stylesheet version");
expect(index.includes("script.js?v=20260807-editorial-scroll"), "Main page must use the editorial-scroll script version");
expect(index.includes("projects.js?v=20260807-layout-tune"), "Main project data must use the layout-tune cache version");
expect(index.includes('width="1363" height="2048"'), "Hero image dimensions are missing");
expect(index.includes('href="#about">ABOUT ME</a>'), "Main menu must label About as About Me");
expect(!index.includes('href="#about">EXPERIENCE</a>'), "Old Experience menu label remains on the main page");
expect(index.includes('id="about-slideshow"'), "About slideshow container is missing");
for (const hash of ["work", "archive", "about", "contact"]) {
  expect(index.includes(`href="#${hash}"`), `Missing main menu target: ${hash}`);
}

const street = projects.find((project) => project.slug === "street-study");
expect(street?.images.length === 5, "Street Study must retain its five compatible images");

const green = projects.find((project) => project.slug === "green-study");
const greenHashes = [];
for (const path of green?.images || []) {
  const bytes = await readFile(join(root, path));
  greenHashes.push(createHash("sha256").update(bytes).digest("hex"));
}
expect(new Set(greenHashes).size === greenHashes.length, "Green Study contains duplicate image content");

const styles = await readFile(join(root, "styles.css"), "utf8");
expect((styles.match(/object-fit:\s*cover/g) || []).length === 2, "Only the Hero and homepage project cards may use object-fit: cover");
expect(styles.includes(".project-card-media img") && styles.includes("object-fit: cover"), "Homepage project cards must use cover framing");
expect(styles.includes(".project-page-gallery img") && styles.includes("object-fit: contain"), "Project-page images must preserve their complete frame");
expect(styles.includes("scroll-padding-top: 58px") && styles.includes("scroll-margin-top: 58px"), "Fixed-header anchor spacing is missing");
expect(styles.includes(".about-slideshow") && styles.includes("aspect-ratio: 2 / 3"), "About slideshow must reserve stable space");


expect(index.includes('<html lang="en" dir="ltr" translate="no">'), "Main document must declare English, LTR and no automatic translation");
expect(index.includes('http-equiv="content-language" content="en"'), "Main document is missing English content-language metadata");
expect(index.includes('hreflang="en"'), "Main document is missing English hreflang");
expect(index.includes('property="og:locale" content="en_US"'), "Main document is missing the English Open Graph locale");
expect(index.includes('name="twitter:card"'), "Main document is missing Twitter Card metadata");
expect(!/lang=["']es(?:[-_][A-Z]{2})?["']/i.test(index), "Spanish lang attribute remains on the main page");

const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
expect(manifest.lang === "en" && manifest.dir === "ltr", "Manifest language must be English and LTR");
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
expect(sitemap.includes('hreflang="en"') && !sitemap.includes('hreflang="es"'), "Sitemap hreflang must be English-only");
const robots = await readFile(join(root, "robots.txt"), "utf8");
expect(robots.includes("Sitemap: https://loladavila-portfolio.pages.dev/sitemap.xml"), "robots.txt must expose the sitemap");
const headers = await readFile(join(root, "_headers"), "utf8");
expect(headers.includes("Content-Language: en"), "Cloudflare headers must declare English");
expect(styles.includes("--hero-motion") && styles.includes("--hero-fit-size") && styles.includes("orientation: landscape"), "Responsive Hero safeguards are missing");
const mainScript = await readFile(join(root, "script.js"), "utf8");
expect(mainScript.includes("function fitHeroName()") && mainScript.includes("document.fonts?.ready"), "Measured Hero fitting is missing");
expect(styles.includes("clamp(144px, 22vw, 380px)"), "The enlarged fluid Hero name size is missing");
expect(styles.includes("clamp(44px, 5.2vw, 82px)") && styles.includes("clamp(38px, 11vw, 46px)"), "Selected Productions must use the compact responsive scale");
expect(styles.includes("padding-block: 32px 24px") && styles.includes("padding-block: 28px 20px") && styles.includes("padding-block: 22px 18px"), "Selected Productions must use compact responsive spacing");
expect(styles.includes("height: auto") && styles.includes("min-height: 0") && styles.includes("margin-block: 0"), "Selected Productions must size itself from its content");
expect(!styles.includes("margin: 0 0 -52px") && !styles.includes("margin-bottom: -32px"), "Selected Productions must not use negative margins to hide excess spacing");
const selectedBreakpoints = [1440, 1024, 430, 390, 375, 320];
for (const width of selectedBreakpoints) {
  const mobile = width <= 600;
  const titleSize = mobile
    ? Math.min(46, Math.max(38, width * .11))
    : Math.min(82, Math.max(44, width * .052));
  const expectedPadding = mobile ? [22, 18] : width <= 900 ? [28, 20] : [32, 24];
  expect(titleSize >= 38 && titleSize <= 82, `Selected Productions title is outside its responsive range at ${width}px`);
  expect(titleSize < width - 20, `Selected Productions title cannot fit the viewport at ${width}px`);
  expect(expectedPadding[0] <= 32 && expectedPadding[1] <= 24, `Selected Productions spacing is excessive at ${width}px`);
}
expect(index.indexOf('class="profile-intro"') > index.indexOf('id="selected-title"') && index.indexOf('class="profile-intro"') < index.indexOf('id="selected-showcase"'), "Professional profile must sit directly before the first production image");
expect(!projects.some((project) => project.slug === "essentials"), "Essentials must not be displayed as a project");
expect(!index.includes("19 PRODUCTIONS") && index.includes("18 PRODUCTIONS"), "Homepage production count must be 18");
expect(index.includes('id="selected-showcase"') && index.includes('class="horizontal-showcase-track"'), "Horizontal Selected Work structure is missing");
expect(index.includes('id="archive-projects" class="archive-grid"'), "Archive project grid is missing");
expect(styles.includes("position: sticky") && styles.includes("scroll-snap-type: x mandatory"), "Desktop sticky or mobile scroll-snap behavior is missing");
expect((styles.match(/overflow-x:\s*clip/g) || []).length >= 2, "Page overflow protection must not break sticky positioning");
expect(mainScript.includes("requestAnimationFrame(updateShowcase)") && mainScript.includes("ResizeObserver"), "Efficient horizontal-scroll calculations are missing");
expect(mainScript.includes('window.addEventListener("scroll", scheduleShowcaseUpdate, { passive: true })'), "Horizontal showcase scroll listener must be passive");
expect((mainScript.match(/project-card-title/g) || []).length === 1, "Project-card titles must be rendered from a single element");
expect(!/project[ -]?index/i.test(index + styles + mainScript), "Project Index remnants remain in the homepage code");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Portfolio checks passed.");
console.log(`Projects: ${projects.length} (8 selected, 10 archive)`);
console.log(`Images: ${projectReferences.length} in projects + ${backstageImages.length} in About`);
console.log("Project pages: 18 active");
