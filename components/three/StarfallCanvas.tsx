"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  NormalBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three";

// The parent drops a star onto a point (section pixels, y down); onLand fires
// the moment it touches down.
export type StarfallBus = {
  launch?: (x: number, y: number, onLand: () => void) => void;
};

const TRAIL = 220;
const FLIGHT = 1.15;

const skyVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uView;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vAlpha;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * uView.x, -position.y * uView.y, 0.0, 1.0);
    vAlpha = 0.25 + 0.55 * (0.5 + 0.5 * sin(uTime * (0.4 + aRandom * 1.3) + aRandom * 50.0));
    gl_PointSize = (1.2 + aRandom * 1.4) * uPixelRatio;
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * (1.0 - smoothstep(0.35, 0.5, d)));
    #include <colorspace_fragment>
  }
`;

// thin quad from tail (uv.x = 0) to head (uv.x = 1)
const trailVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const trailFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uTail;
  uniform vec3 uHead;
  varying vec2 vUv;
  void main() {
    float along = pow(vUv.x, 2.4);
    float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
    vec3 color = mix(uTail, uHead, smoothstep(0.6, 1.0, vUv.x));
    gl_FragColor = vec4(color, along * across * uOpacity);
    #include <colorspace_fragment>
  }
`;

// bright glows on the night sky; deep green strokes on the light theme
const PALETTES = {
  dark: {
    blending: AdditiveBlending,
    sky: "#d1fff2",
    tail: "#00d19b",
    head: "#e6fff7",
    ring: "#4df3c9",
    spark: "#b8ffe9",
    glow: ["rgba(255, 255, 255, 1)", "rgba(200, 255, 236, 0.9)", "rgba(0, 208, 156, 0.25)", "rgba(0, 208, 156, 0)"],
  },
  light: {
    blending: NormalBlending,
    sky: "#6fb8a6",
    tail: "#7fdcc3",
    head: "#006e52",
    ring: "#00b386",
    spark: "#00a37a",
    glow: ["rgba(0, 110, 82, 1)", "rgba(0, 163, 122, 0.85)", "rgba(0, 179, 134, 0.22)", "rgba(0, 179, 134, 0)"],
  },
};

function glowTexture(stops: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, stops[0]);
  g.addColorStop(0.18, stops[1]);
  g.addColorStop(0.45, stops[2]);
  g.addColorStop(1, stops[3]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

type Star = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  angle: number;
  start: number;
  landedAt: number;
  onLand: () => void;
  trail: Mesh<PlaneGeometry, ShaderMaterial>;
  head: Sprite;
  rings: Mesh<RingGeometry, MeshBasicMaterial>[];
  sparks: Points<BufferGeometry, PointsMaterial>;
  velocities: Float32Array;
};

export default function StarfallCanvas({ bus, light = false }: { bus: StarfallBus; light?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const palette = light ? PALETTES.light : PALETTES.dark;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    // one world unit = one CSS pixel, y pointing up from the top edge
    const camera = new OrthographicCamera(0, 1, 0, -1, -10, 10);

    // quiet background sky
    const skyCount = window.innerWidth < 768 ? 90 : 170;
    const skyPositions = new Float32Array(skyCount * 3);
    const skyRandoms = new Float32Array(skyCount);
    for (let i = 0; i < skyCount; i++) {
      skyPositions.set([Math.random(), Math.random() * 0.92, 0], i * 3);
      skyRandoms[i] = Math.random();
    }
    const skyGeo = new BufferGeometry();
    skyGeo.setAttribute("position", new BufferAttribute(skyPositions, 3));
    skyGeo.setAttribute("aRandom", new BufferAttribute(skyRandoms, 1));
    const skyUniforms = {
      uTime: { value: 0 },
      uView: { value: new Vector2(1, 1) },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uColor: { value: new Color(palette.sky) },
    };
    const skyMat = new ShaderMaterial({
      uniforms: skyUniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      transparent: true,
      depthWrite: false,
    });
    const sky = new Points(skyGeo, skyMat);
    sky.frustumCulled = false;
    scene.add(sky);

    const trailGeo = new PlaneGeometry(1, 1);
    trailGeo.translate(-0.5, 0, 0);
    const ringGeo = new RingGeometry(0.9, 1, 64);
    const texture = glowTexture(palette.glow);
    const headMat = new SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: palette.blending,
    });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.left = 0;
      camera.right = w;
      camera.top = 0;
      camera.bottom = -h;
      camera.updateProjectionMatrix();
      skyUniforms.uView.value.set(w, h);
      skyUniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    resize();

    const stars: Star[] = [];
    const clockStart = performance.now();
    const now = () => (performance.now() - clockStart) / 1000;

    const removeStar = (star: Star) => {
      scene.remove(star.trail, star.head, star.sparks, ...star.rings);
      star.trail.material.dispose();
      (star.head.material as SpriteMaterial).dispose();
      star.rings.forEach((ring) => ring.material.dispose());
      star.sparks.geometry.dispose();
      star.sparks.material.dispose();
    };

    bus.launch = (x, y, onLand) => {
      const w = mount.clientWidth;
      // fall in at a slant from above the top edge
      const drop = y + 80;
      const side = x > w / 2 ? 1 : -1;
      const sx = Math.min(Math.max(x + side * drop * (0.45 + Math.random() * 0.3), -60), w + 60);
      const sy = 80;
      const tx = x;
      const ty = -y;

      const trail = new Mesh(
        trailGeo,
        new ShaderMaterial({
          uniforms: {
            uOpacity: { value: 1 },
            uTail: { value: new Color(palette.tail) },
            uHead: { value: new Color(palette.head) },
          },
          vertexShader: trailVertex,
          fragmentShader: trailFragment,
          transparent: true,
          depthWrite: false,
          blending: palette.blending,
        })
      );
      const head = new Sprite(headMat.clone());
      head.scale.setScalar(20);
      const rings = [0, 1].map(() => {
        const ring = new Mesh(
          ringGeo,
          new MeshBasicMaterial({
            color: palette.ring,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: palette.blending,
          })
        );
        ring.position.set(tx, ty, 0);
        return ring;
      });
      const sparkCount = 10;
      const sparkPositions = new Float32Array(sparkCount * 3);
      const velocities = new Float32Array(sparkCount * 2);
      for (let i = 0; i < sparkCount; i++) {
        const a = (i / sparkCount) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 40 + Math.random() * 50;
        velocities[i * 2] = Math.cos(a) * speed;
        velocities[i * 2 + 1] = Math.sin(a) * speed;
        sparkPositions.set([tx, ty, 0], i * 3);
      }
      const sparkGeo = new BufferGeometry();
      sparkGeo.setAttribute("position", new BufferAttribute(sparkPositions, 3));
      const sparks = new Points(
        sparkGeo,
        new PointsMaterial({
          color: palette.spark,
          size: 2.4 * renderer.getPixelRatio(),
          sizeAttenuation: false,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: palette.blending,
        })
      );
      sparks.frustumCulled = false;
      scene.add(trail, head, sparks, ...rings);

      stars.push({
        sx,
        sy,
        tx,
        ty,
        angle: Math.atan2(ty - sy, tx - sx),
        start: now(),
        landedAt: -1,
        onLand,
        trail,
        head,
        rings,
        sparks,
        velocities,
      });
      start();
    };

    const frame = () => {
      const t = now();
      skyUniforms.uTime.value = t;

      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        const p = (t - star.start) / FLIGHT;
        if (p < 1) {
          const e = Math.pow(p, 1.6);
          const x = star.sx + (star.tx - star.sx) * e;
          const y = star.sy + (star.ty - star.sy) * e;
          star.head.position.set(x, y, 0);
          star.trail.position.set(x, y, 0);
          star.trail.rotation.z = star.angle;
          star.trail.scale.set(TRAIL * Math.min(1, p / 0.25), 2.6, 1);
          continue;
        }
        if (star.landedAt < 0) {
          star.landedAt = t;
          star.head.position.set(star.tx, star.ty, 0);
          star.onLand();
        }
        const q = t - star.landedAt;
        // the tail catches up with the head, which flares and fades
        const tail = Math.max(0, 1 - q / 0.22);
        star.trail.scale.set(TRAIL * tail, 2.6, 1);
        star.trail.position.set(star.tx, star.ty, 0);
        star.trail.visible = tail > 0;
        star.head.scale.setScalar(20 + q * 60);
        (star.head.material as SpriteMaterial).opacity = Math.max(0, 1 - q / 0.45);
        star.rings.forEach((ring, r) => {
          const rq = Math.max(0, q - r * 0.14) / 0.8;
          const eased = 1 - Math.pow(1 - Math.min(rq, 1), 3);
          ring.scale.setScalar(4 + eased * 40);
          ring.material.opacity = rq > 0 && rq < 1 ? (1 - rq) * 0.85 : 0;
        });
        const positions = star.sparks.geometry.attributes.position as BufferAttribute;
        const travel = Math.min(q, 0.7) * (1 - Math.min(q, 0.7) * 0.6);
        for (let s = 0; s < positions.count; s++) {
          positions.setXY(
            s,
            star.tx + star.velocities[s * 2] * travel,
            star.ty + star.velocities[s * 2 + 1] * travel
          );
        }
        positions.needsUpdate = true;
        star.sparks.material.opacity = Math.max(0, 1 - q / 0.7);
        if (q > 1.05) {
          removeStar(star);
          stars.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    let raf = 0;
    let running = false;
    let inView = false;
    function start() {
      if (running || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
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
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      stop();
      bus.launch = undefined;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stars.forEach(removeStar);
      skyGeo.dispose();
      skyMat.dispose();
      trailGeo.dispose();
      ringGeo.dispose();
      headMat.dispose();
      texture?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [bus, light]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
