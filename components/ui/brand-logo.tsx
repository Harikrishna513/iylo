import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BRAND_LOGO,
  BRAND_CIRCLE_LOGO,
  BRAND_LOGO_ALT,
  logoWidthForHeight,
} from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  height?: number;
  priority?: boolean;
  /** Powder-blue circular mark (auth / favicon-style) */
  variant?: "default" | "circle";
};

export function BrandLogo({
  className,
  imageClassName,
  height = 68,
  priority = false,
  variant = "default",
}: BrandLogoProps) {
  if (variant === "circle") {
    const size = height;
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden rounded-full bg-light-blue ring-1 ring-maroon/10",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={BRAND_CIRCLE_LOGO}
          alt={BRAND_LOGO_ALT}
          fill
          priority={priority}
          className={cn("object-contain object-center p-[14%]", imageClassName)}
          sizes={`${size}px`}
        />
      </span>
    );
  }

  const width = logoWidthForHeight(height);

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width, height }}
    >
      <Image
        src={BRAND_LOGO}
        alt={BRAND_LOGO_ALT}
        fill
        priority={priority}
        className={cn("object-contain object-center", imageClassName)}
        sizes={`${width}px`}
      />
    </span>
  );
}
