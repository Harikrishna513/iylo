/**
 * Generates circular favicon PNGs + favicon.ico from public/iylo-logo.jpg
 * Run: npx tsx scripts/generate-favicons.ts
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function main() {
  let sharp: typeof import("sharp");
  try {
    sharp = require("sharp");
  } catch {
    console.log("Installing sharp for favicon generation…");
    const { execSync } = await import("node:child_process");
    execSync("npm install --no-save sharp", { stdio: "inherit" });
    sharp = require("sharp");
  }

  const srcPath = join(process.cwd(), "public/iylo-logo.jpg");
  const src = await readFile(srcPath);
  const publicDir = join(process.cwd(), "public");

  const sizes = [
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-16x16.png", size: 16 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ] as const;

  const circleMask = Buffer.from(
    `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="256" fill="white"/>
    </svg>`
  );

  for (const { name, size } of sizes) {
    const out = await sharp(src)
      .resize(size, size, { fit: "cover", position: "centre" })
      .composite([{ input: await sharp(circleMask).resize(size, size).png().toBuffer(), blend: "dest-in" }])
      .png()
      .toBuffer();
    await writeFile(join(publicDir, name), out);
    console.log(`Wrote public/${name}`);
  }

  const ico32 = await sharp(src)
    .resize(32, 32, { fit: "cover", position: "centre" })
    .composite([
      { input: await sharp(circleMask).resize(32, 32).png().toBuffer(), blend: "dest-in" },
    ])
    .png()
    .toBuffer();

  await writeFile(join(publicDir, "favicon.ico"), ico32);
  await writeFile(join(process.cwd(), "app/favicon.ico"), ico32);
  console.log("Wrote public/favicon.ico and app/favicon.ico");

  const manifest = {
    name: "IYLO Bakehouse",
    short_name: "IYLO",
    description: "Eggless artisan bakes · Jayanagar, Bangalore",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6f0",
    theme_color: "#451519",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };

  await writeFile(join(publicDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("Wrote public/manifest.webmanifest");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
