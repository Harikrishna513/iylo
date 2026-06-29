import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BRAND_LOGO,
  BRAND_LOGO_ALT,
  logoWidthForHeight,
} from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  height = 68,
  priority = false,
}: BrandLogoProps) {
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
