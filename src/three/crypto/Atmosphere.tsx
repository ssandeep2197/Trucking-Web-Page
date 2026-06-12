import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Drifting magical-dust particles + sun disc + horizon glow. */

function Dust({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = -Math.random() * 100;
      siz[i] = 0.04 + Math.random() * 0.06;
    }
    return { positions: pos, sizes: siz };
  }, [count]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.25;
      if (arr[i * 3 + 1] > 32) arr[i * 3 + 1] = -1;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.08}
        color="#ffe7c2"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Big sun disc with a halo, sitting on the horizon. */
function Sun() {
  return (
    <>
      <mesh position={[18, 18, -110]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#ffe6c2" />
      </mesh>
      <mesh position={[18, 18, -110.5]}>
        <sphereGeometry args={[9, 32, 32]} />
        <meshBasicMaterial color="#ff8a4d" transparent opacity={0.55} />
      </mesh>
      <mesh position={[18, 18, -111]}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial color="#ff5a78" transparent opacity={0.28} />
      </mesh>
      <pointLight position={[18, 18, -90]} intensity={2.2} distance={140} color="#ffb478" />
    </>
  );
}

/** Painted sky backdrop — vertical gradient texture. */
function Sky() {
  const tex = useRef<THREE.CanvasTexture | null>(null);
  if (!tex.current) {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, "#1a0b2e"); // deep top
    grad.addColorStop(0.35, "#3b1c52"); // purple
    grad.addColorStop(0.6, "#a13d68"); // magenta-rose
    grad.addColorStop(0.78, "#ff8650"); // sunset
    grad.addColorStop(0.92, "#ffc28e"); // glow
    grad.addColorStop(1, "#ffe1bd"); // horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 1024);
    tex.current = new THREE.CanvasTexture(canvas);
  }
  return (
    <mesh position={[0, 22, -140]}>
      <planeGeometry args={[400, 100]} />
      <meshBasicMaterial map={tex.current} />
    </mesh>
  );
}

export default function Atmosphere() {
  return (
    <>
      <Sky />
      <Sun />
      <Dust />
    </>
  );
}
