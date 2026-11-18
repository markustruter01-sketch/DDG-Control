"""Build the preview's ddgNEW files from the ddg11 base, to match claude/hold-polish:
hold fixes, status line, NO water vortex (the liquid module is cut out), Hide leaves only a Show button.
Usage: python3 patch13.py   (run in this folder)"""
import re
from nova_glsl import OLD as NOVA_OLD, NEW as NOVA_NEW
A = 'assets'
NEW = '43'  # the build number of the files written; rename every time (see HANDOVER.md)
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
# the words fly back at the end of the settle time after the blast (Markus, 18 Nov 19:57), not at the blast
s = one(s, "const __st={el:null,lp:'none yet',at:0,fps:0};", "const __st={el:null,lp:'none yet',at:0,fps:0,bl:!1};")
s = one(s, '{const fw=nt.holdFlyOff>.5&&(de.down||tt>=0||ie>.02);', '{const fw=nt.holdFlyOff>.5&&(de.down||ie>.02);')
# once held, the finger can go anywhere: no scroll with that finger, no drag, no selecting, pointer captured
s = one(s, 'scrollY>0&&scrollTo({top:0,behavior:"instant"})}', 'scrollY>0&&scrollTo({top:0,behavior:"instant"});try{Pt.target?.setPointerCapture?.(Pt.pointerId)}catch{}}')
s = one(s, 'document.addEventListener("selectstart",Wn)', 'document.addEventListener("selectstart",Wn),document.addEventListener("dragstart",Wn),addEventListener("touchmove",__st.ns=e=>{(de.down||de.on)&&e.cancelable&&e.preventDefault()},{passive:!1}),addEventListener("touchend",__st.te=e=>{e.touches.length===0&&(de.on=!1)}),addEventListener("touchcancel",__st.te)')
s = one(s, 'document.removeEventListener("selectstart",Wn)', 'document.removeEventListener("selectstart",Wn),document.removeEventListener("dragstart",Wn),removeEventListener("touchmove",__st.ns),removeEventListener("touchend",__st.te),removeEventListener("touchcancel",__st.te)')
s = one(s, 'const St=de.down&&!_t;', '{const s_=de.down?"none":"",r_=document.documentElement.style;r_.userSelect!==s_&&(r_.userSelect=s_,r_.setProperty("-webkit-user-select",s_),r_.setProperty("-webkit-touch-callout",s_))}const St=de.down&&!_t;')
# pressed-glass dent under the finger, and the phone buzz that builds with the charge
s = one(s, "const __st={el:null,lp:'none yet',at:0,fps:0,bl:!1};", "const __st={el:null,lp:'none yet',at:0,fps:0,bl:!1,d:null,dk:0,ba:0,bz:!1,buzz(ms){try{navigator.vibrate(ms)}catch{}}};")
s = one(s, 'hi=Pt=>{Pt.pointerType==="mouse"', 'hi=Pt=>{de.down&&Pt.pointerId===de.id&&(de.x=Pt.clientX,de.y=Pt.clientY);Pt.pointerType==="mouse"')
s = one(s, '{const fw=nt.holdFlyOff>.5&&(de.down||ie>.02);',
  '{const dn_=nt.holdDent||0;if(dn_>0&&(de.down||__st.dk>.01)){if(!__st.d||!__st.d.isConnected){__st.d=document.createElement("div");__st.d.setAttribute("aria-hidden","true");__st.d.style.cssText="position:fixed;left:0;top:0;z-index:2147481000;pointer-events:none;border-radius:50%;will-change:transform,opacity;background:radial-gradient(circle at 50% 46%,rgba(0,0,0,.34) 0%,rgba(0,0,0,.16) 42%,rgba(255,255,255,.07) 68%,rgba(255,255,255,0) 100%);box-shadow:inset 0 7px 20px rgba(0,0,0,.6),inset 0 -4px 12px rgba(255,255,255,.2),0 0 0 1px rgba(255,255,255,.16),0 0 34px rgba(140,210,255,.18);-webkit-backdrop-filter:blur(2.5px) brightness(.82) saturate(1.25);backdrop-filter:blur(2.5px) brightness(.82) saturate(1.25);-webkit-mask-image:radial-gradient(circle,#000 30%,rgba(0,0,0,.55) 52%,transparent 72%);mask-image:radial-gradient(circle,#000 30%,rgba(0,0,0,.55) 52%,transparent 72%)";document.body.appendChild(__st.d)}__st.dk=de.down?Math.min(1,__st.dk+oe/.15):Math.max(0,__st.dk-oe/.35);const sz_=(70+110*Et)*dn_*(.6+.4*__st.dk);__st.d.style.width=__st.d.style.height=sz_.toFixed(1)+"px";__st.d.style.transform=`translate(${(de.x-sz_/2).toFixed(1)}px, ${(de.y-sz_/2).toFixed(1)}px)`;__st.d.style.opacity=__st.dk.toFixed(2)}else __st.d&&__st.d.style.opacity!=="0"&&(__st.dk=0,__st.d.style.opacity="0");if(typeof navigator.vibrate=="function"&&nt.holdVibrate>0&&!s){const vk_=Math.min(1,nt.holdVibrate);St&&!Lt?(Pt-__st.ba>480-410*Et&&(__st.ba=Pt,__st.buzz(Math.round((6+44*Et)*vk_))),__st.bz=!0):(__st.bz||Lt)&&(__st.bz=!1,__st.buzz(0))}}{const fw=nt.holdFlyOff>.5&&(de.down||ie>.02);')
s = one(s, 'mn&&(mn.style.opacity=""),', 'mn&&(mn.style.opacity=""),__st.d&&__st.d.remove(),__st.bz&&__st.buzz(0),')
# phone layout: five things spaced evenly on tall screens, measured (Markus, 18 Nov 20:33); camera at load twice as far (20:35)
s = one(s, "dk:0,ba:0,bz:!1,", "dk:0,ba:0,bz:!1,al:null,yk:'',yo:!1,ya:-1e9,yc:null,yz:0,tb:0,tw:-1,")
s = one(s, 'm=o?80:110,h=o?150:200,T=200,M=380,y=60,', 'm=o?80:110,h=o?186:247,T=200,M=470,y=150,')
s = one(s, 'Vt=ft(innerWidth,Pt),Vt>0?g.setViewOffset', 'Vt=__st.al??ft(innerWidth,Pt),Vt!==0?g.setViewOffset')
s = one(s, 'const mn=Yt.querySelector(".cn-follow"),', 'const mn=Yt.querySelector(".cn-follow"),__ly=me=>{__st.ya=performance.now();const E=Ni(),nv=Yt.querySelector(".s-nav"),br=Yt.querySelector(".cn-brand"),hn=Yt.querySelector(".cn-scroll"),qt=Yt.querySelector(".cn-quote"),ct=Yt.querySelector(".cn-cta"),lon=(nt.phoneLayout??1)>.5&&innerWidth/E<.8&&!!(nv&&br&&qt&&ct);if(lon!==__st.yo&&(__st.yo=lon,Yt.classList.toggle("cn-lay",lon),__st.yk=""),!lon){__st.al!==null&&(__st.al=null,At());__st.yz&&(__st.yz=0,Yt.style.removeProperty("--z"));return}if(__st.tw!==innerWidth){__st.tw=innerWidth;const pb=document.createElement("span");pb.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;font:100px/1 sans-serif;white-space:nowrap",pb.textContent="X",document.body.appendChild(pb);const ph=pb.getBoundingClientRect().height;pb.remove(),__st.tb=ph>0?Math.min(2,Math.max(.8,ph/100)):1}{const zz=Math.min(1.6,Math.max(.6,Math.min(innerWidth/393,innerHeight/798)/__st.tb));Math.abs(zz-__st.yz)>.004&&(__st.yz=zz,Yt.style.setProperty("--z",zz.toFixed(3)),__st.yk="")}const tp=nv.getBoundingClientRect().bottom,bm=ct.getBoundingClientRect().top-(parseFloat(Yt.style.getPropertyValue("--cn-dy"))||0),hB=br.getBoundingClientRect().height,hH=hn&&hn.offsetParent&&getComputedStyle(hn).display!=="none"?hn.getBoundingClientRect().height:0,pq=nt.quoteOn?nt.qbPadY*__st.yz:0,hQ=nt.quoteOn?qt.getBoundingClientRect().height+2*pq:0,lc=__st.yc||(__st.yc=new Xe(58,1,.1,500));lc.fov=g.fov,lc.aspect=g.aspect,lc.clearViewOffset(),lc.updateProjectionMatrix(),lc.position.set(0,9,42).sub($t).multiplyScalar(Math.max(.5,nt.camZoom)).add($t),lc.position.y+=nt.camUp||0,lc.lookAt($t),lc.updateMatrixWorld();const[y0,r0]=xt(lc,new L(0,B.y+nt.orbHeight,B.z),me),D2=2*r0,pr=hH>0?5:4,gp=Math.max(6,(bm-tp-hB-hH-D2-hQ)/pr),b0=tp+gp,h0=b0+hB+gp,om=h0+hH+(hH>0?gp:0)+D2/2,q0=om+D2/2+gp+pq,ky=[b0,h0,q0,om].map(v=>v.toFixed(1)).join("|");if(ky===__st.yk)return;__st.yk=ky,Yt.style.setProperty("--lay-brand",b0.toFixed(1)+"px"),Yt.style.setProperty("--lay-hint",h0.toFixed(1)+"px"),Yt.style.setProperty("--lay-quote",q0.toFixed(1)+"px");const lf=y0-om;(__st.al===null||Math.abs(lf-__st.al)>.5)&&(__st.al=lf,At()),N=""},')
s = one(s, 'if(rt.update(ie,de.down?1:0,et),bt.fov=g.fov,bt.aspect=g.aspect,Vt>0){', 'if(rt.update(ie,de.down?1:0,et),H<.005&&!de.down&&ie===0&&(nu()===null||performance.now()-__st.ya>250)&&__ly(me),bt.fov=g.fov,bt.aspect=g.aspect,Vt!==0){')
s = one(s, 'bt.position.set(0,9,42),bt.lookAt($t)', 'bt.position.set(0,9,42).sub($t).multiplyScalar(Math.max(.5,nt.camZoom)).add($t),bt.position.y+=nt.camUp||0,bt.lookAt($t)')
s = one(s, 'It.set(0,12-9*nt.holdCamTilt,2+4*nt.holdCamTilt),', 'It.set(0,12-9*nt.holdCamTilt,2+4*nt.holdCamTilt),(()=>{const zm=jn(Math.max(.5,nt.camZoom),1,Ze(H*1.5)),sh=g.position.clone().sub(Ot).multiplyScalar(zm-1);g.position.add(sh),Ct.add(sh),g.position.y+=(nt.camUp||0)*(1-Ze(H*1.5)),Ct.y+=nt.camUp||0;const ex=sh.length()*Math.sign(zm-1);dt.near+=ex,dt.far+=ex,z.uniforms.uFogNear.value=dt.near,z.uniforms.uFogFar.value=dt.far})(),')
# orb height from its bottom edge, so the bigger computer orb no longer sinks into the water (Markus, 19 Nov 06:36)
s = one(s, '$.position.set(0,B.y+nt.orbHeight+Xt*26,B.z-Xt*10),$.scale.setScalar((o?1.44:2.19)*nt.orbSize),',
        '$.position.set(0,B.y+nt.orbHeight+et*((o?1.44:2.19)*nt.orbSize-2.88)+Xt*26,B.z-Xt*10),$.scale.setScalar((o?1.44:2.19)*nt.orbSize),')
open(f'{A}/Stage-ddg{NEW}.js', 'w', encoding='utf-8').write(s)

t = rd(f'{A}/site-ddg11.js')
t = one(t, 'Stage-ddg11.js', f'Stage-ddg{NEW}.js', t.count('Stage-ddg11.js'))
t, n = re.subn(r'\{group:"Hold the orb",key:"hold(?:FxVortex|Vortex[A-Za-z]*)",[^{}]*\},', '', t); assert n == 6, n
t, n = re.subn(r'\s*hold(?:FxVortex|Vortex[A-Za-z]*):\s*[0-9.]+,', '', t); assert n == 6, n
t = one(t, '.tune.min { bottom: auto; }\n.tune.min .tune-body, .tune.min .tune-foot { display: none; }',
  '.tune.min { bottom: auto; width: auto; background: none; border: 0; box-shadow: none; backdrop-filter: none; }\n.tune.min .tune-body, .tune.min .tune-foot, .tune.min .tune-head b { display: none; }\n.tune.min .tune-head { padding: 0; border: 0; } .tune.min button { opacity: 0.55; }')
t = one(t, 'ddg-scene-tune-32', 'ddg-scene-tune-51', t.count('ddg-scene-tune-32'))
# the quote: a 'White (black words)' colour choice exists; the default stays black with the thin white frame
t = one(t, '[30,6,10]][r.qbColour]||[0,0,0];', '[30,6,10],[255,255,255]][r.qbColour]||[0,0,0];a.setProperty("--quote-ink",c[0]+c[1]+c[2]>380?"#000":"");')
t = one(t, 'rgb(${c.map(v=>v+10).join(",")})', 'rgb(${c.map(v=>Math.min(255,v+10)).join(",")})')
t = one(t, 'max:6,step:1,names:["Black","Charcoal","Midnight","Deep navy","Deep teal","Deep purple","Deep red"]', 'max:7,step:1,names:["Black","Charcoal","Midnight","Deep navy","Deep teal","Deep purple","Deep red","White (black words)"]')
t = one(t, 'qbPadX:16,', 'qbPadX:32,')  # Markus's settings, 18 Nov 19:01 (black patch, thin white frame)
t, n = re.subn(r'\bholdNova:\s*[-0-9.]+', 'holdNova:0.05', t); assert n == 1, n  # Markus, 18 Nov 19:37
# Markus, 18 Nov 19:40: the hold camera pulls out twice as far (back 15 -> 30, up 5 -> 10)
t = one(t, 'holdCamUp:5,', 'holdCamUp:10,'); t = one(t, 'holdCamBack:15,', 'holdCamBack:30,'); t = one(t, 'label:"Camera: how far back",min:-10,max:20,', 'label:"Camera: how far back",min:-10,max:40,')
t = one(t, 'holdVignette:1,', 'holdVignette:0,')  # Markus, 18 Nov 19:59: no dark screen edges while charging
t = one(t, 'waterDesign:4,', 'waterDesign:1,')  # Markus, 18 Nov 21:41: water design 1 (glass)
# Markus's settings, 18 Nov 22:03
for k, v in {'orbSize': 2, 'orbHeight': -1.6, 'holdCalm': 2.5, 'holdFxAmount': 3, 'holdShock': 2, 'waterClear': 0.82}.items():
    t, n = re.subn(r'\b%s:\s*[-0-9.]+' % k, '%s:%s' % (k, v), t); assert n == 1, (k, n)
# Markus's settings, 18 Nov 19:07 (text sizes re-set on 18 Nov 21:52 to one scale: name 22, logo 44, button 16, menu 14, quote 13, hint 12.6 px on a 393 phone)
for k, v in {'swirlSize': 2.25, 'waterGlint': 2.05, 'waterReflect': 1.1, 'waterColour': 3, 'shSize': 1.15, 'shSpacing': 0.12, 'brandSize': 1, 'logoSize': 0.95, 'quoteSize': 0.72, 'logoGap': 13, 'brandLift': 17}.items():
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
c = one(c, '.j-tick-link i{font-style:normal}', '.j-tick-link i{font-style:normal}.j-tick-screen{display:block;margin:4px 0 0;font:400 11px/1.4 var(--ng-mono);letter-spacing:.08em;text-transform:uppercase;color:#ffffff8c}.j-pop-go .j-tick-screen{margin-top:10px}')
c = one(c, '.j-ticks li{display:flex', 'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}html{scrollbar-width:thin;scrollbar-color:rgba(108,199,240,.32) transparent}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track,::-webkit-scrollbar-corner{background:transparent}::-webkit-scrollbar-thumb{background:rgba(108,199,240,.3);border-radius:999px}::-webkit-scrollbar-thumb:hover{background:rgba(108,199,240,.6)}.cn-top.cn-lay .cn-follow{--cta-h:48px;--cta-gap:25.5px}.cn-top.cn-lay .s-nav,.cn-top.cn-lay .cn-brand,.cn-top.cn-lay .cn-scroll,.cn-top.cn-lay .cn-quote,.cn-top.cn-lay .cn-cta{zoom:var(--z, 1)}.cn-top.cn-lay .cn-brand{top:calc(var(--lay-brand) / var(--z, 1));bottom:auto;transform:translateY(calc(var(--cn-dy, 0px) / var(--z, 1)))}.cn-top.cn-lay .cn-scroll{top:calc(var(--lay-hint) / var(--z, 1));transform:translateY(calc(var(--cn-dy, 0px) / var(--z, 1)))}.cn-top.cn-lay .cn-quote{top:calc(var(--lay-quote) / var(--z, 1));bottom:auto;transform:translateY(calc(var(--cn-dy, 0px) / var(--z, 1)))}.cn-top.cn-lay .cn-cta{bottom:calc((var(--cta-gap) + var(--cn-bar) + var(--cn-safe)) / var(--z, 1));transform:translateY(calc(var(--cn-dy, 0px) / var(--z, 1)))}.j-ticks li{display:flex')
c = one(c, 'display:flex;flex-direction:column;align-items:center;gap:var(--logo-gap, 10px);text-align:center;', 'display:flex;flex-direction:var(--brand-dir, column);align-items:center;gap:var(--logo-gap, 10px);text-align:var(--brand-text, center);')
c = one(c, 'font:500 clamp(14px,.4vw + 12.5px,17px)/1 var(--ng-sans)', 'font:500 clamp(16px,.4vw + 14.4px,18px)/1 var(--ng-sans)')
c = one(c, '.s-nav nav{gap:14px;font-size:13px}', '.s-nav nav{gap:14px;font-size:14px}')
# thank-you panel after the enquiry form; no "we have emailed you" (Markus, 19 Nov 08:23)
t = one(t, 'if(w.ok)return h({state:"done",test:!!S.test})', 'if(w.ok)return h({state:"done",test:!!S.test,email:j})')
t = one(t, 'done:"Thanks, we have it. We have emailed you a confirmation and will reply to that address."', 'done:{title:"Thank you. We have your enquiry.",reply:"We’ll be in touch with you shortly at",nothing:"You don’t need to do anything else."}')
t = one(t, 'e.jsxs("div",{className:"s-form glass-plain",role:"status",children:[e.jsx("h3",{children:f.test?"Test enquiry saved.":M.done}),f.test&&e.jsx("p",{children:"It is in Control → Clients, marked Test."})]})',
        'e.jsxs("div",{className:"s-form s-done glass-plain",role:"status",children:[e.jsxs("svg",{className:"s-done-tick",width:"56",height:"56",viewBox:"0 0 56 56",fill:"none","aria-hidden":"true",children:[e.jsx("circle",{cx:"28",cy:"28",r:"26",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M17 29l7.5 7.5L39.5 21",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round"})]}),e.jsx("h3",{children:f.test?"Test enquiry saved.":M.done.title}),f.test?e.jsx("p",{children:"It is in Control → Clients, marked Test."}):e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[M.done.reply," ",e.jsx("strong",{children:f.email}),"."]}),e.jsx("p",{children:M.done.nothing})]})]})')
c = one(c, '.s-start .s-form{margin-top:12px}', '.s-start .s-form{margin-top:12px}.s-done{align-items:center;text-align:center;gap:12px;padding:40px 24px}.s-done h3{margin:4px 0 0;font-size:clamp(22px,2.4vw,28px)}.s-done p{margin:0;color:var(--ng-text-2, rgba(255,255,255,.78));font-size:16px;overflow-wrap:anywhere}.s-done strong{color:var(--ng-text);font-weight:600}.s-done-tick{color:#6cc7f0;animation:s-done-in .5s ease-out both}@keyframes s-done-in{0%{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.s-done-tick{animation:none}}')
open(f'{A}/site-ddg{NEW}.css', 'w', encoding='utf-8').write(c)
t = one(t, '{group:"Hold the orb",key:"holdVignette",label:"Screen edges darken",min:0,max:1,step:.05},', '{group:"Hold the orb",key:"holdVignette",label:"Screen edges darken",min:0,max:1,step:.05},{group:"Hold the orb",key:"holdVibrate",label:"Phone buzz builds with the charge (0 off; Android only)",min:0,max:1,step:.05},')
t = one(t, 'holdOn:1,', 'holdOn:1,holdDent:0,holdVibrate:1,')  # dent removed (Markus, 18 Nov 21:14)
# "Best viewed on a computer screen" for God's Eye View and Greenlight (Markus, 18 Nov 20:28)
t = one(t, 'name:"God\u2019s Eye View",href:"https://gods-eye-view.replit.app/",external:!0}', 'name:"God\u2019s Eye View",href:"https://gods-eye-view.replit.app/",external:!0,screen:!0}')
t = one(t, 'name:"DDG Greenlight",href:"https://ddg-greenlight.replit.app/",external:!0,standards:!0}', 'name:"DDG Greenlight",href:"https://ddg-greenlight.replit.app/",external:!0,screen:!0,standards:!0}')
t = one(t, 'expand:"Expand",', 'expand:"Expand",screenNote:"Best viewed on a computer screen",')
t = re.sub(r'(className:"j-expand",onClick:\(\)=>a\(c\),"aria-haspopup":"dialog",children:\[\$\.expand,e\.jsx\("i",\{"aria-hidden":"true",children:"\u2192"\}\)\]\}\))', r'\1,l.screen&&e.jsx("span",{className:"j-tick-screen",children:$.screenNote})', t, count=1); assert 'l.screen&&e.jsx("span"' in t
t = one(t, 'e.jsx("div",{className:"j-pop-go",children:s.external?', 'e.jsxs("div",{className:"j-pop-go",children:[s.external?')
t = one(t, 'children:[$.visit,": ",s.name," ",e.jsx("i",{"aria-hidden":"true",children:"\u2192"})]})})]})}),document.body)}', 'children:[$.visit,": ",s.name," ",e.jsx("i",{"aria-hidden":"true",children:"\u2192"})]}),s.screen&&e.jsx("p",{className:"j-tick-screen",children:$.screenNote})]})]})}),document.body)}')
t = one(t, 'fogNear:.2,fogFar:.6,', 'camZoom:2,camUp:10,phoneLayout:1,fogNear:.2,fogFar:.6,')
t = one(t, '{group:"Orb",key:"orbSize"', '{group:"Orb",key:"camZoom",label:"Camera: distance from the orb (1 = close, 2 = twice as far)",min:.6,max:4,step:.05},{group:"Orb",key:"camUp",label:"Camera: height (higher looks down more)",min:-6,max:40,step:.5},{group:"Orb",key:"orbSize"')
t = re.sub(r'(\{group:"Name and logo",key:"brandLift"[^}]*\})', r'\1,{group:"Name and logo",key:"phoneLayout",label:"Phones: space the first screen evenly by itself (0 off: the sliders place things)",min:0,max:1,step:1,names:["Off","On"]}', t, count=1); assert '"phoneLayout",label' in t
# the logo sits left of the name (Markus, 18 Nov 20:46); setting logoPlace
t = one(t, '{group:"Name and logo",key:"logoGap"', '{group:"Name and logo",key:"logoPlace",label:"Where the logo sits",min:0,max:1,step:1,names:["Above the name","Left of the name"]},{group:"Name and logo",key:"logoGap"')
t = one(t, '"logoSize","logoGap","brandLift"', '"logoSize","logoPlace","logoGap","brandLift"')
t, n = re.subn(r'\blogoGap:\s*13\b', 'logoPlace:1,logoGap:13', t); assert n == 1, n
t, n = re.subn(r'([a-zA-Z_$]+)\.setProperty\("--logo-gap",', lambda m: m.group(1) + '.setProperty("--brand-dir",r.logoPlace>.5?"row":"column"),' + m.group(1) + '.setProperty("--brand-text",r.logoPlace>.5?"left":"center"),' + m.group(1) + '.setProperty("--logo-gap",', t); assert n == 1, n
open(f'{A}/site-ddg{NEW}.js', 'w', encoding='utf-8').write(t)
# The site itself is site.html (built from the base page, kept as site-base.html). index.html is the phone frame
# (phone.html in this folder, written by hand) that shows site.html at iPhone size with the settings beside it.
h = rd('site-base.html'); h = one(h, 'site-ddg11.js', f'site-ddg{NEW}.js'); h = one(h, 'site-ddg6.css', f'site-ddg{NEW}.css'); open('site.html', 'w', encoding='utf-8').write(h)
open('index.html', 'w', encoding='utf-8').write(rd('phone.html'))
print('ok')
