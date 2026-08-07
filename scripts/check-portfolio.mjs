import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/scripts\/$/, "");
const dataSource = await readFile(join(root, "projects.js"), "utf8");
const json = dataSource
  .replace(/^\/\*[\s\S]*?\*\/\s*/, "")
  .replace(/^window\.PORTFOLIO_PROJECTS\s*=\s*/, "")
  .replace(/;\s*$/, "");
const projects = JSON.parse(json);
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

const referenced = projects.flatMap((project) => project.images).sort();
const uniqueReferences = new Set(referenced);

expect(projects.length === 20, `Expected 20 projects; found ${projects.length}`);
expect(projects.filter((project) => project.selected).length === 8, "Selected Work must contain 8 projects");
expect(projects.filter((project) => !project.selected).length === 12, "Archive must contain 12 projects");
expect(projects.at(-2)?.folder === "BACKSTAGE", "BACKSTAGE must be project 19");
expect(projects.at(-1)?.folder === "HOJA_DE_CONTACTO", "Contact Sheets must be project 20");
expect(referenced.length === 141, `Expected 141 compatible images; found ${referenced.length}`);
expect(uniqueReferences.size === referenced.length, "A project image is duplicated across groups");
expect(JSON.stringify(referenced) === JSON.stringify(diskImages), "The project data and compatible image files are not synchronized");

for (const [index, project] of projects.entries()) {
  expect(project.order === index + 1, `Incorrect order for ${project.title}`);
  expect(!project.title.includes("_"), `Technical folder name visible in ${project.title}`);
  const minimum = Math.min(3, project.images.length);
  expect(project.featured.length >= minimum && project.featured.length <= 5, `Incorrect preview count for ${project.title}`);
  expect(project.featured.every((path) => project.images.includes(path)), `Featured image missing from ${project.title}`);
  expect(!("client" in project || "year" in project || "role" in project || "deliverables" in project), `Unconfirmed professional data exists in ${project.title}`);

  const page = join(root, "projects", `${project.slug}.html`);
  try {
    await access(page);
    const html = await readFile(page, "utf8");
    expect(html.includes(`data-project="${project.slug}"`), `Wrong project identifier in ${project.slug}.html`);
    expect(html.includes(`<title>${project.title} — Lola Davila</title>`), `Wrong browser title in ${project.slug}.html`);
    expect(html.includes("../project-page.js"), `Missing project script in ${project.slug}.html`);
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
expect(index.includes("https://instagram.com/loladl_st"), "Missing confirmed Instagram URL");

const styles = await readFile(join(root, "styles.css"), "utf8");
expect((styles.match(/object-fit:\s*cover/g) || []).length === 1, "Only the hero may use object-fit: cover");
expect(styles.includes(".project-gallery img") && styles.includes("object-fit: contain"), "Project images must use object-fit: contain");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Portfolio checks passed.");
console.log(`Projects: ${projects.length} (8 selected, 12 archive)`);
console.log(`Images: ${referenced.length}`);
console.log("Project pages: 20");
