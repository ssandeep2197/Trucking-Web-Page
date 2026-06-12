import { motion, type MotionValue } from "framer-motion";

/**
 * Side-view semi-truck rendered in SVG. Wheels are <motion.g> elements that
 * rotate based on the supplied motion value (degrees).
 */
export default function SvgTruck({
  wheelRotate,
  className,
}: {
  wheelRotate: MotionValue<number>;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 520 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cabBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff7a3d" />
          <stop offset="100%" stopColor="#ea4408" />
        </linearGradient>
        <linearGradient id="trailerBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1ede0" />
        </linearGradient>
        <linearGradient id="windshield" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1f3357" />
          <stop offset="100%" stopColor="#0a1a3a" />
        </linearGradient>
        <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="100%" stopColor="#ffdd66" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="260" cy="178" rx="200" ry="6" fill="#000" opacity="0.45" />

      {/* Trailer */}
      <g>
        <rect
          x="40"
          y="60"
          width="270"
          height="100"
          rx="6"
          fill="url(#trailerBody)"
          stroke="#0a0e1a"
          strokeOpacity="0.4"
        />
        {/* Trailer side rails */}
        <rect x="46" y="68" width="258" height="2" fill="#0a0e1a" opacity="0.12" />
        <rect x="46" y="148" width="258" height="2" fill="#0a0e1a" opacity="0.12" />
        {/* Orange accent stripe */}
        <rect x="46" y="100" width="258" height="6" fill="#ff5a1f" />
        {/* Brand panel */}
        <rect
          x="120"
          y="78"
          width="120"
          height="36"
          rx="3"
          fill="#0a0e1a"
          opacity="0.85"
        />
        <text
          x="180"
          y="102"
          textAnchor="middle"
          fill="#ff8a4d"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="700"
          fontSize="16"
          letterSpacing="2"
        >
          LOGISTICS
        </text>
        {/* Rear door split */}
        <line
          x1="40"
          y1="65"
          x2="40"
          y2="155"
          stroke="#0a0e1a"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
      </g>

      {/* Cab */}
      <g>
        {/* Cab main body */}
        <path
          d="M 315 70 L 380 70 L 410 100 L 410 160 L 315 160 Z"
          fill="url(#cabBody)"
          stroke="#0a0e1a"
          strokeOpacity="0.1"
        />
        {/* Windshield */}
        <path
          d="M 360 78 L 396 102 L 396 124 L 360 124 Z"
          fill="url(#windshield)"
        />
        <path
          d="M 360 78 L 396 102"
          stroke="#5c9bff"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        {/* Door divider */}
        <line
          x1="345"
          y1="80"
          x2="345"
          y2="158"
          stroke="#0a0e1a"
          strokeOpacity="0.15"
        />
        {/* Bumper */}
        <rect x="396" y="146" width="18" height="14" rx="2" fill="#0a0e1a" />
        {/* Headlight */}
        <rect x="396" y="126" width="10" height="14" rx="2" fill="#ffe066" />
        <ellipse cx="430" cy="133" rx="40" ry="14" fill="url(#headlight)" />
        {/* Exhaust stack */}
        <rect x="328" y="40" width="6" height="32" rx="1" fill="#c5cdda" />
        <rect x="326" y="36" width="10" height="6" rx="1" fill="#0a0e1a" />
        {/* Side mirror */}
        <rect x="320" y="84" width="4" height="14" rx="1" fill="#0a0e1a" />
        <rect x="316" y="80" width="10" height="4" rx="1" fill="#0a0e1a" />
      </g>

      {/* Wheels */}
      <Wheel cx={90} cy={162} rotate={wheelRotate} />
      <Wheel cx={150} cy={162} rotate={wheelRotate} />
      <Wheel cx={260} cy={162} rotate={wheelRotate} />
      <Wheel cx={355} cy={162} rotate={wheelRotate} />
    </svg>
  );
}

function Wheel({
  cx,
  cy,
  rotate,
}: {
  cx: number;
  cy: number;
  rotate: MotionValue<number>;
}) {
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r="18" fill="#0a0e1a" />
      <motion.g
        style={{
          rotate,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <circle cx={cx} cy={cy} r="10" fill="#c5cdda" />
        <rect
          x={cx - 11}
          y={cy - 1.5}
          width="22"
          height="3"
          fill="#7c8294"
          rx="1"
        />
        <rect
          x={cx - 1.5}
          y={cy - 11}
          width="3"
          height="22"
          fill="#7c8294"
          rx="1"
        />
        <circle cx={cx} cy={cy} r="3" fill="#0a0e1a" />
      </motion.g>
    </g>
  );
}
