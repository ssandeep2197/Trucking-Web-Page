import { useEffect, useRef } from "react";

/**
 * A fixed, pointer-following backdrop:
 *  - A soft orange/blue radial glow that tracks the cursor.
 *  - A faint constellation of dots that drifts in the opposite
 *    direction from the cursor (subtle parallax).
 *
 * Uses CSS custom properties + rAF, so it never causes React re-renders.
 */
export default function PointerBackdrop() {
  const auraRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return; // skip on touch devices

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Smooth follow (lerp).
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const aura = auraRef.current;
      if (aura) {
        aura.style.setProperty("--px", `${currentX}px`);
        aura.style.setProperty("--py", `${currentY}px`);
      }

      // Subtle inverse parallax for the dot layer.
      const dots = dotsRef.current;
      if (dots) {
        const offsetX = ((currentX / window.innerWidth) - 0.5) * -28;
        const offsetY = ((currentY / window.innerHeight) - 0.5) * -28;
        dots.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Constellation parallax layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={dotsRef}
          className="absolute -inset-12 opacity-[0.55] will-change-transform"
          style={{
            backgroundImage:
              "radial-gradient(rgba(196,203,225,0.16) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(80% 60% at 50% 40%, black 0%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(80% 60% at 50% 40%, black 0%, transparent 90%)",
          }}
        />
      </div>

      {/* Cursor spotlight */}
      <div
        ref={auraRef}
        className="pointer-aura"
        style={{ ["--px" as string]: "50vw", ["--py" as string]: "40vh" }}
      />
    </>
  );
}
