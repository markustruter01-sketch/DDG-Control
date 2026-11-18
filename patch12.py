"""Patch the preview build (hand-patched bundle) from ddgA to ddgB to match claude/hold-polish.
Usage: python3 patch12.py PREVIEW_DIR OLD NEW LIQUID_JS   (e.g. ... 11 12 /tmp/tp/liquid.js)"""
import re, sys, os
root, old, new, lqjs = sys.argv[1:5]
A = os.path.join(root, 'assets')
def rd(p): return open(p, encoding='utf-8').read()
def one(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a))
    return s.replace(a, b)

# ── Stage chunk ──
s = rd(f'{A}/Stage-ddg{old}.js')
# 1. the liquid module, transpiled, as an IIFE with three.js names mapped to the minified ones
lq = rd(lqjs)
lq = re.sub(r'import \{[^}]*\} from "three";\n?', '', lq); lq = re.sub(r'import \{ SKY_GLSL \} from "./sky";\n?', '', lq); lq = re.sub(r'^export ', '', lq, flags=re.M)
assert 'import ' not in lq and 'export ' not in lq
iife = ('const __LQ=(()=>{class FramebufferTexture extends Ie{constructor(w,h){super({width:w,height:h});this.isFramebufferTexture=!0;this.magFilter=1003;this.minFilter=1003;this.generateMipmaps=!1;this.needsUpdate=!0}}const BufferAttribute=pe,BufferGeometry=xe,Color=Kt,FloatType=1015,HalfFloatType=1016,LinearFilter=1006,Matrix3=Wt,Mesh=ge,MeshBasicMaterial=xa,NearestFilter=1003,OrthographicCamera=ap,PlaneGeometry=Ji,Points=ra,RGBAFormat=1023,Scene=a0,ShaderMaterial=fe,SphereGeometry=Cn,Vector2=vt,Vector3=L,Vector4=he,WebGLRenderTarget=oi,SKY_GLSL=ws;\n' + lq + '\nreturn {makeLiquid};})();\nconst __lq={o:null};\n')
a = s.index('const __LQ=(()=>{'); b = s.index('const __lq={o:null};\n') + len('const __lq={o:null};\n')
s = s[:a] + iife + "const __st={el:null,lp:'none yet',at:0,fps:0,err:''};\n" + s[b:]
# 2. time step never negative; frames-per-second for the status line
s = one(s, 'const ee=Pt-wt,oe=Math.min(.05,ee/1e3);', 'const ee=Pt-wt,oe=Math.min(.05,Math.max(0,ee/1e3));ee>0&&ee<1e3&&(__st.fps+=(1e3/ee-__st.fps)*.1);')
# 3. the press: works on a slightly scrolled page (jumps to the top), and says what happened
s = one(s, 'on=Pt=>{Pt.button>0||!tr(Pt.clientX,Pt.clientY)||Pt.target?.closest?.("a,button,input,textarea,select,label,.tune")||(de.down=!0,de.id=Pt.pointerId,de.x=Pt.clientX,de.y=Pt.clientY)}',
  'on=Pt=>{if(Pt.button>0||!tr(Pt.clientX,Pt.clientY)){__st.lp=Pt.button>0?"not the main button":Te.r>0?"missed the orb":"orb not ready";return}if(Pt.target?.closest?.("a,button,input,textarea,select,label,.tune")){__st.lp="on a button or the panel";return}__st.lp="on the orb";de.down=!0,de.id=Pt.pointerId,de.x=Pt.clientX,de.y=Pt.clientY;scrollY>0&&scrollTo({top:0,behavior:"instant"})}')
s = one(s, 'Qi.style.cursor=tr(Pt.clientX,Pt.clientY)&&scrollY<40?"pointer":""', 'Qi.style.cursor=tr(Pt.clientX,Pt.clientY)?"pointer":""')
s = one(s, 'Gn=Pt=>{Pt.pointerId===de.id&&(de.down=!1,_t=!1)}', 'Gn=Pt=>{Pt.pointerId===de.id&&(de.down&&Pt.type==="pointercancel"&&(__st.lp="cancelled by the browser"),de.down=!1,_t=!1)}')
s = one(s, 'de.down&&(H>.08||nt.holdOn<.5)&&(de.down=!1)', 'de.down&&(scrollY>Ce*.1||nt.holdOn<.5)&&(de.down=!1)')
s = one(s, 'Te.r=H<.06?ke:0', 'Te.r=H<.25?ke:0')
# 4. the liquid: the river's dish, a safety net, the river's own uniforms, the status line
s = one(s, '__lq.o.update(oe,nt.holdFxVortex>.5&&nt.holdVortexLook===5?fxC*(1-Xt):0,$.position,me*ze,{amount:nt.holdFxAmount,speed:nt.holdFxSpeed,size:nt.holdVortexSize,reach:nt.holdVortexReach,glow:nt.holdVortexGlow},(Zt,se)=>Math.max(it(se),zn(Zt,se)*(1-D))),',
  '(()=>{if(__st.err)return;try{const sk=nt.waterDesign>3.5,sr=(1-Ze(Xt*2.5))*ze;__lq.o.update(oe,nt.holdFxVortex>.5&&nt.holdVortexLook===5?fxC*(1-Xt):0,$.position,me*ze,{amount:nt.holdFxAmount,speed:nt.holdFxSpeed,size:nt.holdVortexSize,reach:nt.holdVortexReach,glow:nt.holdVortexGlow,bowlDepth:(sk?.65*nt.swirlDepth:.9)*sr*(1-D),bowlR:sk?3.6*nt.swirlSize:6.3},(Zt,se)=>Math.max(it(se),zn(Zt,se)*(1-D)))}catch(e){__st.err=String(e),__lq.o.funnel.z=0}})(),')
s = one(s, 'a.render(d,g),__lq.o.render(g,$.position,me*ze,jt),',
  'a.render(d,g),(()=>{if(!__st.err)try{__lq.o.render(g,$.position,me*ze,jt,x.river.material.uniforms)}catch(e){__st.err=String(e),__lq.o.funnel.z=0,a.setRenderTarget(null)}if(globalThis.__DDG_TUNE__&&Pt-__st.at>250){__st.at=Pt;if(!__st.el||!__st.el.isConnected){__st.el=document.createElement("div");__st.el.style.cssText="position:fixed;left:10px;bottom:8px;z-index:2147482000;font:11px/1.4 ui-monospace,Menlo,monospace;color:#9fd8ff;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;pointer-events:none";document.body.appendChild(__st.el)}__st.el.textContent=`scroll ${Math.round(scrollY)} px · orb: ${de.down?"HELD":_t?"let go first":Te.r>0?"ready to press":"cannot be pressed (page scrolled too far)"} · last press: ${__st.lp} · charge ${Math.round(ie*100)}% · ${Math.round(__st.fps)} frames/s · water vortex: ${__st.err?"failed: "+__st.err.slice(0,80):__lq.o.ok?"ok":"not supported on this device"}`}})(),')
# 5. the river: the surface under the orb can now rise into a mound
s = one(s, 'uFunnel.z <= 0.0 ? 0.0 : -uFunnel.z * exp(', 'uFunnel.z == 0.0 ? 0.0 : -uFunnel.z * exp(')
open(f'{A}/Stage-ddg{new}.js', 'w', encoding='utf-8').write(s)

# ── site chunk: settings ──
t = rd(f'{A}/site-ddg{old}.js')
t = one(t, f'Stage-ddg{old}.js', f'Stage-ddg{new}.js', t.count(f'Stage-ddg{old}.js'))
t = one(t, 'holdVortexSize:.4,', 'holdVortexSize:1,') if 'holdVortexSize:.4,' in t else one(t, 'holdVortexSize:0.4,', 'holdVortexSize:1,')
t = one(t, 'Vortex: particle size', 'Vortex: drop size')
m = re.findall(r'ddg-scene-tune-(\d+)', t); assert len(set(m)) == 1
t = t.replace(f'ddg-scene-tune-{m[0]}', f'ddg-scene-tune-{int(m[0]) + 1}')
open(f'{A}/site-ddg{new}.js', 'w', encoding='utf-8').write(t)
h = rd(f'{root}/index.html'); h = one(h, f'site-ddg{old}.js', f'site-ddg{new}.js'); open(f'{root}/index.html', 'w', encoding='utf-8').write(h)
print('patched', old, '->', new, 'tune store', int(m[0]) + 1)
