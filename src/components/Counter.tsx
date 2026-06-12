import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

export default function Counter({
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(latest.toFixed(decimals));
      },
    });
    return controls.stop;
  }, [inView, to, duration, decimals, mv]);

  return (
    <span ref={ref}>
      {prefix}
      {Number(display).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
