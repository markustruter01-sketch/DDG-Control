// Run the liquid's drop motion without a browser (three.js stubbed), and print what the drops do.
import fs from 'fs';
let src = fs.readFileSync('/tmp/tp/liquid.js', 'utf8').replace(/import \{[^}]*\} from "three";\n?/, '').replace(/import \{ SKY_GLSL \} from "\.\/sky";\n?/, '').replace(/^export /m, '');
const stub = `
class V{constructor(x=0,y=0,z=0,w=0){this.x=x;this.y=y;this.z=z;this.w=w}set(x,y,z,w){this.x=x;this.y=y;this.z=z;this.w=w;return this}copy(o){Object.assign(this,o);return this}setScalar(){return this}}
class G{constructor(){this.attributes={}}setAttribute(k,a){this.attributes[k]=a}}
class O{constructor(){this.position=new V();this.scale=new V()}add(){}}
const BufferAttribute=class{constructor(a){this.array=a}},BufferGeometry=G,Color=V,FloatType=1,HalfFloatType=2,LinearFilter=1,Matrix3=V,Mesh=O,MeshBasicMaterial=O,NearestFilter=1,OrthographicCamera=O,PlaneGeometry=G,Points=O,RGBAFormat=1,Scene=O,ShaderMaterial=class{constructor(o){this.uniforms=o.uniforms||{}}},SphereGeometry=G,Vector2=V,Vector3=V,Vector4=V,WebGLRenderTarget=class{constructor(){this.texture={}}},SKY_GLSL='',FramebufferTexture=class{};
globalThis.innerWidth=1400;
`;
src = stub + src + '\nexport { makeLiquid };';
fs.writeFileSync('/tmp/tp/liquid_sim.mjs', src);
const { makeLiquid } = await import('/tmp/tp/liquid_sim.mjs?' + Date.now());
const lq = makeLiquid({ extensions: { has: () => true } });
const R = 4.32, orb = { x: 0, y: 7.5, z: 9 };
const look = { amount: 0.9, speed: 3, size: 1, reach: 1.5, glow: 0.85, bowlDepth: 1.95, bowlR: 7.74 };
const ground = (x, z) => Math.abs(x) > 30 ? 9 : 4.5 - 0.01 * z;
const pos = lq.disposables[0].attributes.position.array, sz = lq.disposables[0].attributes.aSize.array;
const dt = 1 / 30; let charge = 0, nova = false;
for (let f = 0; f < 200; f++) {
  const t = f * dt;
  if (!nova) charge = Math.min(1, charge + dt / 3);
  if (charge >= 1 && !nova) { nova = true; lq.scatter(orb); console.log('--- nova at', t.toFixed(2)); }
  const p = nova ? 0 : Math.pow(charge, 1.4);
  orb.y = 7.5 + 5 * Math.pow(charge, 1.4);
  lq.update(dt, p, orb, R, look, ground);
  if (f % 10 === 9) {
    let n = 0, ymin = 1e9, ymax = -1e9, rmax = 0, inFront = 0, rsum = 0;
    for (let i = 0; i < sz.length; i++) if (sz[i] > 0) { n++; const y = pos[i * 3 + 1], r = Math.hypot(pos[i * 3] - orb.x, pos[i * 3 + 2] - orb.z); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); rmax = Math.max(rmax, r); rsum += r; if (y > orb.y - R) inFront++; }
    console.log(t.toFixed(2), 'p', p.toFixed(2), 'drops', n, 'aboveOrbBottom', inFront, 'y', ymin.toFixed(1), ymax.toFixed(1), 'orbY', orb.y.toFixed(1), 'ravg', (rsum / Math.max(1, n)).toFixed(1), 'rmax', rmax.toFixed(1), 'mound', (-lq.funnel.z).toFixed(2));
  }
}
