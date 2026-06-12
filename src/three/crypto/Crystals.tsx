import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating crystals — glowing octahedrons that drift / bob / slowly spin.
 * Spread across the scene at varying depths and altitudes.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const CRYSTAL_COLORS = ["#ffd9a8", "#ffb8e2", "#a8bfff", "#ffb478", "#d8a8ff"];

type CrystalSpec = {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  phase: number;
  color: string;
};

function Crystal({ spec }: { spec: CrystalSpec }) {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = spec.y + Math.sin(t * spec.speed + spec.phase) * 0.6;
      ref.current.rotation.y = t * 0.3 + spec.phase;
      ref.current.rotation.x = Math.sin(t * 0.4 + spec.phase) * 0.2;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.5 + spec.phase) * 0.18;
      haloRef.current.scale.setScalar(s);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.45 - (s - 1) * 0.4;
    }
  });

  return (
    <group position={[spec.x, spec.y, spec.z]}>
      <mesh ref={ref} scale={spec.scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={spec.color}
          metalness={0.4}
          roughness={0.12}
          transmission={0.4}
          ior={1.4}
          emissive={spec.color}
          emissiveIntensity={0.7}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[spec.scale * 1.5, 12, 12]} />
        <meshBasicMaterial
          color={spec.color}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Crystals() {
  const specs = useMemo<CrystalSpec[]>(() => {
    const r = rng(31);
    const arr: CrystalSpec[] = [];
    for (let i = 0; i < 12; i++) {
      arr.push({
        x: (r() - 0.5) * 60,
        y: 2 + r() * 18,
        z: -8 - r() * 60,
        scale: 0.4 + r() * 1.1,
        speed: 0.6 + r() * 0.8,
        phase: r() * Math.PI * 2,
        color: CRYSTAL_COLORS[Math.floor(r() * CRYSTAL_COLORS.length)],
      });
    }
    return arr;
  }, []);

  return (
    <>
      {specs.map((s, i) => (
        <Crystal key={i} spec={s} />
      ))}
    </>
  );
}
