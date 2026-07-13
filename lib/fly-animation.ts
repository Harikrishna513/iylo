export type FlyTarget = "cart" | "wishlist";

export interface FlyRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlyAnimationItem {
  id: string;
  image: string;
  from: FlyRect;
  to: FlyRect;
  target: FlyTarget;
  onComplete?: () => void;
}

export function rectFromDom(dom: DOMRect): FlyRect {
  return {
    x: dom.x,
    y: dom.y,
    width: dom.width,
    height: dom.height,
  };
}

export function getFlyTargetRect(target: FlyTarget): FlyRect | null {
  const el = document.getElementById(`fly-target-${target}`);
  if (!el) return null;
  const dom = el.getBoundingClientRect();
  return {
    x: dom.x + dom.width / 2 - 20,
    y: dom.y + dom.height / 2 - 20,
    width: 40,
    height: 40,
  };
}

export function getFlySourceRect(source?: HTMLElement | null): FlyRect {
  const fallback: FlyRect = {
    x: window.innerWidth / 2 - 40,
    y: window.innerHeight / 2 - 40,
    width: 80,
    height: 80,
  };

  if (!source) return fallback;

  const container =
    source.closest<HTMLElement>("[data-fly-source]") ??
    source.querySelector<HTMLElement>("[data-fly-source]") ??
    source;

  const dom = container.getBoundingClientRect();
  if (dom.width === 0) return fallback;

  return rectFromDom(dom);
}

export function resolveFlySource(
  source?: HTMLElement | null,
  event?: React.MouseEvent
): HTMLElement | null {
  if (source) return source;
  if (!event) return null;
  return (
    (event.currentTarget as HTMLElement).closest<HTMLElement>("[data-fly-source]") ??
    (event.currentTarget as HTMLElement)
  );
}
