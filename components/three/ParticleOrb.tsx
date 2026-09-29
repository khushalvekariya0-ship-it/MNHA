"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  LineLoop,
  NormalBlending,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  Points,
  QuadraticBezierCurve3,
  Raycaster,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Sphere,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

export type OrbVariant = "globe" | "ring";

// glow on dark adds light; on the light theme the same parts are solid tints
const PALETTES = {
  dark: {
    blending: AdditiveBlending,
    front: "#00d09c",
    hot: "#c4fff0",
    back: "#0b4a3b",
    line: "#00d09c",
    comet: "#9dffe3",
    satellite: "#c4fff0",
    pin: "#ffffff",
    beam: "#c4fff0",
    pulse: "#4df3c9",
  },
  light: {
    blending: NormalBlending,
    front: "#00a37a",
    hot: "#006e52",
    back: "#a8e6d6",
    line: "#00b386",
    comet: "#00805f",
    satellite: "#00805f",
    pin: "#0b1220",
    beam: "#00805f",
    pulse: "#00b386",
  },
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHit;
  uniform float uHitStrength;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aNormal;
  attribute float aRandom;
  varying float vFacing;
  varying float vGlow;

  void main() {
    vec3 p = position;
    p += aNormal * sin(uTime * 0.9 + aRandom * 6.2831) * 0.035;
    float d = distance(position, uHit);
    float bulge = exp(-d * d * 1.4) * uHitStrength;
    p += aNormal * bulge * 0.6;
    vGlow = bulge;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vFacing = normalize(normalMatrix * aNormal).z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.65 + aRandom * 0.7) * (1.0 + bulge * 1.6) / -mv.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorFront;
  uniform vec3 uColorHot;
  uniform vec3 uColorBack;
  uniform float uIntro;
  varying float vFacing;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 1.5);
    float front = smoothstep(-0.35, 0.65, vFacing);
    vec3 col = mix(uColorBack, mix(uColorFront, uColorHot, clamp(vGlow * 1.4, 0.0, 1.0)), front);
    float alpha = glow * (mix(0.14, 0.9, front) + vGlow * 0.6) * uIntro;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

function circlePoints(radius: number, segments: number) {
  const pts: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }
  return new Float32Array(pts);
}

// small deterministic RNG so the arcs are stable between mounts
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function ParticleOrb({
  variant = "globe",
  pin,
  light = false,
}: {
  variant?: OrbVariant;
  pin?: { lat: number; lon: number };
  light?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pinLat = pin?.lat;
  const pinLon = pin?.lon;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const palette = light ? PALETTES.light : PALETTES.dark;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const small = window.innerWidth < 768;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, variant === "ring" ? 10.5 : 9.2);

    const R = 2.6;
    const group = new Group();
    scene.add(group);
    const disposables: { dispose: () => void }[] = [];

    // ---- particle body
    const count =
      variant === "ring" ? (small ? 3800 : 6500) : small ? 2600 : 4600;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    if (variant === "globe") {
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = golden * i;
        const x = Math.cos(th) * r;
        const z = Math.sin(th) * r;
        positions.set([x * R, y * R, z * R], i * 3);
        normals.set([x, y, z], i * 3);
        randoms[i] = Math.random();
      }
    } else {
      const major = 2.7;
      const minor = 0.8;
      for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const cu = Math.cos(u);
        const su = Math.sin(u);
        positions.set(
          [
            (major + minor * Math.cos(v)) * cu,
            minor * Math.sin(v),
            (major + minor * Math.cos(v)) * su,
          ],
          i * 3
        );
        normals.set([Math.cos(v) * cu, Math.sin(v), Math.cos(v) * su], i * 3);
        randoms[i] = Math.random();
      }
    }
    const bodyGeo = new BufferGeometry();
    bodyGeo.setAttribute("position", new BufferAttribute(positions, 3));
    bodyGeo.setAttribute("aNormal", new BufferAttribute(normals, 3));
    bodyGeo.setAttribute("aRandom", new BufferAttribute(randoms, 1));
    const uniforms = {
      uTime: { value: 0 },
      uHit: { value: new Vector3(99, 99, 99) },
      uHitStrength: { value: 0 },
      uSize: { value: small ? 42 : 50 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uIntro: { value: reduced ? 1 : 0 },
      uColorFront: { value: new Color(palette.front) },
      uColorHot: { value: new Color(palette.hot) },
      uColorBack: { value: new Color(palette.back) },
    };
    const bodyMat = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: palette.blending,
    });
    const body = new Points(bodyGeo, bodyMat);
    group.add(body);
    disposables.push(bodyGeo, bodyMat);

    const lineMat = (color: string, opacity: number) => {
      const m = new LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: palette.blending,
        depthWrite: false,
      });
      disposables.push(m);
      return m;
    };
    const loop = (radius: number, opacity: number) => {
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(circlePoints(radius, 160), 3));
      disposables.push(g);
      return new LineLoop(g, lineMat(palette.line, opacity));
    };

    // ---- globe extras: latitude rings + data arcs
    const arcs: { geo: BufferGeometry; offset: number; speed: number }[] = [];
    if (variant === "globe") {
      [-60, -30, 0, 30, 60].forEach((lat) => {
        const rad = (lat * Math.PI) / 180;
        const ring = loop(R * Math.cos(rad) * 1.003, lat === 0 ? 0.16 : 0.08);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = R * Math.sin(rad);
        group.add(ring);
      });

      const rand = rng(pinLat !== undefined ? 7 : 42);
      const randomPoint = () => {
        const u = rand() * 2 - 1;
        const th = rand() * Math.PI * 2;
        const r = Math.sqrt(1 - u * u);
        return new Vector3(Math.cos(th) * r, u, Math.sin(th) * r).multiplyScalar(R);
      };
      for (let k = 0; k < 8; k++) {
        const a = randomPoint();
        let b = randomPoint();
        let guard = 0;
        while (a.angleTo(b) < 0.7 && guard++ < 20) b = randomPoint();
        const mid = a
          .clone()
          .add(b)
          .normalize()
          .multiplyScalar(R * (1.3 + a.angleTo(b) * 0.12));
        const curve = new QuadraticBezierCurve3(a, mid, b);
        const pts = curve.getPoints(80);
        const base = new BufferGeometry().setFromPoints(pts);
        const comet = new BufferGeometry().setFromPoints(pts);
        disposables.push(base, comet);
        group.add(new Line(base, lineMat(palette.line, 0.1)));
        group.add(new Line(comet, lineMat(palette.comet, 0.95)));
        arcs.push({ geo: comet, offset: rand() * 1.6, speed: 0.22 + rand() * 0.2 });
      }
    }

    // ---- ring extras: inner halos
    if (variant === "ring") {
      [1.25, 1.7].forEach((radius, i) => {
        const halo = loop(radius, i === 0 ? 0.14 : 0.08);
        halo.rotation.x = Math.PI / 2;
        group.add(halo);
      });
    }

    // ---- tilted orbit with satellites (independent of the body spin)
    const orbit = new Group();
    orbit.rotation.set(1.15, 0, 0.35);
    scene.add(orbit);
    const orbitRadius = variant === "ring" ? 4.1 : R * 1.45;
    orbit.add(loop(orbitRadius, 0.16));
    const satGeo = new SphereGeometry(0.06, 12, 12);
    const satMat = new MeshBasicMaterial({ color: palette.satellite });
    disposables.push(satGeo, satMat);
    const satellites = [0, Math.PI * 0.66, Math.PI * 1.33].map(() => {
      const s = new Mesh(satGeo, satMat);
      orbit.add(s);
      return s;
    });

    // ---- optional location pin (contact page)
    const pulses: Mesh[] = [];
    if (pinLat !== undefined && pinLon !== undefined && variant === "globe") {
      const la = (pinLat * Math.PI) / 180;
      const lo = (pinLon * Math.PI) / 180;
      const p = new Vector3(
        Math.cos(la) * Math.sin(lo),
        Math.sin(la),
        Math.cos(la) * Math.cos(lo)
      ).multiplyScalar(R * 1.01);

      const dotGeo = new SphereGeometry(0.08, 16, 16);
      const dotMat = new MeshBasicMaterial({ color: palette.pin });
      disposables.push(dotGeo, dotMat);
      const dot = new Mesh(dotGeo, dotMat);
      dot.position.copy(p);
      group.add(dot);

      const beam = new BufferGeometry().setFromPoints([p, p.clone().multiplyScalar(1.28)]);
      disposables.push(beam);
      group.add(new Line(beam, lineMat(palette.beam, 0.9)));

      const ringGeo = new RingGeometry(0.09, 0.115, 40);
      disposables.push(ringGeo);
      for (let k = 0; k < 2; k++) {
        const m = new MeshBasicMaterial({
          color: palette.pulse,
          transparent: true,
          side: DoubleSide,
          blending: palette.blending,
          depthWrite: false,
        });
        disposables.push(m);
        const pulse = new Mesh(ringGeo, m);
        pulse.position.copy(p);
        pulse.lookAt(p.clone().multiplyScalar(2));
        group.add(pulse);
        pulses.push(pulse);
      }
    }

    const baseRotX = pinLat !== undefined ? (pinLat * Math.PI) / 180 : 0.35;
    const baseRotY = pinLon !== undefined ? -(pinLon * Math.PI) / 180 : 0;
    group.rotation.set(
      variant === "ring" ? 1.1 : baseRotX,
      variant === "ring" ? 0 : baseRotY,
      0
    );

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      // re-setting an unchanged size would reallocate and blank the canvas
      if (renderer.domElement.clientWidth !== w || renderer.domElement.clientHeight !== h) renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    resize();

    const dispose = () => {
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };

    if (reduced) {
      renderer.render(scene, camera);
      const ro = new ResizeObserver(() => {
        resize();
        renderer.render(scene, camera);
      });
      ro.observe(mount);
      return () => {
        ro.disconnect();
        dispose();
      };
    }

    // pointer: bulge where the cursor touches + turn toward it
    const raycaster = new Raycaster();
    const sphere = new Sphere(new Vector3(0, 0, 0), R);
    const facePlane = new Plane(new Vector3(0, 0, 1), 0);
    const ndc = new Vector2();
    const hit = new Vector3();
    const pointer = new Vector2(0, 0);
    let hitTarget = 0;
    let hovering = false;

    const onPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      hovering = Math.abs(ndc.x) <= 1.1 && Math.abs(ndc.y) <= 1.1;
      pointer.set(
        Math.max(-1.5, Math.min(1.5, ndc.x)),
        Math.max(-1.5, Math.min(1.5, ndc.y))
      );
      raycaster.setFromCamera(ndc, camera);
      const found =
        variant === "ring"
          ? raycaster.ray.intersectPlane(facePlane, hit)
          : raycaster.ray.intersectSphere(sphere, hit);
      if (found && hovering) {
        body.worldToLocal(uniforms.uHit.value.copy(hit));
        hitTarget = 1;
      } else {
        hitTarget = 0;
      }
    };

    let raf = 0;
    let running = false;
    let inView = true;
    let yaw = 0;
    let spin = 0;
    let last = performance.now();
    const clockStart = last;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - clockStart) / 1000;
      uniforms.uTime.value = t;
      uniforms.uIntro.value = Math.min(uniforms.uIntro.value + dt * 0.8, 1);
      uniforms.uHitStrength.value += (hitTarget - uniforms.uHitStrength.value) * 0.08;

      const intro = 1 - Math.pow(1 - uniforms.uIntro.value, 3);
      group.scale.setScalar(0.72 + intro * 0.28);

      yaw += (pointer.x * 0.55 - yaw) * 0.05;
      if (variant === "ring") {
        spin += dt * 0.18;
        body.rotation.y = spin;
        group.rotation.x += (1.1 - pointer.y * 0.35 - group.rotation.x) * 0.05;
        group.rotation.z = yaw * 0.4;
      } else if (pinLat !== undefined) {
        group.rotation.y = baseRotY + Math.sin(t * 0.25) * 0.35 + yaw;
        group.rotation.x += (baseRotX - pointer.y * 0.3 - group.rotation.x) * 0.05;
      } else {
        spin += dt * 0.12;
        group.rotation.y = spin + yaw;
        group.rotation.x += (0.35 - pointer.y * 0.35 - group.rotation.x) * 0.05;
      }

      satellites.forEach((s, i) => {
        const a = t * 0.45 + i * ((Math.PI * 2) / 3);
        s.position.set(Math.cos(a) * orbitRadius, Math.sin(a) * orbitRadius, 0);
      });
      orbit.rotation.z = 0.35 + Math.sin(t * 0.1) * 0.1;

      arcs.forEach((arc) => {
        const head = ((t * arc.speed + arc.offset) % 1.6) * 80;
        const start = Math.max(0, Math.floor(head) - 24);
        const end = Math.min(Math.floor(head), 81);
        arc.geo.setDrawRange(start, Math.max(end - start, 0));
      });

      pulses.forEach((pulse, i) => {
        const phase = (t * 0.6 + i * 0.5) % 1;
        pulse.scale.setScalar(1 + phase * 3.2);
        (pulse.material as MeshBasicMaterial).opacity = (1 - phase) * 0.85;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(mount);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      dispose();
    };
  }, [variant, pinLat, pinLon, light]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
