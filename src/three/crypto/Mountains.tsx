import { useMemo } from "react";
import * as THREE from "three";
import { getRoadCurve } from "./Road";

/**
 * Stylized low-poly mountain range. A few dozen ConeGeometry peaks
 * arranged with deterministic randomness. Flat shading + a vertical
 * gradient material gives them a "digital painting" feel.
 *
 * Each layer keeps a `clearance` distance from the road so the road is
 * never rendered behind a mountain — the peaks naturally form a valley
 * the road threads through.
 */

/** Cached 2D samples of the road curve for fast distance lookups. */
function sampleRoadXZ(n = 140): THREE.Vector2[] {
  const curve = getRoadCurve();
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const p = curve.getPoint(i / (n - 1));
    out.push(new THREE.Vector2(p.x, p.z));
  }
  return out;
}

function distToRoad(
  x: number,
  z: number,
  samples: THREE.Vector2[]
): number {
  let min = Infinity;
  const p = new THREE.Vector2(x, z);
  for (let i = 0; i < samples.length; i++) {
    const d = p.distanceTo(samples[i]);
    if (d < min) min = d;
  }
  return min;
}
function buildPeakGeometry() {
  // Slightly irregular cone — pinch the tip to look more like a mountain
  const g = new THREE.ConeGeometry(1, 1, 6, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    // gentle warp on side vertices
    if (y > 0.4) {
      pos.setX(i, pos.getX(i) * 0.85);
      pos.setZ(i, pos.getZ(i) * 0.85);
    }
  }
  g.computeVertexNormals();
  return g;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type LayerProps = {
  z: number;
  count: number;
  baseScale: number;
  scaleVar: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  seed: number;
  spread: number;
  /** Minimum XZ distance from the road centerline a peak is allowed to be. */
  roadClearance: number;
};

function MountainLayer({
  z,
  count,
  baseScale,
  scaleVar,
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  seed,
  spread,
  roadClearance,
}: LayerProps) {
  const geom = useMemo(buildPeakGeometry, []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.95,
        metalness: 0,
        flatShading: true,
        emissive,
        emissiveIntensity,
      }),
    [color, emissive, emissiveIntensity]
  );

  const peaks = useMemo(() => {
    const r = rng(seed);
    const roadSamples = sampleRoadXZ();
    const arr: {
      x: number;
      y: number;
      sx: number;
      sy: number;
      sz: number;
      rot: number;
      zOff: number;
    }[] = [];
    // Try plenty of candidates per peak so we can hit the target count
    // even after rejecting overlap-with-road candidates.
    const maxAttempts = count * 18;
    let attempts = 0;
    while (arr.length < count && attempts < maxAttempts) {
      attempts++;
      const xJitter = (r() - 0.5) * spread;
      const sy = baseScale + r() * scaleVar;
      const sx = sy * (0.7 + r() * 0.6);
      const rot = r() * Math.PI * 2;
      const zOff = ((arr.length % 3) - 1) * 2;
      const worldZ = z + zOff;

      // Distance from peak footprint center to road. Inflate clearance by
      // the peak's own footprint radius so big peaks stay further away.
      const need = roadClearance + sx * 0.6;
      if (distToRoad(xJitter, worldZ, roadSamples) < need) continue;

      arr.push({
        x: xJitter,
        y: sy / 2 - 1.5,
        sx,
        sy,
        sz: sx,
        rot,
        zOff,
      });
    }
    return arr;
  }, [count, baseScale, scaleVar, seed, spread, roadClearance]);

  return (
    <group position={[0, 0, z]}>
      {peaks.map((p, i) => (
        <mesh
          key={i}
          geometry={geom}
          material={mat}
          position={[p.x, p.y, p.zOff]}
          scale={[p.sx, p.sy, p.sz]}
          rotation={[0, p.rot, 0]}
        />
      ))}
    </group>
  );
}

/**
 * Composite range with 3 depth layers — far / mid / near.
 * Far layer is darker + bluer (atmospheric perspective).
 * Near layer is warmer + brighter.
 */
export default function Mountains() {
  return (
    <>
      <MountainLayer
        z={-90}
        count={22}
        baseScale={14}
        scaleVar={10}
        color="#241845"
        emissive="#3a2563"
        emissiveIntensity={0.18}
        seed={13}
        spread={140}
        roadClearance={10}
      />
      <MountainLayer
        z={-55}
        count={16}
        baseScale={10}
        scaleVar={8}
        color="#3a2160"
        emissive="#582a78"
        emissiveIntensity={0.22}
        seed={41}
        spread={110}
        roadClearance={8}
      />
      <MountainLayer
        z={-28}
        count={12}
        baseScale={7}
        scaleVar={5.5}
        color="#5b2a6e"
        emissive="#8a3d6f"
        emissiveIntensity={0.18}
        seed={73}
        spread={90}
        roadClearance={6}
      />
      <MountainLayer
        z={-12}
        count={9}
        baseScale={4}
        scaleVar={3}
        color="#793a64"
        emissive="#c25e50"
        emissiveIntensity={0.10}
        seed={97}
        spread={64}
        roadClearance={5}
      />
    </>
  );
}
