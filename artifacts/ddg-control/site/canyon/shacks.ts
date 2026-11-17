import {
  AdditiveBlending, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3, DoubleSide, EdgesGeometry, ExtrudeGeometry,
  Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, ShaderMaterial, Shape, SRGBColorSpace, Sprite, SpriteMaterial,
  TubeGeometry, Vector3,
} from 'three';

/**
 * Four small shacks on the river banks, one for each business. Each is drawn like the land: a dark
 * solid shape with ice-blue edges, a softly lit window in the business's colour and a name over the
 * roof. A pipe runs from each shack to the river and pours water into it.
 */

type Spot = { name: string; x: number; z: number; color: string };
const SPOTS: Spot[] = [
  { name: 'COFFEE', x: -15, z: 17, color: '#e8eef6' },
  { name: 'FINANCE', x: 15, z: 17, color: '#6be4b0' },
  { name: 'FITNESS', x: -16.5, z: -1, color: '#7fd0f5' },
  { name: 'CREATIVE', x: 16.5, z: -1, color: '#b9a3ff' },
];
const LEVEL = 4.5, SLOPE = 0.01;
const levelAt = (z: number) => LEVEL - SLOPE * z;

const POUR_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// Falling water: bright streaks running down the stream, thinner and more broken lower down.
const POUR_FRAG = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float s = sin(vUv.x * 40.0 - uTime * 14.0) * 0.5 + 0.5;
  float r = sin(vUv.y * 6.283 * 3.0 + vUv.x * 9.0) * 0.5 + 0.5;
  float a = (0.35 + 0.65 * s * r) * (1.0 - smoothstep(0.85, 1.0, vUv.x));
  gl_FragColor = vec4(mix(vec3(0.16, 0.52, 0.72), vec3(0.85, 0.96, 1.0), s * r), a * 0.85 * uOpacity);
}`;

function label(text: string, color: string) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d')!;
  g.font = '500 54px "IBM Plex Mono", ui-monospace, Menlo, monospace';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = 18;
  g.fillStyle = color; g.fillText(text.split('').join(' '), 256, 64);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

export function makeShacks(heightAt: (x: number, z: number) => number) {
  const group = new Group();
  const disposables: { dispose: () => void }[] = [];
  const bodyMat = new MeshBasicMaterial({ color: 0x07090f, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const edgeMat = new LineBasicMaterial({ color: 0x6cc7f0, transparent: true, opacity: 0.75 });
  const pipeMat = new MeshBasicMaterial({ color: 0x10141c });
  const pourMat = new ShaderMaterial({ uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } }, vertexShader: POUR_VERT, fragmentShader: POUR_FRAG, transparent: true, depthWrite: false, side: DoubleSide, blending: AdditiveBlending });
  disposables.push(bodyMat, edgeMat, pipeMat, pourMat);
  const glassLines: LineBasicMaterial[] = [];
  const sprites: SpriteMaterial[] = [];

  // One shack: walls, a pitched roof, a door, a lit window. Built once and copied.
  const W = 3.4, D = 2.8, H = 2.2, R = 1.3;
  const walls = new BoxGeometry(W, H, D); walls.translate(0, H / 2, 0);
  const roofShape = new Shape(); roofShape.moveTo(-W / 2 - 0.25, 0); roofShape.lineTo(0, R); roofShape.lineTo(W / 2 + 0.25, 0); roofShape.lineTo(-W / 2 - 0.25, 0);
  const roof = new ExtrudeGeometry(roofShape, { depth: D + 0.4, bevelEnabled: false }); roof.translate(0, H, -(D + 0.4) / 2);
  const base = new BoxGeometry(W + 0.6, 3, D + 0.6); base.translate(0, -1.5, 0); // a footing down into the ground
  const parts: BufferGeometry[] = [walls, roof, base];
  disposables.push(...parts);
  const edges = parts.map((p) => new EdgesGeometry(p, 20)); disposables.push(...edges);
  const winGeo = new BoxGeometry(0.9, 0.7, 0.02), doorGeo = new BoxGeometry(0.75, 1.35, 0.02);
  disposables.push(winGeo, doorGeo);

  const pours: Mesh[] = [];
  for (const s of SPOTS) {
    const side = Math.sign(s.x); // -1 left bank, +1 right bank
    const y0 = heightAt(s.x, s.z);
    const shack = new Group();
    shack.position.set(s.x, y0, s.z);
    shack.rotation.y = side * -0.35; // turned a little towards the camera and the river
    for (const p of parts) shack.add(new Mesh(p, bodyMat));
    for (const e of edges) shack.add(new LineSegments(e, edgeMat));
    // Window and door on the front (towards the camera), lit in the business's colour.
    const lit = new MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.85 }); disposables.push(lit);
    const win = new Mesh(winGeo, lit); win.position.set(side * 0.7, 1.25, D / 2 + 0.02);
    const doorMat = new MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.18 }); disposables.push(doorMat);
    const door = new Mesh(doorGeo, doorMat); door.position.set(-side * 0.8, 0.68, D / 2 + 0.02);
    shack.add(win, door);
    // The name, floating just over the roof.
    const tex = label(s.name, s.color); const sm = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    disposables.push(tex, sm); sprites.push(sm);
    const tag = new Sprite(sm); tag.scale.set(6.4, 1.6, 1); tag.position.set(0, H + R + 1.3, 0);
    shack.add(tag);
    group.add(shack);

    // The pipe: out of the river-side wall, along the bank, ending over the water.
    const wl = levelAt(s.z);
    const startLocal = new Vector3(-side * (W / 2), 0.9, 0).applyAxisAngle(new Vector3(0, 1, 0), shack.rotation.y).add(shack.position);
    let edgeX = s.x - side * 2;
    for (let x = s.x - side * 2; Math.abs(x) > 2; x -= side * 0.25) { if (heightAt(x, s.z) < wl) { edgeX = x + side * 0.6; break; } }
    const mouth = new Vector3(edgeX - side * 1.3, wl + 1.5, s.z + 0.2);
    const curve = new CatmullRomCurve3([
      startLocal,
      startLocal.clone().add(new Vector3(-side * 1.0, -0.15, 0)),
      new Vector3((startLocal.x + mouth.x) / 2, Math.max(heightAt((startLocal.x + mouth.x) / 2, s.z) + 0.35, wl + 0.9), (startLocal.z + mouth.z) / 2),
      mouth,
    ]);
    const tube = new TubeGeometry(curve, 40, 0.3, 12, false); disposables.push(tube);
    group.add(new Mesh(tube, pipeMat));
    const tubeEdges = new EdgesGeometry(tube, 35); disposables.push(tubeEdges);
    const glass = new LineBasicMaterial({ color: 0x6cc7f0, transparent: true, opacity: 0.6 }); glassLines.push(glass); disposables.push(glass);
    group.add(new LineSegments(tubeEdges, glass));
    // Water pouring from the mouth in a short arc down into the river.
    const tip = curve.getTangent(1).setY(0).normalize();
    const fall = new CatmullRomCurve3([mouth, mouth.clone().add(tip.clone().multiplyScalar(0.6)).add(new Vector3(0, -0.3, 0)), mouth.clone().add(tip.clone().multiplyScalar(1.0)).add(new Vector3(0, -0.9, 0)), mouth.clone().add(tip.clone().multiplyScalar(1.15)).setY(wl - 0.15)]);
    const stream = new TubeGeometry(fall, 20, 0.2, 8, false); disposables.push(stream);
    const pour = new Mesh(stream, pourMat); pour.renderOrder = 2; pours.push(pour);
    group.add(pour);
  }

  /** `t` drives the pouring; `show` fades the shacks out as the canyon flattens. */
  const update = (t: number, show: number) => {
    group.visible = show > 0.01;
    pourMat.uniforms.uTime.value = t; pourMat.uniforms.uOpacity.value = show;
    edgeMat.opacity = 0.75 * show;
    for (const g of glassLines) g.opacity = 0.6 * show;
    for (const s of sprites) s.opacity = show;
    group.position.y = -(1 - show) * 6; // sink into the land as it flattens
  };
  return { group, update, disposables };
}
