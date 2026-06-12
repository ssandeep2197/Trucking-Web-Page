import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRoadCurve } from "./Road";

/**
 * Stone portal gate at the end of the road. Doors swing open as the
 * user nears the end of scroll, revealing a glowing portal beyond.
 * A floating "ENTER THE WORLD" banner hangs above the arch.
 */

const stoneMat = new THREE.MeshStandardMaterial({
  color: "#231138",
  roughness: 0.85,
  metalness: 0.25,
  emissive: "#2a1145",
  emissiveIntensity: 0.18,
});
const doorMat = new THREE.MeshStandardMaterial({
  color: "#3a2150",
  roughness: 0.45,
  metalness: 0.55,
  emissive: "#52286f",
  emissiveIntensity: 0.22,
});
const runesMat = new THREE.MeshStandardMaterial({
  color: "#ffd1a3",
  emissive: "#ffb478",
  emissiveIntensity: 3,
});

function makeBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Subtle background panel
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "rgba(40,15,60,0.0)");
  grad.addColorStop(0.5, "rgba(40,15,60,0.45)");
  grad.addColorStop(1, "rgba(40,15,60,0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "500 30px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#ffb478";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffd9a8";
  ctx.fillText("·  THE THRESHOLD  ·", canvas.width / 2, 55);

  ctx.font = "800 110px 'Space Grotesk', sans-serif";
  ctx.shadowColor = "#ffb478";
  ctx.shadowBlur = 35;
  ctx.fillStyle = "#fff8dd";
  ctx.fillText("ENTER THE WORLD", canvas.width / 2, 150);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffb478";
  ctx.fillRect(canvas.width * 0.32, 215, canvas.width * 0.36, 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  return tex;
}

export default function Gate({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const bannerRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef<THREE.Mesh>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);

  // Position + orientation at the end of the road
  const { position, rotation } = useMemo(() => {
    const curve = getRoadCurve();
    const end = curve.getPoint(1);
    const tangent = curve.getTangent(1);
    // Push gate slightly past the road end so camera approaches it nicely
    const lookForward = new THREE.Vector3(tangent.x, 0, tangent.z).normalize();
    const pos = end.clone().add(lookForward.multiplyScalar(2));
    // Rotate so the doors face the incoming camera (camera looks along tangent)
    const rot = Math.atan2(tangent.x, tangent.z);
    return { position: pos, rotation: rot };
  }, []);

  const bannerTex = useMemo(() => makeBannerTexture(), []);

  useFrame(({ clock }) => {
    const p = scrollProgress.current;
    const t = clock.elapsedTime;

    // Doors start parting at p=0.72, fully open by p=0.94
    const openAmt = Math.max(0, Math.min(1, (p - 0.72) / 0.22));
    // Ease the opening
    const eased = openAmt * openAmt * (3 - 2 * openAmt);
    const angle = eased * Math.PI * 0.55;

    if (leftDoorRef.current) leftDoorRef.current.rotation.y = -angle;
    if (rightDoorRef.current) rightDoorRef.current.rotation.y = angle;

    // Banner fade + pulse
    if (bannerRef.current) {
      const fade = Math.max(0, Math.min(1, (p - 0.5) / 0.25));
      const pulse = 0.85 + Math.sin(t * 2.2) * 0.15;
      (bannerRef.current.material as THREE.MeshBasicMaterial).opacity =
        fade * pulse;
      // Subtle bob
      bannerRef.current.position.y = 13 + Math.sin(t * 0.9) * 0.15;
    }

    // Portal brightens + breathes as doors open
    if (portalRef.current) {
      const base = 0.25 + openAmt * 0.75;
      const breathe = 1 + Math.sin(t * 1.4) * 0.06 + openAmt * 0.25;
      portalRef.current.scale.setScalar(breathe);
      (portalRef.current.material as THREE.MeshBasicMaterial).opacity = base;
    }
    if (portalLightRef.current) {
      portalLightRef.current.intensity = 1 + openAmt * 6 + Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* === FRAME === */}
      {/* Left pillar */}
      <mesh material={stoneMat} position={[-3.0, 5, 0]}>
        <boxGeometry args={[0.85, 11, 0.7]} />
      </mesh>
      {/* Right pillar */}
      <mesh material={stoneMat} position={[3.0, 5, 0]}>
        <boxGeometry args={[0.85, 11, 0.7]} />
      </mesh>
      {/* Pillar caps */}
      <mesh material={stoneMat} position={[-3.0, 10.85, 0]}>
        <boxGeometry args={[1.15, 0.5, 0.95]} />
      </mesh>
      <mesh material={stoneMat} position={[3.0, 10.85, 0]}>
        <boxGeometry args={[1.15, 0.5, 0.95]} />
      </mesh>
      {/* Top beam */}
      <mesh material={stoneMat} position={[0, 11.4, 0]}>
        <boxGeometry args={[6.7, 1.0, 0.7]} />
      </mesh>
      {/* Crown — small upper ridge */}
      <mesh material={stoneMat} position={[0, 12.0, 0]}>
        <boxGeometry args={[5.6, 0.3, 0.55]} />
      </mesh>
      {/* Threshold / base */}
      <mesh material={stoneMat} position={[0, -0.25, 0]}>
        <boxGeometry args={[7.4, 0.35, 0.95]} />
      </mesh>

      {/* === GLOWING RUNES on frame === */}
      <mesh material={runesMat} position={[0, 12.0, 0.31]}>
        <boxGeometry args={[5.4, 0.06, 0.04]} />
      </mesh>
      <mesh material={runesMat} position={[0, 10.78, 0.36]}>
        <boxGeometry args={[5.4, 0.05, 0.04]} />
      </mesh>
      <mesh material={runesMat} position={[-3.0, 5, 0.36]}>
        <boxGeometry args={[0.07, 8.8, 0.04]} />
      </mesh>
      <mesh material={runesMat} position={[3.0, 5, 0.36]}>
        <boxGeometry args={[0.07, 8.8, 0.04]} />
      </mesh>
      {/* Keystone */}
      <mesh material={runesMat} position={[0, 11.4, 0.36]}>
        <boxGeometry args={[0.5, 0.5, 0.04]} />
      </mesh>

      {/* === DOORS === */}
      {/* Left door — pivot anchored at left pillar edge */}
      <group position={[-2.55, 5, 0]}>
        <group ref={leftDoorRef}>
          <mesh material={doorMat} position={[1.27, 0, 0]}>
            <boxGeometry args={[2.55, 9.7, 0.28]} />
          </mesh>
          {/* Runes on door */}
          <mesh material={runesMat} position={[1.27, -2.5, 0.15]}>
            <boxGeometry args={[1.7, 0.05, 0.03]} />
          </mesh>
          <mesh material={runesMat} position={[1.27, 0, 0.15]}>
            <boxGeometry args={[1.4, 0.04, 0.03]} />
          </mesh>
          <mesh material={runesMat} position={[1.27, 2.5, 0.15]}>
            <boxGeometry args={[1.7, 0.05, 0.03]} />
          </mesh>
          {/* Vertical accent */}
          <mesh material={runesMat} position={[2.2, 0, 0.15]}>
            <boxGeometry args={[0.04, 8.2, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* Right door */}
      <group position={[2.55, 5, 0]}>
        <group ref={rightDoorRef}>
          <mesh material={doorMat} position={[-1.27, 0, 0]}>
            <boxGeometry args={[2.55, 9.7, 0.28]} />
          </mesh>
          <mesh material={runesMat} position={[-1.27, -2.5, 0.15]}>
            <boxGeometry args={[1.7, 0.05, 0.03]} />
          </mesh>
          <mesh material={runesMat} position={[-1.27, 0, 0.15]}>
            <boxGeometry args={[1.4, 0.04, 0.03]} />
          </mesh>
          <mesh material={runesMat} position={[-1.27, 2.5, 0.15]}>
            <boxGeometry args={[1.7, 0.05, 0.03]} />
          </mesh>
          <mesh material={runesMat} position={[-2.2, 0, 0.15]}>
            <boxGeometry args={[0.04, 8.2, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* === PORTAL beyond the doors === */}
      <mesh ref={portalRef} position={[0, 5, -0.6]}>
        <planeGeometry args={[5.2, 9.6]} />
        <meshBasicMaterial
          color="#ffd9a8"
          transparent
          opacity={0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Soft outer halo */}
      <mesh position={[0, 5, -0.7]}>
        <planeGeometry args={[7.5, 12]} />
        <meshBasicMaterial
          color="#ff8a4d"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={portalLightRef}
        position={[0, 5, 1.5]}
        intensity={1}
        distance={28}
        color="#ffd1a3"
      />

      {/* === "ENTER THE WORLD" banner above gate === */}
      <mesh ref={bannerRef} position={[0, 13, 0]}>
        <planeGeometry args={[11, 2.5]} />
        <meshBasicMaterial
          map={bannerTex}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
