"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  NormalBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

const terrainVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vHeight;
  varying float vFade;
  varying float vRipple;

  void main() {
    vec3 p = position;
    float t = uTime;

    float h = sin(p.x * 0.32 + t * 0.7) * 0.42
            + sin(p.z * 0.55 - t * 0.5) * 0.3
            + sin((p.x - p.z) * 0.22 + t * 0.35) * 0.35;

    // the terrain trends upward to the right
    h += smoothstep(-17.0, 17.0, p.x) * 1.3;

    // ripple that follows the cursor
    float d = distance(p.xz, uMouse);
    float ripple = sin(d * 1.5 - t * 3.2) * exp(-d * 0.32);
    h += ripple * 0.6;
    vRipple = exp(-d * 0.35);

    h *= 1.0 + uScroll * 0.7;
    p.y += h;
    vHeight = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.7 + aRandom * 0.6) * (1.0 + vRipple * 0.8) / -mv.z;

    vFade = (1.0 - smoothstep(12.0, 36.0, -mv.z))
          * (1.0 - smoothstep(14.0, 17.0, abs(position.x)));
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uColorDeep;
  uniform vec3 uColorBright;
  varying float vHeight;
  varying float vFade;
  varying float vRipple;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 1.6);
    vec3 col = mix(uColorDeep, uColorBright, clamp(vHeight * 0.4 + 0.25 + vRipple * 0.6, 0.0, 1.0));
    float alpha = glow * vFade * (0.55 + vRipple * 0.6);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vTwinkle;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aRandom * 1.8) + aRandom * 40.0));
    gl_PointSize = (14.0 + aRandom * 16.0) * uPixelRatio / -mv.z;
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uStarColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);
    gl_FragColor = vec4(uStarColor, glow * vTwinkle * 0.8);
    #include <colorspace_fragment>
  }
`;

// glow on dark adds light; on the light theme the same glow is a soft tint
const PALETTES = {
  dark: {
    blending: AdditiveBlending,
    terrainLow: "#00805f",
    terrainHigh: "#5cffd2",
    star: "#b8ffeb",
    aura: "#00d09c",
    auraOpacity: 0.18,
    lineStart: "#00a37a",
    lineEnd: "#b8ffe9",
    tip: "#d7fff3",
    glow: ["rgba(120, 255, 214, 0.9)", "rgba(0, 208, 156, 0.35)", "rgba(0, 208, 156, 0)"],
  },
  light: {
    blending: NormalBlending,
    terrainLow: "#8fe3cc",
    terrainHigh: "#00936d",
    star: "#00996f",
    aura: "#00b386",
    auraOpacity: 0.16,
    lineStart: "#00c896",
    lineEnd: "#006e52",
    tip: "#00805f",
    glow: ["rgba(0, 179, 134, 0.55)", "rgba(0, 179, 134, 0.18)", "rgba(0, 179, 134, 0)"],
  },
};

function makeGlowTexture(stops: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, stops[0]);
  g.addColorStop(0.35, stops[1]);
  g.addColorStop(1, stops[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// Growth-line waypoints in screen space (NDC). The shape is moved as a whole
// into the gap between the hero headline ([data-line-above]) and the buttons
// ([data-line-below]); *_MID is the height of the shape's middle.
const WIDE_MID = -0.69;
const TALL_MID = -0.83;

const ANCHORS_WIDE: [number, number][] = [
  [-1.3, -0.7],
  [-0.98, -0.76],
  [-0.7, -0.67],
  [-0.44, -0.74],
  [-0.18, -0.66],
  [0.08, -0.72],
  [0.32, -0.6],
  [0.5, -0.65],
  [0.66, -0.46],
  [0.8, -0.51],
  [0.92, -0.2],
];

const ANCHORS_TALL: [number, number][] = [
  [-1.3, -0.84],
  [-0.8, -0.88],
  [-0.4, -0.8],
  [0, -0.85],
  [0.35, -0.72],
  [0.6, -0.76],
  [0.85, -0.58],
];

// layout box inside `root`; offsets ignore the scroll-fade and hover transforms
function layoutBox(el: HTMLElement, root: HTMLElement) {
  let left = 0;
  let top = 0;
  for (
    let node: HTMLElement | null = el;
    node && node !== root;
    node = node.offsetParent as HTMLElement | null
  ) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { left, top, right: left + el.offsetWidth, bottom: top + el.offsetHeight };
}

function unionBox(els: HTMLElement[], root: HTMLElement) {
  const boxes = els.map((el) => layoutBox(el, root));
  return {
    left: Math.min(...boxes.map((b) => b.left)),
    top: Math.min(...boxes.map((b) => b.top)),
    right: Math.max(...boxes.map((b) => b.right)),
    bottom: Math.max(...boxes.map((b) => b.bottom)),
  };
}

export default function HeroScene({ light = false }: { light?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

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
      // no WebGL: the hero still works without the scene
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 100);
    const base = new Vector3(0, 5.2, 15);
    const look = new Vector3(0, 2.2, 0);

    // glowing particle terrain
    const cols = small ? 90 : 170;
    const rows = small ? 46 : 80;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        positions[i * 3] = (c / (cols - 1) - 0.5) * 34;
        positions[i * 3 + 2] = (r / (rows - 1) - 0.5) * 18 - 2;
        randoms[i] = Math.random();
      }
    }
    const terrainGeo = new BufferGeometry();
    terrainGeo.setAttribute("position", new BufferAttribute(positions, 3));
    terrainGeo.setAttribute("aRandom", new BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new Vector2(999, 999) },
      uScroll: { value: 0 },
      uSize: { value: small ? 44 : 54 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uColorDeep: { value: new Color(palette.terrainLow) },
      uColorBright: { value: new Color(palette.terrainHigh) },
    };
    const terrainMat = new ShaderMaterial({
      uniforms,
      vertexShader: terrainVertex,
      fragmentShader: terrainFragment,
      transparent: true,
      depthWrite: false,
      blending: palette.blending,
    });
    scene.add(new Points(terrainGeo, terrainMat));

    // twinkling star dust above the horizon
    const starCount = small ? 260 : 520;
    const starPositions = new Float32Array(starCount * 3);
    const starRandoms = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 1] = 3 + Math.random() * 16;
      starPositions[i * 3 + 2] = -14 - Math.random() * 20;
      starRandoms[i] = Math.random();
    }
    const starGeo = new BufferGeometry();
    starGeo.setAttribute("position", new BufferAttribute(starPositions, 3));
    starGeo.setAttribute("aRandom", new BufferAttribute(starRandoms, 1));
    const starMat = new ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uPixelRatio: uniforms.uPixelRatio,
        uStarColor: { value: new Color(palette.star) },
      },
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: palette.blending,
    });
    scene.add(new Points(starGeo, starMat));

    // neon growth line: bright core + soft additive aura
    const SEGMENTS = 420;
    const RADIAL = 8;
    const coreMat = new MeshBasicMaterial({ vertexColors: true });
    const auraMat = new MeshBasicMaterial({
      color: palette.aura,
      transparent: true,
      opacity: palette.auraOpacity,
      blending: palette.blending,
      depthWrite: false,
    });
    const core = new Mesh(new BufferGeometry(), coreMat);
    const aura = new Mesh(new BufferGeometry(), auraMat);
    scene.add(aura, core);
    let curve: CatmullRomCurve3 | null = null;
    let tipScale = 1;
    const deep = new Color(palette.lineStart);
    const bright = new Color(palette.lineEnd);
    const tmp = new Color();
    const anchorRay = new Raycaster();
    const linePlane = new Plane(new Vector3(0, 1, 0), -2);
    const anchorNdc = new Vector2();
    const anchorHit = new Vector3();

    const section = mount.closest("section");
    const above = section?.querySelector<HTMLElement>("[data-line-above]") ?? null;
    const below = section?.querySelector<HTMLElement>("[data-line-below]") ?? null;

    // the NDC band between the headline and the buttons the line must stay in
    const lineBand = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!section || !above || !below || !w || !h) return null;
      const words = Array.from(above.querySelectorAll<HTMLElement>(".word-mask"));
      const head = unionBox(words.length ? words : [above], section);
      const buttonEls = Array.from(below.children) as HTMLElement[];
      const buttons = unionBox(buttonEls.length ? buttonEls : [below], section);
      const x = (px: number) => (px / w) * 2 - 1;
      const y = (px: number) => 1 - (px / h) * 2;
      return {
        top: y(head.bottom),
        bottom: y(buttons.top),
        headX: [x(head.left), x(head.right)],
        buttonsX: [x(buttons.left), x(buttons.right)],
        margin: (48 / h) * 2,
      };
    };

    const tipGeo = new SphereGeometry(0.15, 20, 20);
    const tipMat = new MeshBasicMaterial({ color: palette.tip });
    const tip = new Mesh(tipGeo, tipMat);
    scene.add(tip);

    const glowTexture = makeGlowTexture(palette.glow);
    const haloMat = glowTexture
      ? new SpriteMaterial({
          map: glowTexture,
          transparent: true,
          depthWrite: false,
          blending: palette.blending,
        })
      : null;
    const halo = haloMat ? new Sprite(haloMat) : null;
    if (halo) scene.add(halo);

    const buildLine = () => {
      camera.position.copy(base);
      camera.lookAt(look);
      camera.updateMatrixWorld();
      const tall = camera.aspect < 1;
      const anchors = tall ? ANCHORS_TALL : ANCHORS_WIDE;
      // the tall layout brings the line closer to the camera, so shrink the tip
      tipScale = tall ? 0.55 : 1;
      tip.scale.setScalar(tipScale);
      const band = lineBand();
      const middle = band ? (band.top + band.bottom) / 2 : 0;
      const shift = band ? middle - (tall ? TALL_MID : WIDE_MID) : 0;
      const pad = 0.12;
      const pts: Vector3[] = [];
      for (const [nx, ny] of anchors) {
        anchorNdc.set(nx, ny);
        anchorRay.setFromCamera(anchorNdc, camera);
        if (!anchorRay.ray.intersectPlane(linePlane, anchorHit)) continue;
        // keeping each waypoint's original distance keeps the tube's thickness
        const distance = anchorHit.distanceTo(anchorRay.ray.origin);
        let y = ny + shift;
        if (band) {
          const underHead = nx > band.headX[0] - pad && nx < band.headX[1] + pad;
          const overButtons =
            nx > band.buttonsX[0] - pad && nx < band.buttonsX[1] + pad;
          const highest = underHead ? band.top - band.margin : Infinity;
          const lowest = overButtons ? band.bottom + band.margin : -Infinity;
          y =
            highest < lowest
              ? middle
              : Math.min(Math.max(y, lowest), highest);
        }
        anchorNdc.set(nx, y);
        anchorRay.setFromCamera(anchorNdc, camera);
        pts.push(anchorRay.ray.at(distance, new Vector3()));
      }
      if (pts.length < 2) return;
      curve = new CatmullRomCurve3(pts, false, "catmullrom", 0.4);

      const coreGeo = new TubeGeometry(curve, SEGMENTS, 0.03, RADIAL, false);
      const vertexCount = coreGeo.attributes.position.count;
      const colors = new Float32Array(vertexCount * 3);
      for (let v = 0; v < vertexCount; v++) {
        tmp.copy(deep).lerp(bright, Math.floor(v / (RADIAL + 1)) / SEGMENTS);
        colors[v * 3] = tmp.r;
        colors[v * 3 + 1] = tmp.g;
        colors[v * 3 + 2] = tmp.b;
      }
      coreGeo.setAttribute("color", new BufferAttribute(colors, 3));
      core.geometry.dispose();
      core.geometry = coreGeo;

      aura.geometry.dispose();
      aura.geometry = new TubeGeometry(curve, SEGMENTS, 0.13, RADIAL, false);
    };

    const setDraw = (progress: number) => {
      if (!curve) return;
      const count = Math.floor(progress * SEGMENTS) * RADIAL * 6;
      core.geometry.setDrawRange(0, count);
      aura.geometry.setDrawRange(0, count);
      const point = curve.getPointAt(Math.min(Math.max(progress, 0.001), 1));
      tip.position.copy(point);
      tip.visible = progress > 0.002;
      if (halo) {
        halo.position.copy(point);
        halo.visible = tip.visible;
      }
    };

    const drawSize = new Vector2();
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      // re-setting an unchanged size would blank the canvas for a frame
      renderer.getSize(drawSize);
      if (drawSize.x !== w || drawSize.y !== h) renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 58 : 42;
      base.z = camera.aspect < 1 ? 19 : 15;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
      buildLine();
    };
    resize();

    const dispose = () => {
      terrainGeo.dispose();
      terrainMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      core.geometry.dispose();
      aura.geometry.dispose();
      coreMat.dispose();
      auraMat.dispose();
      tipGeo.dispose();
      tipMat.dispose();
      glowTexture?.dispose();
      haloMat?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };

    // rebuild the line when the viewport or the copy around it changes
    const watchLayout = (onChange: () => void) => {
      const ro = new ResizeObserver(onChange);
      ro.observe(mount);
      if (above) ro.observe(above);
      if (below) ro.observe(below);
      let active = true;
      document.fonts.ready.then(() => {
        if (active) onChange();
      });
      return () => {
        active = false;
        ro.disconnect();
      };
    };

    if (reduced) {
      const drawStill = () => {
        camera.position.copy(base);
        camera.lookAt(look);
        setDraw(1);
        halo?.scale.setScalar(1.8 * tipScale);
        renderer.render(scene, camera);
      };
      drawStill();
      const unwatch = watchLayout(() => {
        resize();
        drawStill();
      });
      return () => {
        unwatch();
        dispose();
      };
    }

    // pointer → ripple on the ground plane + camera parallax
    const raycaster = new Raycaster();
    const ground = new Plane(new Vector3(0, 1, 0), 0);
    const ndc = new Vector2();
    const hit = new Vector3();
    const mouseTarget = new Vector2(999, 999);
    const pointer = new Vector2(0, 0);
    const onPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      pointer.copy(ndc);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(ground, hit)) {
        mouseTarget.set(hit.x, hit.z);
      }
    };

    let scrollTarget = 0;
    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      scrollTarget = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    };

    let raf = 0;
    let running = false;
    let inView = true;
    let loadedAt = -1;
    const clockStart = performance.now();

    const frame = () => {
      const t = (performance.now() - clockStart) / 1000;
      uniforms.uTime.value = t;
      uniforms.uMouse.value.lerp(mouseTarget, 0.06);
      uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.08;
      const s = uniforms.uScroll.value;

      camera.position.x += (base.x + pointer.x * 1.6 - camera.position.x) * 0.04;
      camera.position.y +=
        (base.y + pointer.y * 0.6 + s * 2.2 - camera.position.y) * 0.04;
      camera.position.z = base.z - s * 4;
      camera.lookAt(look);

      // the growth line draws once the preloader has lifted
      if (loadedAt < 0 && document.body.classList.contains("loaded")) {
        loadedAt = t;
      }
      const p =
        loadedAt < 0
          ? 0
          : Math.min(Math.max((t - loadedAt - 0.35) / 2.4, 0), 1);
      setDraw(1 - Math.pow(1 - p, 3));
      halo?.scale.setScalar((1.8 + Math.sin(t * 3) * 0.3) * tipScale);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !inView || document.hidden) return;
      running = true;
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

    const unwatch = watchLayout(resize);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();
    start();

    return () => {
      stop();
      io.disconnect();
      unwatch();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      dispose();
    };
  }, [light]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
