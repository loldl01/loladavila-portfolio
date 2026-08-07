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

expect(projects.length === 19, `Expected 19 projects; found ${projects.length}`);
expect(projects.filter((project) => project.selected).length === 8, "Selected Work must contain 8 projects");
expect(projects.filter((project) => !project.selected).length === 11, "Archive must contain 11 projects");
expect(!projects.some((project) => project.folder === "BACKSTAGE" || project.slug === "backstage"), "BACKSTAGE must not be listed as a project");
expect(projects.at(-1)?.folder === "HOJA_DE_CONTACTO", "Contact Sheets must be the final project");
expect(projectReferences.length === 134, `Expected 134 project images; found ${projectReferences.length}`);
expect(backstageImages.length === 6, `Expected 6 About slideshow images; found ${backstageImages.length}`);
expect(backstageImages.every((path) => path.startsWith("Assets/Images/BACKSTAGE/")), "About slideshow must use only BACKSTAGE images");
expect(referenced.length === 140, `Expected 140 compatible images; found ${referenced.length}`);
expect(uniqueReferences.size === referenced.length, "A project image is duplicated across groups");
expect(JSON.stringify(referenced) === JSON.stringify(diskImages), "The project data and compatible image files are not synchronized");
expect(Object.keys(dimensions).length === referenced.length, "Every image must have stored dimensions");

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
    expect(html.includes("?v=20260807-about"), `Missing cache-safe asset version in ${project.slug}.html`);
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
expect((index.match(/\?v=20260807-about/g) || []).length === 3, "Main assets must use the current cache-safe version");
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
expect((styles.match(/object-fit:\s*cover/g) || []).length === 1, "Only the hero may use object-fit: cover");
expect(styles.includes(".project-gallery img") && styles.includes("object-fit: contain"), "Project images must use object-fit: contain");
expect(styles.includes("scroll-padding-top: 58px") && styles.includes("scroll-margin-top: 58px"), "Fixed-header anchor spacing is missing");
expect(styles.includes(".about-slideshow") && styles.includes("aspect-ratio: 2 / 3"), "About slideshow must reserve stable space");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Portfolio checks passed.");
console.log(`Projects: ${projects.length} (8 selected, 11 archive)`);
console.log(`Images: ${projectReferences.length} in projects + ${backstageImages.length} in About`);
console.log("Project pages: 19 active");
