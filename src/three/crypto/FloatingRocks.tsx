import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A handful of small floating rock platforms drifting in mid-air. Adds
 * a sense of magic — like islands of stone that ignore gravity.
 * Each has a soft glowing underside hint.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const ROCK_MAT = new THREE.MeshStandardMaterial({
  color: "#5a3d6e",
  roughness: 0.9,
  metalness: 0.05,
  flatShading: true,
  emissive: "#2a1a3a",
  emissiveIntensity: 0.25,
});

type Spec = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotSpeed: number;
  bobSpeed: number;
  phase: number;
};

function FloatingRock({ spec }: { spec: Spec }) {
  const ref = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  // Slight deformation by scaling the icosahedron non-uniformly per axis
  const stretch = useMemo(
    () => [
      0.9 + (spec.phase % 1) * 0.4,
      0.6 + (spec.phase % 0.7) * 0.5,
      0.9 + (spec.phase % 0.5) * 0.3,
    ] as [number, number, number],
    [spec.phase]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = spec.y + Math.sin(t * spec.bobSpeed + spec.phase) * 0.6;
      ref.current.rotation.y += spec.rotSpeed;
      ref.current.rotation.x = Math.sin(t * 0.3 + spec.phase) * 0.18;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.2 + spec.phase) * 0.15;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={ref} position={[spec.x, spec.y, spec.z]} scale={spec.scale}>
      <mesh material={ROCK_MAT} scale={stretch}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      {/* Bottom glow disc — magic suggestion */}
      <mesh
        ref={haloRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.85, 0]}
      >
        <circleGeometry args={[1.4, 24]} />
        <meshBasicMaterial
          color="#ff9c6e"
          transparent
          opacity={0.32}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function FloatingRocks() {
  const specs = useMemo<Spec[]>(() => {
    const r = rng(53);
    const arr: Spec[] = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        x: (r() - 0.5) * 70,
        y: 5 + r() * 14,
        z: -10 - r() * 70,
        scale: 0.8 + r() * 1.8,
        rotSpeed: (r() - 0.5) * 0.005,
        bobSpeed: 0.4 + r() * 0.5,
        phase: r() * Math.PI * 2,
      });
    }
    return arr;
  }, []);
  return (
    <>
      {specs.map((s, i) => (
        <FloatingRock key={i} spec={s} />
      ))}
    </>
  );
}
