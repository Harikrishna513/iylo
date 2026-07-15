/**
 * Generates clear circular favicons from public/circle-logo.jpg
 * Logo is padded inside the circle so letterforms are not clipped.
 * Run: npm run generate-favicons
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Brand powder blue #99BEE0 */
const BG = { r: 153, g: 190, b: 224, alpha: 1 };

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

  const srcPath = join(process.cwd(), "public/circle-logo.jpg");
  const src = await readFile(srcPath);
  const publicDir = join(process.cwd(), "public");
  await mkdir(publicDir, { recursive: true });

  const sizes = [
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-16x16.png", size: 16 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ] as const;

  async function circularIcon(size: number) {
    // Keep ~14% padding so “iylo / BAKEHOUSE” stays clear inside the circle
    const inner = Math.max(8, Math.round(size * 0.72));
    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>`
    );

    const logo = await sharp(src)
      .resize(inner, inner, {
        fit: "contain",
        background: BG,
      })
      .png()
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG,
      },
    })
      .composite([
        { input: logo, gravity: "centre" },
        {
          input: await sharp(circleMask).png().toBuffer(),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();
  }

  for (const { name, size } of sizes) {
    const out = await circularIcon(size);
    await writeFile(join(publicDir, name), out);
    console.log(`Wrote public/${name}`);
  }

  const ico32 = await circularIcon(32);
  await writeFile(join(publicDir, "favicon.ico"), ico32);
  await writeFile(join(process.cwd(), "app/favicon.ico"), ico32);
  console.log("Wrote public/favicon.ico and app/favicon.ico");

  const manifest = {
    name: "IYLO Bakehouse",
    short_name: "IYLO",
    description: "Eggless artisan bakes · Jayanagar, Bangalore",
    start_url: "/",
    display: "standalone",
    background_color: "#99BEE0",
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
