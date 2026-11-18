"""Build the preview's ddgNEW files from the ddg11 base, to match claude/hold-polish:
hold fixes, status line, NO water vortex (the liquid module is cut out), Hide leaves only a Show button.
Usage: python3 patch13.py   (run in this folder)"""
import re
from nova_glsl import OLD as NOVA_OLD, NEW as NOVA_NEW
A = 'assets'
NEW = '23'  # the build number of the files written; rename every time (see HANDOVER.md)
def rd(p): return open(p, encoding='utf-8').read()
def one(s, a, b, n=1):
    assert s.count(a) == n, (a[:70], s.count(a))
    return s.replace(a, b)
s = rd(f'{A}/Stage-ddg11.js')
# the liquid vortex: cut out, with every call to it
a = s.index('const __LQ=(()=>{'); b = s.index('const __lq={o:null};\n') + len('const __lq={o:null};\n')
s = s[:a] + "const __st={el:null,lp:'none yet',at:0,fps:0};\n" + s[b:]
s = one(s, '__lq.o=__LQ.makeLiquid(a),', '')
s = one(s, ',__lq.o.scatter($.position)),', '),')
s = one(s, '__lq.o.update(oe,nt.holdFxVortex>.5&&nt.holdVortexLook===5?fxC*(1-Xt):0,$.position,me*ze,{amount:nt.holdFxAmount,speed:nt.holdFxSpeed,size:nt.holdVortexSize,reach:nt.holdVortexReach,glow:nt.holdVortexGlow},(Zt,se)=>Math.max(it(se),zn(Zt,se)*(1-D))),', '')
s = one(s, 'funnel:__lq.o.funnel,', '')
# no vortex of any kind round the orb
s = one(s, 'nt.holdFxVortex>.5&&nt.holdVortexLook!==5', '!1')
# the status line (preview only)
s = one(s, 'a.render(d,g),__lq.o.render(g,$.position,me*ze,jt),',
  'a.render(d,g),(()=>{if(globalThis.__DDG_TUNE__&&Pt-__st.at>250){__st.at=Pt;if(!__st.el||!__st.el.isConnected){__st.el=document.createElement("div");__st.el.style.cssText="position:fixed;left:10px;bottom:8px;z-index:2147482000;font:11px/1.4 ui-monospace,Menlo,monospace;color:#9fd8ff;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;pointer-events:none";document.body.appendChild(__st.el)}__st.el.textContent=`scroll ${Math.round(scrollY)} px · orb: ${de.down?"HELD":_t?"let go first":Te.r>0?"ready to press":"cannot be pressed (page scrolled too far)"} · last press: ${__st.lp} · charge ${Math.round(ie*100)}% · ${Math.round(__st.fps)} frames/s`}})(),')
assert '__lq' not in s and '__LQ' not in s
# time step never negative; frames a second
s = one(s, 'const ee=Pt-wt,oe=Math.min(.05,ee/1e3);', 'const ee=Pt-wt,oe=Math.min(.05,Math.max(0,ee/1e3));ee>0&&ee<1e3&&(__st.fps+=(1e3/ee-__st.fps)*.1);')
# the press: works on a slightly scrolled page (jumps to the top), and says what happened
s = one(s, 'on=Pt=>{Pt.button>0||!tr(Pt.clientX,Pt.clientY)||Pt.target?.closest?.("a,button,input,textarea,select,label,.tune")||(de.down=!0,de.id=Pt.pointerId,de.x=Pt.clientX,de.y=Pt.clientY)}',
  'on=Pt=>{if(Pt.button>0||!tr(Pt.clientX,Pt.clientY)){__st.lp=Pt.button>0?"not the main button":Te.r>0?"missed the orb":"orb not ready";return}if(Pt.target?.closest?.("a,button,input,textarea,select,label,.tune")){__st.lp="on a button or the panel";return}__st.lp="on the orb";de.down=!0,de.on=!0,de.id=Pt.pointerId,de.x=Pt.clientX,de.y=Pt.clientY;scrollY>0&&scrollTo({top:0,behavior:"instant"})}')
s = one(s, 'Qi.style.cursor=tr(Pt.clientX,Pt.clientY)&&scrollY<40?"pointer":""', 'Qi.style.cursor=tr(Pt.clientX,Pt.clientY)?"pointer":""')
s = one(s, 'Gn=Pt=>{Pt.pointerId===de.id&&(de.down=!1,_t=!1)}', 'Gn=Pt=>{Pt.pointerId===de.id&&(de.down&&Pt.type==="pointercancel"&&(__st.lp="cancelled by the browser"),de.down=!1,de.on=!1,_t=!1)}')
s = one(s, 'de.down&&(H>.08||nt.holdOn<.5)&&(de.down=!1)', 'de.down&&(scrollY>Ce*.1||nt.holdOn<.5)&&(de.down=!1)')
s = one(s, 'Te.r=H<.06?ke:0', 'Te.r=H<.25?ke:0')
# IMPORTANT: the scene chunk imports the site chunk by name. If this name is not changed too, the browser loads
# the OLD site file as a second copy of the whole page (two panels, two 3D scenes: Hide seems dead, and it lags).
s = one(s, 'from"./site-ddg11.js"', f'from"./site-ddg{NEW}.js"')
s = one(s, NOVA_OLD, NOVA_NEW)  # the nova's push on the water, less uniform
# the moment the orb explodes, the words fly back (and are shown at once)
s = one(s, "const __st={el:null,lp:'none yet',at:0,fps:0};", "const __st={el:null,lp:'none yet',at:0,fps:0,bl:!1};")
s = one(s, 'let Lt=!1;St&&ie>=1&&(Lt=!0,_t=!0,de.down=!1,tt=0,ht=1.6),', 'let Lt=!1;St&&ie>=1?(Lt=!0,_t=!0,de.down=!1,tt=0,ht=1.6,__st.bl=!0):St&&(__st.bl=!1),')
s = one(s, '{const fw=nt.holdFlyOff>.5&&(de.down||tt>=0||ie>.02);', '{const fw=nt.holdFlyOff>.5&&!__st.bl&&(de.down||ie>.02);')
s = one(s, 'mn.style.opacity=String(Math.min(1,Math.max(0,(re-.7)/.3))*(1-Ze(ve)))', 'mn.style.opacity=String(Math.min(1,Math.max(0,(re-.7)/.3))*(__st.bl?1:1-Ze(ve)))')
# once held, the finger can go anywhere: no scroll with that finger, no drag, no selecting, pointer captured
s = one(s, 'scrollY>0&&scrollTo({top:0,behavior:"instant"})}', 'scrollY>0&&scrollTo({top:0,behavior:"instant"});try{Pt.target?.setPointerCapture?.(Pt.pointerId)}catch{}}')
s = one(s, 'document.addEventListener("selectstart",Wn)', 'document.addEventListener("selectstart",Wn),document.addEventListener("dragstart",Wn),addEventListener("touchmove",__st.ns=e=>{(de.down||de.on)&&e.cancelable&&e.preventDefault()},{passive:!1}),addEventListener("touchend",__st.te=e=>{e.touches.length===0&&(de.on=!1)}),addEventListener("touchcancel",__st.te)')
s = one(s, 'document.removeEventListener("selectstart",Wn)', 'document.removeEventListener("selectstart",Wn),document.removeEventListener("dragstart",Wn),removeEventListener("touchmove",__st.ns),removeEventListener("touchend",__st.te),removeEventListener("touchcancel",__st.te)')
s = one(s, 'const St=de.down&&!_t;', '{const s_=de.down?"none":"",r_=document.documentElement.style;r_.userSelect!==s_&&(r_.userSelect=s_,r_.setProperty("-webkit-user-select",s_),r_.setProperty("-webkit-touch-callout",s_))}const St=de.down&&!_t;')
open(f'{A}/Stage-ddg{NEW}.js', 'w', encoding='utf-8').write(s)

t = rd(f'{A}/site-ddg11.js')
t = one(t, 'Stage-ddg11.js', f'Stage-ddg{NEW}.js', t.count('Stage-ddg11.js'))
t, n = re.subn(r'\{group:"Hold the orb",key:"hold(?:FxVortex|Vortex[A-Za-z]*)",[^{}]*\},', '', t); assert n == 6, n
t, n = re.subn(r'\s*hold(?:FxVortex|Vortex[A-Za-z]*):\s*[0-9.]+,', '', t); assert n == 6, n
t = one(t, '.tune.min { bottom: auto; }\n.tune.min .tune-body, .tune.min .tune-foot { display: none; }',
  '.tune.min { bottom: auto; width: auto; background: none; border: 0; box-shadow: none; backdrop-filter: none; }\n.tune.min .tune-body, .tune.min .tune-foot, .tune.min .tune-head b { display: none; }\n.tune.min .tune-head { padding: 0; border: 0; } .tune.min button { opacity: 0.55; }')
t = one(t, 'ddg-scene-tune-32', 'ddg-scene-tune-39', t.count('ddg-scene-tune-32'))
# the quote: a 'White (black words)' colour choice exists; the default stays black with the thin white frame
t = one(t, '[30,6,10]][r.qbColour]||[0,0,0];', '[30,6,10],[255,255,255]][r.qbColour]||[0,0,0];a.setProperty("--quote-ink",c[0]+c[1]+c[2]>380?"#000":"");')
t = one(t, 'rgb(${c.map(v=>v+10).join(",")})', 'rgb(${c.map(v=>Math.min(255,v+10)).join(",")})')
t = one(t, 'max:6,step:1,names:["Black","Charcoal","Midnight","Deep navy","Deep teal","Deep purple","Deep red"]', 'max:7,step:1,names:["Black","Charcoal","Midnight","Deep navy","Deep teal","Deep purple","Deep red","White (black words)"]')
t = one(t, 'qbPadX:16,', 'qbPadX:32,')  # Markus's settings, 18 Nov 19:01 (black patch, thin white frame)
t, n = re.subn(r'\bholdNova:\s*[-0-9.]+', 'holdNova:0.05', t); assert n == 1, n  # Markus, 18 Nov 19:37
# Markus's settings, 18 Nov 19:07
for k, v in {'swirlSize': 2.25, 'waterGlint': 2.05, 'waterReflect': 1.1, 'waterColour': 3, 'shSize': 0.95, 'shSpacing': 0.12, 'brandSize': 0.6, 'logoSize': 0.75, 'logoGap': 13, 'brandLift': 17}.items():
    t, n = re.subn(r'\b%s:\s*[-0-9.]+' % k, '%s:%s' % (k, v), t); assert n == 1, (k, n)
c = rd(f'{A}/site-ddg6.css')
c = one(c, '.cn-quote-t{display:block;', '.cn-quote-t{display:block;color:var(--quote-ink, inherit);')
c = one(c, '.cn-quote-hi{font-weight:700;color:var(--j-accent, var(--ng-ice))}', '.cn-quote-hi{font-weight:700;color:var(--quote-ink, var(--j-accent, var(--ng-ice)))}')
c = one(c, '.cn-quote-hi{-webkit-text-fill-color:var(--j-accent, var(--ng-ice))}', '.cn-quote-hi{-webkit-text-fill-color:var(--quote-ink, var(--j-accent, var(--ng-ice)))}')
# the scroll hint on two lines: "|" in the words starts a new line
t = one(t, 'for(const g of(E.shText||"").split(/(\\s+)/))', 'for(const g of(E.shText||"").replace(/\\s*\\|\\s*/g,"\\n").split(/(\\s+)/))')
t = one(t, 'shText:"Scroll for Web-Page or Press & Hold Orb for Fun"', 'shText:"Scroll for Web-Page or | Press & Hold Orb for Fun"')
t = one(t, 'Words (leave empty for arrow only)', 'Words (| starts a new line; empty = arrow only)')
c = one(c, '.cn-scroll-words{margin-right:calc(-1 * var(--sh-track, .3em))}', '.cn-scroll-words{margin-right:calc(-1 * var(--sh-track, .3em));white-space:pre-line;text-align:center}')
open(f'{A}/site-ddg{NEW}.css', 'w', encoding='utf-8').write(c)
open(f'{A}/site-ddg{NEW}.js', 'w', encoding='utf-8').write(t)
h = rd('index.html'); h = one(h, 'site-ddg11.js', f'site-ddg{NEW}.js'); h = one(h, 'site-ddg6.css', f'site-ddg{NEW}.css'); open('index.html', 'w', encoding='utf-8').write(h)
print('ok')
