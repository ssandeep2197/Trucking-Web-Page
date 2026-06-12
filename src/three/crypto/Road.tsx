import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Real road — flat asphalt ribbon following a CatmullRom curve, with:
 *  - Solid white edge lines
 *  - Dashed white center line
 *  - Subtle speckle for asphalt texture
 * All baked into a single CanvasTexture so the whole road is one draw call.
 *
 * Street lights line both sides at staggered intervals. Each pole has
 * a warm glowing bulb + soft halo + flicker + local pointLight.
 */

// Control points for the road. Gentler curves than before — the previous
// hard zigzag was producing twisted quads at the sharp inflections.
// The same curve is exported so the camera rig and the trees can keep
// clear / drive along it.
const ROAD_POINTS: [number, number, number][] = [
  [3, -0.3, 26],
  [1.4, -0.3, 17],
  [-0.6, -0.3, 7],
  [-1.8, -0.3, -4],
  [-1.2, -0.3, -16],
  [0.8, -0.3, -28],
  [2.4, -0.3, -40],
  [1.6, -0.3, -52],
  [-0.8, -0.3, -65],
  [-0.2, -0.3, -78],
  [1.4, -0.3, -90],
];

export function getRoadCurve() {
  const pts = ROAD_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  // "centripetal" avoids cusps / overshoots at sharp control point angles.
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
}

const ROAD_WIDTH = 3.2;
const SEGMENTS = 360;
// World distance over which the dash pattern repeats. Real US highway
// dashes are ~3 m on, ~9 m off; this is a stylized 50/50.
const PATTERN_PERIOD = 6;

/** Build a flat ribbon along the curve. Horizontal perpendicular keeps
 *  the road from banking around corners. */
function buildRoadGeometry(curve: THREE.CatmullRomCurve3): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Pre-compute cumulative arc length for stable texture wrapping
  const samples = SEGMENTS + 1;
  const cumDist: number[] = [0];
  let prevP = curve.getPoint(0);
  for (let i = 1; i < samples; i++) {
    const p = curve.getPoint(i / SEGMENTS);
    cumDist.push(cumDist[i - 1] + prevP.distanceTo(p));
    prevP = p;
  }

  // Keep a memory of the last good perpendicular so we can fall back
  // gracefully if a tangent happens to be near-degenerate.
  let lastPerpX = 1;
  let lastPerpZ = 0;

  for (let i = 0; i < samples; i++) {
    const t = i / SEGMENTS;
    const p = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    // Project tangent onto the XZ plane so the road stays perfectly level
    // regardless of how the curve's vertical component wiggles.
    const tx = tangent.x;
    const tz = tangent.z;
    const tMag = Math.hypot(tx, tz);
    let perpX: number;
    let perpZ: number;
    if (tMag < 1e-4) {
      // Degenerate tangent — reuse previous direction so we don't pinch.
      perpX = lastPerpX;
      perpZ = lastPerpZ;
    } else {
      perpX = -tz / tMag;
      perpZ = tx / tMag;
      lastPerpX = perpX;
      lastPerpZ = perpZ;
    }
    const half = ROAD_WIDTH / 2;
    const left = new THREE.Vector3(
      p.x - perpX * half,
      p.y + 0.02,
      p.z - perpZ * half
    );
    const right = new THREE.Vector3(
      p.x + perpX * half,
      p.y + 0.02,
      p.z + perpZ * half
    );

    positions.push(left.x, left.y, left.z);
    positions.push(right.x, right.y, right.z);

    const v = cumDist[i] / PATTERN_PERIOD;
    uvs.push(0, v); // left edge u=0
    uvs.push(1, v); // right edge u=1

    if (i > 0) {
      const a = (i - 1) * 2;
      const b = (i - 1) * 2 + 1;
      const c = i * 2;
      const d = i * 2 + 1;
      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/** Canvas-painted asphalt + lane markings. Tiles along the road's length. */
function makeRoadTexture(): THREE.CanvasTexture {
  const W = 128;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Dark asphalt
  ctx.fillStyle = "#1a1a1c";
  ctx.fillRect(0, 0, W, H);

  // Deterministic speckle for grit
  let s = 7;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 320; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const shade = 0.35 + rand() * 0.35;
    ctx.fillStyle = `rgba(190,190,200,${shade})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Solid white edge lines (left + right)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(3, 0, 6, H); // left edge
  ctx.fillRect(W - 9, 0, 6, H); // right edge

  // Dashed white center line — dash + gap of equal length
  const CENTER_X = W / 2 - 2;
  const CENTER_W = 5;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(CENTER_X, 0, CENTER_W, H / 2); // top half = dash
  // bottom half (H/2..H) stays asphalt = gap

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Modern street light — tapered pole + glowing bulb + halo + local light. */
function StreetLight({
  position,
  rotation,
  delay,
}: {
  position: THREE.Vector3;
  rotation: number;
  delay: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (lightRef.current) {
      // Subtle flicker
      lightRef.current.intensity = 1.6 + Math.sin(t * 5 + delay) * 0.16;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.6 + delay) * 0.12;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.12, 10]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 3.6, 8]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.55} metalness={0.55} />
      </mesh>
      {/* Light fixture cap */}
      <mesh position={[0, 3.78, 0]}>
        <boxGeometry args={[0.45, 0.14, 0.24]} />
        <meshStandardMaterial color="#15151c" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Glowing bulb */}
      <mesh position={[0, 3.68, 0]}>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial
          color="#fff8dd"
          emissive="#ffd1a3"
          emissiveIntensity={4}
          roughness={0.35}
        />
      </mesh>
      {/* Halo */}
      <mesh ref={haloRef} position={[0, 3.68, 0]}>
        <sphereGeometry args={[0.38, 14, 12]} />
        <meshBasicMaterial
          color="#ffd1a3"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      {/* Local light — small range to keep shader cost down */}
      <pointLight
        ref={lightRef}
        position={[0, 3.5, 0]}
        intensity={1.6}
        distance={6}
        color="#ffd1a3"
        decay={1.5}
      />
    </group>
  );
}

export default function Road() {
  const curve = useMemo(() => getRoadCurve(), []);
  const roadGeom = useMemo(() => buildRoadGeometry(curve), [curve]);
  const tex = useMemo(() => makeRoadTexture(), []);

  // Stagger street lights along the road, alternating sides
  const lights = useMemo(() => {
    const out: { pos: THREE.Vector3; rot: number; delay: number }[] = [];
    const N = 14;
    for (let i = 0; i < N; i++) {
      const t = (i + 0.45) / N;
      const p = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const tMag = Math.hypot(tangent.x, tangent.z);
      const perpX = tMag < 1e-4 ? 1 : -tangent.z / tMag;
      const perpZ = tMag < 1e-4 ? 0 : tangent.x / tMag;
      const side = i % 2 === 0 ? 1 : -1;
      const offset = ROAD_WIDTH / 2 + 0.55;
      const polePos = new THREE.Vector3(
        p.x + perpX * side * offset,
        p.y,
        p.z + perpZ * side * offset
      );
      // Rotate pole to face perpendicular to road
      const rotY = Math.atan2(tangent.x, tangent.z);
      out.push({ pos: polePos, rot: rotY, delay: i * 0.5 });
    }
    return out;
  }, [curve]);

  return (
    <group>
      {/* Asphalt road surface */}
      <mesh geometry={roadGeom} receiveShadow>
        <meshStandardMaterial
          map={tex}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Street lights flanking the road */}
      {lights.map((s, i) => (
        <StreetLight
          key={i}
          position={s.pos}
          rotation={s.rot}
          delay={s.delay}
        />
      ))}
    </group>
  );
}
