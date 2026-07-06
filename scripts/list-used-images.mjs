import fs from "fs";
import path from "path";

const src = fs.readFileSync("lib/product-images.ts", "utf8");

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f === "node_modules" || f === ".next" || f === "scripts") continue;
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(f)) files.push(p);
  }
  return files;
}

const code = walk(".").map((f) => fs.readFileSync(f, "utf8")).join("\n");
const usedKeys = new Set([...code.matchAll(/img\.(\w+)/g)].map((m) => m[1]));

const keyMap = {};
for (const m of src.matchAll(/(\w+):\s*productImage\("([^"]+)"\)/g)) {
  keyMap[m[1]] = m[2];
}

const usedFiles = new Set();
for (const k of usedKeys) {
  if (keyMap[k]) usedFiles.add(keyMap[k]);
}

console.log(JSON.stringify([...usedFiles].sort(), null, 2));
