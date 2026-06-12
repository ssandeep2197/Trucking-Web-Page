import { useMemo } from "react";
import * as THREE from "three";
import { getRoadCurve } from "./Road";

/**
 * Stylized low-poly conifers scattered around the road. Each is a tiny
 * trunk + two stacked cones. Placement is deterministic and kept clear
 * of the road by sampling the path's bounding circle around each tree
 * candidate.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type TreeSpec = {
  x: number;
  z: number;
  scale: number;
  rot: number;
  variant: 0 | 1 | 2;
};

/** Sample the road curve so we can keep trees away from it. */
function sampleRoad(curve: THREE.CatmullRomCurve3, n = 80) {
  const arr: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const p = curve.getPoint(i / (n - 1));
    arr.push(new THREE.Vector2(p.x, p.z));
  }
  return arr;
}

function distToRoad(x: number, z: number, samples: THREE.Vector2[]) {
  let min = Infinity;
  const p = new THREE.Vector2(x, z);
  for (let i = 0; i < samples.length; i++) {
    const d = p.distanceTo(samples[i]);
    if (d < min) min = d;
  }
  return min;
}

function generateTrees(): TreeSpec[] {
  const curve = getRoadCurve();
  const samples = sampleRoad(curve);
  const r = rng(101);
  const trees: TreeSpec[] = [];
  const ROAD_CLEARANCE = 2.4;

  // Try lots of candidates; only keep ones away from the road.
  for (let i = 0; i < 180 && trees.length < 55; i++) {
    const x = (r() - 0.5) * 80;
    const z = -90 + r() * 110;
    const d = distToRoad(x, z, samples);
    if (d < ROAD_CLEARANCE) continue;
    // Keep clearance from foreground crystal area too
    if (d > 18 && Math.abs(x) < 4 && Math.abs(z) < 6) continue;
    trees.push({
      x,
      z,
      scale: 0.6 + r() * 1.4,
      rot: r() * Math.PI * 2,
      variant: Math.floor(r() * 3) as 0 | 1 | 2,
    });
  }
  return trees;
}

const TRUNK_MAT = new THREE.MeshStandardMaterial({
  color: "#3a2018",
  roughness: 0.95,
  flatShading: true,
});

const FOLIAGE_MATS = [
  new THREE.MeshStandardMaterial({
    color: "#2a3f2a",
    roughness: 0.95,
    flatShading: true,
    emissive: "#1c3520",
    emissiveIntensity: 0.18,
  }),
  new THREE.MeshStandardMaterial({
    color: "#3d2a4a",
    roughness: 0.95,
    flatShading: true,
    emissive: "#2d1a35",
    emissiveIntensity: 0.22,
  }),
  new THREE.MeshStandardMaterial({
    color: "#4a2b3a",
    roughness: 0.95,
    flatShading: true,
    emissive: "#3a1f30",
    emissiveIntensity: 0.20,
  }),
];

// Shared geometries (avoid allocating per-tree)
const TRUNK_GEOM = new THREE.CylinderGeometry(0.13, 0.18, 1, 5);
const FOLIAGE_BIG = new THREE.ConeGeometry(1.15, 1.8, 7);
const FOLIAGE_MID = new THREE.ConeGeometry(0.88, 1.4, 7);
const FOLIAGE_TOP = new THREE.ConeGeometry(0.6, 1.0, 7);

function Tree({ spec }: { spec: TreeSpec }) {
  const mat = FOLIAGE_MATS[spec.variant];
  return (
    <group
      position={[spec.x, -0.6, spec.z]}
      rotation={[0, spec.rot, 0]}
      scale={spec.scale}
    >
      <mesh geometry={TRUNK_GEOM} material={TRUNK_MAT} position={[0, 0.5, 0]} />
      <mesh geometry={FOLIAGE_BIG} material={mat} position={[0, 1.6, 0]} />
      <mesh geometry={FOLIAGE_MID} material={mat} position={[0, 2.5, 0]} />
      <mesh geometry={FOLIAGE_TOP} material={mat} position={[0, 3.2, 0]} />
    </group>
  );
}

export default function Trees() {
  const trees = useMemo(() => generateTrees(), []);
  return (
    <>
      {trees.map((t, i) => (
        <Tree key={i} spec={t} />
      ))}
    </>
  );
}
