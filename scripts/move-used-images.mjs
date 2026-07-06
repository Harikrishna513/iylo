import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "product-images");

/** Used images → destination folder under public/ */
const FILE_FOLDER = {
  "iylo-house.webp": "brand",
  "banner-home-desktop.webp": "marketing",
  "banner-home-desktop-1200.webp": "marketing",
  "banner-home-mobile.webp": "marketing",
  "banner-desktop-horizontal.webp": "marketing",
  "luxury-gift-hamper-box.webp": "gifting",
  "indulgence-hamper.webp": "gifting",
  "premium-gift-hamper-box.webp": "gifting",
  "mothers-day-luxury-gift-hamper-box.webp": "gifting",
  "category-delicacies-02.webp": "categories",
  "category-hamper-gifting.webp": "categories",
};

function getUsedFiles() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "product-images.ts"), "utf8");
  function walk(dir, files = []) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (f === "node_modules" || f === ".next" || f === "scripts") continue;
      if (fs.statSync(p).isDirectory()) walk(p, files);
      else if (/\.(ts|tsx)$/.test(f)) files.push(p);
    }
    return files;
  }
  const code = walk(ROOT).map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const usedKeys = new Set([...code.matchAll(/img\.(\w+)/g)].map((m) => m[1]));
  const keyMap = {};
  for (const m of src.matchAll(/(\w+):\s*productImage\("([^"]+)"\)/g)) {
    keyMap[m[1]] = m[2];
  }
  const usedFiles = new Set();
  for (const k of usedKeys) {
    if (keyMap[k]) usedFiles.add(keyMap[k]);
  }
  return [...usedFiles];
}

for (const file of getUsedFiles()) {
  const folder = FILE_FOLDER[file] ?? "products";
  const destDir = path.join(ROOT, "public", folder);
  const srcFile = path.join(SRC, file);
  const destFile = path.join(destDir, file);

  if (!fs.existsSync(srcFile)) {
    if (fs.existsSync(destFile)) {
      console.log("skip (already in place):", `${folder}/${file}`);
      continue;
    }
    console.warn("missing:", file);
    continue;
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.renameSync(srcFile, destFile);
  console.log("moved:", file, "->", `${folder}/`);
}

console.log("done");
