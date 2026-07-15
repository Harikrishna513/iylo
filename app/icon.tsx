import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND_COLORS } from "@/data/site-content";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadLogoDataUrl() {
  const logo = await readFile(join(process.cwd(), "public/circle-logo.jpg"));
  return `data:image/jpeg;base64,${logo.toString("base64")}`;
}

export default async function Icon() {
  const src = await loadLogoDataUrl();
  const inner = Math.round(size.width * 0.72);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLORS.lightBlue,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={inner}
          height={inner}
          style={{
            width: inner,
            height: inner,
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
