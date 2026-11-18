import re,sys
src,dst=sys.argv[1],sys.argv[2]
lq=open('/tmp/lq2/liquid.js').read()
lq=re.sub(r'import \{[^}]*\} from "three";\n?','',lq); lq=re.sub(r'import \{ SKY_GLSL \} from "./sky";\n?','',lq); lq=re.sub(r'^export ','',lq,flags=re.M)
assert 'import' not in lq and 'export' not in lq
iife=('const __LQ=(()=>{const BufferAttribute=pe,BufferGeometry=xe,Color=Kt,FloatType=1015,HalfFloatType=1016,LinearFilter=1006,Matrix3=Wt,Mesh=ge,MeshBasicMaterial=xa,NearestFilter=1003,OrthographicCamera=ap,PlaneGeometry=Ji,Points=ra,RGBAFormat=1023,Scene=a0,ShaderMaterial=fe,SphereGeometry=Cn,Vector2=vt,Vector3=L,Vector4=he,WebGLRenderTarget=oi,SKY_GLSL=ws;\n'+lq+'\nreturn {makeLiquid};})();\nconst __lq={o:null};\n')
s=open(src).read()
a=s.index('const __LQ=(()=>{'); b=s.index('const __lq={o:null};\n')+len('const __lq={o:null};\n')
s=s[:a]+iife+s[b:]
open(dst,'w').write(s)
