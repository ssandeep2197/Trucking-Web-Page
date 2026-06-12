import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Mountains from "./Mountains";
import Crystals from "./Crystals";
import Atmosphere from "./Atmosphere";
import Road, { getRoadCurve } from "./Road";
import Trees from "./Trees";
import FloatingRocks from "./FloatingRocks";
import Gate from "./Gate";

/**
 * The camera rides the road. Scroll progress (0..1) maps directly to a
 * point along the same CatmullRom curve that draws the road, so the
 * user travels from the road's start to its end as they scroll the page.
 *
 * Camera is held ~1.7 units above the surface, looking a short distance
 * ahead — that gives a natural first-person driving sightline.
 */
/**
 * Single continuous function that maps scroll progress (0..1) to a
 * world position along the road + an "exit" extension past the end.
 *  - sp in [0, 0.94]   → ride the road from t=0.02 to t=1.0
 *  - sp in [0.94, 1.0] → leave the road forward, smoothly accelerating
 *                        up to ~10 units past the road's last point
 * Same function is used for both camera position and lookahead so the
 * scene is identical at the same scroll regardless of direction.
 */
function rideAt(
  sp: number,
  curve: THREE.CatmullRomCurve3,
  endPos: THREE.Vector3,
  fwd: THREE.Vector3,
  out: THREE.Vector3
): THREE.Vector3 {
  if (sp <= 0.94) {
    // Map sp [0, 0.94] → t [0.02, 1.0], so sp=0.94 yields t=1.0 exactly
    // and the transition into the next branch is continuous.
    const t = 0.02 + (sp / 0.94) * 0.98;
    const p = curve.getPoint(t);
    out.copy(p);
  } else {
    const enter = (sp - 0.94) / 0.06; // 0..1
    const eased = enter * enter * (3 - 2 * enter);
    out.copy(endPos).add(fwd.clone().multiplyScalar(eased * 10));
  }
  return out;
}

function CameraRig({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { camera, mouse } = useThree();
  const curve = useMemo(() => getRoadCurve(), []);
  const endPos = useMemo(() => curve.getPoint(1), [curve]);
  const fwd = useMemo(() => {
    const t = curve.getTangent(1);
    return new THREE.Vector3(t.x, 0, t.z).normalize();
  }, [curve]);

  // Reusable scratch vectors so we're not allocating per frame
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    rideAt(0, curve, endPos, fwd, camPos);
    camPos.y += 1.7;
    camera.position.copy(camPos);
    rideAt(0.05, curve, endPos, fwd, lookAt);
    lookAt.y += 1.4;
    camera.lookAt(lookAt);
  }, [camera, curve, endPos, fwd, camPos, lookAt]);

  useFrame(({ clock }) => {
    const sp = scrollProgress.current;
    const tt = clock.elapsedTime;

    rideAt(sp, curve, endPos, fwd, camPos);
    camPos.y += 1.7;
    // Idle parallax + mouse nudge (small; doesn't break direction symmetry)
    camPos.x += mouse.x * 0.4 + Math.sin(tt * 0.55) * 0.08;
    camPos.y += -mouse.y * 0.3 + Math.cos(tt * 0.5) * 0.04;

    // Look ahead via the SAME ride function — guarantees the look vector
    // is always derived the same way as position, even past the road end.
    const lookSp = Math.min(sp + 0.04, 1);
    rideAt(lookSp, curve, endPos, fwd, lookAt);
    lookAt.y += 1.4;

    // Snap directly so forward and backward look identical at the same scroll.
    camera.position.copy(camPos);
    camera.lookAt(lookAt);
  });

  return null;
}

export default function CryptoScene({
  scrollProgressRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Adapt rendering cost to device class. We pick once at mount and treat
  // anything < 900 px wide (or coarse pointer) as "mobile" — drops the
  // pixel-ratio ceiling and disables antialias so the GPU breathes.
  const [isMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth < 900 ||
      window.matchMedia?.("(pointer: coarse)").matches === true
    );
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.02 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        dpr={isMobile ? [0.9, 1.1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [5, 1.4, 25], fov: 62 }}
        frameloop={visible ? "always" : "never"}
      >
        <color attach="background" args={["#1a0b2e"]} />
        <fog attach="fog" args={["#3b1c52", 22, 130]} />

        {/* Painterly fill */}
        <ambientLight intensity={0.45} />
        <hemisphereLight color="#ffd1a3" groundColor="#1a0b2e" intensity={0.8} />
        <directionalLight position={[14, 10, -80]} intensity={2.2} color="#ffb478" />
        <directionalLight position={[-8, 14, 6]} intensity={0.7} color="#a78bfa" />

        <Suspense fallback={null}>
          <Atmosphere />
          <Mountains />
          <Trees />
          <Road />
          <FloatingRocks />
          <Crystals />
          <Gate scrollProgress={scrollProgressRef} />
        </Suspense>

        <CameraRig scrollProgress={scrollProgressRef} />
      </Canvas>
    </div>
  );
}
