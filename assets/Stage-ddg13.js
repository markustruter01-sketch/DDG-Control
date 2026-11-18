import{r as Cs,j as Fa}from"./public-info-BXQ9uuSj.js";import{c as Kc,r as Ln,T as nt,a as $c,_ as tn,f as Jc,s as Ni,t as jc,m as Qc,o as tu,b as Oa,d as eu,i as nu}from"./site-ddg13.js";const ca="170",iu=0,za=1,ru=2,nc=1,su=2,En=3,dn=0,Ue=1,Ke=2,Vn=0,zi=1,je=2,Ba=3,ka=4,ou=5,ei=100,au=101,lu=102,cu=103,uu=104,hu=200,fu=201,du=202,pu=203,mo=204,go=205,mu=206,gu=207,vu=208,_u=209,xu=210,yu=211,Mu=212,Su=213,Eu=214,vo=0,_o=1,xo=2,Hi=3,yo=4,Mo=5,So=6,Eo=7,ic=0,bu=1,Tu=2,Hn=0,wu=1,Au=2,Ru=3,Cu=4,Pu=5,Lu=6,Du=7,rc=300,Gi=301,Wi=302,bo=303,To=304,Ss=306,wo=1e3,ii=1001,Ao=1002,qe=1003,Uu=1004,Ar=1005,hn=1006,Ps=1007,ri=1008,An=1009,sc=1010,oc=1011,_r=1012,ua=1013,si=1014,fn=1015,Sr=1016,ha=1017,fa=1018,Xi=1020,ac=35902,lc=1021,cc=1022,sn=1023,uc=1024,hc=1025,Bi=1026,qi=1027,da=1028,pa=1029,fc=1030,ma=1031,ga=1033,as=33776,ls=33777,cs=33778,us=33779,Ro=35840,Co=35841,Po=35842,Lo=35843,Do=36196,Uo=37492,Io=37496,No=37808,Fo=37809,Oo=37810,zo=37811,Bo=37812,ko=37813,Vo=37814,Ho=37815,Go=37816,Wo=37817,Xo=37818,qo=37819,Yo=37820,Zo=37821,hs=36492,Ko=36494,$o=36495,dc=36283,Jo=36284,jo=36285,Qo=36286,Iu=3200,Nu=3201,Fu=0,Ou=1,kn="",Be="srgb",Zi="srgb-linear",Es="linear",le="srgb",pi=7680,Va=519,zu=512,Bu=513,ku=514,pc=515,Vu=516,Hu=517,Gu=518,Wu=519,ta=35044,va=35048,Ha="300 es",bn=2e3,ms=2001;class Ki{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ls=Math.PI/180,ea=180/Math.PI;function Tn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function De(i,t,e){return Math.max(t,Math.min(e,i))}function Xu(i,t){return(i%t+t)%t}function Ds(i,t,e){return(1-e)*i+e*t}function un(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ce(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class vt{constructor(t=0,e=0){vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,r,s,o,a,l,c){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c)}set(t,e,n,r,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],f=n[7],p=n[2],d=n[5],g=n[8],v=r[0],m=r[3],h=r[6],T=r[1],M=r[4],y=r[7],U=r[2],R=r[5],w=r[8];return s[0]=o*v+a*T+l*U,s[3]=o*m+a*M+l*R,s[6]=o*h+a*y+l*w,s[1]=c*v+u*T+f*U,s[4]=c*m+u*M+f*R,s[7]=c*h+u*y+f*w,s[2]=p*v+d*T+g*U,s[5]=p*m+d*M+g*R,s[8]=p*h+d*y+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*s*u+n*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],f=u*o-a*c,p=a*l-u*s,d=c*s-o*l,g=e*f+n*p+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(r*c-u*n)*v,t[2]=(a*n-r*o)*v,t[3]=p*v,t[4]=(u*e-r*l)*v,t[5]=(r*s-a*e)*v,t[6]=d*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Us.makeScale(t,e)),this}rotate(t){return this.premultiply(Us.makeRotation(-t)),this}translate(t,e){return this.premultiply(Us.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Us=new Wt;function mc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function gs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qu(){const i=gs("canvas");return i.style.display="block",i}const Ga={};function pr(i){i in Ga||(Ga[i]=!0,console.warn(i))}function Yu(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function Zu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ku(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const te={enabled:!0,workingColorSpace:Zi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(i.r=wn(i.r),i.g=wn(i.g),i.b=wn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(i.r=ki(i.r),i.g=ki(i.g),i.b=ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===kn?Es:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Wa=[.64,.33,.3,.6,.15,.06],Xa=[.2126,.7152,.0722],qa=[.3127,.329],Ya=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Za=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);te.define({[Zi]:{primaries:Wa,whitePoint:qa,transfer:Es,toXYZ:Ya,fromXYZ:Za,luminanceCoefficients:Xa,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:Wa,whitePoint:qa,transfer:le,toXYZ:Ya,fromXYZ:Za,luminanceCoefficients:Xa,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let mi;class $u{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=gs("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=gs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=wn(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ju=0;class gc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=Tn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Is(r[o].image)):s.push(Is(r[o]))}else s=Is(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Is(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?$u.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ju=0;class Ie extends Ki{constructor(t=Ie.DEFAULT_IMAGE,e=Ie.DEFAULT_MAPPING,n=ii,r=ii,s=hn,o=ri,a=sn,l=An,c=Ie.DEFAULT_ANISOTROPY,u=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Tn(),this.name="",this.source=new gc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case wo:t.x=t.x-Math.floor(t.x);break;case ii:t.x=t.x<0?0:1;break;case Ao:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case wo:t.y=t.y-Math.floor(t.y);break;case ii:t.y=t.y<0?0:1;break;case Ao:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ie.DEFAULT_IMAGE=null;Ie.DEFAULT_MAPPING=rc;Ie.DEFAULT_ANISOTROPY=1;class he{constructor(t=0,e=0,n=0,r=1){he.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const l=t.elements,c=l[0],u=l[4],f=l[8],p=l[1],d=l[5],g=l[9],v=l[2],m=l[6],h=l[10];if(Math.abs(u-p)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+h-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,y=(d+1)/2,U=(h+1)/2,R=(u+p)/4,w=(f+v)/4,P=(g+m)/4;return M>y&&M>U?M<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(M),r=R/n,s=w/n):y>U?y<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),n=R/r,s=P/r):U<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(U),n=w/s,r=P/s),this.set(n,r,s,e),this}let T=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(p-u)*(p-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(f-v)/T,this.z=(p-u)/T,this.w=Math.acos((c+d+h-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qu extends Ki{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e);const r={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Ie(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,r=t.textures.length;n<r;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new gc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends Qu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class vc extends Ie{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=qe,this.minFilter=qe,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class th extends Ie{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=qe,this.minFilter=qe,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $i{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3];const p=s[o+0],d=s[o+1],g=s[o+2],v=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f;return}if(a===1){t[e+0]=p,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(f!==v||l!==p||c!==d||u!==g){let m=1-a;const h=l*p+c*d+u*g+f*v,T=h>=0?1:-1,M=1-h*h;if(M>Number.EPSILON){const U=Math.sqrt(M),R=Math.atan2(U,h*T);m=Math.sin(m*R)/U,a=Math.sin(a*R)/U}const y=a*T;if(l=l*m+p*y,c=c*m+d*y,u=u*m+g*y,f=f*m+v*y,m===1-a){const U=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=U,c*=U,u*=U,f*=U}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[o],p=s[o+1],d=s[o+2],g=s[o+3];return t[e]=a*g+u*f+l*d-c*p,t[e+1]=l*g+u*p+c*f-a*d,t[e+2]=c*g+u*d+a*p-l*f,t[e+3]=u*g-a*f-l*p-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(r/2),f=a(s/2),p=l(n/2),d=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=p*u*f+c*d*g,this._y=c*d*f-p*u*g,this._z=c*u*g+p*d*f,this._w=c*u*f-p*d*g;break;case"YXZ":this._x=p*u*f+c*d*g,this._y=c*d*f-p*u*g,this._z=c*u*g-p*d*f,this._w=c*u*f+p*d*g;break;case"ZXY":this._x=p*u*f-c*d*g,this._y=c*d*f+p*u*g,this._z=c*u*g+p*d*f,this._w=c*u*f-p*d*g;break;case"ZYX":this._x=p*u*f-c*d*g,this._y=c*d*f+p*u*g,this._z=c*u*g-p*d*f,this._w=c*u*f+p*d*g;break;case"YZX":this._x=p*u*f+c*d*g,this._y=c*d*f+p*u*g,this._z=c*u*g-p*d*f,this._w=c*u*f-p*d*g;break;case"XZY":this._x=p*u*f-c*d*g,this._y=c*d*f-p*u*g,this._z=c*u*g+p*d*f,this._w=c*u*f+p*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],f=e[10],p=n+a+f;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(De(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-r*a,this._w=o*u-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*r+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-e)*u)/c,p=Math.sin(e*u)/c;return this._w=o*f+this._w*p,this._x=n*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ka.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ka.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*n),u=2*(a*e-s*r),f=2*(s*n-o*e);return this.x=e+l*c+o*f-a*u,this.y=n+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ns.copy(this).projectOnVector(t),this.sub(Ns)}reflect(t){return this.sub(Ns.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ns=new L,Ka=new $i;class li{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(en.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(en.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=en.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,en):en.fromBufferAttribute(s,o),en.applyMatrix4(t.matrixWorld),this.expandByPoint(en);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(t.matrixWorld),this.union(Rr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,en),en.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ir),Cr.subVectors(this.max,ir),gi.subVectors(t.a,ir),vi.subVectors(t.b,ir),_i.subVectors(t.c,ir),Dn.subVectors(vi,gi),Un.subVectors(_i,vi),qn.subVectors(gi,_i);let e=[0,-Dn.z,Dn.y,0,-Un.z,Un.y,0,-qn.z,qn.y,Dn.z,0,-Dn.x,Un.z,0,-Un.x,qn.z,0,-qn.x,-Dn.y,Dn.x,0,-Un.y,Un.x,0,-qn.y,qn.x,0];return!Fs(e,gi,vi,_i,Cr)||(e=[1,0,0,0,1,0,0,0,1],!Fs(e,gi,vi,_i,Cr))?!1:(Pr.crossVectors(Dn,Un),e=[Pr.x,Pr.y,Pr.z],Fs(e,gi,vi,_i,Cr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,en).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(en).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const vn=[new L,new L,new L,new L,new L,new L,new L,new L],en=new L,Rr=new li,gi=new L,vi=new L,_i=new L,Dn=new L,Un=new L,qn=new L,ir=new L,Cr=new L,Pr=new L,Yn=new L;function Fs(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Yn.fromArray(i,s);const a=r.x*Math.abs(Yn.x)+r.y*Math.abs(Yn.y)+r.z*Math.abs(Yn.z),l=t.dot(Yn),c=e.dot(Yn),u=n.dot(Yn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const eh=new li,rr=new L,Os=new L;class ci{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):eh.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rr.subVectors(t,this.center);const e=rr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(rr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Os.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rr.copy(t.center).add(Os)),this.expandByPoint(rr.copy(t.center).sub(Os))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new L,zs=new L,Lr=new L,In=new L,Bs=new L,Dr=new L,ks=new L;class _a{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_n.copy(this.origin).addScaledVector(this.direction,e),_n.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){zs.copy(t).add(e).multiplyScalar(.5),Lr.copy(e).sub(t).normalize(),In.copy(this.origin).sub(zs);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Lr),a=In.dot(this.direction),l=-In.dot(Lr),c=In.lengthSq(),u=Math.abs(1-o*o);let f,p,d,g;if(u>0)if(f=o*l-a,p=o*a-l,g=s*u,f>=0)if(p>=-g)if(p<=g){const v=1/u;f*=v,p*=v,d=f*(f+o*p+2*a)+p*(o*f+p+2*l)+c}else p=s,f=Math.max(0,-(o*p+a)),d=-f*f+p*(p+2*l)+c;else p=-s,f=Math.max(0,-(o*p+a)),d=-f*f+p*(p+2*l)+c;else p<=-g?(f=Math.max(0,-(-o*s+a)),p=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+p*(p+2*l)+c):p<=g?(f=0,p=Math.min(Math.max(-s,-l),s),d=p*(p+2*l)+c):(f=Math.max(0,-(o*s+a)),p=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+p*(p+2*l)+c);else p=o>0?-s:s,f=Math.max(0,-(o*p+a)),d=-f*f+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(zs).addScaledVector(Lr,p),d}intersectSphere(t,e){_n.subVectors(t.center,this.origin);const n=_n.dot(this.direction),r=_n.dot(_n)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,r=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,r=(t.min.x-p.x)*c),u>=0?(s=(t.min.y-p.y)*u,o=(t.max.y-p.y)*u):(s=(t.max.y-p.y)*u,o=(t.min.y-p.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(t.min.z-p.z)*f,l=(t.max.z-p.z)*f):(a=(t.max.z-p.z)*f,l=(t.min.z-p.z)*f),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,_n)!==null}intersectTriangle(t,e,n,r,s){Bs.subVectors(e,t),Dr.subVectors(n,t),ks.crossVectors(Bs,Dr);let o=this.direction.dot(ks),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;In.subVectors(this.origin,t);const l=a*this.direction.dot(Dr.crossVectors(In,Dr));if(l<0)return null;const c=a*this.direction.dot(Bs.cross(In));if(c<0||l+c>o)return null;const u=-a*In.dot(ks);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,r,s,o,a,l,c,u,f,p,d,g,v,m){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c,u,f,p,d,g,v,m)}set(t,e,n,r,s,o,a,l,c,u,f,p,d,g,v,m){const h=this.elements;return h[0]=t,h[4]=e,h[8]=n,h[12]=r,h[1]=s,h[5]=o,h[9]=a,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=p,h[3]=d,h[7]=g,h[11]=v,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/xi.setFromMatrixColumn(t,0).length(),s=1/xi.setFromMatrixColumn(t,1).length(),o=1/xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const p=o*u,d=o*f,g=a*u,v=a*f;e[0]=l*u,e[4]=-l*f,e[8]=c,e[1]=d+g*c,e[5]=p-v*c,e[9]=-a*l,e[2]=v-p*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){const p=l*u,d=l*f,g=c*u,v=c*f;e[0]=p+v*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*u,e[9]=-a,e[2]=d*a-g,e[6]=v+p*a,e[10]=o*l}else if(t.order==="ZXY"){const p=l*u,d=l*f,g=c*u,v=c*f;e[0]=p-v*a,e[4]=-o*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*u,e[9]=v-p*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const p=o*u,d=o*f,g=a*u,v=a*f;e[0]=l*u,e[4]=g*c-d,e[8]=p*c+v,e[1]=l*f,e[5]=v*c+p,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const p=o*l,d=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=v-p*f,e[8]=g*f+d,e[1]=f,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=d*f+g,e[10]=p-v*f}else if(t.order==="XZY"){const p=o*l,d=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=-f,e[8]=c*u,e[1]=p*f+v,e[5]=o*u,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*u,e[10]=v*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(nh,t,ih)}lookAt(t,e,n){const r=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),Nn.crossVectors(n,Ge),Nn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),Nn.crossVectors(n,Ge)),Nn.normalize(),Ur.crossVectors(Ge,Nn),r[0]=Nn.x,r[4]=Ur.x,r[8]=Ge.x,r[1]=Nn.y,r[5]=Ur.y,r[9]=Ge.y,r[2]=Nn.z,r[6]=Ur.z,r[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],f=n[5],p=n[9],d=n[13],g=n[2],v=n[6],m=n[10],h=n[14],T=n[3],M=n[7],y=n[11],U=n[15],R=r[0],w=r[4],P=r[8],b=r[12],S=r[1],C=r[5],V=r[9],k=r[13],z=r[2],st=r[6],X=r[10],W=r[14],B=r[3],et=r[7],Q=r[11],$=r[15];return s[0]=o*R+a*S+l*z+c*B,s[4]=o*w+a*C+l*st+c*et,s[8]=o*P+a*V+l*X+c*Q,s[12]=o*b+a*k+l*W+c*$,s[1]=u*R+f*S+p*z+d*B,s[5]=u*w+f*C+p*st+d*et,s[9]=u*P+f*V+p*X+d*Q,s[13]=u*b+f*k+p*W+d*$,s[2]=g*R+v*S+m*z+h*B,s[6]=g*w+v*C+m*st+h*et,s[10]=g*P+v*V+m*X+h*Q,s[14]=g*b+v*k+m*W+h*$,s[3]=T*R+M*S+y*z+U*B,s[7]=T*w+M*C+y*st+U*et,s[11]=T*P+M*V+y*X+U*Q,s[15]=T*b+M*k+y*W+U*$,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],f=t[6],p=t[10],d=t[14],g=t[3],v=t[7],m=t[11],h=t[15];return g*(+s*l*f-r*c*f-s*a*p+n*c*p+r*a*d-n*l*d)+v*(+e*l*d-e*c*p+s*o*p-r*o*d+r*c*u-s*l*u)+m*(+e*c*f-e*a*d-s*o*f+n*o*d+s*a*u-n*c*u)+h*(-r*a*u-e*l*f+e*a*p+r*o*f-n*o*p+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],f=t[9],p=t[10],d=t[11],g=t[12],v=t[13],m=t[14],h=t[15],T=f*m*c-v*p*c+v*l*d-a*m*d-f*l*h+a*p*h,M=g*p*c-u*m*c-g*l*d+o*m*d+u*l*h-o*p*h,y=u*v*c-g*f*c+g*a*d-o*v*d-u*a*h+o*f*h,U=g*f*l-u*v*l-g*a*p+o*v*p+u*a*m-o*f*m,R=e*T+n*M+r*y+s*U;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/R;return t[0]=T*w,t[1]=(v*p*s-f*m*s-v*r*d+n*m*d+f*r*h-n*p*h)*w,t[2]=(a*m*s-v*l*s+v*r*c-n*m*c-a*r*h+n*l*h)*w,t[3]=(f*l*s-a*p*s-f*r*c+n*p*c+a*r*d-n*l*d)*w,t[4]=M*w,t[5]=(u*m*s-g*p*s+g*r*d-e*m*d-u*r*h+e*p*h)*w,t[6]=(g*l*s-o*m*s-g*r*c+e*m*c+o*r*h-e*l*h)*w,t[7]=(o*p*s-u*l*s+u*r*c-e*p*c-o*r*d+e*l*d)*w,t[8]=y*w,t[9]=(g*f*s-u*v*s-g*n*d+e*v*d+u*n*h-e*f*h)*w,t[10]=(o*v*s-g*a*s+g*n*c-e*v*c-o*n*h+e*a*h)*w,t[11]=(u*a*s-o*f*s-u*n*c+e*f*c+o*n*d-e*a*d)*w,t[12]=U*w,t[13]=(u*v*r-g*f*r+g*n*p-e*v*p-u*n*m+e*f*m)*w,t[14]=(g*a*r-o*v*r-g*n*l+e*v*l+o*n*m-e*a*m)*w,t[15]=(o*f*r-u*a*r+u*n*l-e*f*l-o*n*p+e*a*p)*w,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+n,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,f=a+a,p=s*c,d=s*u,g=s*f,v=o*u,m=o*f,h=a*f,T=l*c,M=l*u,y=l*f,U=n.x,R=n.y,w=n.z;return r[0]=(1-(v+h))*U,r[1]=(d+y)*U,r[2]=(g-M)*U,r[3]=0,r[4]=(d-y)*R,r[5]=(1-(p+h))*R,r[6]=(m+T)*R,r[7]=0,r[8]=(g+M)*w,r[9]=(m-T)*w,r[10]=(1-(p+v))*w,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=xi.set(r[0],r[1],r[2]).length();const o=xi.set(r[4],r[5],r[6]).length(),a=xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],nn.copy(this);const c=1/s,u=1/o,f=1/a;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=u,nn.elements[5]*=u,nn.elements[6]*=u,nn.elements[8]*=f,nn.elements[9]*=f,nn.elements[10]*=f,e.setFromRotationMatrix(nn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=bn){const l=this.elements,c=2*s/(e-t),u=2*s/(n-r),f=(e+t)/(e-t),p=(n+r)/(n-r);let d,g;if(a===bn)d=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ms)d=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=bn){const l=this.elements,c=1/(e-t),u=1/(n-r),f=1/(o-s),p=(e+t)*c,d=(n+r)*u;let g,v;if(a===bn)g=(o+s)*f,v=-2*f;else if(a===ms)g=s*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xi=new L,nn=new ue,nh=new L(0,0,0),ih=new L(1,1,1),Nn=new L,Ur=new L,Ge=new L,$a=new ue,Ja=new $i;class Rn{constructor(t=0,e=0,n=0,r=Rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],p=r[6],d=r[10];switch(e){case"XYZ":this._y=Math.asin(De(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-De(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(De(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-De(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(De(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-De(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return $a.makeRotationFromQuaternion(t),this.setFromRotationMatrix($a,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ja.setFromEuler(this),this.setFromQuaternion(Ja,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Rn.DEFAULT_ORDER="XYZ";class _c{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rh=0;const ja=new L,yi=new $i,xn=new ue,Ir=new L,sr=new L,sh=new L,oh=new $i,Qa=new L(1,0,0),tl=new L(0,1,0),el=new L(0,0,1),nl={type:"added"},ah={type:"removed"},Mi={type:"childadded",child:null},Vs={type:"childremoved",child:null};class be extends Ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rh++}),this.uuid=Tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new L,e=new Rn,n=new $i,r=new L(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ue},normalMatrix:{value:new Wt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _c,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.multiply(yi),this}rotateOnWorldAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.premultiply(yi),this}rotateX(t){return this.rotateOnAxis(Qa,t)}rotateY(t){return this.rotateOnAxis(tl,t)}rotateZ(t){return this.rotateOnAxis(el,t)}translateOnAxis(t,e){return ja.copy(t).applyQuaternion(this.quaternion),this.position.add(ja.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qa,t)}translateY(t){return this.translateOnAxis(tl,t)}translateZ(t){return this.translateOnAxis(el,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ir.copy(t):Ir.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(sr,Ir,this.up):xn.lookAt(Ir,sr,this.up),this.quaternion.setFromRotationMatrix(xn),r&&(xn.extractRotation(r.matrixWorld),yi.setFromRotationMatrix(xn),this.quaternion.premultiply(yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(nl),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ah),Vs.child=t,this.dispatchEvent(Vs),Vs.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(nl),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,t,sh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,oh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),f=o(t.shapes),p=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}be.DEFAULT_UP=new L(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const rn=new L,yn=new L,Hs=new L,Mn=new L,Si=new L,Ei=new L,il=new L,Gs=new L,Ws=new L,Xs=new L,qs=new he,Ys=new he,Zs=new he;class $e{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),rn.subVectors(t,e),r.cross(rn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){rn.subVectors(r,e),yn.subVectors(n,e),Hs.subVectors(t,e);const o=rn.dot(rn),a=rn.dot(yn),l=rn.dot(Hs),c=yn.dot(yn),u=yn.dot(Hs),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const p=1/f,d=(c*l-a*u)*p,g=(o*u-a*l)*p;return s.set(1-d-g,g,d)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(t,e,n,r,s,o,a,l){return this.getBarycoord(t,e,n,r,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Mn.x),l.addScaledVector(o,Mn.y),l.addScaledVector(a,Mn.z),l)}static getInterpolatedAttribute(t,e,n,r,s,o){return qs.setScalar(0),Ys.setScalar(0),Zs.setScalar(0),qs.fromBufferAttribute(t,e),Ys.fromBufferAttribute(t,n),Zs.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(qs,s.x),o.addScaledVector(Ys,s.y),o.addScaledVector(Zs,s.z),o}static isFrontFacing(t,e,n,r){return rn.subVectors(n,e),yn.subVectors(t,e),rn.cross(yn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),rn.cross(yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return $e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return $e.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return $e.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return $e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return $e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;Si.subVectors(r,n),Ei.subVectors(s,n),Gs.subVectors(t,n);const l=Si.dot(Gs),c=Ei.dot(Gs);if(l<=0&&c<=0)return e.copy(n);Ws.subVectors(t,r);const u=Si.dot(Ws),f=Ei.dot(Ws);if(u>=0&&f<=u)return e.copy(r);const p=l*f-u*c;if(p<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Si,o);Xs.subVectors(t,s);const d=Si.dot(Xs),g=Ei.dot(Xs);if(g>=0&&d<=g)return e.copy(s);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ei,a);const m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return il.subVectors(s,r),a=(f-u)/(f-u+(d-g)),e.copy(r).addScaledVector(il,a);const h=1/(m+v+p);return o=v*h,a=p*h,e.copy(n).addScaledVector(Si,o).addScaledVector(Ei,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const xc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function Ks(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=te.workingColorSpace){if(t=Xu(t,1),e=De(e,0,1),n=De(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Ks(o,s,t+1/3),this.g=Ks(o,s,t),this.b=Ks(o,s,t-1/3)}return te.toWorkingColorSpace(this,r),this}setStyle(t,e=Be){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=xc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return te.fromWorkingColorSpace(Le.copy(this),t),Math.round(De(Le.r*255,0,255))*65536+Math.round(De(Le.g*255,0,255))*256+Math.round(De(Le.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.fromWorkingColorSpace(Le.copy(this),e);const n=Le.r,r=Le.g,s=Le.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=te.workingColorSpace){return te.fromWorkingColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Be){te.fromWorkingColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,r=Le.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Fn),this.setHSL(Fn.h+t,Fn.s+e,Fn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fn),t.getHSL(Nr);const n=Ds(Fn.h,Nr.h,e),r=Ds(Fn.s,Nr.s,e),s=Ds(Fn.l,Nr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new Kt;Kt.NAMES=xc;let lh=0;class ui extends Ki{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lh++}),this.uuid=Tn(),this.name="",this.blending=zi,this.side=dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mo,this.blendDst=go,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Kt(0,0,0),this.blendAlpha=0,this.depthFunc=Hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Va,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==dn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==mo&&(n.blendSrc=this.blendSrc),this.blendDst!==go&&(n.blendDst=this.blendDst),this.blendEquation!==ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Va&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class xa extends ui{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new L,Fr=new vt;class pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ta,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fr.fromBufferAttribute(this,e),Fr.applyMatrix3(t),this.setXY(e,Fr.x,Fr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=un(e,this.array)),e}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=un(e,this.array)),e}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=un(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=un(e,this.array)),e}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),r=ce(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),r=ce(r,this.array),s=ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ta&&(t.usage=this.usage),t}}class yc extends pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Mc extends pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Re extends pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let ch=0;const Ye=new ue,$s=new be,bi=new L,We=new li,or=new li,Ee=new L;class xe extends Ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ch++}),this.uuid=Tn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mc(t)?Mc:yc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Wt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return $s.lookAt(t),$s.updateMatrix(),this.applyMatrix4($s.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Re(n,3))}else{for(let n=0,r=e.count;n<r;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];We.setFromBufferAttribute(s),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ci);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];or.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(We.min,or.min),We.expandByPoint(Ee),Ee.addVectors(We.max,or.max),We.expandByPoint(Ee)):(We.expandByPoint(or.min),We.expandByPoint(or.max))}We.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)Ee.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Ee));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ee.fromBufferAttribute(a,c),l&&(bi.fromBufferAttribute(t,c),Ee.add(bi)),r=Math.max(r,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new L,l[P]=new L;const c=new L,u=new L,f=new L,p=new vt,d=new vt,g=new vt,v=new L,m=new L;function h(P,b,S){c.fromBufferAttribute(n,P),u.fromBufferAttribute(n,b),f.fromBufferAttribute(n,S),p.fromBufferAttribute(s,P),d.fromBufferAttribute(s,b),g.fromBufferAttribute(s,S),u.sub(c),f.sub(c),d.sub(p),g.sub(p);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(C),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(C),a[P].add(v),a[b].add(v),a[S].add(v),l[P].add(m),l[b].add(m),l[S].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let P=0,b=T.length;P<b;++P){const S=T[P],C=S.start,V=S.count;for(let k=C,z=C+V;k<z;k+=3)h(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const M=new L,y=new L,U=new L,R=new L;function w(P){U.fromBufferAttribute(r,P),R.copy(U);const b=a[P];M.copy(b),M.sub(U.multiplyScalar(U.dot(b))).normalize(),y.crossVectors(R,b);const C=y.dot(l[P])<0?-1:1;o.setXYZW(P,M.x,M.y,M.z,C)}for(let P=0,b=T.length;P<b;++P){const S=T[P],C=S.start,V=S.count;for(let k=C,z=C+V;k<z;k+=3)w(t.getX(k+0)),w(t.getX(k+1)),w(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const r=new L,s=new L,o=new L,a=new L,l=new L,c=new L,u=new L,f=new L;if(t)for(let p=0,d=t.count;p<d;p+=3){const g=t.getX(p+0),v=t.getX(p+1),m=t.getX(p+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,d=e.count;p<d;p+=3)r.fromBufferAttribute(e,p+0),s.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,f=a.normalized,p=new c.constructor(l.length*u);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*u;for(let h=0;h<u;h++)p[g++]=c[d++]}return new pe(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xe,n=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const p=c[u],d=t(p,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,p=c.length;f<p;f++){const d=c[f];u.push(d.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],f=s[c];for(let p=0,d=f.length;p<d;p++)u.push(f[p].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rl=new ue,Zn=new _a,Or=new ci,sl=new L,zr=new L,Br=new L,kr=new L,Js=new L,Vr=new L,ol=new L,Hr=new L;class ge extends be{constructor(t=new xe,e=new xa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){Vr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(Js.fromBufferAttribute(f,t),o?Vr.addScaledVector(Js,u):Vr.addScaledVector(Js.sub(e),u))}e.add(Vr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(s),Zn.copy(t.ray).recast(t.near),!(Or.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Or,sl)===null||Zn.origin.distanceToSquared(sl)>(t.far-t.near)**2))&&(rl.copy(s).invert(),Zn.copy(t.ray).applyMatrix4(rl),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,p=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const m=p[g],h=o[m.materialIndex],T=Math.max(m.start,d.start),M=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,U=M;y<U;y+=3){const R=a.getX(y),w=a.getX(y+1),P=a.getX(y+2);r=Gr(this,h,t,n,c,u,f,R,w,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,h=v;m<h;m+=3){const T=a.getX(m),M=a.getX(m+1),y=a.getX(m+2);r=Gr(this,o,t,n,c,u,f,T,M,y),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const m=p[g],h=o[m.materialIndex],T=Math.max(m.start,d.start),M=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,U=M;y<U;y+=3){const R=y,w=y+1,P=y+2;r=Gr(this,h,t,n,c,u,f,R,w,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,h=v;m<h;m+=3){const T=m,M=m+1,y=m+2;r=Gr(this,o,t,n,c,u,f,T,M,y),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function uh(i,t,e,n,r,s,o,a){let l;if(t.side===Ue?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,t.side===dn,a),l===null)return null;Hr.copy(a),Hr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Hr);return c<e.near||c>e.far?null:{distance:c,point:Hr.clone(),object:i}}function Gr(i,t,e,n,r,s,o,a,l,c){i.getVertexPosition(a,zr),i.getVertexPosition(l,Br),i.getVertexPosition(c,kr);const u=uh(i,t,e,n,zr,Br,kr,ol);if(u){const f=new L;$e.getBarycoord(ol,zr,Br,kr,f),r&&(u.uv=$e.getInterpolatedAttribute(r,a,l,c,f,new vt)),s&&(u.uv1=$e.getInterpolatedAttribute(s,a,l,c,f,new vt)),o&&(u.normal=$e.getInterpolatedAttribute(o,a,l,c,f,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const p={a,b:l,c,normal:new L,materialIndex:0};$e.getNormal(zr,Br,kr,p.normal),u.face=p,u.barycoord=f}return u}class Er extends xe{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let p=0,d=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(u,3)),this.setAttribute("uv",new Re(f,2));function g(v,m,h,T,M,y,U,R,w,P,b){const S=y/w,C=U/P,V=y/2,k=U/2,z=R/2,st=w+1,X=P+1;let W=0,B=0;const et=new L;for(let Q=0;Q<X;Q++){const $=Q*C-k;for(let Rt=0;Rt<st;Rt++){const Bt=Rt*S-V;et[v]=Bt*T,et[m]=$*M,et[h]=z,c.push(et.x,et.y,et.z),et[v]=0,et[m]=0,et[h]=R>0?1:-1,u.push(et.x,et.y,et.z),f.push(Rt/w),f.push(1-Q/P),W+=1}}for(let Q=0;Q<P;Q++)for(let $=0;$<w;$++){const Rt=p+$+st*Q,Bt=p+$+st*(Q+1),Y=p+($+1)+st*(Q+1),ut=p+($+1)+st*Q;l.push(Rt,Bt,ut),l.push(Bt,Y,ut),B+=6}a.addGroup(d,B,b),d+=B,p+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Er(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Yi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Fe(i){const t={};for(let e=0;e<i.length;e++){const n=Yi(i[e]);for(const r in n)t[r]=n[r]}return t}function hh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Sc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}const fh={clone:Yi,merge:Fe};var dh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ph=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fe extends ui{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dh,this.fragmentShader=ph,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Yi(t.uniforms),this.uniformsGroups=hh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ec extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=bn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const On=new L,al=new vt,ll=new vt;class Xe extends Ec{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ea*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ea*2*Math.atan(Math.tan(Ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){On.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(On.x,On.y).multiplyScalar(-t/On.z),On.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(On.x,On.y).multiplyScalar(-t/On.z)}getViewSize(t,e){return this.getViewBounds(t,al,ll),e.subVectors(ll,al)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ls*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ti=-90,wi=1;class mh extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Xe(Ti,wi,t,e);r.layers=this.layers,this.add(r);const s=new Xe(Ti,wi,t,e);s.layers=this.layers,this.add(s);const o=new Xe(Ti,wi,t,e);o.layers=this.layers,this.add(o);const a=new Xe(Ti,wi,t,e);a.layers=this.layers,this.add(a);const l=new Xe(Ti,wi,t,e);l.layers=this.layers,this.add(l);const c=new Xe(Ti,wi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,p,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class bc extends Ie{constructor(t,e,n,r,s,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:Gi,super(t,e,n,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gh extends oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new bc(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:hn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Er(5,5,5),s=new fe({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ue,blending:Vn});s.uniforms.tEquirect.value=e;const o=new ge(r,s),a=e.minFilter;return e.minFilter===ri&&(e.minFilter=hn),new mh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}const js=new L,vh=new L,_h=new Wt;class Qn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=js.subVectors(n,e).cross(vh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(js),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_h.getNormalMatrix(t),r=this.coplanarPoint(js).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Kn=new ci,Wr=new L;class Tc{constructor(t=new Qn,e=new Qn,n=new Qn,r=new Qn,s=new Qn,o=new Qn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn){const n=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],p=r[7],d=r[8],g=r[9],v=r[10],m=r[11],h=r[12],T=r[13],M=r[14],y=r[15];if(n[0].setComponents(l-s,p-c,m-d,y-h).normalize(),n[1].setComponents(l+s,p+c,m+d,y+h).normalize(),n[2].setComponents(l+o,p+u,m+g,y+T).normalize(),n[3].setComponents(l-o,p-u,m-g,y-T).normalize(),n[4].setComponents(l-a,p-f,m-v,y-M).normalize(),e===bn)n[5].setComponents(l+a,p+f,m+v,y+M).normalize();else if(e===ms)n[5].setComponents(a,f,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Kn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Kn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Kn)}intersectsSprite(t){return Kn.center.set(0,0,0),Kn.radius=.7071067811865476,Kn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Kn)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Wr.x=r.normal.x>0?t.max.x:t.min.x,Wr.y=r.normal.y>0?t.max.y:t.min.y,Wr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wc(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function xh(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<f.length;d++){const g=f[p],v=f[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++p,f[p]=v)}f.length=p+1;for(let d=0,g=f.length;d<g;d++){const v=f[d];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Ji extends xe{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(r),c=a+1,u=l+1,f=t/a,p=e/l,d=[],g=[],v=[],m=[];for(let h=0;h<u;h++){const T=h*p-o;for(let M=0;M<c;M++){const y=M*f-s;g.push(y,-T,0),v.push(0,0,1),m.push(M/a),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let T=0;T<a;T++){const M=T+c*h,y=T+c*(h+1),U=T+1+c*(h+1),R=T+1+c*h;d.push(M,y,R),d.push(y,U,R)}this.setIndex(d),this.setAttribute("position",new Re(g,3)),this.setAttribute("normal",new Re(v,3)),this.setAttribute("uv",new Re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ji(t.width,t.height,t.widthSegments,t.heightSegments)}}var yh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Eh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Th=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ah=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ch=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ph=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Uh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ih=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Fh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Oh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Gh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$h="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ef=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,of=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,af=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,cf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,uf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ff=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,df=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_f=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,xf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Sf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ef=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Af=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Pf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Uf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,If=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ff=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Of=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Bf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,td=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ed=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,nd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,id=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,od=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ad=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ld=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ud=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,md=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_d=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Md=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ed=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Td=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ad=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Rd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Pd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ld=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ud=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Id=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Nd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Od=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Bd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kd=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Vd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Xd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qd=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Kd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$d=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:yh,alphahash_pars_fragment:Mh,alphamap_fragment:Sh,alphamap_pars_fragment:Eh,alphatest_fragment:bh,alphatest_pars_fragment:Th,aomap_fragment:wh,aomap_pars_fragment:Ah,batching_pars_vertex:Rh,batching_vertex:Ch,begin_vertex:Ph,beginnormal_vertex:Lh,bsdfs:Dh,iridescence_fragment:Uh,bumpmap_pars_fragment:Ih,clipping_planes_fragment:Nh,clipping_planes_pars_fragment:Fh,clipping_planes_pars_vertex:Oh,clipping_planes_vertex:zh,color_fragment:Bh,color_pars_fragment:kh,color_pars_vertex:Vh,color_vertex:Hh,common:Gh,cube_uv_reflection_fragment:Wh,defaultnormal_vertex:Xh,displacementmap_pars_vertex:qh,displacementmap_vertex:Yh,emissivemap_fragment:Zh,emissivemap_pars_fragment:Kh,colorspace_fragment:$h,colorspace_pars_fragment:Jh,envmap_fragment:jh,envmap_common_pars_fragment:Qh,envmap_pars_fragment:tf,envmap_pars_vertex:ef,envmap_physical_pars_fragment:df,envmap_vertex:nf,fog_vertex:rf,fog_pars_vertex:sf,fog_fragment:of,fog_pars_fragment:af,gradientmap_pars_fragment:lf,lightmap_pars_fragment:cf,lights_lambert_fragment:uf,lights_lambert_pars_fragment:hf,lights_pars_begin:ff,lights_toon_fragment:pf,lights_toon_pars_fragment:mf,lights_phong_fragment:gf,lights_phong_pars_fragment:vf,lights_physical_fragment:_f,lights_physical_pars_fragment:xf,lights_fragment_begin:yf,lights_fragment_maps:Mf,lights_fragment_end:Sf,logdepthbuf_fragment:Ef,logdepthbuf_pars_fragment:bf,logdepthbuf_pars_vertex:Tf,logdepthbuf_vertex:wf,map_fragment:Af,map_pars_fragment:Rf,map_particle_fragment:Cf,map_particle_pars_fragment:Pf,metalnessmap_fragment:Lf,metalnessmap_pars_fragment:Df,morphinstance_vertex:Uf,morphcolor_vertex:If,morphnormal_vertex:Nf,morphtarget_pars_vertex:Ff,morphtarget_vertex:Of,normal_fragment_begin:zf,normal_fragment_maps:Bf,normal_pars_fragment:kf,normal_pars_vertex:Vf,normal_vertex:Hf,normalmap_pars_fragment:Gf,clearcoat_normal_fragment_begin:Wf,clearcoat_normal_fragment_maps:Xf,clearcoat_pars_fragment:qf,iridescence_pars_fragment:Yf,opaque_fragment:Zf,packing:Kf,premultiplied_alpha_fragment:$f,project_vertex:Jf,dithering_fragment:jf,dithering_pars_fragment:Qf,roughnessmap_fragment:td,roughnessmap_pars_fragment:ed,shadowmap_pars_fragment:nd,shadowmap_pars_vertex:id,shadowmap_vertex:rd,shadowmask_pars_fragment:sd,skinbase_vertex:od,skinning_pars_vertex:ad,skinning_vertex:ld,skinnormal_vertex:cd,specularmap_fragment:ud,specularmap_pars_fragment:hd,tonemapping_fragment:fd,tonemapping_pars_fragment:dd,transmission_fragment:pd,transmission_pars_fragment:md,uv_pars_fragment:gd,uv_pars_vertex:vd,uv_vertex:_d,worldpos_vertex:xd,background_vert:yd,background_frag:Md,backgroundCube_vert:Sd,backgroundCube_frag:Ed,cube_vert:bd,cube_frag:Td,depth_vert:wd,depth_frag:Ad,distanceRGBA_vert:Rd,distanceRGBA_frag:Cd,equirect_vert:Pd,equirect_frag:Ld,linedashed_vert:Dd,linedashed_frag:Ud,meshbasic_vert:Id,meshbasic_frag:Nd,meshlambert_vert:Fd,meshlambert_frag:Od,meshmatcap_vert:zd,meshmatcap_frag:Bd,meshnormal_vert:kd,meshnormal_frag:Vd,meshphong_vert:Hd,meshphong_frag:Gd,meshphysical_vert:Wd,meshphysical_frag:Xd,meshtoon_vert:qd,meshtoon_frag:Yd,points_vert:Zd,points_frag:Kd,shadow_vert:$d,shadow_frag:Jd,sprite_vert:jd,sprite_frag:Qd},yt={common:{diffuse:{value:new Kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Kt(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},cn={basic:{uniforms:Fe([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:Fe([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:Fe([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)},specular:{value:new Kt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:Fe([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:Fe([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:Fe([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:Fe([yt.points,yt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:Fe([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:Fe([yt.common,yt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:Fe([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:Fe([yt.sprite,yt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:Fe([yt.common,yt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:Fe([yt.lights,yt.fog,{color:{value:new Kt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};cn.physical={uniforms:Fe([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Kt(0)},specularColor:{value:new Kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const Xr={r:0,b:0,g:0},$n=new Rn,tp=new ue;function ep(i,t,e,n,r,s,o){const a=new Kt(0);let l=s===!0?0:1,c,u,f=null,p=0,d=null;function g(T){let M=T.isScene===!0?T.background:null;return M&&M.isTexture&&(M=(T.backgroundBlurriness>0?e:t).get(M)),M}function v(T){let M=!1;const y=g(T);y===null?h(a,l):y&&y.isColor&&(h(y,1),M=!0);const U=i.xr.getEnvironmentBlendMode();U==="additive"?n.buffers.color.setClear(0,0,0,1,o):U==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(T,M){const y=g(M);y&&(y.isCubeTexture||y.mapping===Ss)?(u===void 0&&(u=new ge(new Er(1,1,1),new fe({name:"BackgroundCubeMaterial",uniforms:Yi(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:Ue,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(U,R,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),$n.copy(M.backgroundRotation),$n.x*=-1,$n.y*=-1,$n.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(tp.makeRotationFromEuler($n)),u.material.toneMapped=te.getTransfer(y.colorSpace)!==le,(f!==y||p!==y.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=y,p=y.version,d=i.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new ge(new Ji(2,2),new fe({name:"BackgroundMaterial",uniforms:Yi(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=te.getTransfer(y.colorSpace)!==le,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||p!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,f=y,p=y.version,d=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function h(T,M){T.getRGB(Xr,Sc(i)),n.buffers.color.setClear(Xr.r,Xr.g,Xr.b,M,o)}return{getClearColor:function(){return a},setClearColor:function(T,M=1){a.set(T),l=M,h(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,h(a,l)},render:v,addToRenderList:m}}function np(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=p(null);let s=r,o=!1;function a(S,C,V,k,z){let st=!1;const X=f(k,V,C);s!==X&&(s=X,c(s.object)),st=d(S,k,V,z),st&&g(S,k,V,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(st||o)&&(o=!1,y(S,C,V,k),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function f(S,C,V){const k=V.wireframe===!0;let z=n[S.id];z===void 0&&(z={},n[S.id]=z);let st=z[C.id];st===void 0&&(st={},z[C.id]=st);let X=st[k];return X===void 0&&(X=p(l()),st[k]=X),X}function p(S){const C=[],V=[],k=[];for(let z=0;z<e;z++)C[z]=0,V[z]=0,k[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:V,attributeDivisors:k,object:S,attributes:{},index:null}}function d(S,C,V,k){const z=s.attributes,st=C.attributes;let X=0;const W=V.getAttributes();for(const B in W)if(W[B].location>=0){const Q=z[B];let $=st[B];if($===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&($=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&($=S.instanceColor)),Q===void 0||Q.attribute!==$||$&&Q.data!==$.data)return!0;X++}return s.attributesNum!==X||s.index!==k}function g(S,C,V,k){const z={},st=C.attributes;let X=0;const W=V.getAttributes();for(const B in W)if(W[B].location>=0){let Q=st[B];Q===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(Q=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(Q=S.instanceColor));const $={};$.attribute=Q,Q&&Q.data&&($.data=Q.data),z[B]=$,X++}s.attributes=z,s.attributesNum=X,s.index=k}function v(){const S=s.newAttributes;for(let C=0,V=S.length;C<V;C++)S[C]=0}function m(S){h(S,0)}function h(S,C){const V=s.newAttributes,k=s.enabledAttributes,z=s.attributeDivisors;V[S]=1,k[S]===0&&(i.enableVertexAttribArray(S),k[S]=1),z[S]!==C&&(i.vertexAttribDivisor(S,C),z[S]=C)}function T(){const S=s.newAttributes,C=s.enabledAttributes;for(let V=0,k=C.length;V<k;V++)C[V]!==S[V]&&(i.disableVertexAttribArray(V),C[V]=0)}function M(S,C,V,k,z,st,X){X===!0?i.vertexAttribIPointer(S,C,V,z,st):i.vertexAttribPointer(S,C,V,k,z,st)}function y(S,C,V,k){v();const z=k.attributes,st=V.getAttributes(),X=C.defaultAttributeValues;for(const W in st){const B=st[W];if(B.location>=0){let et=z[W];if(et===void 0&&(W==="instanceMatrix"&&S.instanceMatrix&&(et=S.instanceMatrix),W==="instanceColor"&&S.instanceColor&&(et=S.instanceColor)),et!==void 0){const Q=et.normalized,$=et.itemSize,Rt=t.get(et);if(Rt===void 0)continue;const Bt=Rt.buffer,Y=Rt.type,ut=Rt.bytesPerElement,mt=Y===i.INT||Y===i.UNSIGNED_INT||et.gpuType===ua;if(et.isInterleavedBufferAttribute){const ct=et.data,Ct=ct.stride,It=et.offset;if(ct.isInstancedInterleavedBuffer){for(let Z=0;Z<B.locationSize;Z++)h(B.location+Z,ct.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Z=0;Z<B.locationSize;Z++)m(B.location+Z);i.bindBuffer(i.ARRAY_BUFFER,Bt);for(let Z=0;Z<B.locationSize;Z++)M(B.location+Z,$/B.locationSize,Y,Q,Ct*ut,(It+$/B.locationSize*Z)*ut,mt)}else{if(et.isInstancedBufferAttribute){for(let ct=0;ct<B.locationSize;ct++)h(B.location+ct,et.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let ct=0;ct<B.locationSize;ct++)m(B.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Bt);for(let ct=0;ct<B.locationSize;ct++)M(B.location+ct,$/B.locationSize,Y,Q,$*ut,$/B.locationSize*ct*ut,mt)}}else if(X!==void 0){const Q=X[W];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(B.location,Q);break;case 3:i.vertexAttrib3fv(B.location,Q);break;case 4:i.vertexAttrib4fv(B.location,Q);break;default:i.vertexAttrib1fv(B.location,Q)}}}}T()}function U(){P();for(const S in n){const C=n[S];for(const V in C){const k=C[V];for(const z in k)u(k[z].object),delete k[z];delete C[V]}delete n[S]}}function R(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const V in C){const k=C[V];for(const z in k)u(k[z].object),delete k[z];delete C[V]}delete n[S.id]}function w(S){for(const C in n){const V=n[C];if(V[S.id]===void 0)continue;const k=V[S.id];for(const z in k)u(k[z].object),delete k[z];delete V[S.id]}}function P(){b(),o=!0,s!==r&&(s=r,c(s.object))}function b(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:b,dispose:U,releaseStatesOfGeometry:R,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:m,disableUnusedAttributes:T}}function ip(i,t,e){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),e.update(u,n,f))}function a(c,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,f);let d=0;for(let g=0;g<f;g++)d+=u[g];e.update(d,n,1)}function l(c,u,f,p){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],u[g],p[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,u,0,p,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v]*p[v];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function rp(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==sn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const P=w===Sr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==An&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==fn&&!P)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),U=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:T,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:U,maxSamples:R}}function sp(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new Qn,a=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const d=f.length!==0||p||n!==0||r;return r=p,n=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){e=u(f,p,0)},this.setState=function(f,p,d){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,h=i.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const T=s?0:n,M=T*4;let y=h.clippingState||null;l.value=y,y=u(g,p,M,d);for(let U=0;U!==M;++U)y[U]=e[U];h.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,p,d,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const h=d+v*4,T=p.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<h)&&(m=new Float32Array(h));for(let M=0,y=d;M!==v;++M,y+=4)o.copy(f[M]).applyMatrix4(T,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function op(i){let t=new WeakMap;function e(o,a){return a===bo?o.mapping=Gi:a===To&&(o.mapping=Wi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===bo||a===To)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gh(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",r),e(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class ap extends Ec{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Fi=4,cl=[.125,.215,.35,.446,.526,.582],ni=20,Qs=new ap,ul=new Kt;let to=null,eo=0,no=0,io=!1;const ti=(1+Math.sqrt(5))/2,Ai=1/ti,hl=[new L(-ti,Ai,0),new L(ti,Ai,0),new L(-Ai,0,ti),new L(Ai,0,ti),new L(0,ti,-Ai),new L(0,ti,Ai),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class fl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){to=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),no=this._renderer.getActiveMipmapLevel(),io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ml(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(to,eo,no),this._renderer.xr.enabled=io,t.scissorTest=!1,qr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Gi||t.mapping===Wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),to=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),no=this._renderer.getActiveMipmapLevel(),io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:hn,minFilter:hn,generateMipmaps:!1,type:Sr,format:sn,colorSpace:Zi,depthBuffer:!1},r=dl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=lp(s)),this._blurMaterial=cp(s,t,e)}return r}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Qs)}_sceneToCubeUV(t,e,n,r){const a=new Xe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(ul),u.toneMapping=Hn,u.autoClear=!1;const d=new xa({name:"PMREM.Background",side:Ue,depthWrite:!1,depthTest:!1}),g=new ge(new Er,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(ul),v=!0);for(let h=0;h<6;h++){const T=h%3;T===0?(a.up.set(0,l[h],0),a.lookAt(c[h],0,0)):T===1?(a.up.set(0,0,l[h]),a.lookAt(0,c[h],0)):(a.up.set(0,l[h],0),a.lookAt(0,0,c[h]));const M=this._cubeSize;qr(r,T*M,h>2?M:0,M,M),u.setRenderTarget(r),v&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=p,u.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Gi||t.mapping===Wi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ml()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pl());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;qr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Qs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=hl[(r-s-1)%hl.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new ge(this._lodPlanes[r],c),p=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*ni-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):ni;m>ni&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ni}`);const h=[];let T=0;for(let w=0;w<ni;++w){const P=w/v,b=Math.exp(-P*P/2);h.push(b),w===0?T+=b:w<m&&(T+=2*b)}for(let w=0;w<h.length;w++)h[w]=h[w]/T;p.envMap.value=t.texture,p.samples.value=m,p.weights.value=h,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:M}=this;p.dTheta.value=g,p.mipInt.value=M-n;const y=this._sizeLods[r],U=3*y*(r>M-Fi?r-M+Fi:0),R=4*(this._cubeSize-y);qr(e,U,R,3*y,2*y),l.setRenderTarget(e),l.render(f,Qs)}}function lp(i){const t=[],e=[],n=[];let r=i;const s=i-Fi+1+cl.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>i-Fi?l=cl[o-i+Fi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,f=1+c,p=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,g=6,v=3,m=2,h=1,T=new Float32Array(v*g*d),M=new Float32Array(m*g*d),y=new Float32Array(h*g*d);for(let R=0;R<d;R++){const w=R%3*2/3-1,P=R>2?0:-1,b=[w,P,0,w+2/3,P,0,w+2/3,P+1,0,w,P,0,w+2/3,P+1,0,w,P+1,0];T.set(b,v*g*R),M.set(p,m*g*R);const S=[R,R,R,R,R,R];y.set(S,h*g*R)}const U=new xe;U.setAttribute("position",new pe(T,v)),U.setAttribute("uv",new pe(M,m)),U.setAttribute("faceIndex",new pe(y,h)),t.push(U),r>Fi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function dl(i,t,e){const n=new oi(i,t,e);return n.texture.mapping=Ss,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function cp(i,t,e){const n=new Float32Array(ni),r=new L(0,1,0);return new fe({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ya(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function pl(){return new fe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ya(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function ml(){return new fe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ya(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function ya(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function up(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===bo||l===To,u=l===Gi||l===Wi;if(c||u){let f=t.get(a);const p=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return e===null&&(e=new fl(i)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{const d=a.image;return c&&d&&d.height>0||u&&d&&r(d)?(e===null&&(e=new fl(i)),f=c?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function hp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&pr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function fp(i,t,e,n){const r={},s=new WeakMap;function o(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);for(const g in p.morphAttributes){const v=p.morphAttributes[g];for(let m=0,h=v.length;m<h;m++)t.remove(v[m])}p.removeEventListener("dispose",o),delete r[p.id];const d=s.get(p);d&&(t.remove(d),s.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function a(f,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,e.memory.geometries++),p}function l(f){const p=f.attributes;for(const g in p)t.update(p[g],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const g in d){const v=d[g];for(let m=0,h=v.length;m<h;m++)t.update(v[m],i.ARRAY_BUFFER)}}function c(f){const p=[],d=f.index,g=f.attributes.position;let v=0;if(d!==null){const T=d.array;v=d.version;for(let M=0,y=T.length;M<y;M+=3){const U=T[M+0],R=T[M+1],w=T[M+2];p.push(U,R,R,w,w,U)}}else if(g!==void 0){const T=g.array;v=g.version;for(let M=0,y=T.length/3-1;M<y;M+=3){const U=M+0,R=M+1,w=M+2;p.push(U,R,R,w,w,U)}}else return;const m=new(mc(p)?Mc:yc)(p,1);m.version=v;const h=s.get(f);h&&t.remove(h),s.set(f,m)}function u(f){const p=s.get(f);if(p){const d=f.index;d!==null&&p.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function dp(i,t,e){let n;function r(p){n=p}let s,o;function a(p){s=p.type,o=p.bytesPerElement}function l(p,d){i.drawElements(n,d,s,p*o),e.update(d,n,1)}function c(p,d,g){g!==0&&(i.drawElementsInstanced(n,d,s,p*o,g),e.update(d,n,g))}function u(p,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,p,0,g);let m=0;for(let h=0;h<g;h++)m+=d[h];e.update(m,n,1)}function f(p,d,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<p.length;h++)c(p[h]/o,d[h],v[h]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,s,p,0,v,0,g);let h=0;for(let T=0;T<g;T++)h+=d[T]*v[T];e.update(h,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function pp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function mp(i,t,e){const n=new WeakMap,r=new he;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let p=n.get(a);if(p===void 0||p.count!==f){let b=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",b)};p!==void 0&&p.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let M=0;d===!0&&(M=1),g===!0&&(M=2),v===!0&&(M=3);let y=a.attributes.position.count*M,U=1;y>t.maxTextureSize&&(U=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const R=new Float32Array(y*U*4*f),w=new vc(R,y,U,f);w.type=fn,w.needsUpdate=!0;const P=M*4;for(let S=0;S<f;S++){const C=m[S],V=h[S],k=T[S],z=y*U*4*S;for(let st=0;st<C.count;st++){const X=st*P;d===!0&&(r.fromBufferAttribute(C,st),R[z+X+0]=r.x,R[z+X+1]=r.y,R[z+X+2]=r.z,R[z+X+3]=0),g===!0&&(r.fromBufferAttribute(V,st),R[z+X+4]=r.x,R[z+X+5]=r.y,R[z+X+6]=r.z,R[z+X+7]=0),v===!0&&(r.fromBufferAttribute(k,st),R[z+X+8]=r.x,R[z+X+9]=r.y,R[z+X+10]=r.z,R[z+X+11]=k.itemSize===4?r.w:1)}}p={count:f,texture:w,size:new vt(y,U)},n.set(a,p),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];const g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:s}}function gp(i,t,e,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,f=t.get(l,u);if(r.get(f)!==c&&(t.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==c&&(p.update(),r.set(p,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Ac extends Ie{constructor(t,e,n,r,s,o,a,l,c,u=Bi){if(u!==Bi&&u!==qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Bi&&(n=si),n===void 0&&u===qi&&(n=Xi),super(null,r,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:qe,this.minFilter=l!==void 0?l:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Rc=new Ie,gl=new Ac(1,1),Cc=new vc,Pc=new th,Lc=new bc,vl=[],_l=[],xl=new Float32Array(16),yl=new Float32Array(9),Ml=new Float32Array(4);function ji(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=vl[r];if(s===void 0&&(s=new Float32Array(r),vl[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function Me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Se(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function bs(i,t){let e=_l[t];e===void 0&&(e=new Int32Array(t),_l[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function vp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function _p(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2fv(this.addr,t),Se(e,t)}}function xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Me(e,t))return;i.uniform3fv(this.addr,t),Se(e,t)}}function yp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4fv(this.addr,t),Se(e,t)}}function Mp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Se(e,t)}else{if(Me(e,n))return;Ml.set(n),i.uniformMatrix2fv(this.addr,!1,Ml),Se(e,n)}}function Sp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Se(e,t)}else{if(Me(e,n))return;yl.set(n),i.uniformMatrix3fv(this.addr,!1,yl),Se(e,n)}}function Ep(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Se(e,t)}else{if(Me(e,n))return;xl.set(n),i.uniformMatrix4fv(this.addr,!1,xl),Se(e,n)}}function bp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Tp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2iv(this.addr,t),Se(e,t)}}function wp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3iv(this.addr,t),Se(e,t)}}function Ap(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4iv(this.addr,t),Se(e,t)}}function Rp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Cp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2uiv(this.addr,t),Se(e,t)}}function Pp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3uiv(this.addr,t),Se(e,t)}}function Lp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4uiv(this.addr,t),Se(e,t)}}function Dp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(gl.compareFunction=pc,s=gl):s=Rc,e.setTexture2D(t||s,r)}function Up(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Pc,r)}function Ip(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Lc,r)}function Np(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Cc,r)}function Fp(i){switch(i){case 5126:return vp;case 35664:return _p;case 35665:return xp;case 35666:return yp;case 35674:return Mp;case 35675:return Sp;case 35676:return Ep;case 5124:case 35670:return bp;case 35667:case 35671:return Tp;case 35668:case 35672:return wp;case 35669:case 35673:return Ap;case 5125:return Rp;case 36294:return Cp;case 36295:return Pp;case 36296:return Lp;case 35678:case 36198:case 36298:case 36306:case 35682:return Dp;case 35679:case 36299:case 36307:return Up;case 35680:case 36300:case 36308:case 36293:return Ip;case 36289:case 36303:case 36311:case 36292:return Np}}function Op(i,t){i.uniform1fv(this.addr,t)}function zp(i,t){const e=ji(t,this.size,2);i.uniform2fv(this.addr,e)}function Bp(i,t){const e=ji(t,this.size,3);i.uniform3fv(this.addr,e)}function kp(i,t){const e=ji(t,this.size,4);i.uniform4fv(this.addr,e)}function Vp(i,t){const e=ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Hp(i,t){const e=ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Gp(i,t){const e=ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Wp(i,t){i.uniform1iv(this.addr,t)}function Xp(i,t){i.uniform2iv(this.addr,t)}function qp(i,t){i.uniform3iv(this.addr,t)}function Yp(i,t){i.uniform4iv(this.addr,t)}function Zp(i,t){i.uniform1uiv(this.addr,t)}function Kp(i,t){i.uniform2uiv(this.addr,t)}function $p(i,t){i.uniform3uiv(this.addr,t)}function Jp(i,t){i.uniform4uiv(this.addr,t)}function jp(i,t,e){const n=this.cache,r=t.length,s=bs(e,r);Me(n,s)||(i.uniform1iv(this.addr,s),Se(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Rc,s[o])}function Qp(i,t,e){const n=this.cache,r=t.length,s=bs(e,r);Me(n,s)||(i.uniform1iv(this.addr,s),Se(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Pc,s[o])}function tm(i,t,e){const n=this.cache,r=t.length,s=bs(e,r);Me(n,s)||(i.uniform1iv(this.addr,s),Se(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Lc,s[o])}function em(i,t,e){const n=this.cache,r=t.length,s=bs(e,r);Me(n,s)||(i.uniform1iv(this.addr,s),Se(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Cc,s[o])}function nm(i){switch(i){case 5126:return Op;case 35664:return zp;case 35665:return Bp;case 35666:return kp;case 35674:return Vp;case 35675:return Hp;case 35676:return Gp;case 5124:case 35670:return Wp;case 35667:case 35671:return Xp;case 35668:case 35672:return qp;case 35669:case 35673:return Yp;case 5125:return Zp;case 36294:return Kp;case 36295:return $p;case 36296:return Jp;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Qp;case 35680:case 36300:case 36308:case 36293:return tm;case 36289:case 36303:case 36311:case 36292:return em}}class im{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Fp(e.type)}}class rm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=nm(e.type)}}class sm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const ro=/(\w+)(\])?(\[|\.)?/g;function Sl(i,t){i.seq.push(t),i.map[t.id]=t}function om(i,t,e){const n=i.name,r=n.length;for(ro.lastIndex=0;;){const s=ro.exec(n),o=ro.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Sl(e,c===void 0?new im(a,i,t):new rm(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new sm(a),Sl(e,f)),e=f}}}class fs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);om(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function El(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const am=37297;let lm=0;function cm(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const bl=new Wt;function um(i){te._getMatrix(bl,te.workingColorSpace,i);const t=`mat3( ${bl.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case Es:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Tl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+cm(i.getShaderSource(t),o)}else return r}function hm(i,t){const e=um(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function fm(i,t){let e;switch(t){case wu:e="Linear";break;case Au:e="Reinhard";break;case Ru:e="Cineon";break;case Cu:e="ACESFilmic";break;case Lu:e="AgX";break;case Du:e="Neutral";break;case Pu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Yr=new L;function dm(){te.getLuminanceCoefficients(Yr);const i=Yr.x.toFixed(4),t=Yr.y.toFixed(4),e=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function mm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function gm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function mr(i){return i!==""}function wl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Al(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const vm=/^[ \t]*#include +<([\w\d./]+)>/gm;function na(i){return i.replace(vm,xm)}const _m=new Map;function xm(i,t){let e=qt[t];if(e===void 0){const n=_m.get(t);if(n!==void 0)e=qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return na(e)}const ym=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rl(i){return i.replace(ym,Mm)}function Mm(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Cl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Sm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===su?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===En&&(t="SHADOWMAP_TYPE_VSM"),t}function Em(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gi:case Wi:t="ENVMAP_TYPE_CUBE";break;case Ss:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bm(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Wi&&(t="ENVMAP_MODE_REFRACTION"),t}function Tm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ic:t="ENVMAP_BLENDING_MULTIPLY";break;case bu:t="ENVMAP_BLENDING_MIX";break;case Tu:t="ENVMAP_BLENDING_ADD";break}return t}function wm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Am(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Sm(e),c=Em(e),u=bm(e),f=Tm(e),p=wm(e),d=pm(e),g=mm(s),v=r.createProgram();let m,h,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(mr).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(mr).join(`
`),h.length>0&&(h+=`
`)):(m=[Cl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),h=[Cl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hn?"#define TONE_MAPPING":"",e.toneMapping!==Hn?qt.tonemapping_pars_fragment:"",e.toneMapping!==Hn?fm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,hm("linearToOutputTexel",e.outputColorSpace),dm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(mr).join(`
`)),o=na(o),o=wl(o,e),o=Al(o,e),a=na(a),a=wl(a,e),a=Al(a,e),o=Rl(o),a=Rl(a),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",e.glslVersion===Ha?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ha?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const M=T+m+o,y=T+h+a,U=El(r,r.VERTEX_SHADER,M),R=El(r,r.FRAGMENT_SHADER,y);r.attachShader(v,U),r.attachShader(v,R),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function w(C){if(i.debug.checkShaderErrors){const V=r.getProgramInfoLog(v).trim(),k=r.getShaderInfoLog(U).trim(),z=r.getShaderInfoLog(R).trim();let st=!0,X=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(st=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,U,R);else{const W=Tl(r,U,"vertex"),B=Tl(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+V+`
`+W+`
`+B)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(k===""||z==="")&&(X=!1);X&&(C.diagnostics={runnable:st,programLog:V,vertexShader:{log:k,prefix:m},fragmentShader:{log:z,prefix:h}})}r.deleteShader(U),r.deleteShader(R),P=new fs(r,v),b=gm(r,v)}let P;this.getUniforms=function(){return P===void 0&&w(this),P};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(v,am)),S},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=lm++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=U,this.fragmentShader=R,this}let Rm=0;class Cm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Pm(t),e.set(t,n)),n}}class Pm{constructor(t){this.id=Rm++,this.code=t,this.usedTimes=0}}function Lm(i,t,e,n,r,s,o){const a=new _c,l=new Cm,c=new Set,u=[],f=r.logarithmicDepthBuffer,p=r.vertexTextures;let d=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,S,C,V,k){const z=V.fog,st=k.geometry,X=b.isMeshStandardMaterial?V.environment:null,W=(b.isMeshStandardMaterial?e:t).get(b.envMap||X),B=W&&W.mapping===Ss?W.image.height:null,et=g[b.type];b.precision!==null&&(d=r.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const Q=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,$=Q!==void 0?Q.length:0;let Rt=0;st.morphAttributes.position!==void 0&&(Rt=1),st.morphAttributes.normal!==void 0&&(Rt=2),st.morphAttributes.color!==void 0&&(Rt=3);let Bt,Y,ut,mt;if(et){const jt=cn[et];Bt=jt.vertexShader,Y=jt.fragmentShader}else Bt=b.vertexShader,Y=b.fragmentShader,l.update(b),ut=l.getVertexShaderID(b),mt=l.getFragmentShaderID(b);const ct=i.getRenderTarget(),Ct=i.state.buffers.depth.getReversed(),It=k.isInstancedMesh===!0,Z=k.isBatchedMesh===!0,Nt=!!b.map,J=!!b.matcap,at=!!W,A=!!b.aoMap,ht=!!b.lightMap,tt=!!b.bumpMap,_t=!!b.normalMap,lt=!!b.displacementMap,it=!!b.emissiveMap,rt=!!b.metalnessMap,_=!!b.roughnessMap,x=b.anisotropy>0,I=b.clearcoat>0,O=b.dispersion>0,K=b.iridescence>0,q=b.sheen>0,gt=b.transmission>0,pt=x&&!!b.anisotropyMap,Tt=I&&!!b.clearcoatMap,Vt=I&&!!b.clearcoatNormalMap,ft=I&&!!b.clearcoatRoughnessMap,At=K&&!!b.iridescenceMap,Ft=K&&!!b.iridescenceThicknessMap,Ot=q&&!!b.sheenColorMap,bt=q&&!!b.sheenRoughnessMap,$t=!!b.specularMap,Ht=!!b.specularColorMap,Yt=!!b.specularIntensityMap,N=gt&&!!b.transmissionMap,xt=gt&&!!b.thicknessMap,j=!!b.gradientMap,ot=!!b.alphaMap,wt=b.alphaTest>0,Mt=!!b.alphaHash,zt=!!b.extensions;let ie=Hn;b.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(ie=i.toneMapping);const ve={shaderID:et,shaderType:b.type,shaderName:b.name,vertexShader:Bt,fragmentShader:Y,defines:b.defines,customVertexShaderID:ut,customFragmentShaderID:mt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Z,batchingColor:Z&&k._colorsTexture!==null,instancing:It,instancingColor:It&&k.instanceColor!==null,instancingMorph:It&&k.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Zi,alphaToCoverage:!!b.alphaToCoverage,map:Nt,matcap:J,envMap:at,envMapMode:at&&W.mapping,envMapCubeUVHeight:B,aoMap:A,lightMap:ht,bumpMap:tt,normalMap:_t,displacementMap:p&&lt,emissiveMap:it,normalMapObjectSpace:_t&&b.normalMapType===Ou,normalMapTangentSpace:_t&&b.normalMapType===Fu,metalnessMap:rt,roughnessMap:_,anisotropy:x,anisotropyMap:pt,clearcoat:I,clearcoatMap:Tt,clearcoatNormalMap:Vt,clearcoatRoughnessMap:ft,dispersion:O,iridescence:K,iridescenceMap:At,iridescenceThicknessMap:Ft,sheen:q,sheenColorMap:Ot,sheenRoughnessMap:bt,specularMap:$t,specularColorMap:Ht,specularIntensityMap:Yt,transmission:gt,transmissionMap:N,thicknessMap:xt,gradientMap:j,opaque:b.transparent===!1&&b.blending===zi&&b.alphaToCoverage===!1,alphaMap:ot,alphaTest:wt,alphaHash:Mt,combine:b.combine,mapUv:Nt&&v(b.map.channel),aoMapUv:A&&v(b.aoMap.channel),lightMapUv:ht&&v(b.lightMap.channel),bumpMapUv:tt&&v(b.bumpMap.channel),normalMapUv:_t&&v(b.normalMap.channel),displacementMapUv:lt&&v(b.displacementMap.channel),emissiveMapUv:it&&v(b.emissiveMap.channel),metalnessMapUv:rt&&v(b.metalnessMap.channel),roughnessMapUv:_&&v(b.roughnessMap.channel),anisotropyMapUv:pt&&v(b.anisotropyMap.channel),clearcoatMapUv:Tt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:bt&&v(b.sheenRoughnessMap.channel),specularMapUv:$t&&v(b.specularMap.channel),specularColorMapUv:Ht&&v(b.specularColorMap.channel),specularIntensityMapUv:Yt&&v(b.specularIntensityMap.channel),transmissionMapUv:N&&v(b.transmissionMap.channel),thicknessMapUv:xt&&v(b.thicknessMap.channel),alphaMapUv:ot&&v(b.alphaMap.channel),vertexTangents:!!st.attributes.tangent&&(_t||x),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!st.attributes.uv&&(Nt||ot),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Ct,skinning:k.isSkinnedMesh===!0,morphTargets:st.morphAttributes.position!==void 0,morphNormals:st.morphAttributes.normal!==void 0,morphColors:st.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:Rt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ie,decodeVideoTexture:Nt&&b.map.isVideoTexture===!0&&te.getTransfer(b.map.colorSpace)===le,decodeVideoTextureEmissive:it&&b.emissiveMap.isVideoTexture===!0&&te.getTransfer(b.emissiveMap.colorSpace)===le,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ke,flipSided:b.side===Ue,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:zt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&b.extensions.multiDraw===!0||Z)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ve.vertexUv1s=c.has(1),ve.vertexUv2s=c.has(2),ve.vertexUv3s=c.has(3),c.clear(),ve}function h(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)S.push(C),S.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(T(S,b),M(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function T(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function M(b,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){const S=g[b.type];let C;if(S){const V=cn[S];C=fh.clone(V.uniforms)}else C=b.uniforms;return C}function U(b,S){let C;for(let V=0,k=u.length;V<k;V++){const z=u[V];if(z.cacheKey===S){C=z,++C.usedTimes;break}}return C===void 0&&(C=new Am(i,S,b,s),u.push(C)),C}function R(b){if(--b.usedTimes===0){const S=u.indexOf(b);u[S]=u[u.length-1],u.pop(),b.destroy()}}function w(b){l.remove(b)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:y,acquireProgram:U,releaseProgram:R,releaseShaderCache:w,programs:u,dispose:P}}function Dm(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Um(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Pl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ll(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(f,p,d,g,v,m){let h=i[t];return h===void 0?(h={id:f.id,object:f,geometry:p,material:d,groupOrder:g,renderOrder:f.renderOrder,z:v,group:m},i[t]=h):(h.id=f.id,h.object=f,h.geometry=p,h.material=d,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=v,h.group=m),t++,h}function a(f,p,d,g,v,m){const h=o(f,p,d,g,v,m);d.transmission>0?n.push(h):d.transparent===!0?r.push(h):e.push(h)}function l(f,p,d,g,v,m){const h=o(f,p,d,g,v,m);d.transmission>0?n.unshift(h):d.transparent===!0?r.unshift(h):e.unshift(h)}function c(f,p){e.length>1&&e.sort(f||Um),n.length>1&&n.sort(p||Pl),r.length>1&&r.sort(p||Pl)}function u(){for(let f=t,p=i.length;f<p;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function Im(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new Ll,i.set(n,[o])):r>=s.length?(o=new Ll,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Nm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Kt};break;case"SpotLight":e={position:new L,direction:new L,color:new Kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Kt,groundColor:new Kt};break;case"RectAreaLight":e={color:new Kt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Fm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Om=0;function zm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Bm(i){const t=new Nm,e=Fm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const r=new L,s=new ue,o=new ue;function a(c){let u=0,f=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,v=0,m=0,h=0,T=0,M=0,y=0,U=0,R=0,w=0;c.sort(zm);for(let b=0,S=c.length;b<S;b++){const C=c[b],V=C.color,k=C.intensity,z=C.distance,st=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=V.r*k,f+=V.g*k,p+=V.b*k;else if(C.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(C.sh.coefficients[X],k);w++}else if(C.isDirectionalLight){const X=t.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const W=C.shadow,B=e.get(C);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,n.directionalShadow[d]=B,n.directionalShadowMap[d]=st,n.directionalShadowMatrix[d]=C.shadow.matrix,T++}n.directional[d]=X,d++}else if(C.isSpotLight){const X=t.get(C);X.position.setFromMatrixPosition(C.matrixWorld),X.color.copy(V).multiplyScalar(k),X.distance=z,X.coneCos=Math.cos(C.angle),X.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),X.decay=C.decay,n.spot[v]=X;const W=C.shadow;if(C.map&&(n.spotLightMap[U]=C.map,U++,W.updateMatrices(C),C.castShadow&&R++),n.spotLightMatrix[v]=W.matrix,C.castShadow){const B=e.get(C);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,n.spotShadow[v]=B,n.spotShadowMap[v]=st,y++}v++}else if(C.isRectAreaLight){const X=t.get(C);X.color.copy(V).multiplyScalar(k),X.halfWidth.set(C.width*.5,0,0),X.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=X,m++}else if(C.isPointLight){const X=t.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),X.distance=C.distance,X.decay=C.decay,C.castShadow){const W=C.shadow,B=e.get(C);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,B.shadowCameraNear=W.camera.near,B.shadowCameraFar=W.camera.far,n.pointShadow[g]=B,n.pointShadowMap[g]=st,n.pointShadowMatrix[g]=C.shadow.matrix,M++}n.point[g]=X,g++}else if(C.isHemisphereLight){const X=t.get(C);X.skyColor.copy(C.color).multiplyScalar(k),X.groundColor.copy(C.groundColor).multiplyScalar(k),n.hemi[h]=X,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=yt.LTC_FLOAT_1,n.rectAreaLTC2=yt.LTC_FLOAT_2):(n.rectAreaLTC1=yt.LTC_HALF_1,n.rectAreaLTC2=yt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=p;const P=n.hash;(P.directionalLength!==d||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==m||P.hemiLength!==h||P.numDirectionalShadows!==T||P.numPointShadows!==M||P.numSpotShadows!==y||P.numSpotMaps!==U||P.numLightProbes!==w)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=y+U-R,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=w,P.directionalLength=d,P.pointLength=g,P.spotLength=v,P.rectAreaLength=m,P.hemiLength=h,P.numDirectionalShadows=T,P.numPointShadows=M,P.numSpotShadows=y,P.numSpotMaps=U,P.numLightProbes=w,n.version=Om++)}function l(c,u){let f=0,p=0,d=0,g=0,v=0;const m=u.matrixWorldInverse;for(let h=0,T=c.length;h<T;h++){const M=c[h];if(M.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(M.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),d++}else if(M.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(M.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const y=n.point[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),p++}else if(M.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function Dl(i){const t=new Bm(i),e=[],n=[];function r(u){c.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function km(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new Dl(i),t.set(r,[a])):s>=o.length?(a=new Dl(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Vm extends ui{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Iu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Hm extends ui{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Gm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Xm(i,t,e){let n=new Tc;const r=new vt,s=new vt,o=new he,a=new Vm({depthPacking:Nu}),l=new Hm,c={},u=e.maxTextureSize,f={[dn]:Ue,[Ue]:dn,[Ke]:Ke},p=new fe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:Gm,fragmentShader:Wm}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const g=new xe;g.setAttribute("position",new pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ge(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nc;let h=this.type;this.render=function(R,w,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),V=i.state;V.setBlending(Vn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const k=h!==En&&this.type===En,z=h===En&&this.type!==En;for(let st=0,X=R.length;st<X;st++){const W=R[st],B=W.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const et=B.getFrameExtents();if(r.multiply(et),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/et.x),r.x=s.x*et.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/et.y),r.y=s.y*et.y,B.mapSize.y=s.y)),B.map===null||k===!0||z===!0){const $=this.type!==En?{minFilter:qe,magFilter:qe}:{};B.map!==null&&B.map.dispose(),B.map=new oi(r.x,r.y,$),B.map.texture.name=W.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const Q=B.getViewportCount();for(let $=0;$<Q;$++){const Rt=B.getViewport($);o.set(s.x*Rt.x,s.y*Rt.y,s.x*Rt.z,s.y*Rt.w),V.viewport(o),B.updateMatrices(W,$),n=B.getFrustum(),y(w,P,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===En&&T(B,P),B.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(b,S,C)};function T(R,w){const P=t.update(v);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,d.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new oi(r.x,r.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(w,null,P,p,v,null),d.uniforms.shadow_pass.value=R.mapPass.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(w,null,P,d,v,null)}function M(R,w,P,b){let S=null;const C=P.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(C!==void 0)S=C;else if(S=P.isPointLight===!0?l:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const V=S.uuid,k=w.uuid;let z=c[V];z===void 0&&(z={},c[V]=z);let st=z[k];st===void 0&&(st=S.clone(),z[k]=st,w.addEventListener("dispose",U)),S=st}if(S.visible=w.visible,S.wireframe=w.wireframe,b===En?S.side=w.shadowSide!==null?w.shadowSide:w.side:S.side=w.shadowSide!==null?w.shadowSide:f[w.side],S.alphaMap=w.alphaMap,S.alphaTest=w.alphaTest,S.map=w.map,S.clipShadows=w.clipShadows,S.clippingPlanes=w.clippingPlanes,S.clipIntersection=w.clipIntersection,S.displacementMap=w.displacementMap,S.displacementScale=w.displacementScale,S.displacementBias=w.displacementBias,S.wireframeLinewidth=w.wireframeLinewidth,S.linewidth=w.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const V=i.properties.get(S);V.light=P}return S}function y(R,w,P,b,S){if(R.visible===!1)return;if(R.layers.test(w.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&S===En)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,R.matrixWorld);const k=t.update(R),z=R.material;if(Array.isArray(z)){const st=k.groups;for(let X=0,W=st.length;X<W;X++){const B=st[X],et=z[B.materialIndex];if(et&&et.visible){const Q=M(R,et,b,S);R.onBeforeShadow(i,R,w,P,k,Q,B),i.renderBufferDirect(P,null,k,Q,R,B),R.onAfterShadow(i,R,w,P,k,Q,B)}}}else if(z.visible){const st=M(R,z,b,S);R.onBeforeShadow(i,R,w,P,k,st,null),i.renderBufferDirect(P,null,k,st,R,null),R.onAfterShadow(i,R,w,P,k,st,null)}}const V=R.children;for(let k=0,z=V.length;k<z;k++)y(V[k],w,P,b,S)}function U(R){R.target.removeEventListener("dispose",U);for(const P in c){const b=c[P],S=R.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const qm={[vo]:_o,[xo]:So,[yo]:Eo,[Hi]:Mo,[_o]:vo,[So]:xo,[Eo]:yo,[Mo]:Hi};function Ym(i,t){function e(){let N=!1;const xt=new he;let j=null;const ot=new he(0,0,0,0);return{setMask:function(wt){j!==wt&&!N&&(i.colorMask(wt,wt,wt,wt),j=wt)},setLocked:function(wt){N=wt},setClear:function(wt,Mt,zt,ie,ve){ve===!0&&(wt*=ie,Mt*=ie,zt*=ie),xt.set(wt,Mt,zt,ie),ot.equals(xt)===!1&&(i.clearColor(wt,Mt,zt,ie),ot.copy(xt))},reset:function(){N=!1,j=null,ot.set(-1,0,0,0)}}}function n(){let N=!1,xt=!1,j=null,ot=null,wt=null;return{setReversed:function(Mt){if(xt!==Mt){const zt=t.get("EXT_clip_control");xt?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT);const ie=wt;wt=null,this.setClear(ie)}xt=Mt},getReversed:function(){return xt},setTest:function(Mt){Mt?ct(i.DEPTH_TEST):Ct(i.DEPTH_TEST)},setMask:function(Mt){j!==Mt&&!N&&(i.depthMask(Mt),j=Mt)},setFunc:function(Mt){if(xt&&(Mt=qm[Mt]),ot!==Mt){switch(Mt){case vo:i.depthFunc(i.NEVER);break;case _o:i.depthFunc(i.ALWAYS);break;case xo:i.depthFunc(i.LESS);break;case Hi:i.depthFunc(i.LEQUAL);break;case yo:i.depthFunc(i.EQUAL);break;case Mo:i.depthFunc(i.GEQUAL);break;case So:i.depthFunc(i.GREATER);break;case Eo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ot=Mt}},setLocked:function(Mt){N=Mt},setClear:function(Mt){wt!==Mt&&(xt&&(Mt=1-Mt),i.clearDepth(Mt),wt=Mt)},reset:function(){N=!1,j=null,ot=null,wt=null,xt=!1}}}function r(){let N=!1,xt=null,j=null,ot=null,wt=null,Mt=null,zt=null,ie=null,ve=null;return{setTest:function(jt){N||(jt?ct(i.STENCIL_TEST):Ct(i.STENCIL_TEST))},setMask:function(jt){xt!==jt&&!N&&(i.stencilMask(jt),xt=jt)},setFunc:function(jt,de,Te){(j!==jt||ot!==de||wt!==Te)&&(i.stencilFunc(jt,de,Te),j=jt,ot=de,wt=Te)},setOp:function(jt,de,Te){(Mt!==jt||zt!==de||ie!==Te)&&(i.stencilOp(jt,de,Te),Mt=jt,zt=de,ie=Te)},setLocked:function(jt){N=jt},setClear:function(jt){ve!==jt&&(i.clearStencil(jt),ve=jt)},reset:function(){N=!1,xt=null,j=null,ot=null,wt=null,Mt=null,zt=null,ie=null,ve=null}}}const s=new e,o=new n,a=new r,l=new WeakMap,c=new WeakMap;let u={},f={},p=new WeakMap,d=[],g=null,v=!1,m=null,h=null,T=null,M=null,y=null,U=null,R=null,w=new Kt(0,0,0),P=0,b=!1,S=null,C=null,V=null,k=null,z=null;const st=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,W=0;const B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(B)[1]),X=W>=1):B.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),X=W>=2);let et=null,Q={};const $=i.getParameter(i.SCISSOR_BOX),Rt=i.getParameter(i.VIEWPORT),Bt=new he().fromArray($),Y=new he().fromArray(Rt);function ut(N,xt,j,ot){const wt=new Uint8Array(4),Mt=i.createTexture();i.bindTexture(N,Mt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<j;zt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,ot,0,i.RGBA,i.UNSIGNED_BYTE,wt):i.texImage2D(xt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,wt);return Mt}const mt={};mt[i.TEXTURE_2D]=ut(i.TEXTURE_2D,i.TEXTURE_2D,1),mt[i.TEXTURE_CUBE_MAP]=ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[i.TEXTURE_2D_ARRAY]=ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),mt[i.TEXTURE_3D]=ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ct(i.DEPTH_TEST),o.setFunc(Hi),tt(!1),_t(za),ct(i.CULL_FACE),A(Vn);function ct(N){u[N]!==!0&&(i.enable(N),u[N]=!0)}function Ct(N){u[N]!==!1&&(i.disable(N),u[N]=!1)}function It(N,xt){return f[N]!==xt?(i.bindFramebuffer(N,xt),f[N]=xt,N===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=xt),N===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function Z(N,xt){let j=d,ot=!1;if(N){j=p.get(xt),j===void 0&&(j=[],p.set(xt,j));const wt=N.textures;if(j.length!==wt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Mt=0,zt=wt.length;Mt<zt;Mt++)j[Mt]=i.COLOR_ATTACHMENT0+Mt;j.length=wt.length,ot=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ot=!0);ot&&i.drawBuffers(j)}function Nt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const J={[ei]:i.FUNC_ADD,[au]:i.FUNC_SUBTRACT,[lu]:i.FUNC_REVERSE_SUBTRACT};J[cu]=i.MIN,J[uu]=i.MAX;const at={[hu]:i.ZERO,[fu]:i.ONE,[du]:i.SRC_COLOR,[mo]:i.SRC_ALPHA,[xu]:i.SRC_ALPHA_SATURATE,[vu]:i.DST_COLOR,[mu]:i.DST_ALPHA,[pu]:i.ONE_MINUS_SRC_COLOR,[go]:i.ONE_MINUS_SRC_ALPHA,[_u]:i.ONE_MINUS_DST_COLOR,[gu]:i.ONE_MINUS_DST_ALPHA,[yu]:i.CONSTANT_COLOR,[Mu]:i.ONE_MINUS_CONSTANT_COLOR,[Su]:i.CONSTANT_ALPHA,[Eu]:i.ONE_MINUS_CONSTANT_ALPHA};function A(N,xt,j,ot,wt,Mt,zt,ie,ve,jt){if(N===Vn){v===!0&&(Ct(i.BLEND),v=!1);return}if(v===!1&&(ct(i.BLEND),v=!0),N!==ou){if(N!==m||jt!==b){if((h!==ei||y!==ei)&&(i.blendEquation(i.FUNC_ADD),h=ei,y=ei),jt)switch(N){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case je:i.blendFunc(i.ONE,i.ONE);break;case Ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ka:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case je:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ka:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}T=null,M=null,U=null,R=null,w.set(0,0,0),P=0,m=N,b=jt}return}wt=wt||xt,Mt=Mt||j,zt=zt||ot,(xt!==h||wt!==y)&&(i.blendEquationSeparate(J[xt],J[wt]),h=xt,y=wt),(j!==T||ot!==M||Mt!==U||zt!==R)&&(i.blendFuncSeparate(at[j],at[ot],at[Mt],at[zt]),T=j,M=ot,U=Mt,R=zt),(ie.equals(w)===!1||ve!==P)&&(i.blendColor(ie.r,ie.g,ie.b,ve),w.copy(ie),P=ve),m=N,b=!1}function ht(N,xt){N.side===Ke?Ct(i.CULL_FACE):ct(i.CULL_FACE);let j=N.side===Ue;xt&&(j=!j),tt(j),N.blending===zi&&N.transparent===!1?A(Vn):A(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const ot=N.stencilWrite;a.setTest(ot),ot&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),it(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(N){S!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),S=N)}function _t(N){N!==iu?(ct(i.CULL_FACE),N!==C&&(N===za?i.cullFace(i.BACK):N===ru?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ct(i.CULL_FACE),C=N}function lt(N){N!==V&&(X&&i.lineWidth(N),V=N)}function it(N,xt,j){N?(ct(i.POLYGON_OFFSET_FILL),(k!==xt||z!==j)&&(i.polygonOffset(xt,j),k=xt,z=j)):Ct(i.POLYGON_OFFSET_FILL)}function rt(N){N?ct(i.SCISSOR_TEST):Ct(i.SCISSOR_TEST)}function _(N){N===void 0&&(N=i.TEXTURE0+st-1),et!==N&&(i.activeTexture(N),et=N)}function x(N,xt,j){j===void 0&&(et===null?j=i.TEXTURE0+st-1:j=et);let ot=Q[j];ot===void 0&&(ot={type:void 0,texture:void 0},Q[j]=ot),(ot.type!==N||ot.texture!==xt)&&(et!==j&&(i.activeTexture(j),et=j),i.bindTexture(N,xt||mt[N]),ot.type=N,ot.texture=xt)}function I(){const N=Q[et];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function O(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function gt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Vt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function At(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(N){Bt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Bt.copy(N))}function bt(N){Y.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Y.copy(N))}function $t(N,xt){let j=c.get(xt);j===void 0&&(j=new WeakMap,c.set(xt,j));let ot=j.get(N);ot===void 0&&(ot=i.getUniformBlockIndex(xt,N.name),j.set(N,ot))}function Ht(N,xt){const ot=c.get(xt).get(N);l.get(xt)!==ot&&(i.uniformBlockBinding(xt,ot,N.__bindingPointIndex),l.set(xt,ot))}function Yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},et=null,Q={},f={},p=new WeakMap,d=[],g=null,v=!1,m=null,h=null,T=null,M=null,y=null,U=null,R=null,w=new Kt(0,0,0),P=0,b=!1,S=null,C=null,V=null,k=null,z=null,Bt.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ct,disable:Ct,bindFramebuffer:It,drawBuffers:Z,useProgram:Nt,setBlending:A,setMaterial:ht,setFlipSided:tt,setCullFace:_t,setLineWidth:lt,setPolygonOffset:it,setScissorTest:rt,activeTexture:_,bindTexture:x,unbindTexture:I,compressedTexImage2D:O,compressedTexImage3D:K,texImage2D:At,texImage3D:Ft,updateUBOMapping:$t,uniformBlockBinding:Ht,texStorage2D:Vt,texStorage3D:ft,texSubImage2D:q,texSubImage3D:gt,compressedTexSubImage2D:pt,compressedTexSubImage3D:Tt,scissor:Ot,viewport:bt,reset:Yt}}function Ul(i,t,e,n){const r=Zm(n);switch(e){case lc:return i*t;case uc:return i*t;case hc:return i*t*2;case da:return i*t/r.components*r.byteLength;case pa:return i*t/r.components*r.byteLength;case fc:return i*t*2/r.components*r.byteLength;case ma:return i*t*2/r.components*r.byteLength;case cc:return i*t*3/r.components*r.byteLength;case sn:return i*t*4/r.components*r.byteLength;case ga:return i*t*4/r.components*r.byteLength;case as:case ls:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case cs:case us:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Co:case Lo:return Math.max(i,16)*Math.max(t,8)/4;case Ro:case Po:return Math.max(i,8)*Math.max(t,8)/2;case Do:case Uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case No:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Oo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case zo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ko:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ho:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Go:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case qo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Zo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case hs:case Ko:case $o:return Math.ceil(i/4)*Math.ceil(t/4)*16;case dc:case Jo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case jo:case Qo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Zm(i){switch(i){case An:case sc:return{byteLength:1,components:1};case _r:case oc:case Sr:return{byteLength:2,components:1};case ha:case fa:return{byteLength:2,components:4};case si:case ua:case fn:return{byteLength:4,components:1};case ac:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Km(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new vt,u=new WeakMap;let f;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(_,x){return d?new OffscreenCanvas(_,x):gs("canvas")}function v(_,x,I){let O=1;const K=rt(_);if((K.width>I||K.height>I)&&(O=I/Math.max(K.width,K.height)),O<1)if(typeof HTMLImageElement<"u"&&_ instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&_ instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&_ instanceof ImageBitmap||typeof VideoFrame<"u"&&_ instanceof VideoFrame){const q=Math.floor(O*K.width),gt=Math.floor(O*K.height);f===void 0&&(f=g(q,gt));const pt=x?g(q,gt):f;return pt.width=q,pt.height=gt,pt.getContext("2d").drawImage(_,0,0,q,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+q+"x"+gt+")."),pt}else return"data"in _&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),_;return _}function m(_){return _.generateMipmaps}function h(_){i.generateMipmap(_)}function T(_){return _.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:_.isWebGL3DRenderTarget?i.TEXTURE_3D:_.isWebGLArrayRenderTarget||_.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(_,x,I,O,K=!1){if(_!==null){if(i[_]!==void 0)return i[_];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+_+"'")}let q=x;if(x===i.RED&&(I===i.FLOAT&&(q=i.R32F),I===i.HALF_FLOAT&&(q=i.R16F),I===i.UNSIGNED_BYTE&&(q=i.R8)),x===i.RED_INTEGER&&(I===i.UNSIGNED_BYTE&&(q=i.R8UI),I===i.UNSIGNED_SHORT&&(q=i.R16UI),I===i.UNSIGNED_INT&&(q=i.R32UI),I===i.BYTE&&(q=i.R8I),I===i.SHORT&&(q=i.R16I),I===i.INT&&(q=i.R32I)),x===i.RG&&(I===i.FLOAT&&(q=i.RG32F),I===i.HALF_FLOAT&&(q=i.RG16F),I===i.UNSIGNED_BYTE&&(q=i.RG8)),x===i.RG_INTEGER&&(I===i.UNSIGNED_BYTE&&(q=i.RG8UI),I===i.UNSIGNED_SHORT&&(q=i.RG16UI),I===i.UNSIGNED_INT&&(q=i.RG32UI),I===i.BYTE&&(q=i.RG8I),I===i.SHORT&&(q=i.RG16I),I===i.INT&&(q=i.RG32I)),x===i.RGB_INTEGER&&(I===i.UNSIGNED_BYTE&&(q=i.RGB8UI),I===i.UNSIGNED_SHORT&&(q=i.RGB16UI),I===i.UNSIGNED_INT&&(q=i.RGB32UI),I===i.BYTE&&(q=i.RGB8I),I===i.SHORT&&(q=i.RGB16I),I===i.INT&&(q=i.RGB32I)),x===i.RGBA_INTEGER&&(I===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),I===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),I===i.UNSIGNED_INT&&(q=i.RGBA32UI),I===i.BYTE&&(q=i.RGBA8I),I===i.SHORT&&(q=i.RGBA16I),I===i.INT&&(q=i.RGBA32I)),x===i.RGB&&I===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),x===i.RGBA){const gt=K?Es:te.getTransfer(O);I===i.FLOAT&&(q=i.RGBA32F),I===i.HALF_FLOAT&&(q=i.RGBA16F),I===i.UNSIGNED_BYTE&&(q=gt===le?i.SRGB8_ALPHA8:i.RGBA8),I===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),I===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function y(_,x){let I;return _?x===null||x===si||x===Xi?I=i.DEPTH24_STENCIL8:x===fn?I=i.DEPTH32F_STENCIL8:x===_r&&(I=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===si||x===Xi?I=i.DEPTH_COMPONENT24:x===fn?I=i.DEPTH_COMPONENT32F:x===_r&&(I=i.DEPTH_COMPONENT16),I}function U(_,x){return m(_)===!0||_.isFramebufferTexture&&_.minFilter!==qe&&_.minFilter!==hn?Math.log2(Math.max(x.width,x.height))+1:_.mipmaps!==void 0&&_.mipmaps.length>0?_.mipmaps.length:_.isCompressedTexture&&Array.isArray(_.image)?x.mipmaps.length:1}function R(_){const x=_.target;x.removeEventListener("dispose",R),P(x),x.isVideoTexture&&u.delete(x)}function w(_){const x=_.target;x.removeEventListener("dispose",w),S(x)}function P(_){const x=n.get(_);if(x.__webglInit===void 0)return;const I=_.source,O=p.get(I);if(O){const K=O[x.__cacheKey];K.usedTimes--,K.usedTimes===0&&b(_),Object.keys(O).length===0&&p.delete(I)}n.remove(_)}function b(_){const x=n.get(_);i.deleteTexture(x.__webglTexture);const I=_.source,O=p.get(I);delete O[x.__cacheKey],o.memory.textures--}function S(_){const x=n.get(_);if(_.depthTexture&&(_.depthTexture.dispose(),n.remove(_.depthTexture)),_.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(x.__webglFramebuffer[O]))for(let K=0;K<x.__webglFramebuffer[O].length;K++)i.deleteFramebuffer(x.__webglFramebuffer[O][K]);else i.deleteFramebuffer(x.__webglFramebuffer[O]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[O])}else{if(Array.isArray(x.__webglFramebuffer))for(let O=0;O<x.__webglFramebuffer.length;O++)i.deleteFramebuffer(x.__webglFramebuffer[O]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let O=0;O<x.__webglColorRenderbuffer.length;O++)x.__webglColorRenderbuffer[O]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[O]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const I=_.textures;for(let O=0,K=I.length;O<K;O++){const q=n.get(I[O]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(I[O])}n.remove(_)}let C=0;function V(){C=0}function k(){const _=C;return _>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+_+" texture units while this GPU supports only "+r.maxTextures),C+=1,_}function z(_){const x=[];return x.push(_.wrapS),x.push(_.wrapT),x.push(_.wrapR||0),x.push(_.magFilter),x.push(_.minFilter),x.push(_.anisotropy),x.push(_.internalFormat),x.push(_.format),x.push(_.type),x.push(_.generateMipmaps),x.push(_.premultiplyAlpha),x.push(_.flipY),x.push(_.unpackAlignment),x.push(_.colorSpace),x.join()}function st(_,x){const I=n.get(_);if(_.isVideoTexture&&lt(_),_.isRenderTargetTexture===!1&&_.version>0&&I.__version!==_.version){const O=_.image;if(O===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(I,_,x);return}}e.bindTexture(i.TEXTURE_2D,I.__webglTexture,i.TEXTURE0+x)}function X(_,x){const I=n.get(_);if(_.version>0&&I.__version!==_.version){Y(I,_,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,I.__webglTexture,i.TEXTURE0+x)}function W(_,x){const I=n.get(_);if(_.version>0&&I.__version!==_.version){Y(I,_,x);return}e.bindTexture(i.TEXTURE_3D,I.__webglTexture,i.TEXTURE0+x)}function B(_,x){const I=n.get(_);if(_.version>0&&I.__version!==_.version){ut(I,_,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+x)}const et={[wo]:i.REPEAT,[ii]:i.CLAMP_TO_EDGE,[Ao]:i.MIRRORED_REPEAT},Q={[qe]:i.NEAREST,[Uu]:i.NEAREST_MIPMAP_NEAREST,[Ar]:i.NEAREST_MIPMAP_LINEAR,[hn]:i.LINEAR,[Ps]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},$={[zu]:i.NEVER,[Wu]:i.ALWAYS,[Bu]:i.LESS,[pc]:i.LEQUAL,[ku]:i.EQUAL,[Gu]:i.GEQUAL,[Vu]:i.GREATER,[Hu]:i.NOTEQUAL};function Rt(_,x){if(x.type===fn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===hn||x.magFilter===Ps||x.magFilter===Ar||x.magFilter===ri||x.minFilter===hn||x.minFilter===Ps||x.minFilter===Ar||x.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(_,i.TEXTURE_WRAP_S,et[x.wrapS]),i.texParameteri(_,i.TEXTURE_WRAP_T,et[x.wrapT]),(_===i.TEXTURE_3D||_===i.TEXTURE_2D_ARRAY)&&i.texParameteri(_,i.TEXTURE_WRAP_R,et[x.wrapR]),i.texParameteri(_,i.TEXTURE_MAG_FILTER,Q[x.magFilter]),i.texParameteri(_,i.TEXTURE_MIN_FILTER,Q[x.minFilter]),x.compareFunction&&(i.texParameteri(_,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(_,i.TEXTURE_COMPARE_FUNC,$[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===qe||x.minFilter!==Ar&&x.minFilter!==ri||x.type===fn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const I=t.get("EXT_texture_filter_anisotropic");i.texParameterf(_,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Bt(_,x){let I=!1;_.__webglInit===void 0&&(_.__webglInit=!0,x.addEventListener("dispose",R));const O=x.source;let K=p.get(O);K===void 0&&(K={},p.set(O,K));const q=z(x);if(q!==_.__cacheKey){K[q]===void 0&&(K[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,I=!0),K[q].usedTimes++;const gt=K[_.__cacheKey];gt!==void 0&&(K[_.__cacheKey].usedTimes--,gt.usedTimes===0&&b(x)),_.__cacheKey=q,_.__webglTexture=K[q].texture}return I}function Y(_,x,I){let O=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(O=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(O=i.TEXTURE_3D);const K=Bt(_,x),q=x.source;e.bindTexture(O,_.__webglTexture,i.TEXTURE0+I);const gt=n.get(q);if(q.version!==gt.__version||K===!0){e.activeTexture(i.TEXTURE0+I);const pt=te.getPrimaries(te.workingColorSpace),Tt=x.colorSpace===kn?null:te.getPrimaries(x.colorSpace),Vt=x.colorSpace===kn||pt===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let ft=v(x.image,!1,r.maxTextureSize);ft=it(x,ft);const At=s.convert(x.format,x.colorSpace),Ft=s.convert(x.type);let Ot=M(x.internalFormat,At,Ft,x.colorSpace,x.isVideoTexture);Rt(O,x);let bt;const $t=x.mipmaps,Ht=x.isVideoTexture!==!0,Yt=gt.__version===void 0||K===!0,N=q.dataReady,xt=U(x,ft);if(x.isDepthTexture)Ot=y(x.format===qi,x.type),Yt&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,Ot,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,Ot,ft.width,ft.height,0,At,Ft,null));else if(x.isDataTexture)if($t.length>0){Ht&&Yt&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,$t[0].width,$t[0].height);for(let j=0,ot=$t.length;j<ot;j++)bt=$t[j],Ht?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,At,Ft,bt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,bt.width,bt.height,0,At,Ft,bt.data);x.generateMipmaps=!1}else Ht?(Yt&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,ft.width,ft.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft.width,ft.height,At,Ft,ft.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,ft.width,ft.height,0,At,Ft,ft.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ht&&Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ot,$t[0].width,$t[0].height,ft.depth);for(let j=0,ot=$t.length;j<ot;j++)if(bt=$t[j],x.format!==sn)if(At!==null)if(Ht){if(N)if(x.layerUpdates.size>0){const wt=Ul(bt.width,bt.height,x.format,x.type);for(const Mt of x.layerUpdates){const zt=bt.data.subarray(Mt*wt/bt.data.BYTES_PER_ELEMENT,(Mt+1)*wt/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Mt,bt.width,bt.height,1,At,zt)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,bt.width,bt.height,ft.depth,At,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Ot,bt.width,bt.height,ft.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,bt.width,bt.height,ft.depth,At,Ft,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Ot,bt.width,bt.height,ft.depth,0,At,Ft,bt.data)}else{Ht&&Yt&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,$t[0].width,$t[0].height);for(let j=0,ot=$t.length;j<ot;j++)bt=$t[j],x.format!==sn?At!==null?Ht?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,At,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Ot,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,At,Ft,bt.data):e.texImage2D(i.TEXTURE_2D,j,Ot,bt.width,bt.height,0,At,Ft,bt.data)}else if(x.isDataArrayTexture)if(Ht){if(Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ot,ft.width,ft.height,ft.depth),N)if(x.layerUpdates.size>0){const j=Ul(ft.width,ft.height,x.format,x.type);for(const ot of x.layerUpdates){const wt=ft.data.subarray(ot*j/ft.data.BYTES_PER_ELEMENT,(ot+1)*j/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,ft.width,ft.height,1,At,Ft,wt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,At,Ft,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,ft.width,ft.height,ft.depth,0,At,Ft,ft.data);else if(x.isData3DTexture)Ht?(Yt&&e.texStorage3D(i.TEXTURE_3D,xt,Ot,ft.width,ft.height,ft.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,At,Ft,ft.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,ft.width,ft.height,ft.depth,0,At,Ft,ft.data);else if(x.isFramebufferTexture){if(Yt)if(Ht)e.texStorage2D(i.TEXTURE_2D,xt,Ot,ft.width,ft.height);else{let j=ft.width,ot=ft.height;for(let wt=0;wt<xt;wt++)e.texImage2D(i.TEXTURE_2D,wt,Ot,j,ot,0,At,Ft,null),j>>=1,ot>>=1}}else if($t.length>0){if(Ht&&Yt){const j=rt($t[0]);e.texStorage2D(i.TEXTURE_2D,xt,Ot,j.width,j.height)}for(let j=0,ot=$t.length;j<ot;j++)bt=$t[j],Ht?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,At,Ft,bt):e.texImage2D(i.TEXTURE_2D,j,Ot,At,Ft,bt);x.generateMipmaps=!1}else if(Ht){if(Yt){const j=rt(ft);e.texStorage2D(i.TEXTURE_2D,xt,Ot,j.width,j.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Ft,ft)}else e.texImage2D(i.TEXTURE_2D,0,Ot,At,Ft,ft);m(x)&&h(O),gt.__version=q.version,x.onUpdate&&x.onUpdate(x)}_.__version=x.version}function ut(_,x,I){if(x.image.length!==6)return;const O=Bt(_,x),K=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,_.__webglTexture,i.TEXTURE0+I);const q=n.get(K);if(K.version!==q.__version||O===!0){e.activeTexture(i.TEXTURE0+I);const gt=te.getPrimaries(te.workingColorSpace),pt=x.colorSpace===kn?null:te.getPrimaries(x.colorSpace),Tt=x.colorSpace===kn||gt===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const Vt=x.isCompressedTexture||x.image[0].isCompressedTexture,ft=x.image[0]&&x.image[0].isDataTexture,At=[];for(let ot=0;ot<6;ot++)!Vt&&!ft?At[ot]=v(x.image[ot],!0,r.maxCubemapSize):At[ot]=ft?x.image[ot].image:x.image[ot],At[ot]=it(x,At[ot]);const Ft=At[0],Ot=s.convert(x.format,x.colorSpace),bt=s.convert(x.type),$t=M(x.internalFormat,Ot,bt,x.colorSpace),Ht=x.isVideoTexture!==!0,Yt=q.__version===void 0||O===!0,N=K.dataReady;let xt=U(x,Ft);Rt(i.TEXTURE_CUBE_MAP,x);let j;if(Vt){Ht&&Yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,$t,Ft.width,Ft.height);for(let ot=0;ot<6;ot++){j=At[ot].mipmaps;for(let wt=0;wt<j.length;wt++){const Mt=j[wt];x.format!==sn?Ot!==null?Ht?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt,0,0,Mt.width,Mt.height,Ot,Mt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt,$t,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt,0,0,Mt.width,Mt.height,Ot,bt,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt,$t,Mt.width,Mt.height,0,Ot,bt,Mt.data)}}}else{if(j=x.mipmaps,Ht&&Yt){j.length>0&&xt++;const ot=rt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,$t,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(ft){Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,At[ot].width,At[ot].height,Ot,bt,At[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,$t,At[ot].width,At[ot].height,0,Ot,bt,At[ot].data);for(let wt=0;wt<j.length;wt++){const zt=j[wt].image[ot].image;Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt+1,0,0,zt.width,zt.height,Ot,bt,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt+1,$t,zt.width,zt.height,0,Ot,bt,zt.data)}}else{Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Ot,bt,At[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,$t,Ot,bt,At[ot]);for(let wt=0;wt<j.length;wt++){const Mt=j[wt];Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt+1,0,0,Ot,bt,Mt.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,wt+1,$t,Ot,bt,Mt.image[ot])}}}m(x)&&h(i.TEXTURE_CUBE_MAP),q.__version=K.version,x.onUpdate&&x.onUpdate(x)}_.__version=x.version}function mt(_,x,I,O,K,q){const gt=s.convert(I.format,I.colorSpace),pt=s.convert(I.type),Tt=M(I.internalFormat,gt,pt,I.colorSpace),Vt=n.get(x),ft=n.get(I);if(ft.__renderTarget=x,!Vt.__hasExternalTextures){const At=Math.max(1,x.width>>q),Ft=Math.max(1,x.height>>q);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,q,Tt,At,Ft,x.depth,0,gt,pt,null):e.texImage2D(K,q,Tt,At,Ft,0,gt,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,_),_t(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,O,K,ft.__webglTexture,0,tt(x)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,O,K,ft.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(_,x,I){if(i.bindRenderbuffer(i.RENDERBUFFER,_),x.depthBuffer){const O=x.depthTexture,K=O&&O.isDepthTexture?O.type:null,q=y(x.stencilBuffer,K),gt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=tt(x);_t(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt,q,x.width,x.height):I?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt,q,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,q,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,_)}else{const O=x.textures;for(let K=0;K<O.length;K++){const q=O[K],gt=s.convert(q.format,q.colorSpace),pt=s.convert(q.type),Tt=M(q.internalFormat,gt,pt,q.colorSpace),Vt=tt(x);I&&_t(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Tt,x.width,x.height):_t(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,Tt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ct(_,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,_),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const O=n.get(x.depthTexture);O.__renderTarget=x,(!O.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),st(x.depthTexture,0);const K=O.__webglTexture,q=tt(x);if(x.depthTexture.format===Bi)_t(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(x.depthTexture.format===qi)_t(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function It(_){const x=n.get(_),I=_.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==_.depthTexture){const O=_.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),O){const K=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,O.removeEventListener("dispose",K)};O.addEventListener("dispose",K),x.__depthDisposeCallback=K}x.__boundDepthTexture=O}if(_.depthTexture&&!x.__autoAllocateDepthBuffer){if(I)throw new Error("target.depthTexture not supported in Cube render targets");Ct(x.__webglFramebuffer,_)}else if(I){x.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[O]),x.__webglDepthbuffer[O]===void 0)x.__webglDepthbuffer[O]=i.createRenderbuffer(),ct(x.__webglDepthbuffer[O],_,!1);else{const K=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[O];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),ct(x.__webglDepthbuffer,_,!1);else{const O=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,O,i.RENDERBUFFER,K)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Z(_,x,I){const O=n.get(_);x!==void 0&&mt(O.__webglFramebuffer,_,_.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),I!==void 0&&It(_)}function Nt(_){const x=_.texture,I=n.get(_),O=n.get(x);_.addEventListener("dispose",w);const K=_.textures,q=_.isWebGLCubeRenderTarget===!0,gt=K.length>1;if(gt||(O.__webglTexture===void 0&&(O.__webglTexture=i.createTexture()),O.__version=x.version,o.memory.textures++),q){I.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(x.mipmaps&&x.mipmaps.length>0){I.__webglFramebuffer[pt]=[];for(let Tt=0;Tt<x.mipmaps.length;Tt++)I.__webglFramebuffer[pt][Tt]=i.createFramebuffer()}else I.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){I.__webglFramebuffer=[];for(let pt=0;pt<x.mipmaps.length;pt++)I.__webglFramebuffer[pt]=i.createFramebuffer()}else I.__webglFramebuffer=i.createFramebuffer();if(gt)for(let pt=0,Tt=K.length;pt<Tt;pt++){const Vt=n.get(K[pt]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),o.memory.textures++)}if(_.samples>0&&_t(_)===!1){I.__webglMultisampledFramebuffer=i.createFramebuffer(),I.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let pt=0;pt<K.length;pt++){const Tt=K[pt];I.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,I.__webglColorRenderbuffer[pt]);const Vt=s.convert(Tt.format,Tt.colorSpace),ft=s.convert(Tt.type),At=M(Tt.internalFormat,Vt,ft,Tt.colorSpace,_.isXRRenderTarget===!0),Ft=tt(_);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,At,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,I.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),_.depthBuffer&&(I.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(I.__webglDepthRenderbuffer,_,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture),Rt(i.TEXTURE_CUBE_MAP,x);for(let pt=0;pt<6;pt++)if(x.mipmaps&&x.mipmaps.length>0)for(let Tt=0;Tt<x.mipmaps.length;Tt++)mt(I.__webglFramebuffer[pt][Tt],_,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Tt);else mt(I.__webglFramebuffer[pt],_,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);m(x)&&h(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let pt=0,Tt=K.length;pt<Tt;pt++){const Vt=K[pt],ft=n.get(Vt);e.bindTexture(i.TEXTURE_2D,ft.__webglTexture),Rt(i.TEXTURE_2D,Vt),mt(I.__webglFramebuffer,_,Vt,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,0),m(Vt)&&h(i.TEXTURE_2D)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((_.isWebGL3DRenderTarget||_.isWebGLArrayRenderTarget)&&(pt=_.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,O.__webglTexture),Rt(pt,x),x.mipmaps&&x.mipmaps.length>0)for(let Tt=0;Tt<x.mipmaps.length;Tt++)mt(I.__webglFramebuffer[Tt],_,x,i.COLOR_ATTACHMENT0,pt,Tt);else mt(I.__webglFramebuffer,_,x,i.COLOR_ATTACHMENT0,pt,0);m(x)&&h(pt),e.unbindTexture()}_.depthBuffer&&It(_)}function J(_){const x=_.textures;for(let I=0,O=x.length;I<O;I++){const K=x[I];if(m(K)){const q=T(_),gt=n.get(K).__webglTexture;e.bindTexture(q,gt),h(q),e.unbindTexture()}}}const at=[],A=[];function ht(_){if(_.samples>0){if(_t(_)===!1){const x=_.textures,I=_.width,O=_.height;let K=i.COLOR_BUFFER_BIT;const q=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(_),pt=x.length>1;if(pt)for(let Tt=0;Tt<x.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let Tt=0;Tt<x.length;Tt++){if(_.resolveDepthBuffer&&(_.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),_.stencilBuffer&&_.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[Tt]);const Vt=n.get(x[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Vt,0)}i.blitFramebuffer(0,0,I,O,0,0,I,O,K,i.NEAREST),l===!0&&(at.length=0,A.length=0,at.push(i.COLOR_ATTACHMENT0+Tt),_.depthBuffer&&_.resolveDepthBuffer===!1&&(at.push(q),A.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,A)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let Tt=0;Tt<x.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,gt.__webglColorRenderbuffer[Tt]);const Vt=n.get(x[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(_.depthBuffer&&_.resolveDepthBuffer===!1&&l){const x=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function tt(_){return Math.min(r.maxSamples,_.samples)}function _t(_){const x=n.get(_);return _.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function lt(_){const x=o.render.frame;u.get(_)!==x&&(u.set(_,x),_.update())}function it(_,x){const I=_.colorSpace,O=_.format,K=_.type;return _.isCompressedTexture===!0||_.isVideoTexture===!0||I!==Zi&&I!==kn&&(te.getTransfer(I)===le?(O!==sn||K!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",I)),x}function rt(_){return typeof HTMLImageElement<"u"&&_ instanceof HTMLImageElement?(c.width=_.naturalWidth||_.width,c.height=_.naturalHeight||_.height):typeof VideoFrame<"u"&&_ instanceof VideoFrame?(c.width=_.displayWidth,c.height=_.displayHeight):(c.width=_.width,c.height=_.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=V,this.setTexture2D=st,this.setTexture2DArray=X,this.setTexture3D=W,this.setTextureCube=B,this.rebindTextures=Z,this.setupRenderTarget=Nt,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=_t}function $m(i,t){function e(n,r=kn){let s;const o=te.getTransfer(r);if(n===An)return i.UNSIGNED_BYTE;if(n===ha)return i.UNSIGNED_SHORT_4_4_4_4;if(n===fa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ac)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===sc)return i.BYTE;if(n===oc)return i.SHORT;if(n===_r)return i.UNSIGNED_SHORT;if(n===ua)return i.INT;if(n===si)return i.UNSIGNED_INT;if(n===fn)return i.FLOAT;if(n===Sr)return i.HALF_FLOAT;if(n===lc)return i.ALPHA;if(n===cc)return i.RGB;if(n===sn)return i.RGBA;if(n===uc)return i.LUMINANCE;if(n===hc)return i.LUMINANCE_ALPHA;if(n===Bi)return i.DEPTH_COMPONENT;if(n===qi)return i.DEPTH_STENCIL;if(n===da)return i.RED;if(n===pa)return i.RED_INTEGER;if(n===fc)return i.RG;if(n===ma)return i.RG_INTEGER;if(n===ga)return i.RGBA_INTEGER;if(n===as||n===ls||n===cs||n===us)if(o===le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===as)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ls)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===cs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===us)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===as)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ls)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===cs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===us)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ro||n===Co||n===Po||n===Lo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ro)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Co)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Po)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Lo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Do||n===Uo||n===Io)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Do||n===Uo)return o===le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Io)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===No||n===Fo||n===Oo||n===zo||n===Bo||n===ko||n===Vo||n===Ho||n===Go||n===Wo||n===Xo||n===qo||n===Yo||n===Zo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===No)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Oo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===zo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ko)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Vo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ho)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Go)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===qo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Zo)return o===le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===hs||n===Ko||n===$o)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===hs)return o===le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ko)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===$o)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dc||n===Jo||n===jo||n===Qo)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===hs)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Jo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===jo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Jm extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Je extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jm={type:"move"};class so{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),h=this._getHandJoint(c,v);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&p>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(jm)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Qm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class e0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const r=new Ie,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new fe({vertexShader:Qm,fragmentShader:t0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new Ji(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class n0 extends Ki{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,p=null,d=null,g=null;const v=new e0,m=e.getContextAttributes();let h=null,T=null;const M=[],y=[],U=new vt;let R=null;const w=new Xe;w.viewport=new he;const P=new Xe;P.viewport=new he;const b=[w,P],S=new Jm;let C=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ut=M[Y];return ut===void 0&&(ut=new so,M[Y]=ut),ut.getTargetRaySpace()},this.getControllerGrip=function(Y){let ut=M[Y];return ut===void 0&&(ut=new so,M[Y]=ut),ut.getGripSpace()},this.getHand=function(Y){let ut=M[Y];return ut===void 0&&(ut=new so,M[Y]=ut),ut.getHandSpace()};function k(Y){const ut=y.indexOf(Y.inputSource);if(ut===-1)return;const mt=M[ut];mt!==void 0&&(mt.update(Y.inputSource,Y.frame,c||o),mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function z(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",st);for(let Y=0;Y<M.length;Y++){const ut=y[Y];ut!==null&&(y[Y]=null,M[Y].disconnect(ut))}C=null,V=null,v.reset(),t.setRenderTarget(h),d=null,p=null,f=null,r=null,T=null,Bt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(U.width,U.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(h=t.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",z),r.addEventListener("inputsourceschange",st),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(U),r.renderState.layers===void 0){const ut={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,e,ut),r.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),T=new oi(d.framebufferWidth,d.framebufferHeight,{format:sn,type:An,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let ut=null,mt=null,ct=null;m.depth&&(ct=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ut=m.stencil?qi:Bi,mt=m.stencil?Xi:si);const Ct={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:s};f=new XRWebGLBinding(r,e),p=f.createProjectionLayer(Ct),r.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),T=new oi(p.textureWidth,p.textureHeight,{format:sn,type:An,depthTexture:new Ac(p.textureWidth,p.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,ut),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Bt.setContext(r),Bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function st(Y){for(let ut=0;ut<Y.removed.length;ut++){const mt=Y.removed[ut],ct=y.indexOf(mt);ct>=0&&(y[ct]=null,M[ct].disconnect(mt))}for(let ut=0;ut<Y.added.length;ut++){const mt=Y.added[ut];let ct=y.indexOf(mt);if(ct===-1){for(let It=0;It<M.length;It++)if(It>=y.length){y.push(mt),ct=It;break}else if(y[It]===null){y[It]=mt,ct=It;break}if(ct===-1)break}const Ct=M[ct];Ct&&Ct.connect(mt)}}const X=new L,W=new L;function B(Y,ut,mt){X.setFromMatrixPosition(ut.matrixWorld),W.setFromMatrixPosition(mt.matrixWorld);const ct=X.distanceTo(W),Ct=ut.projectionMatrix.elements,It=mt.projectionMatrix.elements,Z=Ct[14]/(Ct[10]-1),Nt=Ct[14]/(Ct[10]+1),J=(Ct[9]+1)/Ct[5],at=(Ct[9]-1)/Ct[5],A=(Ct[8]-1)/Ct[0],ht=(It[8]+1)/It[0],tt=Z*A,_t=Z*ht,lt=ct/(-A+ht),it=lt*-A;if(ut.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(it),Y.translateZ(lt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ct[10]===-1)Y.projectionMatrix.copy(ut.projectionMatrix),Y.projectionMatrixInverse.copy(ut.projectionMatrixInverse);else{const rt=Z+lt,_=Nt+lt,x=tt-it,I=_t+(ct-it),O=J*Nt/_*rt,K=at*Nt/_*rt;Y.projectionMatrix.makePerspective(x,I,O,K,rt,_),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function et(Y,ut){ut===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ut.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let ut=Y.near,mt=Y.far;v.texture!==null&&(v.depthNear>0&&(ut=v.depthNear),v.depthFar>0&&(mt=v.depthFar)),S.near=P.near=w.near=ut,S.far=P.far=w.far=mt,(C!==S.near||V!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),C=S.near,V=S.far),w.layers.mask=Y.layers.mask|2,P.layers.mask=Y.layers.mask|4,S.layers.mask=w.layers.mask|P.layers.mask;const ct=Y.parent,Ct=S.cameras;et(S,ct);for(let It=0;It<Ct.length;It++)et(Ct[It],ct);Ct.length===2?B(S,w,P):S.projectionMatrix.copy(w.projectionMatrix),Q(Y,S,ct)};function Q(Y,ut,mt){mt===null?Y.matrix.copy(ut.matrixWorld):(Y.matrix.copy(mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ut.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ut.projectionMatrix),Y.projectionMatrixInverse.copy(ut.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ea*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(p===null&&d===null))return l},this.setFoveation=function(Y){l=Y,p!==null&&(p.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let $=null;function Rt(Y,ut){if(u=ut.getViewerPose(c||o),g=ut,u!==null){const mt=u.views;d!==null&&(t.setRenderTargetFramebuffer(T,d.framebuffer),t.setRenderTarget(T));let ct=!1;mt.length!==S.cameras.length&&(S.cameras.length=0,ct=!0);for(let It=0;It<mt.length;It++){const Z=mt[It];let Nt=null;if(d!==null)Nt=d.getViewport(Z);else{const at=f.getViewSubImage(p,Z);Nt=at.viewport,It===0&&(t.setRenderTargetTextures(T,at.colorTexture,p.ignoreDepthValues?void 0:at.depthStencilTexture),t.setRenderTarget(T))}let J=b[It];J===void 0&&(J=new Xe,J.layers.enable(It),J.viewport=new he,b[It]=J),J.matrix.fromArray(Z.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Z.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Nt.x,Nt.y,Nt.width,Nt.height),It===0&&(S.matrix.copy(J.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ct===!0&&S.cameras.push(J)}const Ct=r.enabledFeatures;if(Ct&&Ct.includes("depth-sensing")){const It=f.getDepthInformation(mt[0]);It&&It.isValid&&It.texture&&v.init(t,It,r.renderState)}}for(let mt=0;mt<M.length;mt++){const ct=y[mt],Ct=M[mt];ct!==null&&Ct!==void 0&&Ct.update(ct,ut,c||o)}$&&$(Y,ut),ut.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ut}),g=null}const Bt=new wc;Bt.setAnimationLoop(Rt),this.setAnimationLoop=function(Y){$=Y},this.dispose=function(){}}}const Jn=new Rn,i0=new ue;function r0(i,t){function e(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,Sc(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function r(m,h,T,M,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(m,h):h.isMeshToonMaterial?(s(m,h),f(m,h)):h.isMeshPhongMaterial?(s(m,h),u(m,h)):h.isMeshStandardMaterial?(s(m,h),p(m,h),h.isMeshPhysicalMaterial&&d(m,h,y)):h.isMeshMatcapMaterial?(s(m,h),g(m,h)):h.isMeshDepthMaterial?s(m,h):h.isMeshDistanceMaterial?(s(m,h),v(m,h)):h.isMeshNormalMaterial?s(m,h):h.isLineBasicMaterial?(o(m,h),h.isLineDashedMaterial&&a(m,h)):h.isPointsMaterial?l(m,h,T,M):h.isSpriteMaterial?c(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,e(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===Ue&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,e(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===Ue&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,e(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,e(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,e(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const T=t.get(h),M=T.envMap,y=T.envMapRotation;M&&(m.envMap.value=M,Jn.copy(y),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),m.envMapRotation.value.setFromMatrix4(i0.makeRotationFromEuler(Jn)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,e(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,e(h.aoMap,m.aoMapTransform))}function o(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform))}function a(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,T,M){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*T,m.scale.value=M*.5,h.map&&(m.map.value=h.map,e(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function f(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function p(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,e(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,e(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function d(m,h,T){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,e(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,e(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,e(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,e(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,e(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Ue&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,e(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,e(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,e(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,e(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,e(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,e(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,e(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function v(m,h){const T=t.get(h).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function s0(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,M){const y=M.program;n.uniformBlockBinding(T,y)}function c(T,M){let y=r[T.id];y===void 0&&(g(T),y=u(T),r[T.id]=y,T.addEventListener("dispose",m));const U=M.program;n.updateUBOMapping(T,U);const R=t.render.frame;s[T.id]!==R&&(p(T),s[T.id]=R)}function u(T){const M=f();T.__bindingPointIndex=M;const y=i.createBuffer(),U=T.__size,R=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,U,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,y),y}function f(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(T){const M=r[T.id],y=T.uniforms,U=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let R=0,w=y.length;R<w;R++){const P=Array.isArray(y[R])?y[R]:[y[R]];for(let b=0,S=P.length;b<S;b++){const C=P[b];if(d(C,R,b,U)===!0){const V=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let st=0;st<k.length;st++){const X=k[st],W=v(X);typeof X=="number"||typeof X=="boolean"?(C.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,V+z,C.__data)):X.isMatrix3?(C.__data[0]=X.elements[0],C.__data[1]=X.elements[1],C.__data[2]=X.elements[2],C.__data[3]=0,C.__data[4]=X.elements[3],C.__data[5]=X.elements[4],C.__data[6]=X.elements[5],C.__data[7]=0,C.__data[8]=X.elements[6],C.__data[9]=X.elements[7],C.__data[10]=X.elements[8],C.__data[11]=0):(X.toArray(C.__data,z),z+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(T,M,y,U){const R=T.value,w=M+"_"+y;if(U[w]===void 0)return typeof R=="number"||typeof R=="boolean"?U[w]=R:U[w]=R.clone(),!0;{const P=U[w];if(typeof R=="number"||typeof R=="boolean"){if(P!==R)return U[w]=R,!0}else if(P.equals(R)===!1)return P.copy(R),!0}return!1}function g(T){const M=T.uniforms;let y=0;const U=16;for(let w=0,P=M.length;w<P;w++){const b=Array.isArray(M[w])?M[w]:[M[w]];for(let S=0,C=b.length;S<C;S++){const V=b[S],k=Array.isArray(V.value)?V.value:[V.value];for(let z=0,st=k.length;z<st;z++){const X=k[z],W=v(X),B=y%U,et=B%W.boundary,Q=B+et;y+=et,Q!==0&&U-Q<W.storage&&(y+=U-Q),V.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=W.storage}}}const R=y%U;return R>0&&(y+=U-R),T.__size=y,T.__cache={},this}function v(T){const M={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(M.boundary=4,M.storage=4):T.isVector2?(M.boundary=8,M.storage=8):T.isVector3||T.isColor?(M.boundary=16,M.storage=12):T.isVector4?(M.boundary=16,M.storage=16):T.isMatrix3?(M.boundary=48,M.storage=48):T.isMatrix4?(M.boundary=64,M.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),M}function m(T){const M=T.target;M.removeEventListener("dispose",m);const y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function h(){for(const T in r)i.deleteBuffer(r[T]);o=[],r={},s={}}return{bind:l,update:c,dispose:h}}class o0{constructor(t={}){const{canvas:e=qu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,h=null;const T=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=Hn,this.toneMappingExposure=1;const y=this;let U=!1,R=0,w=0,P=null,b=-1,S=null;const C=new he,V=new he;let k=null;const z=new Kt(0);let st=0,X=e.width,W=e.height,B=1,et=null,Q=null;const $=new he(0,0,X,W),Rt=new he(0,0,X,W);let Bt=!1;const Y=new Tc;let ut=!1,mt=!1;const ct=new ue,Ct=new ue,It=new L,Z=new he,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function at(){return P===null?B:1}let A=n;function ht(E,F){return e.getContext(E,F)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ca}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),A===null){const F="webgl2";if(A=ht(F,E),A===null)throw ht(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let tt,_t,lt,it,rt,_,x,I,O,K,q,gt,pt,Tt,Vt,ft,At,Ft,Ot,bt,$t,Ht,Yt,N;function xt(){tt=new hp(A),tt.init(),Ht=new $m(A,tt),_t=new rp(A,tt,t,Ht),lt=new Ym(A,tt),_t.reverseDepthBuffer&&p&&lt.buffers.depth.setReversed(!0),it=new pp(A),rt=new Dm,_=new Km(A,tt,lt,rt,_t,Ht,it),x=new op(y),I=new up(y),O=new xh(A),Yt=new np(A,O),K=new fp(A,O,it,Yt),q=new gp(A,K,O,it),Ot=new mp(A,_t,_),ft=new sp(rt),gt=new Lm(y,x,I,tt,_t,Yt,ft),pt=new r0(y,rt),Tt=new Im,Vt=new km(tt),Ft=new ep(y,x,I,lt,q,d,l),At=new Xm(y,q,_t),N=new s0(A,it,_t,lt),bt=new ip(A,tt,it),$t=new dp(A,tt,it),it.programs=gt.programs,y.capabilities=_t,y.extensions=tt,y.properties=rt,y.renderLists=Tt,y.shadowMap=At,y.state=lt,y.info=it}xt();const j=new n0(y,A);this.xr=j,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const E=tt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=tt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(E){E!==void 0&&(B=E,this.setSize(X,W,!1))},this.getSize=function(E){return E.set(X,W)},this.setSize=function(E,F,G=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=E,W=F,e.width=Math.floor(E*B),e.height=Math.floor(F*B),G===!0&&(e.style.width=E+"px",e.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(X*B,W*B).floor()},this.setDrawingBufferSize=function(E,F,G){X=E,W=F,B=G,e.width=Math.floor(E*G),e.height=Math.floor(F*G),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(C)},this.getViewport=function(E){return E.copy($)},this.setViewport=function(E,F,G,H){E.isVector4?$.set(E.x,E.y,E.z,E.w):$.set(E,F,G,H),lt.viewport(C.copy($).multiplyScalar(B).round())},this.getScissor=function(E){return E.copy(Rt)},this.setScissor=function(E,F,G,H){E.isVector4?Rt.set(E.x,E.y,E.z,E.w):Rt.set(E,F,G,H),lt.scissor(V.copy(Rt).multiplyScalar(B).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(E){lt.setScissorTest(Bt=E)},this.setOpaqueSort=function(E){et=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor.apply(Ft,arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha.apply(Ft,arguments)},this.clear=function(E=!0,F=!0,G=!0){let H=0;if(E){let D=!1;if(P!==null){const dt=P.texture.format;D=dt===ga||dt===ma||dt===pa}if(D){const dt=P.texture.type,St=dt===An||dt===si||dt===_r||dt===Xi||dt===ha||dt===fa,Lt=Ft.getClearColor(),Et=Ft.getClearAlpha(),kt=Lt.r,Gt=Lt.g,Dt=Lt.b;St?(g[0]=kt,g[1]=Gt,g[2]=Dt,g[3]=Et,A.clearBufferuiv(A.COLOR,0,g)):(v[0]=kt,v[1]=Gt,v[2]=Dt,v[3]=Et,A.clearBufferiv(A.COLOR,0,v))}else H|=A.COLOR_BUFFER_BIT}F&&(H|=A.DEPTH_BUFFER_BIT),G&&(H|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),Tt.dispose(),Vt.dispose(),rt.dispose(),x.dispose(),I.dispose(),q.dispose(),Yt.dispose(),N.dispose(),gt.dispose(),j.dispose(),j.removeEventListener("sessionstart",Qi),j.removeEventListener("sessionend",tr),on.stop()};function ot(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const E=it.autoReset,F=At.enabled,G=At.autoUpdate,H=At.needsUpdate,D=At.type;xt(),it.autoReset=E,At.enabled=F,At.autoUpdate=G,At.needsUpdate=H,At.type=D}function Mt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function zt(E){const F=E.target;F.removeEventListener("dispose",zt),ie(F)}function ie(E){ve(E),rt.remove(E)}function ve(E){const F=rt.get(E).programs;F!==void 0&&(F.forEach(function(G){gt.releaseProgram(G)}),E.isShaderMaterial&&gt.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,G,H,D,dt){F===null&&(F=Nt);const St=D.isMesh&&D.matrixWorld.determinant()<0,Lt=ee(E,F,G,H,D);lt.setMaterial(H,St);let Et=G.index,kt=1;if(H.wireframe===!0){if(Et=K.getWireframeAttribute(G),Et===void 0)return;kt=2}const Gt=G.drawRange,Dt=G.attributes.position;let Jt=Gt.start*kt,ae=(Gt.start+Gt.count)*kt;dt!==null&&(Jt=Math.max(Jt,dt.start*kt),ae=Math.min(ae,(dt.start+dt.count)*kt)),Et!==null?(Jt=Math.max(Jt,0),ae=Math.min(ae,Et.count)):Dt!=null&&(Jt=Math.max(Jt,0),ae=Math.min(ae,Dt.count));const Xt=ae-Jt;if(Xt<0||Xt===1/0)return;Yt.setup(D,H,Lt,G,Et);let me,Qt=bt;if(Et!==null&&(me=O.get(Et),Qt=$t,Qt.setIndex(me)),D.isMesh)H.wireframe===!0?(lt.setLineWidth(H.wireframeLinewidth*at()),Qt.setMode(A.LINES)):Qt.setMode(A.TRIANGLES);else if(D.isLine){let Ut=H.linewidth;Ut===void 0&&(Ut=1),lt.setLineWidth(Ut*at()),D.isLineSegments?Qt.setMode(A.LINES):D.isLineLoop?Qt.setMode(A.LINE_LOOP):Qt.setMode(A.LINE_STRIP)}else D.isPoints?Qt.setMode(A.POINTS):D.isSprite&&Qt.setMode(A.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)Qt.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Qt.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{const Ut=D._multiDrawStarts,ke=D._multiDrawCounts,ne=D._multiDrawCount,Ve=Et?O.get(Et).bytesPerElement:1,an=rt.get(H).currentProgram.getUniforms();for(let we=0;we<ne;we++)an.setValue(A,"_gl_DrawID",we),Qt.render(Ut[we]/Ve,ke[we])}else if(D.isInstancedMesh)Qt.renderInstances(Jt,Xt,D.count);else if(G.isInstancedBufferGeometry){const Ut=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ke=Math.min(G.instanceCount,Ut);Qt.renderInstances(Jt,Xt,ke)}else Qt.render(Jt,Xt)};function jt(E,F,G){E.transparent===!0&&E.side===Ke&&E.forceSinglePass===!1?(E.side=Ue,E.needsUpdate=!0,mn(E,F,G),E.side=dn,E.needsUpdate=!0,mn(E,F,G),E.side=Ke):mn(E,F,G)}this.compile=function(E,F,G=null){G===null&&(G=E),h=Vt.get(G),h.init(F),M.push(h),G.traverseVisible(function(D){D.isLight&&D.layers.test(F.layers)&&(h.pushLight(D),D.castShadow&&h.pushShadow(D))}),E!==G&&E.traverseVisible(function(D){D.isLight&&D.layers.test(F.layers)&&(h.pushLight(D),D.castShadow&&h.pushShadow(D))}),h.setupLights();const H=new Set;return E.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;const dt=D.material;if(dt)if(Array.isArray(dt))for(let St=0;St<dt.length;St++){const Lt=dt[St];jt(Lt,G,D),H.add(Lt)}else jt(dt,G,D),H.add(dt)}),M.pop(),h=null,H},this.compileAsync=function(E,F,G=null){const H=this.compile(E,F,G);return new Promise(D=>{function dt(){if(H.forEach(function(St){rt.get(St).currentProgram.isReady()&&H.delete(St)}),H.size===0){D(E);return}setTimeout(dt,10)}tt.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let de=null;function Te(E){de&&de(E)}function Qi(){on.stop()}function tr(){on.start()}const on=new wc;on.setAnimationLoop(Te),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(E){de=E,j.setAnimationLoop(E),E===null?on.stop():on.start()},j.addEventListener("sessionstart",Qi),j.addEventListener("sessionend",tr),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,F,P),h=Vt.get(E,M.length),h.init(F),M.push(h),Ct.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Y.setFromProjectionMatrix(Ct),mt=this.localClippingEnabled,ut=ft.init(this.clippingPlanes,mt),m=Tt.get(E,T.length),m.init(),T.push(m),j.enabled===!0&&j.isPresenting===!0){const dt=y.xr.getDepthSensingMesh();dt!==null&&hi(dt,F,-1/0,y.sortObjects)}hi(E,F,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(et,Q),J=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,J&&Ft.addToRenderList(m,E),this.info.render.frame++,ut===!0&&ft.beginShadows();const G=h.state.shadowsArray;At.render(G,E,F),ut===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,D=m.transmissive;if(h.setupLights(),F.isArrayCamera){const dt=F.cameras;if(D.length>0)for(let St=0,Lt=dt.length;St<Lt;St++){const Et=dt[St];Wn(H,D,E,Et)}J&&Ft.render(E);for(let St=0,Lt=dt.length;St<Lt;St++){const Et=dt[St];Gn(m,E,Et,Et.viewport)}}else D.length>0&&Wn(H,D,E,F),J&&Ft.render(E),Gn(m,E,F);P!==null&&(_.updateMultisampleRenderTarget(P),_.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(y,E,F),Yt.resetDefaultState(),b=-1,S=null,M.pop(),M.length>0?(h=M[M.length-1],ut===!0&&ft.setGlobalState(y.clippingPlanes,h.state.camera)):h=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function hi(E,F,G,H){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)h.pushLight(E),E.castShadow&&h.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Y.intersectsSprite(E)){H&&Z.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ct);const St=q.update(E),Lt=E.material;Lt.visible&&m.push(E,St,Lt,G,Z.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Y.intersectsObject(E))){const St=q.update(E),Lt=E.material;if(H&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Z.copy(E.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Z.copy(St.boundingSphere.center)),Z.applyMatrix4(E.matrixWorld).applyMatrix4(Ct)),Array.isArray(Lt)){const Et=St.groups;for(let kt=0,Gt=Et.length;kt<Gt;kt++){const Dt=Et[kt],Jt=Lt[Dt.materialIndex];Jt&&Jt.visible&&m.push(E,St,Jt,G,Z.z,Dt)}}else Lt.visible&&m.push(E,St,Lt,G,Z.z,null)}}const dt=E.children;for(let St=0,Lt=dt.length;St<Lt;St++)hi(dt[St],F,G,H)}function Gn(E,F,G,H){const D=E.opaque,dt=E.transmissive,St=E.transparent;h.setupLightsView(G),ut===!0&&ft.setGlobalState(y.clippingPlanes,G),H&&lt.viewport(C.copy(H)),D.length>0&&Pn(D,F,G),dt.length>0&&Pn(dt,F,G),St.length>0&&Pn(St,F,G),lt.buffers.depth.setTest(!0),lt.buffers.depth.setMask(!0),lt.buffers.color.setMask(!0),lt.setPolygonOffset(!1)}function Wn(E,F,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[H.id]===void 0&&(h.state.transmissionRenderTarget[H.id]=new oi(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?Sr:An,minFilter:ri,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace}));const dt=h.state.transmissionRenderTarget[H.id],St=H.viewport||C;dt.setSize(St.z,St.w);const Lt=y.getRenderTarget();y.setRenderTarget(dt),y.getClearColor(z),st=y.getClearAlpha(),st<1&&y.setClearColor(16777215,.5),y.clear(),J&&Ft.render(G);const Et=y.toneMapping;y.toneMapping=Hn;const kt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),h.setupLightsView(H),ut===!0&&ft.setGlobalState(y.clippingPlanes,H),Pn(E,G,H),_.updateMultisampleRenderTarget(dt),_.updateRenderTargetMipmap(dt),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Dt=0,Jt=F.length;Dt<Jt;Dt++){const ae=F[Dt],Xt=ae.object,me=ae.geometry,Qt=ae.material,Ut=ae.group;if(Qt.side===Ke&&Xt.layers.test(H.layers)){const ke=Qt.side;Qt.side=Ue,Qt.needsUpdate=!0,br(Xt,G,H,me,Qt,Ut),Qt.side=ke,Qt.needsUpdate=!0,Gt=!0}}Gt===!0&&(_.updateMultisampleRenderTarget(dt),_.updateRenderTargetMipmap(dt))}y.setRenderTarget(Lt),y.setClearColor(z,st),kt!==void 0&&(H.viewport=kt),y.toneMapping=Et}function Pn(E,F,G){const H=F.isScene===!0?F.overrideMaterial:null;for(let D=0,dt=E.length;D<dt;D++){const St=E[D],Lt=St.object,Et=St.geometry,kt=H===null?St.material:H,Gt=St.group;Lt.layers.test(G.layers)&&br(Lt,F,G,Et,kt,Gt)}}function br(E,F,G,H,D,dt){E.onBeforeRender(y,F,G,H,D,dt),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),D.onBeforeRender(y,F,G,H,E,dt),D.transparent===!0&&D.side===Ke&&D.forceSinglePass===!1?(D.side=Ue,D.needsUpdate=!0,y.renderBufferDirect(G,F,H,D,E,dt),D.side=dn,D.needsUpdate=!0,y.renderBufferDirect(G,F,H,D,E,dt),D.side=Ke):y.renderBufferDirect(G,F,H,D,E,dt),E.onAfterRender(y,F,G,H,D,dt)}function mn(E,F,G){F.isScene!==!0&&(F=Nt);const H=rt.get(E),D=h.state.lights,dt=h.state.shadowsArray,St=D.state.version,Lt=gt.getParameters(E,D.state,dt,F,G),Et=gt.getProgramCacheKey(Lt);let kt=H.programs;H.environment=E.isMeshStandardMaterial?F.environment:null,H.fog=F.fog,H.envMap=(E.isMeshStandardMaterial?I:x).get(E.envMap||H.environment),H.envMapRotation=H.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,kt===void 0&&(E.addEventListener("dispose",zt),kt=new Map,H.programs=kt);let Gt=kt.get(Et);if(Gt!==void 0){if(H.currentProgram===Gt&&H.lightsStateVersion===St)return Pt(E,Lt),Gt}else Lt.uniforms=gt.getUniforms(E),E.onBeforeCompile(Lt,y),Gt=gt.acquireProgram(Lt,Et),kt.set(Et,Gt),H.uniforms=Lt.uniforms;const Dt=H.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Dt.clippingPlanes=ft.uniform),Pt(E,Lt),H.needsLights=Ce(E),H.lightsStateVersion=St,H.needsLights&&(Dt.ambientLightColor.value=D.state.ambient,Dt.lightProbe.value=D.state.probe,Dt.directionalLights.value=D.state.directional,Dt.directionalLightShadows.value=D.state.directionalShadow,Dt.spotLights.value=D.state.spot,Dt.spotLightShadows.value=D.state.spotShadow,Dt.rectAreaLights.value=D.state.rectArea,Dt.ltc_1.value=D.state.rectAreaLTC1,Dt.ltc_2.value=D.state.rectAreaLTC2,Dt.pointLights.value=D.state.point,Dt.pointLightShadows.value=D.state.pointShadow,Dt.hemisphereLights.value=D.state.hemi,Dt.directionalShadowMap.value=D.state.directionalShadowMap,Dt.directionalShadowMatrix.value=D.state.directionalShadowMatrix,Dt.spotShadowMap.value=D.state.spotShadowMap,Dt.spotLightMatrix.value=D.state.spotLightMatrix,Dt.spotLightMap.value=D.state.spotLightMap,Dt.pointShadowMap.value=D.state.pointShadowMap,Dt.pointShadowMatrix.value=D.state.pointShadowMatrix),H.currentProgram=Gt,H.uniformsList=null,Gt}function er(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=fs.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function Pt(E,F){const G=rt.get(E);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function ee(E,F,G,H,D){F.isScene!==!0&&(F=Nt),_.resetTextureUnits();const dt=F.fog,St=H.isMeshStandardMaterial?F.environment:null,Lt=P===null?y.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Zi,Et=(H.isMeshStandardMaterial?I:x).get(H.envMap||St),kt=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Gt=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Dt=!!G.morphAttributes.position,Jt=!!G.morphAttributes.normal,ae=!!G.morphAttributes.color;let Xt=Hn;H.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Xt=y.toneMapping);const me=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Qt=me!==void 0?me.length:0,Ut=rt.get(H),ke=h.state.lights;if(ut===!0&&(mt===!0||E!==S)){const Oe=E===S&&H.id===b;ft.setState(H,E,Oe)}let ne=!1;H.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==ke.state.version||Ut.outputColorSpace!==Lt||D.isBatchedMesh&&Ut.batching===!1||!D.isBatchedMesh&&Ut.batching===!0||D.isBatchedMesh&&Ut.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&Ut.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&Ut.instancing===!1||!D.isInstancedMesh&&Ut.instancing===!0||D.isSkinnedMesh&&Ut.skinning===!1||!D.isSkinnedMesh&&Ut.skinning===!0||D.isInstancedMesh&&Ut.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&Ut.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&Ut.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&Ut.instancingMorph===!1&&D.morphTexture!==null||Ut.envMap!==Et||H.fog===!0&&Ut.fog!==dt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==ft.numPlanes||Ut.numIntersection!==ft.numIntersection)||Ut.vertexAlphas!==kt||Ut.vertexTangents!==Gt||Ut.morphTargets!==Dt||Ut.morphNormals!==Jt||Ut.morphColors!==ae||Ut.toneMapping!==Xt||Ut.morphTargetsCount!==Qt)&&(ne=!0):(ne=!0,Ut.__version=H.version);let Ve=Ut.currentProgram;ne===!0&&(Ve=mn(H,F,D));let an=!1,we=!1,gn=!1;const re=Ve.getUniforms(),He=Ut.uniforms;if(lt.useProgram(Ve.program)&&(an=!0,we=!0,gn=!0),H.id!==b&&(b=H.id,we=!0),an||S!==E){lt.buffers.depth.getReversed()?(ct.copy(E.projectionMatrix),Zu(ct),Ku(ct),re.setValue(A,"projectionMatrix",ct)):re.setValue(A,"projectionMatrix",E.projectionMatrix),re.setValue(A,"viewMatrix",E.matrixWorldInverse);const Qe=re.map.cameraPosition;Qe!==void 0&&Qe.setValue(A,It.setFromMatrixPosition(E.matrixWorld)),_t.logarithmicDepthBuffer&&re.setValue(A,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&re.setValue(A,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,we=!0,gn=!0)}if(D.isSkinnedMesh){re.setOptional(A,D,"bindMatrix"),re.setOptional(A,D,"bindMatrixInverse");const Oe=D.skeleton;Oe&&(Oe.boneTexture===null&&Oe.computeBoneTexture(),re.setValue(A,"boneTexture",Oe.boneTexture,_))}D.isBatchedMesh&&(re.setOptional(A,D,"batchingTexture"),re.setValue(A,"batchingTexture",D._matricesTexture,_),re.setOptional(A,D,"batchingIdTexture"),re.setValue(A,"batchingIdTexture",D._indirectTexture,_),re.setOptional(A,D,"batchingColorTexture"),D._colorsTexture!==null&&re.setValue(A,"batchingColorTexture",D._colorsTexture,_));const ln=G.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&Ot.update(D,G,Ve),(we||Ut.receiveShadow!==D.receiveShadow)&&(Ut.receiveShadow=D.receiveShadow,re.setValue(A,"receiveShadow",D.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(He.envMap.value=Et,He.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&F.environment!==null&&(He.envMapIntensity.value=F.environmentIntensity),we&&(re.setValue(A,"toneMappingExposure",y.toneMappingExposure),Ut.needsLights&&oe(He,gn),dt&&H.fog===!0&&pt.refreshFogUniforms(He,dt),pt.refreshMaterialUniforms(He,H,B,W,h.state.transmissionRenderTarget[E.id]),fs.upload(A,er(Ut),He,_)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(fs.upload(A,er(Ut),He,_),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&re.setValue(A,"center",D.center),re.setValue(A,"modelViewMatrix",D.modelViewMatrix),re.setValue(A,"normalMatrix",D.normalMatrix),re.setValue(A,"modelMatrix",D.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Oe=H.uniformsGroups;for(let Qe=0,ze=Oe.length;Qe<ze;Qe++){const fi=Oe[Qe];N.update(fi,Ve),N.bind(fi,Ve)}}return Ve}function oe(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function Ce(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,F,G){rt.get(E.texture).__webglTexture=F,rt.get(E.depthTexture).__webglTexture=G;const H=rt.get(E);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=G===void 0,H.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,F){const G=rt.get(E);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,G=0){P=E,R=F,w=G;let H=!0,D=null,dt=!1,St=!1;if(E){const Et=rt.get(E);if(Et.__useDefaultFramebuffer!==void 0)lt.bindFramebuffer(A.FRAMEBUFFER,null),H=!1;else if(Et.__webglFramebuffer===void 0)_.setupRenderTarget(E);else if(Et.__hasExternalTextures)_.rebindTextures(E,rt.get(E.texture).__webglTexture,rt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Dt=E.depthTexture;if(Et.__boundDepthTexture!==Dt){if(Dt!==null&&rt.has(Dt)&&(E.width!==Dt.image.width||E.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_.setupDepthRenderbuffer(E)}}const kt=E.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(St=!0);const Gt=rt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[F])?D=Gt[F][G]:D=Gt[F],dt=!0):E.samples>0&&_.useMultisampledRTT(E)===!1?D=rt.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?D=Gt[G]:D=Gt,C.copy(E.viewport),V.copy(E.scissor),k=E.scissorTest}else C.copy($).multiplyScalar(B).floor(),V.copy(Rt).multiplyScalar(B).floor(),k=Bt;if(lt.bindFramebuffer(A.FRAMEBUFFER,D)&&H&&lt.drawBuffers(E,D),lt.viewport(C),lt.scissor(V),lt.setScissorTest(k),dt){const Et=rt.get(E.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+F,Et.__webglTexture,G)}else if(St){const Et=rt.get(E.texture),kt=F||0;A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,Et.__webglTexture,G||0,kt)}b=-1},this.readRenderTargetPixels=function(E,F,G,H,D,dt,St){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(Lt=Lt[St]),Lt){lt.bindFramebuffer(A.FRAMEBUFFER,Lt);try{const Et=E.texture,kt=Et.format,Gt=Et.type;if(!_t.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_t.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-H&&G>=0&&G<=E.height-D&&A.readPixels(F,G,H,D,Ht.convert(kt),Ht.convert(Gt),dt)}finally{const Et=P!==null?rt.get(P).__webglFramebuffer:null;lt.bindFramebuffer(A.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(E,F,G,H,D,dt,St){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(Lt=Lt[St]),Lt){const Et=E.texture,kt=Et.format,Gt=Et.type;if(!_t.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_t.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=E.width-H&&G>=0&&G<=E.height-D){lt.bindFramebuffer(A.FRAMEBUFFER,Lt);const Dt=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Dt),A.bufferData(A.PIXEL_PACK_BUFFER,dt.byteLength,A.STREAM_READ),A.readPixels(F,G,H,D,Ht.convert(kt),Ht.convert(Gt),0);const Jt=P!==null?rt.get(P).__webglFramebuffer:null;lt.bindFramebuffer(A.FRAMEBUFFER,Jt);const ae=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Yu(A,ae,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Dt),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,dt),A.deleteBuffer(Dt),A.deleteSync(ae),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,F=null,G=0){E.isTexture!==!0&&(pr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1]);const H=Math.pow(2,-G),D=Math.floor(E.image.width*H),dt=Math.floor(E.image.height*H),St=F!==null?F.x:0,Lt=F!==null?F.y:0;_.setTexture2D(E,0),A.copyTexSubImage2D(A.TEXTURE_2D,G,0,0,St,Lt,D,dt),lt.unbindTexture()},this.copyTextureToTexture=function(E,F,G=null,H=null,D=0){E.isTexture!==!0&&(pr("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,E=arguments[1],F=arguments[2],D=arguments[3]||0,G=null);let dt,St,Lt,Et,kt,Gt,Dt,Jt,ae;const Xt=E.isCompressedTexture?E.mipmaps[D]:E.image;G!==null?(dt=G.max.x-G.min.x,St=G.max.y-G.min.y,Lt=G.isBox3?G.max.z-G.min.z:1,Et=G.min.x,kt=G.min.y,Gt=G.isBox3?G.min.z:0):(dt=Xt.width,St=Xt.height,Lt=Xt.depth||1,Et=0,kt=0,Gt=0),H!==null?(Dt=H.x,Jt=H.y,ae=H.z):(Dt=0,Jt=0,ae=0);const me=Ht.convert(F.format),Qt=Ht.convert(F.type);let Ut;F.isData3DTexture?(_.setTexture3D(F,0),Ut=A.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(_.setTexture2DArray(F,0),Ut=A.TEXTURE_2D_ARRAY):(_.setTexture2D(F,0),Ut=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,F.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,F.unpackAlignment);const ke=A.getParameter(A.UNPACK_ROW_LENGTH),ne=A.getParameter(A.UNPACK_IMAGE_HEIGHT),Ve=A.getParameter(A.UNPACK_SKIP_PIXELS),an=A.getParameter(A.UNPACK_SKIP_ROWS),we=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,Xt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Xt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Et),A.pixelStorei(A.UNPACK_SKIP_ROWS,kt),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Gt);const gn=E.isDataArrayTexture||E.isData3DTexture,re=F.isDataArrayTexture||F.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const He=rt.get(E),ln=rt.get(F),Oe=rt.get(He.__renderTarget),Qe=rt.get(ln.__renderTarget);lt.bindFramebuffer(A.READ_FRAMEBUFFER,Oe.__webglFramebuffer),lt.bindFramebuffer(A.DRAW_FRAMEBUFFER,Qe.__webglFramebuffer);for(let ze=0;ze<Lt;ze++)gn&&A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,rt.get(E).__webglTexture,D,Gt+ze),E.isDepthTexture?(re&&A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,rt.get(F).__webglTexture,D,ae+ze),A.blitFramebuffer(Et,kt,dt,St,Dt,Jt,dt,St,A.DEPTH_BUFFER_BIT,A.NEAREST)):re?A.copyTexSubImage3D(Ut,D,Dt,Jt,ae+ze,Et,kt,dt,St):A.copyTexSubImage2D(Ut,D,Dt,Jt,ae+ze,Et,kt,dt,St);lt.bindFramebuffer(A.READ_FRAMEBUFFER,null),lt.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else re?E.isDataTexture||E.isData3DTexture?A.texSubImage3D(Ut,D,Dt,Jt,ae,dt,St,Lt,me,Qt,Xt.data):F.isCompressedArrayTexture?A.compressedTexSubImage3D(Ut,D,Dt,Jt,ae,dt,St,Lt,me,Xt.data):A.texSubImage3D(Ut,D,Dt,Jt,ae,dt,St,Lt,me,Qt,Xt):E.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,D,Dt,Jt,dt,St,me,Qt,Xt.data):E.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,D,Dt,Jt,Xt.width,Xt.height,me,Xt.data):A.texSubImage2D(A.TEXTURE_2D,D,Dt,Jt,dt,St,me,Qt,Xt);A.pixelStorei(A.UNPACK_ROW_LENGTH,ke),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ne),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ve),A.pixelStorei(A.UNPACK_SKIP_ROWS,an),A.pixelStorei(A.UNPACK_SKIP_IMAGES,we),D===0&&F.generateMipmaps&&A.generateMipmap(Ut),lt.unbindTexture()},this.copyTextureToTexture3D=function(E,F,G=null,H=null,D=0){return E.isTexture!==!0&&(pr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,H=arguments[1]||null,E=arguments[2],F=arguments[3],D=arguments[4]||0),pr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,F,G,H,D)},this.initRenderTarget=function(E){rt.get(E).__webglFramebuffer===void 0&&_.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?_.setTextureCube(E,0):E.isData3DTexture?_.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?_.setTexture2DArray(E,0):_.setTexture2D(E,0),lt.unbindTexture()},this.resetState=function(){R=0,w=0,P=null,lt.reset(),Yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}}class Ma{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Kt(t),this.near=e,this.far=n}clone(){return new Ma(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class a0 extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class l0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ta,this.updateRanges=[],this.version=0,this.uuid=Tn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ne=new L;class vs{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix4(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyNormalMatrix(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.transformDirection(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=un(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=un(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=un(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=un(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),r=ce(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),r=ce(r,this.array),s=ce(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new vs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Sa extends ui{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ri;const ar=new L,Ci=new L,Pi=new L,Li=new vt,lr=new vt,Dc=new ue,Zr=new L,cr=new L,Kr=new L,Il=new vt,oo=new vt,Nl=new vt;class Uc extends be{constructor(t=new Sa){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new xe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new l0(e,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new vs(n,3,0,!1)),Ri.setAttribute("uv",new vs(n,2,3,!1))}this.geometry=Ri,this.material=t,this.center=new vt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),Dc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Pi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Pi.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const o=this.center;$r(Zr.set(-.5,-.5,0),Pi,o,Ci,r,s),$r(cr.set(.5,-.5,0),Pi,o,Ci,r,s),$r(Kr.set(.5,.5,0),Pi,o,Ci,r,s),Il.set(0,0),oo.set(1,0),Nl.set(1,1);let a=t.ray.intersectTriangle(Zr,cr,Kr,!1,ar);if(a===null&&($r(cr.set(-.5,.5,0),Pi,o,Ci,r,s),oo.set(0,1),a=t.ray.intersectTriangle(Zr,Kr,cr,!1,ar),a===null))return;const l=t.ray.origin.distanceTo(ar);l<t.near||l>t.far||e.push({distance:l,point:ar.clone(),uv:$e.getInterpolation(ar,Zr,cr,Kr,Il,oo,Nl,new vt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function $r(i,t,e,n,r,s){Li.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?(lr.x=s*Li.x-r*Li.y,lr.y=r*Li.x+s*Li.y):lr.copy(Li),i.copy(t),i.x+=lr.x,i.y+=lr.y,i.applyMatrix4(Dc)}class c0 extends Ie{constructor(t=null,e=1,n=1,r,s,o,a,l,c=qe,u=qe,f,p){super(null,o,a,l,c,u,r,s,f,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _s extends pe{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Di=new ue,Fl=new ue,Jr=[],Ol=new li,u0=new ue,ur=new ge,hr=new ci;class Ea extends ge{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new _s(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,u0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new li),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Di),Ol.copy(t.boundingBox).applyMatrix4(Di),this.boundingBox.union(Ol)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ci),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Di),hr.copy(t.boundingSphere).applyMatrix4(Di),this.boundingSphere.union(hr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=t*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(t,e){const n=this.matrixWorld,r=this.count;if(ur.geometry=this.geometry,ur.material=this.material,ur.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hr.copy(this.boundingSphere),hr.applyMatrix4(n),t.ray.intersectsSphere(hr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Di),Fl.multiplyMatrices(n,Di),ur.matrixWorld=Fl,ur.raycast(t,Jr);for(let o=0,a=Jr.length;o<a;o++){const l=Jr[o];l.instanceId=s,l.object=this,e.push(l)}Jr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new _s(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new c0(new Float32Array(r*this.count),r,this.count,da,fn));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*t;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ic extends ui{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const xs=new L,ys=new L,zl=new ue,fr=new _a,jr=new ci,ao=new L,Bl=new L;class Nc extends be{constructor(t=new xe,e=new Ic){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)xs.fromBufferAttribute(e,r-1),ys.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=xs.distanceTo(ys);t.setAttribute("lineDistance",new Re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(r),jr.radius+=s,t.ray.intersectsSphere(jr)===!1)return;zl.copy(r).invert(),fr.copy(t.ray).applyMatrix4(zl);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,p=n.attributes.position;if(u!==null){const d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=d,m=g-1;v<m;v+=c){const h=u.getX(v),T=u.getX(v+1),M=Qr(this,t,fr,l,h,T);M&&e.push(M)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(d),h=Qr(this,t,fr,l,v,m);h&&e.push(h)}}else{const d=Math.max(0,o.start),g=Math.min(p.count,o.start+o.count);for(let v=d,m=g-1;v<m;v+=c){const h=Qr(this,t,fr,l,v,v+1);h&&e.push(h)}if(this.isLineLoop){const v=Qr(this,t,fr,l,g-1,d);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Qr(i,t,e,n,r,s){const o=i.geometry.attributes.position;if(xs.fromBufferAttribute(o,r),ys.fromBufferAttribute(o,s),e.distanceSqToSegment(xs,ys,ao,Bl)>n)return;ao.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ao);if(!(l<t.near||l>t.far))return{distance:l,point:Bl.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const kl=new L,Vl=new L;class h0 extends Nc{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let r=0,s=e.count;r<s;r+=2)kl.fromBufferAttribute(e,r),Vl.fromBufferAttribute(e,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+kl.distanceTo(Vl);t.setAttribute("lineDistance",new Re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class f0 extends ui{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Hl=new ue,ia=new _a,ts=new ci,es=new L;class ra extends be{constructor(t=new xe,e=new f0){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ts.copy(n.boundingSphere),ts.applyMatrix4(r),ts.radius+=s,t.ray.intersectsSphere(ts)===!1)return;Hl.copy(r).invert(),ia.copy(t.ray).applyMatrix4(Hl);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const p=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=p,v=d;g<v;g++){const m=c.getX(g);es.fromBufferAttribute(f,m),Gl(es,m,l,r,t,e,this)}}else{const p=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=p,v=d;g<v;g++)es.fromBufferAttribute(f,g),Gl(es,g,l,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Gl(i,t,e,n,r,s,o){const a=ia.distanceSqToPoint(i);if(a<e){const l=new L;ia.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class ba extends Ie{constructor(t,e,n,r,s,o,a,l,c){super(t,e,n,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let r=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=n[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===o)return r/(s-1);const u=n[r],p=n[r+1]-u,d=(o-u)/p;return(r+d)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=e||(o.isVector2?new vt:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,r=[],s=[],o=[],a=new L,l=new ue;for(let d=0;d<=t;d++){const g=d/t;r[d]=this.getTangentAt(g,new L)}s[0]=new L,o[0]=new L;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),p=Math.abs(r[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(r[d-1],r[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(De(r[d-1].dot(r[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(r[d],s[d])}if(e===!0){let d=Math.acos(De(s[0].dot(s[t]),-1,1));d/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(d=-d);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],d*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ta extends pn{constructor(t=0,e=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new vt){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=l-this.aX,d=c-this.aY;l=p*u-d*f+this.aX,c=p*f+d*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class d0 extends Ta{constructor(t,e,n,r,s,o){super(t,e,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function wa(){let i=0,t=0,e=0,n=0;function r(s,o,a,l){i=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,f){let p=(o-s)/c-(a-s)/(c+u)+(a-o)/u,d=(a-o)/u-(l-o)/(u+f)+(l-a)/f;p*=u,d*=u,r(o,a,p,d)},calc:function(s){const o=s*s,a=o*s;return i+t*s+e*o+n*a}}}const ns=new L,lo=new wa,co=new wa,uo=new wa;class Fc extends pn{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new L){const n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(ns.subVectors(r[0],r[1]).add(r[0]),c=ns);const f=r[a%s],p=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(ns.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=ns),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(u),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),lo.initNonuniformCatmullRom(c.x,f.x,p.x,u.x,g,v,m),co.initNonuniformCatmullRom(c.y,f.y,p.y,u.y,g,v,m),uo.initNonuniformCatmullRom(c.z,f.z,p.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(lo.initCatmullRom(c.x,f.x,p.x,u.x,this.tension),co.initCatmullRom(c.y,f.y,p.y,u.y,this.tension),uo.initCatmullRom(c.z,f.z,p.z,u.z,this.tension));return n.set(lo.calc(l),co.calc(l),uo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new L().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wl(i,t,e,n,r){const s=(n-t)*.5,o=(r-e)*.5,a=i*i,l=i*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*i+e}function p0(i,t){const e=1-i;return e*e*t}function m0(i,t){return 2*(1-i)*i*t}function g0(i,t){return i*i*t}function gr(i,t,e,n){return p0(i,t)+m0(i,e)+g0(i,n)}function v0(i,t){const e=1-i;return e*e*e*t}function _0(i,t){const e=1-i;return 3*e*e*i*t}function x0(i,t){return 3*(1-i)*i*i*t}function y0(i,t){return i*i*i*t}function vr(i,t,e,n,r){return v0(i,t)+_0(i,e)+x0(i,n)+y0(i,r)}class Oc extends pn{constructor(t=new vt,e=new vt,n=new vt,r=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new vt){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(vr(t,r.x,s.x,o.x,a.x),vr(t,r.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class M0 extends pn{constructor(t=new L,e=new L,n=new L,r=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new L){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(vr(t,r.x,s.x,o.x,a.x),vr(t,r.y,s.y,o.y,a.y),vr(t,r.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class zc extends pn{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class S0 extends pn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bc extends pn{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(gr(t,r.x,s.x,o.x),gr(t,r.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kc extends pn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(gr(t,r.x,s.x,o.x),gr(t,r.y,s.y,o.y),gr(t,r.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vc extends pn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){const n=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],f=r[o>r.length-3?r.length-1:o+2];return n.set(Wl(a,l.x,c.x,u.x,f.x),Wl(a,l.y,c.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new vt().fromArray(r))}return this}}var Ms=Object.freeze({__proto__:null,ArcCurve:d0,CatmullRomCurve3:Fc,CubicBezierCurve:Oc,CubicBezierCurve3:M0,EllipseCurve:Ta,LineCurve:zc,LineCurve3:S0,QuadraticBezierCurve:Bc,QuadraticBezierCurve3:kc,SplineCurve:Vc});class E0 extends pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ms[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const o=r[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new Ms[r.type]().fromJSON(r))}return this}}class sa extends E0{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new zc(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new Bc(this.currentPoint.clone(),new vt(t,e),new vt(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,o){const a=new Oc(this.currentPoint.clone(),new vt(t,e),new vt(n,r),new vt(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Vc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,r,s,o),this}absarc(t,e,n,r,s,o){return this.absellipse(t,e,n,n,r,s,o),this}ellipse(t,e,n,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,r,s,o,a,l),this}absellipse(t,e,n,r,s,o,a,l){const c=new Ta(t,e,n,r,s,o,a,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ds extends sa{constructor(t){super(t),this.uuid=Tn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new sa().fromJSON(r))}return this}}const b0={triangulate:function(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=Hc(i,0,r,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,u,f,p,d;if(n&&(s=C0(i,t,s,e)),i.length>80*e){a=c=i[0],l=u=i[1];for(let g=e;g<r;g+=e)f=i[g],p=i[g+1],f<a&&(a=f),p<l&&(l=p),f>c&&(c=f),p>u&&(u=p);d=Math.max(c-a,u-l),d=d!==0?32767/d:0}return xr(s,o,e,a,l,d,0),o}};function Hc(i,t,e,n,r){let s,o;if(r===k0(i,t,e,n)>0)for(s=t;s<e;s+=n)o=Xl(s,i[s],i[s+1],o);else for(s=e-n;s>=t;s-=n)o=Xl(s,i[s],i[s+1],o);return o&&Ts(o,o.next)&&(Mr(o),o=o.next),o}function ai(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Ts(e,e.next)||_e(e.prev,e,e.next)===0)){if(Mr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function xr(i,t,e,n,r,s,o){if(!i)return;!o&&s&&I0(i,n,r,s);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,s?w0(i,n,r,s):T0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Mr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=A0(ai(i),t,e),xr(i,t,e,n,r,s,2)):o===2&&R0(i,t,e,n,r,s):xr(ai(i),t,e,n,r,s,1);break}}}function T0(i){const t=i.prev,e=i,n=i.next;if(_e(t,e,n)>=0)return!1;const r=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=r<s?r<o?r:o:s<o?s:o,f=a<l?a<c?a:c:l<c?l:c,p=r>s?r>o?r:o:s>o?s:o,d=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=p&&g.y>=f&&g.y<=d&&Oi(r,a,s,l,o,c,g.x,g.y)&&_e(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function w0(i,t,e,n){const r=i.prev,s=i,o=i.next;if(_e(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,f=s.y,p=o.y,d=a<l?a<c?a:c:l<c?l:c,g=u<f?u<p?u:p:f<p?f:p,v=a>l?a>c?a:c:l>c?l:c,m=u>f?u>p?u:p:f>p?f:p,h=oa(d,g,t,e,n),T=oa(v,m,t,e,n);let M=i.prevZ,y=i.nextZ;for(;M&&M.z>=h&&y&&y.z<=T;){if(M.x>=d&&M.x<=v&&M.y>=g&&M.y<=m&&M!==r&&M!==o&&Oi(a,u,l,f,c,p,M.x,M.y)&&_e(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Oi(a,u,l,f,c,p,y.x,y.y)&&_e(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=h;){if(M.x>=d&&M.x<=v&&M.y>=g&&M.y<=m&&M!==r&&M!==o&&Oi(a,u,l,f,c,p,M.x,M.y)&&_e(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=T;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Oi(a,u,l,f,c,p,y.x,y.y)&&_e(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function A0(i,t,e){let n=i;do{const r=n.prev,s=n.next.next;!Ts(r,s)&&Gc(r,n,n.next,s)&&yr(r,s)&&yr(s,r)&&(t.push(r.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),Mr(n),Mr(n.next),n=i=s),n=n.next}while(n!==i);return ai(n)}function R0(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&O0(o,a)){let l=Wc(o,a);o=ai(o,o.next),l=ai(l,l.next),xr(o,t,e,n,r,s,0),xr(l,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function C0(i,t,e,n){const r=[];let s,o,a,l,c;for(s=0,o=t.length;s<o;s++)a=t[s]*n,l=s<o-1?t[s+1]*n:i.length,c=Hc(i,a,l,n,!1),c===c.next&&(c.steiner=!0),r.push(F0(c));for(r.sort(P0),s=0;s<r.length;s++)e=L0(r[s],e);return e}function P0(i,t){return i.x-t.x}function L0(i,t){const e=D0(i,t);if(!e)return t;const n=Wc(e,i);return ai(n,n.next),ai(e,e.next)}function D0(i,t){let e=t,n=-1/0,r;const s=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const p=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(p<=s&&p>n&&(n=p,r=e.x<e.next.x?e:e.next,p===s))return r}e=e.next}while(e!==t);if(!r)return null;const a=r,l=r.x,c=r.y;let u=1/0,f;e=r;do s>=e.x&&e.x>=l&&s!==e.x&&Oi(o<c?s:n,o,l,c,o<c?n:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),yr(e,i)&&(f<u||f===u&&(e.x>r.x||e.x===r.x&&U0(r,e)))&&(r=e,u=f)),e=e.next;while(e!==a);return r}function U0(i,t){return _e(i.prev,i,t.prev)<0&&_e(t.next,i,i.next)<0}function I0(i,t,e,n){let r=i;do r.z===0&&(r.z=oa(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,N0(r)}function N0(i){let t,e,n,r,s,o,a,l,c=1;do{for(e=i,i=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(r=e,e=e.nextZ,a--):(r=n,n=n.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;e=n}s.nextZ=null,c*=2}while(o>1);return i}function oa(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function F0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Oi(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function O0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!z0(i,t)&&(yr(i,t)&&yr(t,i)&&B0(i,t)&&(_e(i.prev,i,t.prev)||_e(i,t.prev,t))||Ts(i,t)&&_e(i.prev,i,i.next)>0&&_e(t.prev,t,t.next)>0)}function _e(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Ts(i,t){return i.x===t.x&&i.y===t.y}function Gc(i,t,e,n){const r=rs(_e(i,t,e)),s=rs(_e(i,t,n)),o=rs(_e(e,n,i)),a=rs(_e(e,n,t));return!!(r!==s&&o!==a||r===0&&is(i,e,t)||s===0&&is(i,n,t)||o===0&&is(e,i,n)||a===0&&is(e,t,n))}function is(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function rs(i){return i>0?1:i<0?-1:0}function z0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Gc(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function yr(i,t){return _e(i.prev,i,i.next)<0?_e(i,t,i.next)>=0&&_e(i,i.prev,t)>=0:_e(i,t,i.prev)<0||_e(i,i.next,t)<0}function B0(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Wc(i,t){const e=new aa(i.i,i.x,i.y),n=new aa(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Xl(i,t,e,n){const r=new aa(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Mr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function aa(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function k0(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}class Vi{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return Vi.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];ql(t),Yl(n,t);let o=t.length;e.forEach(ql);for(let l=0;l<e.length;l++)r.push(o),o+=e[l].length,Yl(n,e[l]);const a=b0.triangulate(n,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function ql(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Yl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Aa extends xe{constructor(t=new ds([new vt(.5,.5),new vt(-.5,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Re(r,3)),this.setAttribute("uv",new Re(s,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const h=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:V0;let M,y=!1,U,R,w,P;h&&(M=h.getSpacedPoints(u),y=!0,p=!1,U=h.computeFrenetFrames(u,!1),R=new L,w=new L,P=new L),p||(m=0,d=0,g=0,v=0);const b=a.extractPoints(c);let S=b.shape;const C=b.holes;if(!Vi.isClockWise(S)){S=S.reverse();for(let J=0,at=C.length;J<at;J++){const A=C[J];Vi.isClockWise(A)&&(C[J]=A.reverse())}}const k=Vi.triangulateShape(S,C),z=S;for(let J=0,at=C.length;J<at;J++){const A=C[J];S=S.concat(A)}function st(J,at,A){return at||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(at,A)}const X=S.length,W=k.length;function B(J,at,A){let ht,tt,_t;const lt=J.x-at.x,it=J.y-at.y,rt=A.x-J.x,_=A.y-J.y,x=lt*lt+it*it,I=lt*_-it*rt;if(Math.abs(I)>Number.EPSILON){const O=Math.sqrt(x),K=Math.sqrt(rt*rt+_*_),q=at.x-it/O,gt=at.y+lt/O,pt=A.x-_/K,Tt=A.y+rt/K,Vt=((pt-q)*_-(Tt-gt)*rt)/(lt*_-it*rt);ht=q+lt*Vt-J.x,tt=gt+it*Vt-J.y;const ft=ht*ht+tt*tt;if(ft<=2)return new vt(ht,tt);_t=Math.sqrt(ft/2)}else{let O=!1;lt>Number.EPSILON?rt>Number.EPSILON&&(O=!0):lt<-Number.EPSILON?rt<-Number.EPSILON&&(O=!0):Math.sign(it)===Math.sign(_)&&(O=!0),O?(ht=-it,tt=lt,_t=Math.sqrt(x)):(ht=lt,tt=it,_t=Math.sqrt(x/2))}return new vt(ht/_t,tt/_t)}const et=[];for(let J=0,at=z.length,A=at-1,ht=J+1;J<at;J++,A++,ht++)A===at&&(A=0),ht===at&&(ht=0),et[J]=B(z[J],z[A],z[ht]);const Q=[];let $,Rt=et.concat();for(let J=0,at=C.length;J<at;J++){const A=C[J];$=[];for(let ht=0,tt=A.length,_t=tt-1,lt=ht+1;ht<tt;ht++,_t++,lt++)_t===tt&&(_t=0),lt===tt&&(lt=0),$[ht]=B(A[ht],A[_t],A[lt]);Q.push($),Rt=Rt.concat($)}for(let J=0;J<m;J++){const at=J/m,A=d*Math.cos(at*Math.PI/2),ht=g*Math.sin(at*Math.PI/2)+v;for(let tt=0,_t=z.length;tt<_t;tt++){const lt=st(z[tt],et[tt],ht);ct(lt.x,lt.y,-A)}for(let tt=0,_t=C.length;tt<_t;tt++){const lt=C[tt];$=Q[tt];for(let it=0,rt=lt.length;it<rt;it++){const _=st(lt[it],$[it],ht);ct(_.x,_.y,-A)}}}const Bt=g+v;for(let J=0;J<X;J++){const at=p?st(S[J],Rt[J],Bt):S[J];y?(w.copy(U.normals[0]).multiplyScalar(at.x),R.copy(U.binormals[0]).multiplyScalar(at.y),P.copy(M[0]).add(w).add(R),ct(P.x,P.y,P.z)):ct(at.x,at.y,0)}for(let J=1;J<=u;J++)for(let at=0;at<X;at++){const A=p?st(S[at],Rt[at],Bt):S[at];y?(w.copy(U.normals[J]).multiplyScalar(A.x),R.copy(U.binormals[J]).multiplyScalar(A.y),P.copy(M[J]).add(w).add(R),ct(P.x,P.y,P.z)):ct(A.x,A.y,f/u*J)}for(let J=m-1;J>=0;J--){const at=J/m,A=d*Math.cos(at*Math.PI/2),ht=g*Math.sin(at*Math.PI/2)+v;for(let tt=0,_t=z.length;tt<_t;tt++){const lt=st(z[tt],et[tt],ht);ct(lt.x,lt.y,f+A)}for(let tt=0,_t=C.length;tt<_t;tt++){const lt=C[tt];$=Q[tt];for(let it=0,rt=lt.length;it<rt;it++){const _=st(lt[it],$[it],ht);y?ct(_.x,_.y+M[u-1].y,M[u-1].x+A):ct(_.x,_.y,f+A)}}}Y(),ut();function Y(){const J=r.length/3;if(p){let at=0,A=X*at;for(let ht=0;ht<W;ht++){const tt=k[ht];Ct(tt[2]+A,tt[1]+A,tt[0]+A)}at=u+m*2,A=X*at;for(let ht=0;ht<W;ht++){const tt=k[ht];Ct(tt[0]+A,tt[1]+A,tt[2]+A)}}else{for(let at=0;at<W;at++){const A=k[at];Ct(A[2],A[1],A[0])}for(let at=0;at<W;at++){const A=k[at];Ct(A[0]+X*u,A[1]+X*u,A[2]+X*u)}}n.addGroup(J,r.length/3-J,0)}function ut(){const J=r.length/3;let at=0;mt(z,at),at+=z.length;for(let A=0,ht=C.length;A<ht;A++){const tt=C[A];mt(tt,at),at+=tt.length}n.addGroup(J,r.length/3-J,1)}function mt(J,at){let A=J.length;for(;--A>=0;){const ht=A;let tt=A-1;tt<0&&(tt=J.length-1);for(let _t=0,lt=u+m*2;_t<lt;_t++){const it=X*_t,rt=X*(_t+1),_=at+ht+it,x=at+tt+it,I=at+tt+rt,O=at+ht+rt;It(_,x,I,O)}}}function ct(J,at,A){l.push(J),l.push(at),l.push(A)}function Ct(J,at,A){Z(J),Z(at),Z(A);const ht=r.length/3,tt=T.generateTopUV(n,r,ht-3,ht-2,ht-1);Nt(tt[0]),Nt(tt[1]),Nt(tt[2])}function It(J,at,A,ht){Z(J),Z(at),Z(ht),Z(at),Z(A),Z(ht);const tt=r.length/3,_t=T.generateSideWallUV(n,r,tt-6,tt-3,tt-2,tt-1);Nt(_t[0]),Nt(_t[1]),Nt(_t[3]),Nt(_t[1]),Nt(_t[2]),Nt(_t[3])}function Z(J){r.push(l[J*3+0]),r.push(l[J*3+1]),r.push(l[J*3+2])}function Nt(J){s.push(J.x),s.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return H0(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Ms[r.type]().fromJSON(r)),new Aa(n,t.options)}}const V0={generateTopUV:function(i,t,e,n,r){const s=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[r*3],u=t[r*3+1];return[new vt(s,o),new vt(a,l),new vt(c,u)]},generateSideWallUV:function(i,t,e,n,r,s){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],f=t[n*3+2],p=t[r*3],d=t[r*3+1],g=t[r*3+2],v=t[s*3],m=t[s*3+1],h=t[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new vt(o,1-l),new vt(c,1-f),new vt(p,1-g),new vt(v,1-h)]:[new vt(a,1-l),new vt(u,1-f),new vt(d,1-g),new vt(m,1-h)]}};function H0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Cn extends xe{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],f=new L,p=new L,d=[],g=[],v=[],m=[];for(let h=0;h<=n;h++){const T=[],M=h/n;let y=0;h===0&&o===0?y=.5/e:h===n&&l===Math.PI&&(y=-.5/e);for(let U=0;U<=e;U++){const R=U/e;f.x=-t*Math.cos(r+R*s)*Math.sin(o+M*a),f.y=t*Math.cos(o+M*a),f.z=t*Math.sin(r+R*s)*Math.sin(o+M*a),g.push(f.x,f.y,f.z),p.copy(f).normalize(),v.push(p.x,p.y,p.z),m.push(R+y,1-M),T.push(c++)}u.push(T)}for(let h=0;h<n;h++)for(let T=0;T<e;T++){const M=u[h][T+1],y=u[h][T],U=u[h+1][T],R=u[h+1][T+1];(h!==0||o>0)&&d.push(M,y,R),(h!==n-1||l<Math.PI)&&d.push(y,U,R)}this.setIndex(d),this.setAttribute("position",new Re(g,3)),this.setAttribute("normal",new Re(v,3)),this.setAttribute("uv",new Re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Bn extends xe{constructor(t=new kc(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new L,l=new L,c=new vt;let u=new L;const f=[],p=[],d=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Re(f,3)),this.setAttribute("normal",new Re(p,3)),this.setAttribute("uv",new Re(d,2));function v(){for(let M=0;M<e;M++)m(M);m(s===!1?e:0),T(),h()}function m(M){u=t.getPointAt(M/e,u);const y=o.normals[M],U=o.binormals[M];for(let R=0;R<=r;R++){const w=R/r*Math.PI*2,P=Math.sin(w),b=-Math.cos(w);l.x=b*y.x+P*U.x,l.y=b*y.y+P*U.y,l.z=b*y.z+P*U.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,f.push(a.x,a.y,a.z)}}function h(){for(let M=1;M<=e;M++)for(let y=1;y<=r;y++){const U=(r+1)*(M-1)+(y-1),R=(r+1)*M+(y-1),w=(r+1)*M+y,P=(r+1)*(M-1)+y;g.push(U,R,P),g.push(R,w,P)}}function T(){for(let M=0;M<=e;M++)for(let y=0;y<=r;y++)c.x=M/e,c.y=y/r,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Bn(new Ms[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}const Zl={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class G0{constructor(t,e,n){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,p=c.length;f<p;f+=2){const d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null}}}const W0=new G0;class Ra{constructor(t){this.manager=t!==void 0?t:W0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(r,s){n.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}Ra.DEFAULT_MATERIAL_NAME="__DEFAULT";const Sn={};class X0 extends Error{constructor(t,e){super(t),this.response=e}}class q0 extends Ra{constructor(t){super(t)}load(t,e,n,r){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=Zl.get(t);if(s!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0),s;if(Sn[t]!==void 0){Sn[t].push({onLoad:e,onProgress:n,onError:r});return}Sn[t]=[],Sn[t].push({onLoad:e,onProgress:n,onError:r});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Sn[t],f=c.body.getReader(),p=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=p?parseInt(p):0,g=d!==0;let v=0;const m=new ReadableStream({start(h){T();function T(){f.read().then(({done:M,value:y})=>{if(M)h.close();else{v+=y.byteLength;const U=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:d});for(let R=0,w=u.length;R<w;R++){const P=u[R];P.onProgress&&P.onProgress(U)}h.enqueue(y),T()}},M=>{h.error(M)})}}});return new Response(m)}else throw new X0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(a),p=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(p);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{Zl.add(t,c);const u=Sn[t];delete Sn[t];for(let f=0,p=u.length;f<p;f++){const d=u[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=Sn[t];if(u===void 0)throw this.manager.itemError(t),c;delete Sn[t];for(let f=0,p=u.length;f<p;f++){const d=u[f];d.onError&&d.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}}class Y0{constructor(){this.type="ShapePath",this.color=new Kt,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new sa,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,r){return this.currentPath.quadraticCurveTo(t,e,n,r),this}bezierCurveTo(t,e,n,r,s,o){return this.currentPath.bezierCurveTo(t,e,n,r,s,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(h){const T=[];for(let M=0,y=h.length;M<y;M++){const U=h[M],R=new ds;R.curves=U.curves,T.push(R)}return T}function n(h,T){const M=T.length;let y=!1;for(let U=M-1,R=0;R<M;U=R++){let w=T[U],P=T[R],b=P.x-w.x,S=P.y-w.y;if(Math.abs(S)>Number.EPSILON){if(S<0&&(w=T[R],b=-b,P=T[U],S=-S),h.y<w.y||h.y>P.y)continue;if(h.y===w.y){if(h.x===w.x)return!0}else{const C=S*(h.x-w.x)-b*(h.y-w.y);if(C===0)return!0;if(C<0)continue;y=!y}}else{if(h.y!==w.y)continue;if(P.x<=h.x&&h.x<=w.x||w.x<=h.x&&h.x<=P.x)return!0}}return y}const r=Vi.isClockWise,s=this.subPaths;if(s.length===0)return[];let o,a,l;const c=[];if(s.length===1)return a=s[0],l=new ds,l.curves=a.curves,c.push(l),c;let u=!r(s[0].getPoints());u=t?!u:u;const f=[],p=[];let d=[],g=0,v;p[g]=void 0,d[g]=[];for(let h=0,T=s.length;h<T;h++)a=s[h],v=a.getPoints(),o=r(v),o=t?!o:o,o?(!u&&p[g]&&g++,p[g]={s:new ds,p:v},p[g].s.curves=a.curves,u&&g++,d[g]=[]):d[g].push({h:a,p:v[0]});if(!p[0])return e(s);if(p.length>1){let h=!1,T=0;for(let M=0,y=p.length;M<y;M++)f[M]=[];for(let M=0,y=p.length;M<y;M++){const U=d[M];for(let R=0;R<U.length;R++){const w=U[R];let P=!0;for(let b=0;b<p.length;b++)n(w.p,p[b].p)&&(M!==b&&T++,P?(P=!1,f[b].push(w)):h=!0);P&&f[M].push(w)}}T>0&&h===!1&&(d=f)}let m;for(let h=0,T=p.length;h<T;h++){l=p[h].s,c.push(l),m=d[h];for(let M=0,y=m.length;M<y;M++)l.holes.push(m[M].h)}return c}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ca}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ca);const ws=`
float skyHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float skyNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(skyHash(i), skyHash(i + vec3(1.0, 0.0, 0.0)), u.x), mix(skyHash(i + vec3(0.0, 1.0, 0.0)), skyHash(i + vec3(1.0, 1.0, 0.0)), u.x), u.y);
  float b = mix(mix(skyHash(i + vec3(0.0, 0.0, 1.0)), skyHash(i + vec3(1.0, 0.0, 1.0)), u.x), mix(skyHash(i + vec3(0.0, 1.0, 1.0)), skyHash(i + vec3(1.0, 1.0, 1.0)), u.x), u.y);
  return mix(a, b, u.z);
}
float skyFbm(vec3 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * skyNoise(p); p = p * 2.03 + 11.3; a *= 0.5; } return v; }
// One layer of stars: the sphere of directions is cut into cells, and some cells hold one star.
float skyStars(vec3 d, float cells, float chance, float size) {
  vec3 p = d * cells, c = floor(p);
  if (skyHash(c) > chance) return 0.0;
  vec3 at = (vec3(skyHash(c + 1.7), skyHash(c + 5.3), skyHash(c + 9.1)) - 0.5) * 0.5;
  float bright = 0.2 + 1.3 * pow(skyHash(c + 3.3), 5.0);
  return bright * smoothstep(size, 0.0, length(fract(p) - 0.5 - at));
}
// MILKY_AXIS is the pole of the Milky Way's band; MILKY_CORE the direction of its brightest part.
const vec3 MILKY_AXIS = vec3(0.6543, -0.7436, -0.1376);
const vec3 MILKY_CORE = vec3(0.3016, 0.4235, -0.8542);
uniform float uSkyTurn; // the sky turning while the orb is held (radians); 0 = as drawn
vec3 skyColor(vec3 d) {
  { float c = cos(uSkyTurn), s = sin(uSkyTurn); d = vec3(c * d.x - s * d.z, d.y, s * d.x + c * d.z); }
  vec3 col = mix(vec3(0.040, 0.052, 0.088), vec3(0.008, 0.012, 0.028), pow(clamp(d.y, 0.0, 1.0), 0.55));
  float lat = dot(d, MILKY_AXIS) + (skyFbm(d * 3.0) - 0.5) * 0.14;
  float band = exp(-lat * lat / 0.032);
  float clouds = skyFbm(d * 6.0 + 3.0);
  float dust = smoothstep(0.42, 0.7, skyFbm(d * 10.0 + 20.0)) * exp(-lat * lat / 0.006);
  float core = 0.4 + 0.6 * exp(-pow(distance(d, MILKY_CORE) / 0.95, 2.0));
  float milky = band * (0.25 + 1.1 * clouds * clouds * 2.0) * core * (1.0 - 0.8 * dust);
  col += milky * vec3(0.17, 0.22, 0.32) + milky * milky * vec3(0.20, 0.17, 0.15) * 0.5;
  float stars = skyStars(d, 55.0, 0.05, 0.13) * 1.5 + skyStars(d, 105.0, 0.1 + 0.25 * band, 0.2) + skyStars(d, 190.0, 0.12 + 0.5 * band, 0.3) * 0.55;
  return col + stars * vec3(0.85, 0.92, 1.0);
}`,Z0=`
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,K0=`
${ws}
uniform float uShow;
uniform vec3 uFog;
varying vec3 vDir;
void main() { gl_FragColor = vec4(mix(uFog, skyColor(normalize(vDir)), uShow), 1.0); }`;function $0(i){const t={uShow:{value:1},uSkyTurn:{value:0},uFog:{value:new L((i>>16&255)/255,(i>>8&255)/255,(i&255)/255)}},e=new Cn(450,48,32),n=new fe({uniforms:t,vertexShader:Z0,fragmentShader:K0,side:Ue,depthWrite:!1,depthTest:!1}),r=new ge(e,n);return r.frustumCulled=!1,r.renderOrder=-1,{dome:r,update:(o,a,l=0)=>{r.position.copy(o),t.uShow.value=a,t.uSkyTurn.value=l},disposables:[e,n]}}const J0=`
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
varying vec3 vWN;
varying vec3 vWP;
void main() {
  vObj = normalize(position);
  vWN = mat3(modelMatrix) * normal;
  vWP = (modelMatrix * vec4(position, 1.0)).xyz;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal;
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,j0=`
uniform float uTime;
uniform float uOpacity;
uniform float uSkin; // 0 = the ball itself, 1 = the faint outer skin
uniform float uSpinT;   // spin clock (speed set from outside)
uniform float uBandsK;  // strength of the white streaks
uniform float uZapK;    // spark brightness
uniform float uZapRate; // how often sparks happen
uniform float uStyle;   // which orb (0 air, 1 clouds, 2 liquid pearl, 3 water, 4 storm, 5 aurora, 6 neural net, 7 galaxy, 8 singularity)
uniform float uHue;     // colour turn, radians
uniform float uFlow;    // speed of the movement inside
uniform vec2 uGate;     // which of the two lightning streams is firing right now (worked out outside, so the water and land can flash with it)
uniform float uFlash;   // how brightly the lightning lights the inside of the ball right now
uniform float uDepth;   // layers of wind seen inside the ball
uniform float uGlass;   // glass shell: the stars behind are bent through it, with a glossy highlight
uniform float uFringe;  // a thin rainbow along the edge, like a lens
uniform vec3 uCamObj;   // the camera, seen from the ball (1 = the ball's radius)
varying vec3 vWN;
varying vec3 vWP;
${ws}
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash3(i), hash3(i + vec3(1.0, 0.0, 0.0)), u.x), mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y);
  float b = mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), u.x), mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y);
  return mix(a, b, u.z);
}
vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
// Lightning that walks across the surface: now and then a thin, jagged arc flickers on for a
// split second at a random spot. Two independent streams, so the timing never looks regular.
float arc(float lane, float rate, float chance) {
  float slot = floor(uTime * rate + lane * 13.7), lt = fract(uTime * rate + lane * 13.7);
  if ((lane < 0.5 ? uGate.x : uGate.y) < 0.5) return 0.0;
  vec3 c = normalize(vec3(hash3(vec3(slot, 2.1, lane)), hash3(vec3(slot, 5.7, lane)), hash3(vec3(slot, 9.2, lane))) * 2.0 - 1.0);
  c.z = abs(c.z) * 0.8 + 0.2; // keep most flashes on the side facing the camera
  c = normalize(c);
  vec3 t = normalize(cross(c, abs(c.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  float a = hash3(vec3(slot, 3.3, lane)) * 6.283;
  t = t * cos(a) + cross(c, t) * sin(a);
  vec3 b = cross(c, t);
  if (dot(vObj, c) < 0.6) return 0.0;
  float u = dot(vObj, t), v = dot(vObj, b), L = 0.22 + 0.18 * hash3(vec3(slot, 7.7, lane));
  // Jagged path: two layers of noise bend the line; a short fork leaves it part-way along.
  float j = (noise3(vec3(u * 9.0, slot, lane)) - 0.5) * 0.09 + (noise3(vec3(u * 31.0, slot + 4.0, lane)) - 0.5) * 0.03;
  float along = 1.0 - smoothstep(L * 0.6, L, abs(u));
  float line = exp(-abs(v - j) / 0.0035) * along;
  float fu = u - L * 0.2, fork = exp(-abs(v - j - fu * 0.8 - (noise3(vec3(u * 27.0, slot, 8.0)) - 0.5) * 0.03) / 0.003) * step(0.0, fu) * (1.0 - smoothstep(0.0, L * 0.45, fu));
  float glow = exp(-abs(v - j) / 0.03) * along * 0.25;
  // A quick double flicker, then gone.
  float flick = exp(-lt * 9.0) * (0.6 + 0.4 * step(0.5, fract(lt * 14.0)));
  return (line + fork * 0.7 + glow) * flick;
}
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise3(p); p = p * 2.03 + vec3(1.7, 9.2, 4.1); a *= 0.5; } return s; }
// Turn every colour round the colour wheel by the same angle (the tuner's colour slider).
vec3 hueShift(vec3 c, float a) { vec3 k = vec3(0.57735); float ca = cos(a), sa = sin(a); return c * ca + cross(k, c) * sa + k * dot(k, c) * (1.0 - ca); }
void main() {
  vec3 N = normalize(vN);
  float facing = abs(dot(N, normalize(vV)));
  float rim = pow(1.0 - facing, 2.2);
  float centre = pow(facing, 2.5);
  float ft = uTime * uFlow;
  vec3 col = vec3(0.0);
  float alpha = 1.0;
  if (uStyle < 0.5) {
    // 0. Spinning air (the first orb). Wind bands: noise stretched along the spin, on two tilted axes.
    vec3 a = rotY(rotX(vObj, 0.28), uSpinT * 18.0);
    vec3 b = rotY(rotZ(vObj, -0.55), uSpinT * 28.5 + 2.0);
    float n1 = noise3(a * vec3(1.5, 8.0, 1.5)) * 0.65 + noise3(a * vec3(3.2, 17.0, 3.2) + 4.0) * 0.35;
    float n2 = noise3(b * vec3(2.2, 12.0, 2.2) + 9.0);
    float bands = (smoothstep(0.5, 0.82, n1) * 0.75 + smoothstep(0.58, 0.88, n2) * 0.45) * 0.41 * uBandsK;
    if (uSkin > 0.5) { gl_FragColor = vec4(hueShift(vec3(0.6, 0.88, 1.0), uHue), bands * 0.25 * pow(facing, 0.7) * uOpacity); return; }
    col = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(bands + centre * 0.5, 0.0, 1.0));
    col *= 0.8 + 0.2 * N.y;
    col += rim * vec3(0.45, 0.8, 1.0) * 0.9;
    float zap = clamp(arc(0.0, 2.6, 0.16 * uZapRate) + arc(1.0, 3.7, 0.11 * uZapRate), 0.0, 1.5);
    // Depth: three shells of wind inside the ball, each found by following the line of sight inwards.
    if (uDepth > 0.001) {
      vec3 dir = normalize(vObj - uCamObj);
      float bq = dot(vObj, dir), deep = 0.0;
      for (int k = 1; k <= 3; k++) {
        float fk = float(k), rr = 1.0 - 0.2 * fk, disc = bq * bq - (1.0 - rr * rr);
        if (disc > 0.0) {
          vec3 p = normalize(vObj + dir * (-bq - sqrt(disc)));
          vec3 pa = rotY(rotX(p, 0.28 + 0.3 * fk), uSpinT * (18.0 - 4.0 * fk) + fk * 1.7);
          deep += smoothstep(0.5, 0.85, noise3(pa * vec3(1.5, 8.0, 1.5) * (1.0 + 0.25 * fk))) * (0.55 - 0.12 * fk);
        }
      }
      col += vec3(0.35, 0.7, 1.0) * deep * uDepth * 0.5;
    }
    // Glass shell: the night sky behind, bent through the ball, and one glossy highlight.
    if (uGlass > 0.001) {
      vec3 wv = normalize(cameraPosition - vWP), wn = normalize(vWN);
      vec3 bent = refract(-wv, wn, 0.75);
      col += skyColor(normalize(vec3(bent.x, abs(bent.y) + 0.02, bent.z))) * 1.7 * uGlass * (1.0 - bands);
      col += vec3(1.0) * pow(max(dot(wn, normalize(normalize(vec3(-0.5, 0.8, 0.6)) + wv)), 0.0), 60.0) * 0.9 * uGlass;
    }
    // Rainbow edge.
    if (uFringe > 0.001) {
      float e = 1.0 - facing;
      vec3 rb = 0.5 + 0.5 * cos(6.283 * (e * 1.6 + vec3(0.0, 0.33, 0.67)));
      col += rb * smoothstep(0.55, 0.9, e) * (1.0 - smoothstep(0.93, 1.0, e)) * 0.9 * uFringe;
    }
    // Lightning lights the ball from inside.
    col += vec3(0.7, 0.88, 1.0) * uFlash * (0.25 + 0.75 * centre);
    col += vec3(0.85, 0.95, 1.0) * zap * 1.95 * uZapK;
    alpha = clamp(0.58 + bands * 0.4 + rim * 0.45 + centre * 0.2 + zap * 0.6, 0.0, 1.0);
  } else {
    if (uSkin > 0.5) { gl_FragColor = vec4(0.0); return; } // the outer skin belongs to the air orb only
    if (uStyle < 1.5) {
      // 1. Cloud core: soft clouds drifting and folding inside a blue ball.
      vec3 q = rotY(vObj, ft * 0.15) * 1.6;
      float n = fbm(q + vec3(0.0, ft * 0.12, 0.0));
      float n2 = fbm(q * 2.1 - vec3(ft * 0.2, 0.0, 0.0) + 3.0);
      float c = smoothstep(0.35, 0.75, n * 0.7 + n2 * 0.45);
      col = mix(vec3(0.10, 0.32, 0.85), vec3(0.55, 0.8, 1.0), n);
      col = mix(col, vec3(1.0), c * 0.85);
      col += rim * vec3(0.5, 0.75, 1.0) * 0.7;
      alpha = 0.93;
    } else if (uStyle < 2.5) {
      // 2. Liquid pearl: thick white liquid folding over itself, with a wet highlight.
      vec3 q = rotY(vObj, ft * 0.9);
      vec3 w = vec3(fbm(q * 1.8 + ft * 0.3), fbm(q * 1.8 + 5.2 - ft * 0.25), fbm(q * 1.8 + 9.1));
      float n = fbm(q * 1.4 + w * 2.2);
      float ridge = abs(sin(n * 14.0));
      col = mix(vec3(0.60, 0.66, 0.80), vec3(1.0), smoothstep(0.15, 0.9, ridge));
      col *= 0.75 + 0.25 * N.y;
      col += pow(max(dot(N, normalize(vec3(0.4, 0.7, 0.6))), 0.0), 24.0) * 0.6;
      col += rim * 0.35;
      alpha = 0.97;
    } else if (uStyle < 3.5) {
      // 3. Water in glass: a clear ball half full of water that sloshes from side to side.
      float lvl = 0.02 + 0.22 * sin(ft * 1.6) * vObj.x + 0.12 * sin(ft * 2.3 + 1.0) * vObj.z + (noise3(vec3(vObj.xz * 5.0, ft * 1.5)) - 0.5) * 0.06;
      float d = vObj.y - lvl;
      float under = 1.0 - smoothstep(-0.01, 0.01, d);
      float ca = noise3(vec3(vObj.xz * 6.0 + ft * 0.6, ft * 0.8));
      vec3 water = mix(vec3(0.03, 0.22, 0.6), vec3(0.2, 0.65, 1.0), clamp(ca * 0.8 - d * 0.3, 0.0, 1.0));
      vec3 glass = vec3(0.55, 0.8, 1.0) * (0.08 + rim * 0.9);
      col = mix(glass, water, under);
      col += exp(-abs(d) / 0.012) * vec3(0.9, 0.97, 1.0) * 0.9;
      col += rim * vec3(0.5, 0.8, 1.0) * 0.5;
      alpha = mix(0.22 + rim * 0.6, 0.93, under);
    } else if (uStyle < 4.5) {
      // 4. Storm: a dark thundercloud lit from inside by flashes, with bolts across its face.
      vec3 q = rotY(vObj, ft * 0.25) * 1.8;
      float n = fbm(q + vec3(0.0, ft * 0.1, 0.0));
      float n2 = fbm(q * 2.3 + 7.0 - ft * 0.15);
      float cl = smoothstep(0.3, 0.8, n * 0.65 + n2 * 0.5);
      col = mix(vec3(0.03, 0.04, 0.09), vec3(0.32, 0.36, 0.48), cl);
      float slot = floor(uTime * 2.2), lt = fract(uTime * 2.2);
      float on = step(1.0 - 0.28 * uZapRate, hash3(vec3(slot, 3.1, 7.7)));
      float flash = on * exp(-lt * 7.0) * (0.6 + 0.4 * step(0.5, fract(lt * 11.0)));
      vec3 fc = normalize(vec3(hash3(vec3(slot, 1.0, 2.0)), hash3(vec3(slot, 4.0, 5.0)), hash3(vec3(slot, 8.0, 6.0))) * 2.0 - 1.0);
      col += vec3(0.75, 0.85, 1.0) * flash * smoothstep(-0.2, 0.9, dot(vObj, fc)) * (0.4 + cl) * 1.4 * uZapK;
      float zap = clamp(arc(0.0, 2.6, 0.16 * uZapRate) + arc(1.0, 3.7, 0.11 * uZapRate), 0.0, 1.5);
      col += vec3(0.85, 0.95, 1.0) * zap * 1.95 * uZapK;
      col += rim * vec3(0.3, 0.45, 0.8) * 0.6;
      alpha = 0.95;
    } else if (uStyle < 5.5) {
      // 5. Aurora: ribbons of coloured light sliding round a dark ball.
      vec3 q = rotY(vObj, ft * 0.3);
      float w = fbm(q * 1.5 + vec3(0.0, ft * 0.2, 0.0));
      float r = smoothstep(0.55, 1.0, sin(q.y * 5.0 + w * 6.0 + ft * 0.8)) + 0.5 * smoothstep(0.7, 1.0, sin(q.y * 9.0 - w * 8.0 - ft * 1.1));
      vec3 hc = 0.5 + 0.5 * cos(6.283 * (w * 0.8 + q.y * 0.25 + vec3(0.0, 0.33, 0.67)) + ft * 0.2);
      col = vec3(0.02, 0.03, 0.10) + hc * r * 1.1 + rim * vec3(0.3, 0.9, 0.8) * 0.6;
      alpha = 0.9;
    } else if (uStyle < 6.5) {
      // 6. Neural net: glowing points joined by lines, with pulses of light passing between them.
      vec3 q = rotY(vObj, ft * 0.12) * 4.5;
      vec3 ip = floor(q), fp = fract(q);
      float d1 = 9.0, d2 = 9.0, id = 0.0;
      for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 o = vec3(hash3(ip + g), hash3(ip + g + 17.0), hash3(ip + g + 31.0));
        float d = length(g + o - fp);
        if (d < d1) { d2 = d1; d1 = d; id = hash3(ip + g + 5.0); } else if (d < d2) { d2 = d; }
      }
      float node = exp(-d1 * d1 * 40.0);
      float edge = 1.0 - smoothstep(0.0, 0.06, d2 - d1);
      float pulse = 0.5 + 0.5 * sin(ft * 2.5 + id * 40.0);
      col = vec3(0.02, 0.05, 0.14) + vec3(0.25, 0.7, 1.0) * edge * (0.25 + 0.6 * pulse) + vec3(0.9, 0.97, 1.0) * node * (0.5 + pulse);
      col += rim * vec3(0.3, 0.6, 1.0) * 0.7;
      alpha = 0.93;
    } else if (uStyle < 7.5) {
      // 7. Galaxy: spiral arms turning round a bright centre, with twinkling stars.
      vec3 q = rotX(vObj, 0.9);
      float r = length(q.xz), ang = atan(q.z, q.x);
      float arms = smoothstep(0.2, 1.0, sin(ang * 2.0 - log(r + 0.05) * 6.0 + ft * 0.8)) * (1.0 - smoothstep(0.15, 1.0, r));
      vec3 cell = floor(vObj * 38.0);
      float stars = step(0.985, hash3(cell)) * (0.5 + 0.5 * sin(ft * 3.0 + hash3(cell + 3.0) * 40.0));
      float core = exp(-r * r * 14.0);
      col = vec3(0.02, 0.02, 0.08) + vec3(0.45, 0.55, 1.0) * arms * 0.9 + vec3(1.0, 0.9, 0.75) * core * 1.2 + vec3(stars);
      col += rim * vec3(0.4, 0.5, 1.0) * 0.5;
      alpha = 0.93;
    } else {
      // 8. Singularity: a black centre with a ring of light streaming round it.
      float core = smoothstep(0.55, 0.8, facing);
      float a = atan(N.y, N.x);
      float sw = noise3(vec3(cos(a) * 2.0, sin(a) * 2.0, facing * 6.0 - ft));
      float rd = (facing - 0.5) / 0.12;
      float ring = exp(-rd * rd) * (0.6 + 0.8 * sw);
      col = vec3(0.5, 0.8, 1.0) * ring * 1.6 + rim * vec3(0.3, 0.6, 1.0);
      alpha = max(core * 0.97, clamp(ring + rim * 0.6, 0.0, 1.0));
    }
  }
  gl_FragColor = vec4(hueShift(col, uHue), alpha * uOpacity);
}`;function Q0(i,t){const e=(s,o,a)=>{const l=i*o+s*13.7,c=Math.floor(l),u=l-c,f=Math.sin(c*127.1+s*311.7+97.11)*43758.5453;return f-Math.floor(f)>a?[0,0]:[1,Math.exp(-u*9)*(.6+.4*(u*14%1>=.5?1:0))]},n=e(0,2.6,.16*t),r=e(1,3.7,.11*t);return{gate:[n[0],r[0]],flash:Math.min(1.5,n[1]+r[1])}}function tg(i){const t=new Je,e=new L(0,0,10),n=f=>new fe({uniforms:{uTime:{value:0},uOpacity:{value:1},uSkin:{value:f},uSpinT:{value:0},uBandsK:{value:1},uZapK:{value:1},uZapRate:{value:1},uStyle:{value:0},uHue:{value:0},uFlow:{value:1},uGate:{value:[0,0]},uFlash:{value:0},uDepth:{value:0},uGlass:{value:0},uFringe:{value:0},uCamObj:{value:new L(0,0,10)}},vertexShader:J0,fragmentShader:j0,transparent:!0,depthWrite:!1,...f?{blending:je}:{}}),r=n(0),s=n(1);r.depthWrite=!0;const o=new Cn(i,64,48),a=new Cn(i*1.14,48,32),l=new ge(o,r),c=new ge(a,s);return l.renderOrder=5,c.renderOrder=6,t.add(l,c),{group:t,update:(f,p,d=f,g={bands:1,zap:1,zapRate:1,style:0,hue:0,flow:1})=>{g.cam&&(t.updateWorldMatrix(!0,!0),l.worldToLocal(e.copy(g.cam)).divideScalar(i));for(const v of[r,s])v.uniforms.uTime.value=f,v.uniforms.uOpacity.value=p,v.uniforms.uSpinT.value=d,v.uniforms.uBandsK.value=g.bands,v.uniforms.uZapK.value=g.zap,v.uniforms.uZapRate.value=g.zapRate,v.uniforms.uStyle.value=g.style,v.uniforms.uHue.value=g.hue*Math.PI/180,v.uniforms.uFlow.value=g.flow,v.uniforms.uGate.value=g.gate??[0,0],v.uniforms.uFlash.value=g.flash??0,v.uniforms.uDepth.value=g.depth??0,v.uniforms.uGlass.value=g.glass??0,v.uniforms.uFringe.value=g.fringe??0,v.uniforms.uCamObj.value.copy(e);t.position.y=Math.sin(f*1.3)*.05},disposables:[o,a,r,s]}}const ss=(i,t)=>{const e=Math.sin(i*127.1+t*311.7)*43758.5453;return e-Math.floor(e)},la=i=>i*i*(3-2*i),Kl=(i,t,e)=>la(Math.min(1,Math.max(0,(e-i)/(t-i))));function eg(i,t){const e=Math.floor(i),n=Math.floor(t),r=i-e,s=t-n,o=ss(e,n),a=ss(e+1,n),l=ss(e,n+1),c=ss(e+1,n+1),u=la(r),f=la(s);return o+(a-o)*u+(l-o)*f+(o-a-l+c)*u*f}function ng(i,t){let e=0,n=1,r=1;for(let s=0;s<5;s++)e+=n*eg(i*r,t*r),n*=.5,r*=2.03;return e}const ig=(i,t,e)=>Math.min(1,Math.pow(Math.abs(i)/t,e));function zn(i,t){const e=ig(i,24,1.7)*(.45+.55*Kl(25,-45,t))*.36,n=(ng(i*.045,t*.045)-.55)*26*(.12+e)+e*11;return Math.max(n,Kl(9,16,Math.abs(i))*7-1.2)}const Xc=`
uniform float uTime;
uniform float uStir;
uniform vec2 uOrb;
float stirAt(float d) { return uStir * exp(-d * d / 220.0); }
uniform float uVar;
uniform float uSwirlR, uSwirlDepth, uSwirlSpeed;
// Preview water designs 1-4 (0 = the current swirl). Each is a round dent pushed into the water by
// the orb's air, with a different kind of spin inside it.
float bowl(float d, float r, float depth) { return -depth * exp(-d * d / (r * r)); }
float shapeH0(vec2 q, float d, float tt) {
  float a = atan(q.y, q.x + 0.0001);
  if (uVar < 1.5) return bowl(d, 3.2, 1.1) + 0.07 * sin(a * 4.0 + d * 1.6 - tt * 6.0) * exp(-d * d / 16.0);
  if (uVar < 2.5) return bowl(d, 4.0, 1.7) + 0.13 * sin(a * 3.0 + d * 2.6 - tt * 7.0) * exp(-d * d / 22.0) * smoothstep(0.4, 2.0, d);
  if (uVar < 3.5) return bowl(d, 2.7, 1.0) + 0.32 * exp(-(d - 3.7) * (d - 3.7) / 0.9) + 0.035 * sin(d * 4.0 - tt * 5.0) * exp(-d * d / 45.0) * smoothstep(4.2, 5.2, d);
  return bowl(d, 3.6, 0.65) + 0.02 * sin(a * 2.0 + d * 0.9 - tt * 2.5) * exp(-d * d / 18.0); // only a soft, broad lean; the swirl detail is in vortex()
}
float shapeH(vec2 q, float d) { return uSwirlDepth * shapeH0(q, d / uSwirlR, uTime * uSwirlSpeed); }
float shapeFoam0(vec2 q, float d, float lace, float tt) {
  float a = atan(q.y, q.x + 0.0001);
  if (uVar < 1.5) return smoothstep(0.55, 1.0, sin(a * 4.0 + d * 1.6 - tt * 6.0)) * exp(-d * d / 14.0) * (0.4 + lace);
  if (uVar < 2.5) return smoothstep(0.4, 1.0, sin(a * 3.0 + d * 2.6 - tt * 7.0)) * exp(-d * d / 18.0) * smoothstep(0.4, 1.6, d) * (0.5 + lace);
  if (uVar < 3.5) return exp(-(d - 3.6) * (d - 3.6) / 0.6) * (0.25 + 1.3 * lace) + 0.3 * smoothstep(0.7, 1.0, sin(a * 5.0 + d * 1.2 - tt * 6.0)) * exp(-d * d / 6.0) * lace;
  return 0.0; // silk: soft foam comes from vortex() instead of lines
}
float shapeFoam(vec2 q, float d, float lace) { return shapeFoam0(q, d / uSwirlR, lace, uTime * uSwirlSpeed); }
float swirl(vec2 q, float d, float arms, float wind, float speed) {
  return sin(arms * atan(q.y, q.x + 0.0001) + d * wind - uTime * speed) * smoothstep(1.5, 6.5, d);
}
uniform vec4 uFunnel;    // the river drawn down into a funnel under the orb by the liquid vortex: x, z, depth, width
float funnelDip(vec2 p) { return uFunnel.z <= 0.0 ? 0.0 : -uFunnel.z * exp(-dot(p - uFunnel.xy, p - uFunnel.xy) / (uFunnel.w * uFunnel.w)); }
uniform vec4 uNova;      // the nova's push on the water: x, z, seconds since the blast (below 0 = none), height
uniform float uNovaSpeed; // how fast the ring runs out (units a second)
// The nova pushes the water: a crest of water heaped up at the ring as it runs outwards, the middle pushed
// down and filling back in, and a few waves trailing behind the crest. All of it fades as it spreads.
float novaWave(vec2 p) {
  if (uNova.z < 0.0 || uNova.w <= 0.0) return 0.0;
  float t = uNova.z, d = length(p - uNova.xy), front = t * uNovaSpeed;
  float k = d - front;
  float crest = exp(-k * k / (2.5 + front * 0.15));
  float hollow = -0.9 * exp(-d * d / (front * front * 0.3 + 4.0)) * exp(-t * 1.1);
  float trail = 0.35 * sin(k * 1.3) * exp(k * 0.12) * step(k, 0.0);
  return uNova.w * (crest + hollow + trail) * exp(-t * 0.55) * smoothstep(0.0, 0.08, t);
}
uniform vec4 uBoil;      // the boil: centre x, z (under the orb), strength (0 to 1), how far it spreads (radius)
uniform vec4 uBoilLook;  // fine bubbling, speed, white specks, how high the surface heaves (real height)
// A rolling boil: the surface split into jittered cells (Voronoi), each a dome that swells and sinks on its
// own clock, the way boiling water heaves (the cell method foam and lava artists use).
float boilHash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
float boilCells(vec2 p, float t) {
  vec2 g = floor(p), f = fract(p);
  float h = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y)), c = g + o;
    vec2 r = vec2(boilHash(c), boilHash(c + 7.1));
    float ph = fract(t * (0.5 + 0.9 * r.x) + r.y);
    float dome = sin(3.14159 * ph) * smoothstep(0.55 + 0.25 * r.y, 0.0, length(o + r - f));
    h = max(h, dome);
  }
  return h;
}
// The heave: big slow domes that lift the water's actual surface (used by the vertex shader to move the mesh,
// and by the colour shader so the lighting matches). Cheap: two cell lookups, only where it boils.
float boilHeave(vec2 p) {
  if (uBoil.z <= 0.001 || uBoilLook.w <= 0.0) return 0.0;
  vec2 bq = p - uBoil.xy;
  float near = exp(-dot(bq, bq) / (uBoil.w * uBoil.w)), sp = uBoilLook.y;
  return uBoil.z * near * uBoilLook.w * (0.8 * boilCells(p * 0.42, uTime * 0.9 * sp) + 0.35 * boilCells(p * 0.85 + 5.0, uTime * 1.4 * sp));
}`,rg=`
attribute float aBed;
${Xc}
uniform float uFlat;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
void main() {
  vec3 p = position;
  vec2 q = p.xz - uOrb;
  float d = length(q);
  float dish = -0.9 * uStir * exp(-d * d / 40.0);
  float arms = 0.55 * swirl(q, d, 3.0, 0.9, 5.0) + 0.3 * swirl(q, d, 2.0, 0.35, 2.6);
  float swell = 0.05 * sin(p.z * 0.3 + p.x * 0.2 + uTime * 1.6);
  float lift = uVar > 0.5 ? uStir * shapeH(q, d) + swell : dish + stirAt(d) * arms + swell;
  lift += boilHeave(p.xz) + novaWave(p.xz) + funnelDip(p.xz); // the boiling lake rises and falls for real
  p.y += lift;
  vP = p.xz;
  vBed = (aBed + lift) * max(uFlat, 0.45); // the river keeps some depth when the land lies flat, so it stays visible
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vView = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,sg=`
${Xc}
uniform float uRough, uDetailK, uFoamK, uGlintK, uReflect, uBody, uSilk, uSwirlLines, uSwirlSoft, uClear;
${ws}
uniform float uGlow;
uniform vec4 uCalm;      // a box on screen (left, bottom, right, top, in canvas pixels) where the water is kept calm
uniform vec4 uPops[8];   // bubbles bursting and the release shockwave: x, z, age (0 to 1), size
uniform vec4 uMirror;    // the orb mirrored in the water: x strength, y the orb's radius, z its spin clock, w the lightning flash
uniform vec3 uCalmK;     // x: how calm (0 off, 1 no reflections or highlights at all), y: how soft the box's edges are (part of its size)
uniform float uOpacity;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uOrbPos;
uniform vec3 uFog;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
// Simplex noise (Ian McEwan, Ashima Arts, MIT licence). Smooth in every direction, so the water
// shows no square cells the way grid-based noise does.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec2 turn(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// Silk swirl: the water's own pattern is twisted round the dent (more twist near the middle) and the
// whole twist turns slowly. The twist is a fixed amount, so the streaks never wind up tighter and
// tighter over time (that was what filled it with fine rings).
vec2 vortexUV(vec2 q, float d) {
  float dn = d / uSwirlR, spin = uTime * uSwirlSpeed * 0.9 + 2.2 * uSwirlLines * exp(-dn * dn / 9.0);
  float c = cos(spin), s = sin(spin);
  return vec2(c * q.x - s * q.y, s * q.x + c * q.y) / uSwirlR;
}
float vortex(vec2 q, float d) {
  vec2 r = vortexUV(q, d);
  float dn = d / uSwirlR;
  return (0.6 * snoise(r * vec2(0.45, 0.25) / uSwirlSoft) + 0.4 * snoise(r * 0.9 / uSwirlSoft + 3.7)) * exp(-dn * dn / 12.0);
}
// Height of the surface detail. Slow swells ride the current, which runs towards +z
// (the camera); near the orb they are bent round it and the spiral arms are added.
float surface(vec2 p, float detail) {
  vec2 q = p - uOrb;
  float d = length(q), stir = stirAt(d);
  vec2 f = uOrb + turn(q, -1.1 * stir);
  f.y -= uTime * 4.0;
  // Away from the orb the water is close to glass: long, low swells moving with the current, a few
  // gentle wave trains crossing it, and two faint layers of fine ripples drifting in different
  // directions (blended, they never repeat and never look like a pattern).
  // Preview styles: how much surface texture each one keeps (1 = today's water).
  float rough = uVar < 0.5 ? 1.0 : uVar < 1.5 ? 0.18 : uVar < 2.5 ? 0.45 : uVar < 3.5 ? 0.08 : 0.345;
  rough *= uRough;
  detail *= (uVar > 0.5 ? (uVar > 3.5 ? 0.15 : 0.0) : 1.0) * uDetailK;
  float h = 0.16 * rough * snoise(f * vec2(0.11, 0.055));
  h += 0.045 * rough * snoise(f * vec2(0.26, 0.14) + vec2(3.1, -uTime * 0.25));
  h += rough * (0.035 * sin(dot(p, vec2(0.21, 0.43)) - uTime * 1.1) + 0.022 * sin(dot(p, vec2(-0.37, 0.29)) - uTime * 1.45) + 0.014 * sin(dot(p, vec2(0.52, -0.18)) - uTime * 1.9));
  h += detail * (0.009 * snoise(p * 0.9 + vec2(uTime * 0.21, -uTime * 0.33)) + 0.007 * snoise(p * 1.6 + vec2(-uTime * 0.29, -uTime * 0.17) + 7.3));
  if (uVar > 3.5) h += 0.07 * uStir * uSwirlDepth * vortex(q, d);
  h += boilHeave(p) + novaWave(p) + funnelDip(p);
  // The boil: small fast bumps over the lake (as far as uBoil.w reaches), and rings running out from the beam.
  if (uBoil.z > 0.001) {
    vec2 bq = p - uBoil.xy; float bd = length(bq), near = exp(-bd * bd / (uBoil.w * uBoil.w)), sp = uBoilLook.y;
    h += uBoil.z * near * uBoilLook.x * (0.09 * boilCells(p * 1.3, uTime * 1.6 * sp) + 0.05 * detail * boilCells(p * 2.9 + 13.0, uTime * 2.3 * sp) + 0.04 * snoise(p * 2.6 + vec2(uTime * 3.1, -uTime * 2.7) * sp) + 0.05 * detail * snoise(p * 5.3 - vec2(uTime * 4.3, uTime * 3.7) * sp) + 0.03 * sin(bd * 7.0 - uTime * 14.0 * sp) * exp(-bd * 0.15));
  }
  // Rings from bubbles bursting (and the big one when the orb is let go).
  for (int i = 0; i < 8; i++) {
    vec4 pp = uPops[i];
    if (pp.z <= 0.0 || pp.z >= 1.0) continue;
    float ring = length(p - pp.xy) - pp.z * pp.w * 6.0;
    h += 0.05 * min(pp.w, 2.0) * (1.0 - pp.z) * exp(-ring * ring / (0.05 + 0.02 * pp.w));
  }
  h += uVar > 0.5 ? 0.6 * uStir * shapeH(q, d) : stir * (0.42 * swirl(q, d, 3.0, 0.9, 5.0) + 0.05 * swirl(q, d, 7.0, 2.2, 9.0));
  return h;
}
void main() {
  if (vBed <= 0.0) discard;
  // Far away the finest ripples are smaller than a pixel, so they are faded out there.
  float detail = 1.0 - smoothstep(20.0, 80.0, vView);
  float e = 0.12, h0 = surface(vP, detail);
  vec3 n = normalize(vec3(-(surface(vP + vec2(e, 0.0), detail) - h0) / e, 1.0, -(surface(vP + vec2(0.0, e), detail) - h0) / e));
  vec3 v = normalize(cameraPosition - vWorld);
  vec3 r = reflect(-v, n);
  // Behind the quote the water goes quiet: no mirrored sky, no orb glint, no foam or light-lines, so the
  // words are read against plain dark water. The box fades out at its edges.
  // It is the same rounded box as the frosted patch and the frame round the quote (one shape for all three).
  vec2 cc = (uCalm.xy + uCalm.zw) * 0.5, hs = max((uCalm.zw - uCalm.xy) * 0.5, vec2(0.5));
  float cr = min(uCalmK.z, min(hs.x, hs.y));
  vec2 cq = abs(gl_FragCoord.xy - cc) - hs + cr;
  float csd = length(max(cq, 0.0)) + min(max(cq.x, cq.y), 0.0) - cr;
  float cfe = max(uCalmK.y * 2.0 * min(hs.x, hs.y), 1.0);
  float lit = 1.0 - uCalmK.x * (1.0 - smoothstep(-cfe, 0.0, csd));
  float fresnel = clamp((0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0)) * uReflect, 0.0, 1.0) * lit;

  // What the surface mirrors: the real sky above it (stars and Milky Way, a little brighter than
  // life so they read on the water), a soft lift towards the horizon, and the orb's glow.
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 1.7 + vec3(0.07, 0.12, 0.2) * (1.0 - smoothstep(0.0, 0.4, r.y));
  vec3 toOrb = normalize(uOrbPos - vWorld);
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);

  // A true mirror image of the orb: where the reflected line of sight meets the ball, show the ball.
  float orbSeen = 0.0; vec3 orbCol = vec3(0.0);
  if (uMirror.x > 0.001) {
    vec3 oc = vWorld - uOrbPos;
    float bq = dot(oc, r), disc = bq * bq - (dot(oc, oc) - uMirror.y * uMirror.y);
    if (disc > 0.0 && bq < 0.0) {
      vec3 hn = normalize(oc + r * (-bq - sqrt(disc)));
      float fc = max(dot(hn, -r), 0.0), cr = cos(uMirror.z * 18.0), sr = sin(uMirror.z * 18.0);
      vec3 hr = vec3(cr * hn.x + sr * hn.z, hn.y, -sr * hn.x + cr * hn.z);
      float bnd = smoothstep(0.1, 0.7, snoise(vec2(hr.x * 1.5 + hr.z * 0.7, hr.y * 8.0)));
      orbCol = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(bnd * 0.3 + pow(fc, 2.5) * 0.5, 0.0, 1.0)) + pow(1.0 - fc, 2.2) * vec3(0.45, 0.8, 1.0) * 0.9;
      orbCol *= 1.0 + 2.0 * uMirror.w;
      orbSeen = uMirror.x * smoothstep(0.0, 0.12 * uMirror.y * uMirror.y, disc) * lit;
      sky = mix(sky, orbCol * 1.4, clamp(orbSeen, 0.0, 1.0));
    }
  }

  // What shows through: teal over the shallows, near-black where it is deep. The orb lights it a little.
  float depth = vBed;
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6)) * uBody;
  float reach = uGlow * exp(-length(uOrbPos.xz - vWorld.xz) / 16.0) * lit;
  body *= 0.75 + 1.3 * max(dot(n, toOrb), 0.0) * reach;
  // Light passing through: shallows glow faintly, with soft moving light-lines on the bed.
  float shallow = exp(-depth * 1.1);
  float caust = pow(0.5 + 0.5 * snoise(vP * 0.7 + vec2(uTime * 0.18, -uTime * 0.4)), 6.0) + pow(0.5 + 0.5 * snoise(vP * 1.1 - vec2(uTime * 0.23, uTime * 0.31) + 4.0), 6.0);
  body += vec3(0.1, 0.32, 0.34) * caust * shallow * 0.35 * (0.4 + reach) * lit * (uVar > 0.5 && uVar < 1.5 ? 0.0 : 1.0);
  vec3 col = mix(body, sky, fresnel) + orbCol * orbSeen * 0.3;
  // The orb as a light: a tight, bright glint on the water under it and a softer sheen round that.
  vec3 hv = normalize(toOrb + v);
  float nh = max(dot(n, hv), 0.0);
  col += vec3(0.8, 0.93, 1.0) * uGlow * (pow(nh, 420.0) * 2.2 + pow(nh, 64.0) * 0.18) * uGlintK * lit * exp(-length(uOrbPos.xz - vWorld.xz) / 30.0);

  // Foam: along the banks (more where the orb throws water at them), and on the spiral arms.
  vec2 q = vP - uOrb;
  float d = length(q), stir = stirAt(d);
  float lace = (0.5 + 0.5 * snoise(vP * 0.55 + vec2(0.0, -uTime * 1.3))) * (0.5 + 0.5 * snoise(vP * 1.5 + vec2(1.3, -uTime * 2.0)));
  float shore = (1.0 - smoothstep(0.0, 0.5, depth)) * smoothstep(0.14, 0.36, lace) * (0.3 + 1.8 * stir);
  float churn = uVar > 0.5 ? uStir * shapeFoam(q, d, lace) : stir * 1.15 * smoothstep(0.25, 1.0, swirl(q, d, 3.0, 0.9, 5.0)) * (0.3 + 1.5 * lace);
  if (uVar > 3.5) {
    float dn = d / uSwirlR, vn = 0.5 + 0.5 * vortex(q, d) / max(exp(-dn * dn / 12.0), 0.001);
    churn += uStir * 0.32 * smoothstep(0.45, 0.95, vn) * exp(-dn * dn / 11.0) * (0.5 + lace);
  }
  float foam = clamp((shore + churn) * uFoamK, 0.0, 1.0) * lit;
  // White specks wherever the water boils; the rings catch the light.
  if (uBoil.z > 0.001) {
    float bd = length(vP - uBoil.xy);
    float near = exp(-bd * bd / (uBoil.w * uBoil.w));
    float specks = smoothstep(0.72, 0.95, snoise(vP * 4.5 + vec2(uTime * 5.0, -uTime * 4.0) * uBoilLook.y) * 0.5 + 0.5);
    col += vec3(0.65, 0.88, 1.0) * uBoil.z * near * 0.06;
    foam = max(foam, uBoil.z * near * specks * 0.8 * uBoilLook.z);
  }
  for (int i = 0; i < 8; i++) {
    vec4 pp = uPops[i];
    if (pp.z <= 0.0 || pp.z >= 1.0) continue;
    float ring = length(vP - pp.xy) - pp.z * pp.w * 6.0;
    col += vec3(0.7, 0.9, 1.0) * (1.0 - pp.z) * exp(-ring * ring / (0.03 + 0.03 * pp.w)) * (pp.w > 2.0 ? 0.9 : 0.35);
  }
  col = mix(col, vec3(0.8, 0.93, 1.0), foam * 0.85);
  // Style 2: cartoon (cel) water. Colours snap to a few bands and foam gets a crisp edge.
  if (uVar > 1.5 && uVar < 2.5) {
    float lum = dot(col, vec3(0.3, 0.55, 0.15));
    float band = floor(lum * 6.0 + 0.5) / 6.0;
    col = mix(vec3(0.02, 0.07, 0.14), vec3(0.55, 0.85, 1.0), band) ;
    col = mix(col, vec3(0.92, 0.98, 1.0), step(0.45, foam));
  }
  // Style 4: silk. Broad, soft highlights and a faint colour shift at grazing angles.
  if (uVar > 3.5) col += vec3(0.05, 0.08, 0.16) * fresnel + vec3(0.12, 0.16, 0.2) * pow(max(dot(n, normalize(toOrb + v)), 0.0), 12.0) * uGlow * 0.6 * uSilk * lit;

  // The water thins out to nothing exactly where it meets the land, so the edge is soft.
  float edge = smoothstep(0.0, 0.4, depth);
  float alpha = edge * max(mix(0.8, 0.97, 1.0 - exp(-depth * 1.2)) * (1.0 - 0.75 * uClear), max(foam * 0.85, fresnel * 0.9));
  float fog = smoothstep(uFogNear, uFogFar, vView);
  gl_FragColor = vec4(mix(col, uFog, fog), alpha * uOpacity);
}`,og=`
varying vec3 vN;
varying vec3 vV;
void main() {
  vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize((modelViewMatrix * instanceMatrix * vec4(normal, 0.0)).xyz);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,ag=`
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN), v = normalize(vV);
  float facing = max(dot(n, v), 0.0), rim = pow(1.0 - facing, 2.0);
  float glint = pow(max(dot(n, normalize(vec3(0.25, 0.85, 0.45))), 0.0), 26.0);
  vec3 col = mix(vec3(0.16, 0.42, 0.56), vec3(0.75, 0.92, 1.0), rim) + glint * 0.9;
  gl_FragColor = vec4(col, clamp(0.55 + rim * 0.4 + glint, 0.0, 1.0));
}`;function lg({small:i,grid:t,heightAt:e,fogColor:n}){const l=Z=>4.5-.01*Z,{NX:c,NZ:u,W:f,D:p,Z0:d,base:g}=t,v=f/c,m=p/u,h=Math.max(0,Math.floor((f/2-44)/v)),M=Math.min(c,Math.ceil((f/2+44)/v))-h,y=Math.min(u,Math.ceil((d- -150)/m)),U=2,R=M*U,w=y*U,P=(Z,Nt)=>{const J=Math.min(c-1,Math.max(0,Math.floor(Z))),at=Math.min(u-1,Math.max(0,Math.floor(Nt))),A=Z-J,ht=Nt-at,tt=(_,x)=>g[x*(c+1)+_],_t=tt(J,at),lt=tt(J+1,at),it=tt(J,at+1),rt=tt(J+1,at+1);return A+ht<=1?_t+(lt-_t)*A+(it-_t)*ht:rt+(it-rt)*(1-A)+(lt-rt)*(1-ht)},b=(R+1)*(w+1),S=new Float32Array(b*3),C=new Float32Array(b),V=[];for(let Z=0,Nt=0;Z<=w;Z++){const J=Z/U,at=d-J*m,A=l(at);for(let ht=0;ht<=R;ht++,Nt++){const tt=h+ht/U;S[Nt*3]=-f/2+tt*v,S[Nt*3+1]=A,S[Nt*3+2]=at,C[Nt]=A-P(tt,J)}}for(let Z=0;Z<w;Z++)for(let Nt=0;Nt<R;Nt++){const J=Z*(R+1)+Nt,at=J+1,A=J+R+1,ht=A+1;V.push(J,A,at,at,A,ht)}const k=new xe;k.setAttribute("position",new pe(S,3)),k.setAttribute("aBed",new pe(C,1)),k.setIndex(V);const z={uTime:{value:0},uVar:{value:0},uSwirlR:{value:1},uSwirlDepth:{value:1},uSwirlSpeed:{value:1},uRough:{value:1},uClear:{value:0},uSwirlLines:{value:1},uSwirlSoft:{value:1},uDetailK:{value:1},uFoamK:{value:1},uGlintK:{value:1},uReflect:{value:1},uBody:{value:1},uSilk:{value:1},uStir:{value:1},uGlow:{value:1},uOpacity:{value:1},uFlat:{value:1},uFunnel:{value:new he(0,0,0,1)},uNova:{value:new he(0,0,-1,0)},uNovaSpeed:{value:22},uBoil:{value:new he(0,0,0,3)},uBoilLook:{value:new he(1,1,1,1)},uPops:{value:Array.from({length:8},()=>new he)},uSkyTurn:{value:0},uMirror:{value:new he},uCalm:{value:new he},uCalmK:{value:new L},uOrb:{value:new vt},uOrbPos:{value:new L},uFog:{value:new L((n>>16&255)/255,(n>>8&255)/255,(n&255)/255)},uFogNear:{value:30},uFogFar:{value:150}},st=new fe({uniforms:z,vertexShader:rg,fragmentShader:sg,transparent:!0,depthWrite:!1,side:Ke}),X=new ge(k,st);X.frustumCulled=!1,X.renderOrder=1;const W=i?44:80,B=new Float32Array(W*3);for(let Z=0;Z<W*3;Z++)B[Z]=Math.random();const et=new Cn(1,10,8),Q=new fe({vertexShader:og,fragmentShader:ag,transparent:!0,depthWrite:!1}),$=new Ea(et,Q,W);$.instanceMatrix.setUsage(va),$.frustumCulled=!1,$.renderOrder=7;const Rt=new be,Bt=new L(0,1,0),Y=new L,ut=Z=>{X.scale.y=Math.max(Z.flat,.02),X.position.y=(1-Z.flat)*.3-(Z.drop??0),z.uTime.value=Z.t,z.uStir.value=Z.stir,z.uGlow.value=Z.stir*(1+Z.flash),z.uOpacity.value=Z.show,z.uFlat.value=Z.flat,z.uOrb.value.set(Z.orbX,Z.orbZ),z.uOrbPos.value.set(Z.orbX,Z.orbY,Z.orbZ),z.uFogNear.value=Z.fogNear,z.uFogFar.value=Z.fogFar,z.uCalm.value.set(Z.calm[0],Z.calm[1],Z.calm[2],Z.calm[3]),z.uCalmK.value.set(Z.calm[4],Z.calm[5],Z.calm[6]??0),z.uMirror.value.set(Z.mirror[0],Z.mirror[1],Z.mirror[2],Z.mirror[3]),Z.boil?z.uBoil.value.set(Z.boil[0],Z.boil[1],Z.boil[2],Z.boil[3]):z.uBoil.value.z=0,Z.nova?z.uNova.value.set(Z.nova[0],Z.nova[1],Z.nova[2],Z.nova[3]):z.uNova.value.z=-1,z.uNovaSpeed.value=Z.novaSpeed??22,Z.funnel?z.uFunnel.value.copy(Z.funnel):z.uFunnel.value.z=0,Z.boilLook&&z.uBoilLook.value.set(Z.boilLook[0],Z.boilLook[1],Z.boilLook[2],Z.boilLook[3]);for(let ht=0;ht<8;ht++){const tt=Z.pops?.[ht];tt?z.uPops.value[ht].set(tt[0],tt[1],tt[2],tt[3]):z.uPops.value[ht].z=0}if(z.uSkyTurn.value=Z.skyTurn??0,X.visible=$.visible=Z.show>.01,!X.visible)return;const Nt=(l(Z.orbZ)-.4)*Z.flat,J=Z.stir*Z.show,at=18,A=1.5;for(let ht=0;ht<W;ht++){const tt=B[ht*3],_t=B[ht*3+1],lt=B[ht*3+2],it=ht%4===0,rt=(_t+Z.t/A*(.8+lt*.4))%1,_=rt*A,x=it?10+lt*6:3.5+lt*4,I=it?10+tt*3:6.5+tt*4,O=.5,K=2.5+tt*3.5+x*_,q=(tt*37+lt*11)%6.283+O*_,gt=Math.cos(q),pt=Math.sin(q),Tt=Z.orbX+K*gt,Vt=Z.orbZ+K*pt,ft=Nt+I*_-.5*at*_*_,Ft=J>.02&&ft>Nt&&ft>e(Tt,Vt)*Z.flat&&ht<W*ct?(.032+.05*lt*lt)*Ct*Math.min(1,_*14)*Math.min(1,J*2):0;Y.set(x*gt-K*O*pt,I-at*_,x*pt+K*O*gt);const Ot=Y.length();Rt.position.set(Tt,ft,Vt),Rt.quaternion.setFromUnitVectors(Bt,Y.divideScalar(Ot||1)),Rt.scale.set(Ft,Ft*(1+Ot*.045),Ft),Rt.updateMatrix(),$.setMatrixAt(ht,Rt.matrix)}$.instanceMatrix.needsUpdate=!0},mt=Z=>{z.uVar.value=Z};let ct=1,Ct=1;return{river:X,spray:$,update:ut,setVariant:mt,setLook:Z=>{z.uVar.value=Z.waterDesign,z.uRough.value=Z.waterTexture,z.uDetailK.value=Z.waterRipples,z.uSwirlR.value=Z.swirlSize,z.uSwirlDepth.value=Z.swirlDepth,z.uSwirlSpeed.value=Z.swirlSpeed,z.uSwirlLines.value=Z.swirlLines,z.uClear.value=Z.waterClear,z.uSwirlSoft.value=Z.swirlSoft,z.uFoamK.value=Z.waterFoam,z.uGlintK.value=Z.waterGlint,z.uReflect.value=Z.waterReflect,z.uBody.value=Z.waterColour,z.uSilk.value=Z.waterSheen,ct=Z.sprayAmount,Ct=Z.spraySize},levelAt:l,disposables:[k,st,et,Q]}}const cg=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,ug=`
uniform float uTime, uBloom, uRays, uFlash, uOpacity, uReach;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p) * uReach;          // distance from the centre, in orb radii
  float past = max(r - 1.0, 0.0);        // how far past the orb's edge
  float ang = atan(p.y, p.x);
  float bloom = (exp(-past * 3.5) * 0.9 + exp(-past * 1.1) * 0.35) * uBloom * (1.0 + 1.5 * uFlash);
  float s1 = 0.5 + 0.5 * sin(ang * 7.0 + uTime * 0.15);
  float s2 = 0.5 + 0.5 * sin(ang * 13.0 - uTime * 0.11 + 1.3);
  float s3 = 0.5 + 0.5 * sin(ang * 23.0 + uTime * 0.07 + 4.0);
  float ray = pow(s1 * s2, 2.0) + 0.5 * pow(s2 * s3, 3.0);
  float rays = (ray * exp(-past * 0.75) * smoothstep(0.0, 0.3, past) * 0.5 + exp(-past * 0.45) * 0.12) * uRays * (1.0 + uFlash);
  float fade = 1.0 - smoothstep(0.7, 1.0, length(p));
  gl_FragColor = vec4(vec3(0.55, 0.82, 1.0) * (bloom + rays) * fade * uOpacity, 1.0);
}`,hg=`
attribute vec4 aSeed;
uniform float uTime, uAmount, uSize, uR;
varying float vA;
void main() {
  float rad = uR * (1.15 + 0.9 * aSeed.x);
  float a = aSeed.z * 6.283 + uTime * (0.6 + 1.4 * aSeed.y) * uR / rad;
  vec3 p = vec3(cos(a) * rad, 0.0, sin(a) * rad);
  float tilt = (aSeed.w - 0.5) * 2.2, ct = cos(tilt), st = sin(tilt);
  p = vec3(p.x, -st * p.z, ct * p.z);
  float tw = aSeed.x * 6.283, cw = cos(tw), sw = sin(tw);
  p = vec3(cw * p.x + sw * p.z, p.y, -sw * p.x + cw * p.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aSeed.y) / max(-mv.z, 0.1);
  vA = step(fract(aSeed.x * 7.31 + aSeed.w * 3.17), uAmount) * (0.55 + 0.45 * sin(uTime * 3.0 + aSeed.z * 40.0));
}`,fg=`
uniform float uOpacity;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * a * a * vA * uOpacity, 1.0);
}`;function dg(i){const t=new Je,e=4.2,n=new Ji(2*i*e,2*i*e),r=new fe({uniforms:{uTime:{value:0},uBloom:{value:0},uRays:{value:0},uFlash:{value:0},uOpacity:{value:1},uReach:{value:e}},vertexShader:cg,fragmentShader:ug,transparent:!0,depthWrite:!1,blending:je}),s=new ge(n,r);s.renderOrder=4,s.onBeforeRender=(p,d,g)=>{s.quaternion.copy(g.quaternion),s.updateMatrixWorld()};const o=160,a=new Float32Array(o*4);for(let p=0;p<o*4;p++){const d=Math.sin(p*12.9898+4.1)*43758.5453;a[p]=d-Math.floor(d)}const l=new xe;l.setAttribute("position",new pe(new Float32Array(o*3),3)),l.setAttribute("aSeed",new pe(a,4));const c=new fe({uniforms:{uTime:{value:0},uAmount:{value:0},uSize:{value:60},uR:{value:i},uOpacity:{value:1}},vertexShader:hg,fragmentShader:fg,transparent:!0,depthWrite:!1,blending:je}),u=new ra(l,c);return u.frustumCulled=!1,u.renderOrder=7,t.add(s,u),{group:t,update:(p,d,g)=>{r.uniforms.uTime.value=p,r.uniforms.uBloom.value=g.bloom,r.uniforms.uRays.value=g.rays,r.uniforms.uFlash.value=g.flash,r.uniforms.uOpacity.value=d,s.visible=(g.bloom>0||g.rays>0)&&d>.01,c.uniforms.uTime.value=p,c.uniforms.uAmount.value=g.sparks,c.uniforms.uOpacity.value=d,c.uniforms.uSize.value=.11*g.pxScale,u.visible=g.sparks>0&&d>.01},disposables:[n,r,l,c]}}const ps=24,pg=4;function $l(i,t,e,n){const r=[i.clone(),t.clone()];let s=i.distanceTo(t)*.16;for(;r.length<ps;){for(let o=r.length-1;o>0&&!(r.length>=ps);o--){const a=r[o-1].clone().lerp(r[o],.5);a.x+=(n()-.5)*s,a.y+=(n()-.5)*s*.6,a.z+=(n()-.5)*s,r.splice(o,0,a)}s*=.55}for(let o=0;o<ps;o++){const a=r[o]??r[r.length-1];e[o*3]=a.x,e[o*3+1]=a.y,e[o*3+2]=a.z}}const mg=`
uniform float uAlpha;
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(1.0 - facing, 3.0);
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * (rim * 1.4 + 0.05) * uAlpha, 1.0);
}`,gg=`
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  vY = uv.y;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal; vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;function vg(){const i=new Je,t=Array.from({length:pg},()=>{const g=new Float32Array(ps*3),v=new xe;v.setAttribute("position",new pe(g,3));const m=new Ic({color:14217471,transparent:!0,opacity:0,blending:je,depthWrite:!1}),h=new Nc(v,m);return h.frustumCulled=!1,h.renderOrder=7,h.visible=!1,i.add(h),{pos:g,geo:v,mat:m,line:h,life:9,target:new L}}),e=new Cn(1,40,24),n=new fe({uniforms:{uAlpha:{value:0}},vertexShader:gg,fragmentShader:mg,transparent:!0,depthWrite:!1,blending:je}),r=new ge(e,n);r.renderOrder=7,r.visible=!1,r.frustumCulled=!1,i.add(r);const s=(g,v,m,h)=>{if(r.visible=g>=0&&g<1.6&&h>0,!r.visible)return;const T=m*(1.1+30*h*(1-Math.exp(-g*2.2)));r.position.copy(v),r.scale.setScalar(T),n.uniforms.uAlpha.value=Math.exp(-g*2.4)*Math.min(1,g*20)},o=(g,v,m)=>{for(const h of t)h.target.copy(m()),f.copy(h.target).sub(g).normalize(),u.copy(g).addScaledVector(f,v*.95),$l(u,h.target,h.pos,c),h.geo.attributes.position.needsUpdate=!0,h.life=0};const sk=Array.from({length:12},()=>{const g=new Float32Array(ps*3),v=new xe;v.setAttribute("position",new pe(g,3));const m=new Ic({color:15661311,transparent:!0,opacity:0,blending:je,depthWrite:!1}),h=new Nc(v,m);return h.frustumCulled=!1,h.renderOrder=8,h.visible=!1,i.add(h),{pos:g,geo:v,mat:m,line:h}});let skL=9,skP=0,skN=0;const skA=new L,skF=new L,skE=new L,skS=(top,hit,pw)=>{const P=3*pw,mn=sk[0].pos,D=top.distanceTo(hit),w=D*.003;$l(top,hit,mn,c);for(let k=1;k<9;k++){const ox=(k%3-1)*w,oz=(Math.floor(k/3)-1)*w;for(let q=0;q<ps;q++)sk[k].pos[q*3]=mn[q*3]+ox,sk[k].pos[q*3+1]=mn[q*3+1],sk[k].pos[q*3+2]=mn[q*3+2]+oz}for(let k=9;k<12;k++){const at=4+Math.floor(c()*12);skF.set(mn[at*3],mn[at*3+1],mn[at*3+2]),skE.copy(hit).sub(top).multiplyScalar(.25+c()*.25).add(skF),skE.x+=(c()-.5)*D*.4,skE.z+=(c()-.5)*D*.25,$l(skF,skE,sk[k].pos,c)}for(const b of sk)b.geo.attributes.position.needsUpdate=!0;skA.copy(hit),skL=0,skP=P,skN=Math.max(1,Math.min(9,Math.round(P)))};let a=0,l=1;const c=()=>(l=l*16807%2147483647,l/2147483647),u=new L,f=new L,p=(g,v,m,h,T,M,y,U)=>{if(a-=v,m>.25&&y.bolts>0&&a<=0){const P=t.find(b=>b.life>.3);P&&(P.target.copy(U()),f.copy(P.target).sub(h).normalize(),u.copy(h).addScaledVector(f,T*.95),$l(u,P.target,P.pos,c),P.geo.attributes.position.needsUpdate=!0,P.life=0),a=(.15+.85*(1-m))*(.5+c())/y.bolts}let R=0,w=null;for(const P of t){P.life+=v;const b=P.life<.3?Math.exp(-P.life*12)*(P.life%.06<.03?1:.45):0;P.line.visible=b>.01,P.mat.opacity=Math.min(1,b*1.4),b>R&&(R=b,w=P.target)}skL+=v;const sO=skL<.6+.06*skP?Math.exp(-skL*4/(1+.15*skP))*(skL%.09<.05?1:.35):0;sk.forEach((b,q)=>{const u=q<9?q<skN:skP>=1.5;b.line.visible=u&&sO>.01,b.mat.opacity=Math.min(1,sO*(q<9?1.5:.9))});const sF=Math.min(3,sO*skP*.5);sF>R&&(R=sF,w=skA);return{flash:R,at:w}},d=[e,n,...t.flatMap(g=>[g.geo,g.mat]),...sk.flatMap(g=>[g.geo,g.mat])];return{group:i,update:p,novaAt:s,burstAll:o,skyStrike:skS,disposables:d}}const Ui=320,ho=160,_g=`
attribute float aFade;
attribute float aMix;
varying vec3 vWN; varying vec3 vWP; varying float vFade; varying float vMix;
void main() {
  vFade = aFade; vMix = aMix;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,xg=`
uniform float uGlow;
varying vec3 vWN; varying vec3 vWP; varying float vFade; varying float vMix;
${ws}
void main() {
  vec3 n = normalize(vWN), v = normalize(cameraPosition - vWP);
  float facing = abs(dot(n, v));
  float fres = 0.04 + 0.96 * pow(1.0 - facing, 4.0);
  vec3 r = reflect(-v, n);
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 2.5;
  // Leaving the lake it is lake water: near-black blue, mostly mirroring the sky. As it nears the orb it takes
  // on the orb's colour and light: bright blue, glowing from inside, white at the core (vMix 0 -> 1).
  vec3 lake = mix(vec3(0.006, 0.035, 0.08), vec3(0.03, 0.12, 0.2), pow(1.0 - facing, 2.0));
  vec3 orb = mix(vec3(0.86, 0.97, 1.0), vec3(0.2, 0.55, 1.0), pow(1.0 - facing, 1.2)) * (1.0 + 0.6 * uGlow);
  vec3 body = mix(lake, orb, vMix);
  float spec = pow(max(dot(r, normalize(vec3(-0.35, 0.85, 0.4))), 0.0), 90.0);
  vec3 col = mix(body, sky * (1.0 - 0.6 * vMix) + vec3(0.3, 0.6, 1.0) * 0.3 * vMix, fres * (1.0 - 0.5 * vMix)) + vec3(1.0) * spec * 1.4;
  gl_FragColor = vec4(col, (0.85 + 0.15 * fres) * vFade);
}`,yg=`
attribute float aA;
attribute float aS;
uniform float uPx;
varying float vA; varying float vSeed;
void main() {
  vA = aA; vSeed = fract(position.x * 1.7 + position.z * 3.1);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * aS / max(-mv.z, 0.1) : 0.0;
}`,Mg=`
uniform vec3 uColor; uniform float uCore; uniform float uPuff;
varying float vA; varying float vSeed;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = length(q);
  float soft = exp(-d * d * 18.0);
  float core = exp(-d * d * 160.0) * uCore;
  // Mist: break the round spot up a little so it reads as vapour, not a dot.
  float n = 0.5 + 0.5 * sin(q.x * 13.0 + vSeed * 30.0) * sin(q.y * 11.0 - vSeed * 17.0);
  float a = mix(soft, soft * (0.55 + 0.45 * n), uPuff);
  gl_FragColor = vec4((uColor * a + vec3(1.0) * core) * vA, 1.0);
}`,os=2400,Ii=10,Sg=`
attribute float aA;
uniform float uPx;
varying float vA;
void main() {
  vA = aA;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * 0.16 / max(-mv.z, 0.1) : 0.0;
}`,Eg=`
varying float vA;
void main() {
  vec2 q = abs(gl_PointCoord - 0.5);
  if (max(q.x * 1.2, q.y) > 0.42) discard; // a rough chunk, not a dot
  gl_FragColor = vec4(mix(vec3(0.05, 0.06, 0.09), vec3(0.35, 0.6, 0.85), 0.3 * (1.0 - gl_PointCoord.y)), vA);
}`;function bg(){const i=new Je,t=new Cn(1,16,12),e=new _s(new Float32Array(Ui),1),n=new _s(new Float32Array(Ui),1);t.setAttribute("aFade",e),t.setAttribute("aMix",n);const r=new fe({uniforms:{uGlow:{value:0},uSkyTurn:{value:0}},vertexShader:_g,fragmentShader:xg,transparent:!0,depthWrite:!0}),s=new Ea(t,r,Ui);s.frustumCulled=!1,s.renderOrder=6,s.count=0;const o=new Float32Array(ho*3),a=new Float32Array(ho),l=new xe;l.setAttribute("position",new pe(o,3)),l.setAttribute("aA",new pe(a,1));const c=new fe({uniforms:{uPx:{value:800}},vertexShader:Sg,fragmentShader:Eg,transparent:!0,depthWrite:!1}),u=new ra(l,c);u.frustumCulled=!1,u.renderOrder=3;const f=new Float32Array(os*3),p=new Float32Array(os),d=new Float32Array(os),g=new xe;g.setAttribute("position",new pe(f,3)),g.setAttribute("aA",new pe(p,1)),g.setAttribute("aS",new pe(d,1));const v=new fe({uniforms:{uPx:{value:800},uColor:{value:new L(.5,.8,1)},uCore:{value:0},uPuff:{value:0}},vertexShader:yg,fragmentShader:Mg,transparent:!0,depthWrite:!1,blending:je}),m=new ra(g,v);m.frustumCulled=!1,m.renderOrder=7,i.add(s,u,m);const h=[],T=[],M=[];let y=0;const U=new ue,R=new $i,w=new L(0,1,0),P=new L,b=new L,S=new L,C=new L,V=(W,B)=>W+Math.random()*(B-W),k=(W,B,et,Q,$)=>({x:W,y:B,z:et,vx:0,vy:0,vz:0,age:0,life:Q,size:$,seed:Math.random(),out:!1});return{group:i,update:(W,B,et,Q,$,Rt,Bt,Y,ut,mt)=>{const ct=it=>$.on[it-1]===!0;C.copy(et),y+=W*$.amount*(B>.02?20+300*B*B:0);let Ct=0;for(;y>=1&&Ct++<60;){y-=1;const it=[1,2,3].filter(ct);if(it.length===0){y=0;break}const rt=it[Math.floor(Math.random()*it.length)],_=Math.random()*Math.PI*2;if(rt===1&&h.length<Ui*.7)for(let x=0;x<5;x++){const I=Q*V(1.6,7),O=C.x+Math.cos(_+x)*I,K=C.z+Math.sin(_+x)*I*.8,q=Bt(O,K);if(q===null)continue;const gt=k(O,q-.1,K,V(2.5,4),Q*V(.035,.09));gt.vy=V(.8,1.8),h.push(gt),Y(O,K,gt.size*6);break}else if(rt===2&&T.length<260){const x=$.vortex,I=Math.round(x.look),O=k(0,0,0,V(1.6,2.8),Q*V(.015,.035)*x.size);O.look=I,O.th=_,O.tn=0,O.trail=new Float32Array(Ii*3),I===4?(O.r=Q*V(1.4,2.8)*x.reach,O.h=(Bt(C.x,C.z)??C.y-Q*2)-C.y,O.life=V(1.8,3)):(O.r=Q*V(1.25,2.4)*x.reach,O.h=V(-.7,.6)*Q),I===3&&(O.size=Q*V(.5,1.1)*x.size,O.life=V(2.5,4)),O.x=C.x+Math.cos(_)*O.r,O.y=C.y+O.h,O.z=C.z+Math.sin(_)*O.r;for(let K=0;K<Ii;K++)O.trail.set([O.x,O.y,O.z],K*3);T.push(O)}else if(rt===3&&M.length<ho){const x=Q*V(1.6,6),I=C.x+Math.cos(_)*x,O=C.z+Math.sin(_)*x*.8;M.push(k(I,Rt(I,O),O,V(4,7),1))}}y>10&&(y=10);const It=$.speed*(.4+1.6*B),Z=(it,rt,_)=>{const x=C.x-it.x,I=C.y-it.y,O=C.z-it.z,K=Math.hypot(x,I,O)||1;it.vx+=(x/K*rt-O/K*_)*W,it.vy+=I/K*rt*W,it.vz+=(O/K*rt+x/K*_)*W;const q=Math.exp(-W*1.2);return it.vx*=q,it.vy*=q,it.vz*=q,K},Nt=it=>{it.vy-=9.8*W,it.x+=it.vx*W,it.y+=it.vy*W,it.z+=it.vz*W};let J=0;const at=(it,rt)=>{if(J>=Ui)return;const _=Math.hypot(it.vx,it.vy,it.vz);P.set(it.vx,it.vy,it.vz),_>.001?P.divideScalar(_):P.set(0,1,0),R.setFromUnitVectors(w,P);const x=1+Math.min(2.5,_*.12);b.set(it.size/Math.sqrt(x),it.size*x,it.size/Math.sqrt(x)),U.compose(S.set(it.x,it.y,it.z),R,b);const I=Math.hypot(C.x-it.x,C.y-it.y,C.z-it.z);s.setMatrixAt(J,U),e.setX(J,rt),n.setX(J,Math.min(1,Math.max(0,(Q*4-I)/(Q*3)))),J++};let A=0;const ht=$.vortex,tt=Math.round(ht.look),_t=it=>{const rt=Math.min(1,it.age*4)*Math.min(1,(it.life-it.age)*2.5),_=it.look??1,x=_===2?.6+.4*Math.sin(it.age*60+it.seed*40):1,I=_===3?.07:_===2?.9:.22,O=_===3?it.size*.9:_===2?Q*.05*ht.size:Q*.09*ht.size,K=_===3?1:Math.max(1,Math.round(Ii*Math.min(1,ht.trail*(_===2?.5:1))));for(let q=0;q<K&&A<os;q++){const gt=((it.tn??0)-q+Ii)%Ii,pt=1-q/K;f[A*3]=it.trail[gt*3],f[A*3+1]=it.trail[gt*3+1],f[A*3+2]=it.trail[gt*3+2],p[A]=rt*x*I*pt*ht.glow,d[A]=O*(.5+.5*pt)/Q,A++}};for(const it of[h,T])for(let rt=it.length-1;rt>=0;rt--){const _=it[rt];_.age+=W;let x=_.age>_.life;if(_.out&&it===T&&_.look!==void 0&&_.look!==0&&_.look!==4){const I=Math.exp(-W*1.5);_.vx*=I,_.vy*=I,_.vz*=I,_.x+=_.vx*W,_.y+=_.vy*W,_.z+=_.vz*W}else if(_.out){Nt(_);const I=Bt(_.x,_.z);_.vy<0&&_.y<(I??Rt(_.x,_.z))&&(I!==null&&Y(_.x,_.z,_.size*8),x=!0)}else if(it===h){const I=Math.min(1,_.age/.6),O=Z(_,(4+26*B)*It*I,(2+6*B)*It*I);I<1&&(_.vy=Math.max(_.vy,1.2)),_.x+=_.vx*W,_.y+=_.vy*W,_.z+=_.vz*W,O<Q*.95&&(x=!0),B<.01&&(_.out=!0,_.vx*=.3,_.vz*=.3)}else{const I=_.r,O=(1.6+6*B)*It/Math.max(.6,I/Q);_.th+=O*W,_.r=Math.max(Q*1.02,I-Q*(.12+.5*B)*It*W*(_.look===4?.6:1)),_.look===4?_.h+=Q*(.9+1.4*B)*It*W:_.h+=Math.sin(_.age*2+_.seed*6)*Q*.25*W;const K=C.x+Math.cos(_.th)*_.r,q=C.y+_.h,gt=C.z+Math.sin(_.th)*_.r;_.vx=(K-_.x)/Math.max(W,.001),_.vy=(q-_.y)/Math.max(W,.001),_.vz=(gt-_.z)/Math.max(W,.001),_.x=K,_.y=q,_.z=gt,B<.01&&_.age>.2&&(_.out=!0,_.age=0,_.life=1),_.look===4&&_.h>-Q*.6&&(x=!0)}if(_.trail&&(_.tn=((_.tn??0)+1)%Ii,_.trail.set([_.x,_.y,_.z],_.tn*3)),x){it.splice(rt,1);continue}if(it===T&&_.look!==void 0&&_.look!==0&&_.look!==4){_t(_);continue}at(_,Math.min(1,_.age*5)*Math.min(1,(_.life-_.age)*3)*(_.splash?.4:1))}s.count=J,s.visible=J>0,g.setDrawRange(0,A),m.visible=A>0,g.attributes.position.needsUpdate=!0,g.attributes.aA.needsUpdate=!0,g.attributes.aS.needsUpdate=!0,v.uniforms.uPx.value=ut*Q,v.uniforms.uColor.value.set(...tt===2?[.35,.65,1]:tt===3?[.45,.7,.95]:[.75,.88,1]),v.uniforms.uCore.value=tt===2?1:0,v.uniforms.uPuff.value=tt===3?1:0,s.instanceMatrix.needsUpdate=!0,e.needsUpdate=!0,n.needsUpdate=!0,r.uniforms.uGlow.value=B,r.uniforms.uSkyTurn.value=mt;let lt=0;for(let it=M.length-1;it>=0;it--){const rt=M[it];if(rt.age+=W,rt.out)Nt(rt);else{const x=B>.12?(.6+2.2*B)*It:-4;rt.vy+=(x-rt.vy)*Math.min(1,W*2);const I=C.x-rt.x,O=C.z-rt.z,K=(.3+1.2*B)*It;rt.vx=-O*K*.12,rt.vz=I*K*.12,rt.x+=rt.vx*W,rt.y+=rt.vy*W,rt.z+=rt.vz*W}const _=Rt(rt.x,rt.z);if(rt.age>.5&&rt.y<_-.2||rt.age>(rt.out?rt.life:30)){M.splice(it,1);continue}o[lt*3]=rt.x,o[lt*3+1]=rt.y,o[lt*3+2]=rt.z,a[lt]=Math.min(1,rt.age*4)*(rt.out?Math.min(1,(rt.life-rt.age)*2):1)*.9,lt++}l.setDrawRange(0,lt),u.visible=lt>0,l.attributes.position.needsUpdate=!0,l.attributes.aA.needsUpdate=!0,c.uniforms.uPx.value=ut},explode:(W,B)=>{for(const et of[h,T,M])for(const Q of et){P.set(Q.x-W.x,Q.y-W.y,Q.z-W.z),P.lengthSq()<1e-4&&P.set(Math.random()-.5,.3,Math.random()-.5),P.normalize();const $=B*V(10,24);Q.vx=P.x*$,Q.vy=Math.abs(P.y)*$*.6+V(3,9)*B,Q.vz=P.z*$,Q.out=!0,Q.age=0,Q.life=V(1.4,3)}},splash:(W,B,et,Q)=>{for(let $=0;$<et&&h.length<Ui;$++){const Rt=Math.random()*Math.PI*2,Bt=B*V(.8,6),Y=W.x+Math.cos(Rt)*Bt,ut=W.z+Math.sin(Rt)*Bt*.8,mt=Q(Y,ut);if(mt===null)continue;const ct=k(Y,mt,ut,V(1.5,3),B*V(.03,.1)),Ct=V(4,12)*(1.3-Bt/(B*7));ct.vx=Math.cos(Rt)*Ct,ct.vz=Math.sin(Rt)*Ct,ct.vy=V(6,16),ct.out=!0,ct.splash=!0,h.push(ct)}},disposables:[t,r,l,c,g,v]}}const Tg=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,wg=`
uniform float uProgress; uniform float uAlpha; uniform sampler2D uText;
varying vec2 vUv;
const float SWEEP = 270.0, TICKS = 50.0;
float band(float x, float c, float w) { float f = fwidth(x); return 1.0 - smoothstep(w - f, w + f, abs(x - c)); }
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  // Angle measured clockwise from the bottom-left (225°), 0..270 inside the sweep.
  float theta = mod(225.0 - degrees(atan(p.y, p.x)), 360.0);
  float t = theta / SWEEP;
  float inSweep = step(theta, SWEEP);
  // Tick marks: short ones, a longer one every fifth.
  float k = t * TICKS, idx = floor(k + 0.5), off = abs(k - idx);
  float tickW = fwidth(k) * 0.9;
  float longTick = step(mod(idx, 5.0), 0.5);
  float tick = (1.0 - smoothstep(tickW, tickW * 2.0, off)) * step(longTick > 0.5 ? 0.86 : 0.9, r) * step(r, 0.95) * inSweep;
  float track = band(r, 0.8, 0.003) * inSweep;
  float fill = band(r, 0.8, 0.007) * inSweep * step(t, uProgress);
  vec2 tipAt = vec2(cos(radians(225.0 - SWEEP * uProgress)), sin(radians(225.0 - SWEEP * uProgress))) * 0.8;
  float tip = 1.0 - smoothstep(0.012, 0.022, length(p - tipAt));
  float glow = exp(-pow((r - 0.8) / 0.03, 2.0)) * inSweep * step(t, uProgress) * 0.35;
  // The percentage, under the gap at the bottom.
  vec2 tq = (p - vec2(0.0, -0.74)) / vec2(0.28, 0.07) * 0.5 + 0.5;
  float text = (tq.x > 0.0 && tq.x < 1.0 && tq.y > 0.0 && tq.y < 1.0) ? texture2D(uText, tq).a : 0.0;
  float a = tick * 0.35 + track * 0.12 + fill + tip + glow + text * 0.85;
  vec3 col = mix(vec3(1.0), vec3(0.6, 0.85, 1.0), glow * 2.0);
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * uAlpha);
}`;function Ag(){const i=document.createElement("canvas");i.width=128,i.height=32;const t=i.getContext("2d"),e=new ba(i),n=new Ji(2,2),r=new fe({uniforms:{uProgress:{value:0},uAlpha:{value:0},uText:{value:e}},vertexShader:Tg,fragmentShader:wg,transparent:!0,depthWrite:!1,depthTest:!1}),s=new ge(n,r);s.renderOrder=9,s.frustumCulled=!1,s.visible=!1,s.onBeforeRender=(c,u,f)=>{s.quaternion.copy(f.quaternion),s.updateMatrixWorld()};let o=0,a=-1;return{mesh:s,update:(c,u,f)=>{o+=(u-o)*.12,s.visible=o>.01,s.scale.setScalar(f*1.42),r.uniforms.uProgress.value=c,r.uniforms.uAlpha.value=o;const p=Math.round(c*100);p!==a&&(a=p,t.clearRect(0,0,128,32),t.fillStyle="#fff",t.font="500 20px ui-monospace, Menlo, monospace",t.textAlign="center",t.textBaseline="middle",t.fillText(`${p}%`,64,17),e.needsUpdate=!0)},disposables:[n,r,e]}}const fo=4.62,dr=-300,po=58;function Rg(i,t){const e=t?70:140,n=Kc().map(d=>{const g=new ba(d);return g.colorSpace=Be,g}),r=new Je,s=[];for(let d=dr;d<=po+2;d+=2){let g=0;for(;g<60&&i(g,d)<fo-.01*d&&i(-g,d)<fo-.01*d;)g+=.5;s.push(g)}const o=d=>s[Math.max(0,Math.min(s.length-1,Math.round((d-dr)/2)))];$c(21);const a=(d,g)=>{d.z=g?dr+Ln()*(po-dr-10):dr+Ln()*30;const v=Ln()<.5?-1:1;d.x=v*(o(d.z)+6+Ln()*70),d.y=i(d.x,d.z)+2,d.vx=0,d.vz=0,d.life=g?1:0},l=Array.from({length:e},(d,g)=>{const v=new Sa({map:n[Math.floor(Ln()*n.length)],transparent:!0,depthWrite:!1,depthTest:!1,fog:!0,opacity:0}),m=new Uc(v);m.renderOrder=3.5,r.add(m);const h={s:m,mat:v,x:0,y:0,z:0,vx:0,vz:0,size:.6+Ln()*.9,lift:Ln(),gust:Ln()*6.3,life:1,fade:g<e*nt.cloudCount?1:0};return a(h,!0),h}),c={white:[1,1,1],blue:[.72,.84,1]},u=new L;let f=-1;return{group:r,update:(d,g,v,m,h)=>{r.visible=nt.cloudsOn>.5&&m>.01;const T=f<0?0:Math.min(.05,Math.max(0,d-f));if(f=d,!r.visible)return;g.getWorldPosition(u);const M=Math.round(e*nt.cloudCount),y=[0,1,2].map(w=>c.white[w]+(c.blue[w]-c.white[w])*nt.cloudTint),U=2.2*nt.cloudDrift,R=30*nt.cloudOrbRadius;l.forEach((w,P)=>{const b=22*nt.cloudSize*w.size,S=Math.sin(d*.13+w.gust)*.6;let C=(-Math.sign(w.x)*.35+.25*S)*U-w.vx,V=(1+.3*S)*U-w.vz;const z=o(w.z)+b*(.32+.5*nt.cloudSpread)-Math.abs(w.x);z>0&&(C+=Math.sign(w.x||1)*z*1.6);const st=w.x-h.x,X=w.z-h.z,W=Math.hypot(st,X)||1;if(W<R){const Y=26*nt.cloudOrbPush*Math.pow(1-W/R,2);C+=st/W*Y,V+=X/W*Y*.6}w.vx+=C*T*.8,w.vz+=V*T*.8,w.x+=w.vx*T,w.z+=w.vz*T;const et=Math.max(i(w.x,w.z),fo)*v+(.4+w.lift*2.5)*nt.cloudHeight;w.y+=(et-w.y)*Math.min(1,T*1.5);const Q=w.z>po-6||Math.abs(w.x)>105;w.life=Math.max(0,Math.min(1,w.life+T*(Q?-.6:.35))),Q&&w.life<=0&&a(w,!1),w.fade+=((P<M?1:0)-w.fade)*Math.min(1,T*.8);const $=Math.min(1,Math.max(0,(w.s.position.distanceTo(u)-8)/(18*nt.cloudSize))),Rt=.75+.25*Math.sin(d*.3+w.gust),Bt=nt.cloudOpacity*$*Rt*m*w.life*w.fade;w.s.visible=Bt>.003,w.s.position.set(w.x,w.y,w.z),w.s.scale.set(b,b*.5*nt.cloudFlat,1),w.mat.opacity=Bt,w.mat.color.setRGB(y[0],y[1],y[2])})},disposables:[...n,...l.map(d=>d.mat)]}}class Cg extends Ra{constructor(t){super(t)}load(t,e,n,r){const s=this,o=new q0(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){const l=s.parse(JSON.parse(a));e&&e(l)},n,r)}parse(t){return new Pg(t)}}class Pg{constructor(t){this.isFont=!0,this.type="Font",this.data=t}generateShapes(t,e=100){const n=[],r=Lg(t,e,this.data);for(let s=0,o=r.length;s<o;s++)n.push(...r[s].toShapes());return n}}function Lg(i,t,e){const n=Array.from(i),r=t/e.resolution,s=(e.boundingBox.yMax-e.boundingBox.yMin+e.underlineThickness)*r,o=[];let a=0,l=0;for(let c=0;c<n.length;c++){const u=n[c];if(u===`
`)a=0,l-=s;else{const f=Dg(u,r,a,l,e);a+=f.offsetX,o.push(f.path)}}return o}function Dg(i,t,e,n,r){const s=r.glyphs[i]||r.glyphs["?"];if(!s){console.error('THREE.Font: character "'+i+'" does not exists in font family '+r.familyName+".");return}const o=new Y0;let a,l,c,u,f,p,d,g;if(s.o){const v=s._cachedOutline||(s._cachedOutline=s.o.split(" "));for(let m=0,h=v.length;m<h;)switch(v[m++]){case"m":a=v[m++]*t+e,l=v[m++]*t+n,o.moveTo(a,l);break;case"l":a=v[m++]*t+e,l=v[m++]*t+n,o.lineTo(a,l);break;case"q":c=v[m++]*t+e,u=v[m++]*t+n,f=v[m++]*t+e,p=v[m++]*t+n,o.quadraticCurveTo(f,p,c,u);break;case"b":c=v[m++]*t+e,u=v[m++]*t+n,f=v[m++]*t+e,p=v[m++]*t+n,d=v[m++]*t+e,g=v[m++]*t+n,o.bezierCurveTo(f,p,d,g,c,u);break}}return{offsetX:s.ha*t,path:o}}class Ug extends Aa{constructor(t,e={}){const n=e.font;if(n===void 0)super();else{const r=n.generateShapes(t,e.size);e.depth===void 0&&e.height!==void 0&&console.warn("THREE.TextGeometry: .height is now depreciated. Please use .depth instead"),e.depth=e.depth!==void 0?e.depth:e.height!==void 0?e.height:50,e.bevelThickness===void 0&&(e.bevelThickness=10),e.bevelSize===void 0&&(e.bevelSize=8),e.bevelEnabled===void 0&&(e.bevelEnabled=!1),super(r,e)}this.type="TextGeometry"}}const Jl=[()=>tn(()=>import("./helvetiker_regular.typeface-Dygzy7Mx.js"),[],import.meta.url),()=>tn(()=>import("./helvetiker_bold.typeface-pgAee6ga.js"),[],import.meta.url),()=>tn(()=>import("./optimer_regular.typeface-Cju6Sxq0.js"),[],import.meta.url),()=>tn(()=>import("./optimer_bold.typeface-CZGfJgRZ.js"),[],import.meta.url),()=>tn(()=>import("./gentilis_regular.typeface-Ds2DIBGP.js"),[],import.meta.url),()=>tn(()=>import("./gentilis_bold.typeface-OxtC0GsH.js"),[],import.meta.url),()=>tn(()=>import("./droid_sans_regular.typeface-CBRu5cZG.js"),[],import.meta.url),()=>tn(()=>import("./droid_sans_bold.typeface-o-hrii98.js"),[],import.meta.url),()=>tn(()=>import("./droid_serif_regular.typeface-BBGmLrSw.js"),[],import.meta.url),()=>tn(()=>import("./droid_serif_bold.typeface-Lp8aTxAO.js"),[],import.meta.url),()=>tn(()=>import("./droid_sans_mono_regular.typeface-7A1sMzu7.js"),[],import.meta.url)],jl=`
varying vec3 vN;
varying vec3 vObj;
void main() { vN = normal; vObj = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Ql=`
uniform float uOpacity;
uniform float uTop;
uniform float uBright;
varying vec3 vN;
varying vec3 vObj;
void main() {
  vec3 n = normalize(vN);
  float front = smoothstep(0.6, 0.95, n.z);
  float h = clamp(vObj.y / uTop, 0.0, 1.0);
  vec3 face = mix(vec3(0.72, 0.84, 0.95), vec3(0.97, 0.99, 1.0), h);
  float lit = 0.35 + 0.65 * max(dot(n, normalize(vec3(-0.5, 0.7, 0.5))), 0.0);
  vec3 side = vec3(0.16, 0.42, 0.62) * lit + vec3(0.3, 0.6, 0.8) * pow(1.0 - abs(n.z), 3.0) * 0.4;
  gl_FragColor = vec4(mix(side, face, front) * uBright, uOpacity);
}`;function Ig(i="We build it all."){const t=new fe({vertexShader:jl,fragmentShader:Ql,transparent:!0,uniforms:{uOpacity:{value:1},uTop:{value:1},uBright:{value:1}}}),e=new fe({vertexShader:jl,fragmentShader:Ql,transparent:!0,depthWrite:!1,side:Ke,uniforms:{uOpacity:{value:.12},uTop:{value:1},uBright:{value:1}}}),n=new ge(void 0,t),r=new ge(void 0,e);r.scale.y=-1,n.renderOrder=3,r.renderOrder=2;const s=new Je;s.add(n,r),s.visible=!1;let o=-1,a=-1;const l=u=>{const f=new Cg().parse(u),p=new Ug(i,{font:f,size:1.15,depth:.32,curveSegments:8,bevelEnabled:!0,bevelThickness:.03,bevelSize:.02,bevelSegments:2});p.computeBoundingBox();const d=p.boundingBox;p.translate(-(d.min.x+d.max.x)/2,-d.min.y,-(d.min.z+d.max.z)/2);const g=d.max.y-d.min.y;t.uniforms.uTop.value=e.uniforms.uTop.value=g,n.geometry.dispose(),n.geometry=r.geometry=p};return{group:s,mat:t,refl:e,setFont:u=>{const f=Math.max(0,Math.min(Jl.length-1,Math.round(u)));f!==a&&(a=f,Jl[f]().then(p=>{a===f&&o!==f&&(l(p.default),o=f)}).catch(()=>{}))},ready:()=>o>=0,disposables:[t,e,{dispose:()=>n.geometry.dispose()}]}}const tc=`
varying vec3 vN;
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,Ng=`
uniform vec3 uTint;
uniform float uOpacity;
uniform float uRim;
uniform float uShow;
uniform float uJoin; // 0 = glass pipe in the river; 1 = drawn exactly like the page's pipes (thin glass, blue water)
uniform float uInk; // 1 = the water is white ink
uniform vec3 uInkCol;
uniform vec3 uOrbPos;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float f = pow(1.0 - abs(dot(n, v)), 2.5);
  if (uJoin > 0.001) {
    // The page pipe in cross-section: a faint light wall, then blue water in the middle.
    float across = abs(dot(n, v));
    vec3 page = mix(vec3(0.17, 0.18, 0.2), mix(vec3(0.165, 0.56, 0.74), uInkCol, uInk), smoothstep(0.55, 0.75, across));
    page = mix(vec3(0.04, 0.05, 0.08), page, smoothstep(0.15, 0.3, across));
    vec3 toO = normalize(uOrbPos - vW);
    vec3 glassCol = uTint * (0.25 + 1.6 * f * uRim);
    gl_FragColor = vec4(mix(glassCol, page, uJoin), mix(uOpacity + f * 0.55 * uRim, 1.0, uJoin) * uShow);
    return;
  }
  vec3 toOrb = normalize(uOrbPos - vW);
  float spec = pow(max(dot(reflect(-toOrb, n), v), 0.0), 40.0);
  vec3 col = uTint * (0.25 + 1.6 * f * uRim) + vec3(0.9, 0.97, 1.0) * spec * 0.8;
  gl_FragColor = vec4(col, (uOpacity + f * 0.55 * uRim + spec * 0.5) * uShow);
}`,Fg=`
uniform vec3 uTint;
uniform float uGlow;
uniform float uShow;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float c = pow(abs(dot(n, v)), 3.0);
  gl_FragColor = vec4(uTint * c * uGlow * 0.35 * uShow, 1.0);
}`,Og=`
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,zg=`
uniform float uTime;
uniform float uSpeed;
uniform float uThick;
uniform float uShow;
uniform float uJoin;
uniform vec3 uColor;
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float face = abs(dot(n, v));
  float along = vUv.x * 240.0 - uTime * uSpeed;
  float ang = vUv.y * 6.2832;
  // Strands that twist slowly as they flow (continuous all the way round the tube).
  vec2 q = vec2(along * 0.45, cos(ang) * 1.6 + 0.6 * sin(along * 0.11));
  vec2 r = vec2(along * 0.45 + 13.0, sin(ang) * 1.6 + 0.6 * cos(along * 0.09));
  float f = 0.5 * (fbm(q) + fbm(r));
  float strands = smoothstep(0.38, 0.7, f);
  float body = smoothstep(0.08, 0.8, face);
  float a = clamp(body * mix(0.45 + 0.55 * strands, 1.0, uJoin) * uThick * 1.3, 0.0, 1.0);
  gl_FragColor = vec4(uColor, a * uShow);
}`,Bg=`
varying vec3 vN;
void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,kg=`
uniform vec3 uColor;
uniform float uBright;
uniform float uShow;
varying vec3 vN;
void main() { float c = 0.5 + 0.5 * abs(vN.z); gl_FragColor = vec4(uColor * uBright * (0.7 + 0.6 * c) * uShow, 1.0); }`;function Vg({heightAt:i,zFar:t,zNear:e,small:n}){const r=[];for(let et=t;et<=e;et+=4){let Q=1/0;for(let $=-3;$<=3;$+=.5)Q=Math.min(Q,i($,et));r.push(new L(0,Q,et))}const s=new Fc(r),o=new Bn(s,400,1,24,!1),a=new Bn(s,300,1,20,!1),c={uTint:{value:new Kt(7129072)},uShow:{value:1},uJoin:{value:0},uInk:{value:0},uInkCol:{value:new Kt(1,1,1)},uOrbPos:{value:new L}},u=new fe({vertexShader:tc,fragmentShader:Ng,transparent:!0,depthWrite:!1,side:dn,uniforms:{...c,uOpacity:{value:.12},uRim:{value:1}}}),f=new fe({vertexShader:tc,fragmentShader:Fg,transparent:!0,depthWrite:!1,side:Ue,blending:je,uniforms:{...c,uGlow:{value:1}}}),p=new fe({vertexShader:Og,fragmentShader:zg,transparent:!0,depthWrite:!1,side:dn,uniforms:{uTime:{value:0},uSpeed:{value:6},uThick:{value:1},uShow:{value:1},uJoin:c.uJoin,uColor:c.uInkCol}}),d=new ge(new Bn(s,400,.55,20,!1),p);d.renderOrder=.65,d.frustumCulled=!1;const g=new ge(o,u),v=new ge(a,f);g.renderOrder=.6,v.renderOrder=.5,g.frustumCulled=v.frustumCulled=!1;const m=n?300:700,h=new Float32Array(m*3);for(let et=0;et<m*3;et++)h[et]=Math.random();const T=new Cn(1,8,6),M=new fe({vertexShader:Bg,fragmentShader:kg,transparent:!0,depthWrite:!1,blending:je,uniforms:{uColor:{value:new Kt(9430783)},uBright:{value:1},uShow:{value:1}}}),y=new Ea(T,M,m);y.instanceMatrix.setUsage(va),y.frustumCulled=!1,y.renderOrder=.7;const U=new be,R=new L,w=new Je;w.add(v,d,g,y);let P=.6,b=.5,S=1,C=1,V=0,k=0;const z=new Kt(9430783),st=new Kt(8384704),X=new Kt(16777215);return{group:w,setLook:et=>{P=.6*et.pipeRadius,b=et.dataCount,S=et.dataSize,C=et.dataSpeed,V=et.pipeLift,u.uniforms.uOpacity.value=.12*et.pipeGlass,u.uniforms.uRim.value=et.pipeRim,f.uniforms.uGlow.value=et.pipeGlow,M.uniforms.uBright.value=et.dataBright;const Q=et.dataColour;M.uniforms.uColor.value.copy(Q<=1?z.clone().lerp(st,Q):st.clone().lerp(X,Q-1)),w.visible=et.pipeOn>.5,k=et.pipeFluid>.5?1:0,c.uInk.value=k,d.visible=k>0,c.uInkCol.value.setRGB(...Jc(et)),p.uniforms.uSpeed.value=4*et.inkSpeed,p.uniforms.uThick.value=et.inkThick},update:(et,Q,$,Rt,Bt=0,Y=1)=>{if(!w.visible)return;w.scale.set(1+(Y-1)*Bt,Math.max(Q,.02),1),c.uJoin.value=Bt,v.visible=Bt<.98,M.uniforms.uShow.value=Rt*(1-Bt)*(1-k),p.uniforms.uTime.value=et,p.uniforms.uShow.value=Rt,w.position.y=(1-Q)*.15+V*Q,c.uShow.value=Rt,c.uOrbPos.value.copy($);const ut=Math.round(m*Math.min(1,b));for(let mt=0;mt<m;mt++){if(mt>=ut){U.scale.setScalar(0),U.updateMatrix(),y.setMatrixAt(mt,U.matrix);continue}const ct=(h[mt*3]+et*.012*C*(.7+.6*h[mt*3+1]))%1;s.getPointAt(Math.min(.999,Math.max(0,ct)),R);const Ct=h[mt*3+2]*6.283,It=P*.55*Math.sqrt(h[(mt*3+4)%(m*3)]);U.position.set(R.x+Math.cos(Ct)*It,R.y+Math.sin(Ct)*It*Math.max(Q,.05),R.z),U.scale.setScalar(.07*S*(.6+.8*h[mt*3+1])),U.updateMatrix(),y.setMatrixAt(mt,U.matrix)}y.instanceMatrix.needsUpdate=!0},curve:s,rebuild:et=>{g.geometry.dispose(),v.geometry.dispose(),d.geometry.dispose(),g.geometry=new Bn(s,400,et,24,!1),d.geometry=new Bn(s,400,et*.55,20,!1),v.geometry=new Bn(s,300,et*2.6,20,!1)},disposables:[o,a,u,f,T,M,p,{dispose:()=>{g.geometry.dispose(),v.geometry.dispose(),d.geometry.dispose()}}]}}const Hg=`
attribute float aT; // 0 at the tail, 1 at the head
varying float vT;
void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Gg=`
uniform float uAlpha;
varying float vT;
void main() {
  float a = pow(vT, 2.2) * uAlpha;
  vec3 col = mix(vec3(0.55, 0.75, 1.0), vec3(1.0), smoothstep(0.85, 1.0, vT));
  gl_FragColor = vec4(col * a, a);
}`,ec=440;function Wg(i){const t=[];let e=-1;const n=new L,r=new L,s=new L,o=new L,a=new L,l=(f,p,d)=>{const g=Math.random()<.5,v=g?-.9+Math.random()*1.1:-.2+Math.random()*1.1,m=.25+Math.random()*.7,h=(14+Math.random()*22)*d.starsSteep*Math.PI/180,T=(.35+Math.random()*.3)*d.starsLength,M=v+(g?1:-1)*Math.cos(h)*T*(Ni()/innerWidth)*1.6,y=m-Math.sin(h)*T,U=(b,S)=>(n.set(b,S,.5).unproject(p).sub(p.position).normalize(),p.position.clone().addScaledVector(n,ec)),R=new xe;R.setAttribute("position",new pe(new Float32Array(12),3)),R.setAttribute("aT",new pe(new Float32Array([0,0,1,1]),1)),R.setIndex([0,1,2,1,3,2]);const w=new fe({vertexShader:Hg,fragmentShader:Gg,transparent:!0,depthWrite:!1,blending:je,uniforms:{uAlpha:{value:0}}}),P=new ge(R,w);P.frustumCulled=!1,P.renderOrder=-.5,i.add(P),t.push({mesh:P,geo:R,mat:w,start:f,dur:(.7+Math.random()*.5)/d.starsSpeed*1e3,a:U(v,m),b:U(M,y)})};return{update:(f,p,d,g)=>{e<0&&(e=f+d.starsEvery*1e3*(.77+Math.random()*.46)),f>=e&&(g&&d.starsOn>.5&&l(f,p,d),e=f+d.starsEvery*1e3*(.77+Math.random()*.46));const v=2*ec*Math.tan(p.fov*Math.PI/360)/Ni(),m=1.1*d.starsWidth*v;for(let h=t.length-1;h>=0;h--){const T=t[h],M=(f-T.start)/T.dur;if(M>=1){i.remove(T.mesh),T.geo.dispose(),T.mat.dispose(),t.splice(h,1);continue}const y=M*(2-M);r.lerpVectors(T.a,T.b,y),s.lerpVectors(T.a,T.b,Math.max(0,y-.45)),a.copy(r).sub(p.position).normalize(),o.copy(r).sub(s).cross(a).normalize().multiplyScalar(m);const U=T.geo.getAttribute("position");U.setXYZ(0,s.x+o.x*.3,s.y+o.y*.3,s.z+o.z*.3),U.setXYZ(1,s.x-o.x*.3,s.y-o.y*.3,s.z-o.z*.3),U.setXYZ(2,r.x+o.x,r.y+o.y,r.z+o.z),U.setXYZ(3,r.x-o.x,r.y-o.y,r.z-o.z),U.needsUpdate=!0,T.mat.uniforms.uAlpha.value=Math.min(1,M*8)*(1-Math.max(0,(M-.7)/.3))*d.starsBright*1.4}},disposables:[{dispose:()=>{for(const f of t)f.geo.dispose(),f.mat.dispose()}}]}}const jn=(i,t,e)=>i+(t-i)*e,Ze=i=>i<=0?0:i>=1?1:i*i*(3-2*i);function Xg(i){const t=document.createElement("canvas");t.width=t.height=128;const e=t.getContext("2d"),n=e.createRadialGradient(64,64,0,64,64,64);n.addColorStop(0,`rgba(${i},1)`),n.addColorStop(.25,`rgba(${i},0.45)`),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(0,0,128,128);const r=new ba(t);return r.colorSpace=Be,r}function Kg({fadeAt:i}){const t=Cs.useRef(null),e=Cs.useRef(null);return Cs.useEffect(()=>{const n=e.current,r=t.current,s=matchMedia("(prefers-reduced-motion: reduce)").matches,o=innerWidth<700;let a;try{a=new o0({canvas:n,antialias:!0,alpha:!0})}catch{r.style.display="none";return}const l=[1.5,1.2,1].filter(Pt=>Pt<=Math.max(1,devicePixelRatio));let c=0;a.setPixelRatio(Math.min(devicePixelRatio,l[0]??1));let u=-1,f=0,p=0;const d=new a0;d.fog=new Ma(658710,30,150);const g=new Xe(58,1,.1,500),v=[],m=o?80:110,h=o?150:200,T=200,M=380,y=60,U=(m+1)*(h+1),R=new Float32Array(U),w=new Float32Array(U*3);for(let Pt=0,ee=0;Pt<=h;Pt++)for(let oe=0;oe<=m;oe++,ee++){const Ce=-T/2+oe/m*T,E=y-Pt/h*M;R[ee]=zn(Ce,E),w[ee*3]=Ce,w[ee*3+1]=R[ee],w[ee*3+2]=E}const P=new pe(w,3);P.setUsage(va);const b=[],S=[];for(let Pt=0;Pt<h;Pt++)for(let ee=0;ee<m;ee++){const oe=Pt*(m+1)+ee,Ce=oe+1,E=oe+m+1,F=E+1;b.push(oe,E,Ce,Ce,E,F),S.push(oe,Ce,oe,E)}for(let Pt=0;Pt<m;Pt++){const ee=h*(m+1)+Pt;S.push(ee,ee+1)}for(let Pt=0;Pt<h;Pt++){const ee=Pt*(m+1)+m;S.push(ee,ee+m+1)}const C=new xe;C.setAttribute("position",P),C.setIndex(b);const V=new xe;V.setAttribute("position",P),V.setIndex(S);const k=new xa({color:461071,side:Ke,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1});V.setAttribute("aBase",new pe(R,1));const z=new fe({transparent:!0,uniforms:{uOpacity:{value:.34},uFogNear:{value:30},uFogFar:{value:150},uBolt:{value:new he(0,0,0,1)}},vertexShader:`attribute float aBase; varying float vWet; varying float vDist; varying vec2 vXZ;
        void main() { vXZ = position.xz; vWet = step(aBase, 4.62 - 0.01 * position.z); vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uOpacity; uniform float uFogNear; uniform float uFogFar; uniform vec4 uBolt; varying float vWet; varying float vDist; varying vec2 vXZ;
        void main() { if (vWet > 0.5) discard;
          float lit = uBolt.z * exp(-distance(vXZ, uBolt.xy) / uBolt.w);
          gl_FragColor = vec4(mix(vec3(0.42, 0.78, 0.94), vec3(0.85, 0.95, 1.0), clamp(lit, 0.0, 1.0) * 0.7), min(uOpacity * (1.0 + 3.0 * lit), 1.0) * (1.0 - smoothstep(uFogNear, uFogFar, vDist))); }`}),st=new ge(C,k),X=new h0(V,z);d.add(st,X),v.push(C,V,k,z);const W=$0(658710);d.add(W.dome),v.push(...W.disposables);const B=new L(0,9.5,9),et=1.7,Q=.45,$=new Je;$.position.copy(B),d.add($);const Rt=tg(et),Bt=Xg("170,225,255"),Y=new Sa({map:Bt,blending:je,depthWrite:!1,transparent:!0,opacity:Q}),ut=new Uc(Y);ut.scale.set(10,10,1),ut.renderOrder=4;const mt=dg(et);$.add(ut,mt.group,Rt.group),v.push(...mt.disposables,...Rt.disposables,Bt,Y);const ct=vg();d.add(ct.group),__sp.fx=__SP.makeSpawnFx(),d.add(__sp.fx.group),v.push(...ct.disposables);const Ct=new L,It=new L,Z=new L,Nt=bg();d.add(Nt.group),v.push(...Nt.disposables);const J=[];let at=0,A=!1,ht=0,tt=-1,_t=!1,lt=0;const it=Pt=>x.levelAt(Pt)-lt,rt=Ag();$.add(rt.mesh),v.push(...rt.disposables);const _=(Pt,ee,oe)=>{J[at]=[Pt,ee,.001,oe],at=(at+1)%8},x=lg({small:o,grid:{NX:m,NZ:h,W:T,D:M,Z0:y,base:R},heightAt:zn,fogColor:658710});d.add(x.river,x.spray),v.push(...x.disposables);const I=jc()?Qc():null,O=Ig();d.add(O.group),v.push(...O.disposables);let K=0;const q=Vg({heightAt:zn,zFar:-150,zNear:y,small:o});d.add(q.group),v.push(...q.disposables);let gt=-1;const pt=Rg(zn,o);d.add(pt.group),v.push(...pt.disposables);const Tt=Wg(d);v.push(...Tt.disposables);let Vt=0;const ft=(Pt,ee)=>Math.min(1,Math.max(0,(ee/Pt-1.15)/.8))*.17*ee,At=()=>{const Pt=Ni();a.setSize(innerWidth,Pt,!1),g.aspect=innerWidth/Pt,Vt=ft(innerWidth,Pt),Vt>0?g.setViewOffset(innerWidth,Pt,0,Vt,innerWidth,Pt):g.clearViewOffset(),g.updateProjectionMatrix()};At();const Ft=tu(At),Ot=new L,bt=new Xe(58,1,.1,500),$t=new L(0,12,2),Ht=new L,Yt=document.querySelector(".cn-top")??document.documentElement;let N="";document.fonts?.ready.then(()=>{N=""}).catch(()=>{});const xt=(Pt,ee,oe)=>{Ht.copy(ee).project(Pt);const Ce=Pt.position.distanceTo(ee),E=Ni();return[(1-Ht.y)/2*E,oe/(Ce*Math.tan(Pt.fov*Math.PI/360))*(E/2)]};let j=-1,ot=scrollY,wt=performance.now(),Mt=0,zt=0,ie=0,ve=0,jt=0;const de={down:!1,id:-1,x:0,y:0},Te={x:0,y:0,r:0},Qi=document.querySelector(".cn-hero"),tr=(Pt,ee)=>nt.holdOn>.5&&Te.r>0&&(Pt-Te.x)**2+(ee-Te.y)**2<=(Te.r*1.05)**2,on=Pt=>{if(Pt.button>0||!tr(Pt.clientX,Pt.clientY)){__st.lp=Pt.button>0?"not the main button":Te.r>0?"missed the orb":"orb not ready";return}if(Pt.target?.closest?.("a,button,input,textarea,select,label,.tune")){__st.lp="on a button or the panel";return}__st.lp="on the orb";de.down=!0,de.id=Pt.pointerId,de.x=Pt.clientX,de.y=Pt.clientY;scrollY>0&&scrollTo({top:0,behavior:"instant"})},hi=Pt=>{Pt.pointerType==="mouse"&&Qi&&(Qi.style.cursor=tr(Pt.clientX,Pt.clientY)?"pointer":"")},Gn=Pt=>{Pt.pointerId===de.id&&(de.down&&Pt.type==="pointercancel"&&(__st.lp="cancelled by the browser"),de.down=!1,_t=!1)},Wn=Pt=>{de.down&&Pt.preventDefault()};addEventListener("pointerdown",on,!0),addEventListener("pointermove",hi,{passive:!0}),addEventListener("pointerup",Gn),addEventListener("pointercancel",Gn),addEventListener("contextmenu",Wn),document.addEventListener("selectstart",Wn);let Pn=!1,br=0;Promise.race([document.fonts?.ready??Promise.resolve(),new Promise(Pt=>setTimeout(Pt,2500))]).then(()=>{Pn=!0});const mn=Yt.querySelector(".cn-follow"),er=Pt=>{Mt=requestAnimationFrame(er);const ee=Pt-wt,oe=Math.min(.05,Math.max(0,ee/1e3));ee>0&&ee<1e3&&(__st.fps+=(1e3/ee-__st.fps)*.1);wt=Pt,!document.hidden&&ee<250&&c<l.length-1&&(u<0&&(u=Pt),Pt-u>1500&&(p++,ee>22&&f++,p>=90&&(f>60?(c++,a.setPixelRatio(Math.min(devicePixelRatio,l[c])),At(),u=Pt):c=l.length,p=0,f=0))),ot+=(scrollY-ot)*(s?1:.12);const Ce=Ni(),E=document.getElementById(i),F=E?E.getBoundingClientRect().top:Ce,G=Math.min(1,Math.max(0,(F-Ce*.3)/(Ce*.55)));if(r.style.opacity=String(G),G<=0&&Pn&&Oa(nt.introFade*1e3),G<=0){document.documentElement.style.setProperty("--pipe-join","1"),Yt.style.setProperty("--cn-fade","0"),Yt.style.setProperty("--cn-pe","none"),N="";return}const H=Math.min(1,Math.max(0,ot/(Ce*1.35))),D=Ze((H-.18)/.72);if(Math.abs(D-j)>5e-4){const Zt=1-D;for(let se=0;se<U;se++)w[se*3+1]=R[se]*Zt;P.needsUpdate=!0,j=D}z.uniforms.uOpacity.value=jn(.34,.16,D)*nt.gridLines,x.setLook(nt),q.setLook(nt),nt.pipeRadius!==gt&&(gt=nt.pipeRadius,q.rebuild(.6*gt)),eu(),g.fov!==nt.fov&&(g.fov=nt.fov,g.updateProjectionMatrix());const dt=d.fog;dt.near=jn(30,200,D)*nt.fogNear,dt.far=Math.max(dt.near+1,jn(150,420,D)*nt.fogFar),z.uniforms.uFogNear.value=dt.near,z.uniforms.uFogFar.value=dt.far,de.down&&(scrollY>Ce*.1||nt.holdOn<.5)&&(de.down=!1);const St=de.down&&!_t;ie=St?Math.min(1,ie+oe/Math.max(1,nt.holdBuild)):Math.max(0,ie-oe/(tt>=0?Math.max(.5,nt.holdCalm):1.2));let Lt=!1;St&&ie>=1&&(Lt=!0,_t=!0,de.down=!1,tt=0,ht=1.6),tt>=0&&(tt+=oe,tt>Math.max(4,nt.holdCalm+1)&&(tt=-1)),ve=St?Math.min(1,ve+oe/2):Math.max(0,ve-oe/(tt>=0?Math.max(1,nt.holdCalm):1.6));const Et=Math.pow(ie,1.4),kt=Ze(ve)*nt.holdZoom,fxC=tt>=0?0:Et;{const fw=nt.holdFlyOff>.5&&(de.down||tt>=0||ie>.02);fw!==__flyOn&&(__flyOn=fw,Yt.classList.toggle("cn-fly",fw)),__fly=fw?Math.min(1,__fly+oe/.3):Math.max(0,__fly-oe/.7)}jt+=oe*Ze(ve)*.35*nt.holdSky*(1+2*Et);const Gt=jn(42,0,Ze(H*1.2));g.position.set(0,jn(9,o?95:70,D),Gt),Ot.set(0,jn(12,0,D),jn(Gt-40,Gt-.01,D)),Ct.set(0,9+nt.holdCamUp,42+nt.holdCamBack),It.set(0,12-9*nt.holdCamTilt,2+4*nt.holdCamTilt),kt>0&&(g.position.lerp(Ct,kt),Ot.lerp(It,kt)),g.lookAt(Ot);const Dt=s?0:nt.holdScreenShake*Et*Et*7+ht*nt.holdShock*12,Jt=Dt>.05?`translate(${((Math.random()-.5)*Dt).toFixed(1)}px, ${((Math.random()-.5)*Dt).toFixed(1)}px)`:"";n.style.transform!==Jt&&(n.style.transform=Jt);const ae=s?0:(nt.holdGroundShake*Ze(ie)+ht*nt.holdShock*.6)*.12*Math.sin(zt*47)*Math.sin(zt*31+1);st.position.y=ae,X.position.y=ae,W.update(g.position,1-D,jt);const Xt=Ze((H-.1)/.5);$.position.set(0,B.y+nt.orbHeight+Xt*26,B.z-Xt*10),$.scale.setScalar((o?1.44:2.19)*nt.orbSize),Y.opacity=Q*nt.orbGlow*(1-Xt),g.updateMatrixWorld();const me=et*$.scale.x,Qt=1.22,[Ut,ke]=xt(g,$.position,me);if(Te.x=innerWidth/2,Te.y=Ut,Te.r=H<.25?ke:0,Et>0&&($.position.y+=nt.holdRise*Et,!s)){const Zt=.14*nt.holdOrbShake*fxC*(.4+fxC)*(1+fxC*fxC);$.position.x+=(Math.random()-.5)*Zt,$.position.y+=(Math.random()-.5)*Zt*.5,$.position.z+=(Math.random()-.5)*Zt}if(rt.update(ie,de.down?1:0,et),bt.fov=g.fov,bt.aspect=g.aspect,Vt>0){const Zt=Ni();bt.setViewOffset(innerWidth,Zt,0,Vt,innerWidth,Zt)}else bt.clearViewOffset();bt.updateProjectionMatrix(),bt.position.set(0,9,42),bt.lookAt($t),bt.updateMatrixWorld(),Ht.set(0,B.y+nt.orbHeight,B.z);const[ne,Ve]=xt(bt,Ht.clone(),me),an=1-Ze((H-.06)/.22),we=`${an.toFixed(3)}|${Ut.toFixed(2)}|${(ke*Qt).toFixed(2)}|${(Ut+ke*Qt-(ne+Ve*Qt)).toFixed(2)}`;if(we!==N){N=we;const[Zt,se,Ae,nr]=we.split("|");if(Yt.style.setProperty("--cn-fade",Zt),Yt.style.setProperty("--cn-pe",Number(Zt)>.3?"auto":"none"),Yt.style.setProperty("--cn-oy",`${se}px`),Yt.style.setProperty("--cn-or",`${Ae}px`),Yt.style.setProperty("--cn-dy",`${nr}px`),Math.abs(Number(nr))<.5){const Ua=Yt.querySelector(".cn-brand"),Rs=Yt.querySelector(".cn-scroll");if(Ua&&Rs&&Rs.offsetParent){const Ia=parseFloat(Yt.style.getPropertyValue("--sh-push"))||0,Na=Math.max(0,Math.ceil(Ua.getBoundingClientRect().bottom+12-(Rs.getBoundingClientRect().top-Ia)));Na!==Ia&&Yt.style.setProperty("--sh-push",`${Na}px`)}}}s||(zt+=oe,K+=oe*nt.orbSpin);const gn=nu(),re=s||nt.introSpawn<=0?gn===null?0:1:gn===null?0:Math.min(1,Math.max(0,(Pt-gn)/(nt.introSpawn*1e3)));const ar=__SP.spawnLook(nt.introStyle,re,me);let ze;if(ar.classic){const He=Ze(re/.22),ln=re<=.15?0:Math.min(1,(re-.15)/.6),Oe=ln>=1?1:1+2.2*Math.pow(ln-1,3)+1.2*Math.pow(ln-1,2),Qe=Math.exp(-Math.pow((re-.78)/.07,2));ze=Math.max(.001,Oe),$.scale.multiplyScalar(ze),Y.opacity=Math.max(Y.opacity,(He*(1-ln)*.95+Qe*.6)*(1-Xt)),ut.scale.setScalar(10*(.35+.65*He)*(1+Qe*.5))}else ze=Math.max(.001,ar.scale),$.scale.multiplyScalar(ze),$.position.y-=ar.lift,Y.opacity=Math.max(Y.opacity*Math.min(1,ar.scale),ar.halo*(1-Xt)),ut.scale.setScalar(10*ar.haloSize);{const pz=at=>at>=0&&__sp.prev<at&&re>=at;re<__sp.prev&&(__sp.wt=-1),pz(ar.waveAt)&&(__sp.wt=0,__sp.w=ar.wave,__sp.x=$.position.x,__sp.z=$.position.z),pz(ar.strikeAt)&&ct.skyStrike(new L((Math.random()-.5)*.4,1.25,.5).unproject(g).sub(g.position).normalize().multiplyScalar(g.position.distanceTo($.position)*.35).add(g.position),new L($.position.x,$.position.y+me,$.position.z),1),__sp.prev=re,__sp.wt>=0&&(__sp.wt+=oe,__sp.wt>4&&(__sp.wt=-1)),__sp.fx.update(nt.introStyle,re,zt,$.position,me,g,n.height/(2*Math.tan(g.fov*Math.PI/360)))}mn&&(mn.style.opacity=String(Math.min(1,Math.max(0,(re-.7)/.3))*(1-Ze(ve)))),Y.opacity+=.5*Et*(1-Xt);const fi=Q0(zt,nt.orbSparkRate),Tr=fi.flash*nt.orbFlashLight*Math.min(nt.orbSparks,1.5)*(1-Xt);Rt.update(zt,1-Xt,K,{bands:nt.orbStreaks,zap:nt.orbSparks*(1+Et),zapRate:nt.orbSparkRate*(1+3*Et),style:nt.orbStyle,hue:nt.orbHue,flow:nt.orbFlow,gate:fi.gate,flash:Tr*.6,depth:nt.orbDepth,glass:nt.orbGlass,fringe:nt.orbFringe,cam:g.position}),mt.update(zt,(1-Xt)*ze,{bloom:nt.orbBloom+Et,rays:nt.orbRays,sparks:nt.orbParticles,flash:Tr,pxScale:n.height/(2*Math.tan(g.fov*Math.PI/360))}),Y.opacity*=1+Tr;const As=fi.flash*nt.orbFlashLand*(1-Xt);z.uniforms.uBolt.value.set($.position.x,$.position.z,As,nt.orbFlashReach);const Ca=it($.position.z),di=ct.update(zt,oe,fxC*(1-Xt),$.position,me,Ca,{bolts:nt.holdBolts},()=>{const Zt=Math.random()*Math.PI*2;if(Math.random()<.6){const nr=me*(1.3+1.9*Math.random());return Z.set($.position.x+Math.cos(Zt)*nr,Ca,$.position.z+Math.sin(Zt)*nr*.7)}const se=(Math.random()<.5?-1:1)*(14+24*Math.random()),Ae=$.position.z-25+35*Math.random();return Z.set(se,zn(se,Ae)*(1-D),Ae)});di.at&&di.flash*nt.holdBolts*1.5>As&&z.uniforms.uBolt.value.set(di.at.x,di.at.z,di.flash*nt.holdBolts*1.5,14),A&&!de.down&&!Lt&&ie>.5&&nt.holdShock>0&&(ht=1),Lt&&nt.holdNova>0&&(ct.burstAll($.position,me,()=>{const Zt=Math.random()*Math.PI*2,se=me*(1.5+4*Math.random());return Z.set($.position.x+Math.cos(Zt)*se,it($.position.z),$.position.z+Math.sin(Zt)*se*.7)})),Lt&&nt.holdSkyStrike>0&&ct.skyStrike(new L((Math.random()-.5)*.4,1.25,.5).unproject(g).sub(g.position).normalize().multiplyScalar(g.position.distanceTo($.position)*.35).add(g.position),new L($.position.x,$.position.y+me,$.position.z),nt.holdSkyStrike),ct.novaAt(tt,$.position,me,nt.holdNova),tt>=0&&(Y.opacity+=Math.exp(-tt*3)*2.5*nt.holdNova),A=de.down,ht=Math.max(0,ht-oe*2.5),Y.opacity+=ht*.8*nt.holdShock;const qc=Math.max(0,(fxC-.1)/.9)*nt.holdBoil*(1-Xt),Yc=n.height/(2*Math.tan(g.fov*Math.PI/360));Lt&&(Nt.explode($.position,nt.holdNova),globalThis.__ddgNovaAt=[$.position.x,$.position.z]),Nt.update(oe,fxC*(1-Xt),$.position,me,{on:[nt.holdFxGlobs>.5,!1,nt.holdFxGround>.5],amount:nt.holdFxAmount,speed:nt.holdFxSpeed,vortex:{look:nt.holdVortexLook,size:nt.holdVortexSize,reach:nt.holdVortexReach,trail:nt.holdVortexTrail,glow:nt.holdVortexGlow}},(Zt,se)=>Math.max(it(se),zn(Zt,se)*(1-D)),(Zt,se)=>{const Ae=it(se);return Math.abs(Zt)<40&&se<55&&Ae-zn(Zt,se)>.3?Ae:null},()=>{},Yc,jt);for(const Zt of J)Zt&&Zt[2]>0&&(Zt[2]+=oe/(Zt[3]>2?1.6:.7),Zt[2]>=1&&(Zt[2]=0));r.style.getPropertyValue("--hold")!==(Et*nt.holdVignette).toFixed(2)&&r.style.setProperty("--hold",(Et*nt.holdVignette).toFixed(2));const Xn=[0,0,0,0,0,0,0],Pa=nt.qbCalm>0&&nt.quoteOn&&an>.01?document.querySelector(".cn-quote"):null;if(Pa){const Zt=Pa.getBoundingClientRect(),se=n.getBoundingClientRect(),Ae=n.width/Math.max(se.width,1);Xn[0]=(Zt.left-nt.qbPadX-se.left)*Ae,Xn[2]=(Zt.right+nt.qbPadX-se.left)*Ae,Xn[1]=(se.bottom-Zt.bottom-nt.qbPadY)*Ae,Xn[3]=(se.bottom-Zt.top+nt.qbPadY)*Ae,Xn[4]=nt.qbCalm*an,Xn[5]=nt.qbFade/100,Xn[6]=nt.qbRadius*Ae}x.update({t:zt,orbX:$.position.x,orbY:$.position.y,orbZ:$.position.z,flat:1-D,stir:(1-Ze(Xt*2.5))*ze,show:1,fogNear:dt.near,fogFar:dt.far,calm:Xn,drop:lt,nova:tt>=0?[(globalThis.__ddgNovaAt||[0,0])[0],(globalThis.__ddgNovaAt||[0,0])[1],tt,nt.holdNovaWave]:[__sp.x,__sp.z,__sp.wt,__sp.w*2.5],novaSpeed:tt>=0?nt.holdNovaWaveSpeed:30,mirror:[nt.orbMirror*(1-Xt)*ze,me*ze,K,Tr],flash:As*.5+di.flash*.35*nt.holdBolts,boil:[$.position.x,$.position.z,qc,nt.holdBoilArea],boilLook:[nt.holdBoilHeight,nt.holdBoilSpeed,nt.holdBoilSpecks,nt.holdBoilLift],pops:J,skyTurn:jt});const La=Ze((D-.75)/.25),Zc=2*(g.position.y-.15)*Math.tan(g.fov*Math.PI/360)/Ce;q.update(zt,1-D,$.position,1,La,1.75*Zc/(.6*nt.pipeRadius)),document.documentElement.style.setProperty("--pipe-join",String(La));const wr=Ze(H/nt.wordsFade);nt.wordsOn>.5&&O.setFont(nt.wordsFont),O.group.visible=nt.wordsOn>.5&&O.ready()&&wr<.99;const Da=nt.wordsZ;O.group.position.set(nt.wordsX,(4.25-.01*Da+nt.wordsY)*(1-D)-wr*2.2,Da),O.group.quaternion.copy(g.quaternion),__fly>0&&O.group.position.addScaledVector(new L(1,0,0).applyQuaternion(g.quaternion),-120*(__flyOn?__fly*__fly:1-(1-__fly)*(1-__fly))),O.group.scale.set(nt.wordsSize*(o?.72:1),nt.wordsSize*(o?.72:1),nt.wordsSize*nt.wordsDepth),O.mat.uniforms.uOpacity.value=1-wr,O.mat.uniforms.uBright.value=nt.wordsBright,O.refl.uniforms.uBright.value=nt.wordsBright,O.refl.uniforms.uOpacity.value=nt.wordsReflect*(1-wr),pt.update(zt,g,1-D,G,$.position),Tt.update(Pt,g,nt,D<.3),a.render(d,g),(()=>{if(globalThis.__DDG_TUNE__&&Pt-__st.at>250){__st.at=Pt;if(!__st.el||!__st.el.isConnected){__st.el=document.createElement("div");__st.el.style.cssText="position:fixed;left:10px;bottom:8px;z-index:2147482000;font:11px/1.4 ui-monospace,Menlo,monospace;color:#9fd8ff;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;pointer-events:none";document.body.appendChild(__st.el)}__st.el.textContent=`scroll ${Math.round(scrollY)} px · orb: ${de.down?"HELD":_t?"let go first":Te.r>0?"ready to press":"cannot be pressed (page scrolled too far)"} · last press: ${__st.lp} · charge ${Math.round(ie*100)}% · ${Math.round(__st.fps)} frames/s`}})(),++br>=3&&Pn&&Oa(nt.introFade*1e3)};return Mt=requestAnimationFrame(er),()=>{cancelAnimationFrame(Mt),I?.(),removeEventListener("pointerdown",on,!0),removeEventListener("pointermove",hi),removeEventListener("pointerup",Gn),removeEventListener("pointercancel",Gn),removeEventListener("contextmenu",Wn),document.removeEventListener("selectstart",Wn),mn&&(mn.style.opacity=""),Ft(),v.forEach(Pt=>Pt.dispose()),a.dispose()}},[i]),Fa.jsx("div",{className:"cn-stage",ref:t,"aria-hidden":"true",children:Fa.jsx("canvas",{ref:e})})}export{Kg as default};

let __fly=0,__flyOn=!1,__rk="";function __rule(top){const r=top.querySelector(".cn-rule"),n=top.querySelector(".cn-brand > span"),w=top.querySelector(".cn-scroll-words");if(!r||!n||!w||__flyOn||__fly!==0)return;const a=n.getBoundingClientRect(),b=w.getBoundingClientRect(),op=r.offsetParent,f=op?op.getBoundingClientRect():{top:0,left:0},y=(b.top>=a.bottom?(a.bottom+b.top)/2:(b.bottom+a.top)/2)+nt.ruleShift-f.top,W=Math.max(a.width,b.width)+2*nt.ruleOver,x=(a.left+a.right)/2-W/2-f.left,k=`${nt.ruleOn}|${x.toFixed(1)}|${y.toFixed(1)}|${W.toFixed(1)}|${nt.ruleThick}|${nt.ruleBright}`;if(k===__rk)return;__rk=k;r.style.setProperty("--rule-show",nt.ruleOn>.5&&b.width>0?"block":"none");r.style.left=`${x}px`;r.style.top=`${y}px`;r.style.width=`${W}px`;r.style.setProperty("--rule-thick",`${nt.ruleThick}px`);r.style.setProperty("--rule-bright",String(nt.ruleBright))}

const __SP=(()=>{const AdditiveBlending=je,BufferAttribute=pe,BufferGeometry=xe,Group=Je,Mesh=ge,PlaneGeometry=Ji,Points=ra,ShaderMaterial=fe,Vector3=L;

const SPAWN_NAMES = ["Classic", "Portal", "Spark", "Gathering", "Lightning", "Rise from the river"];
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const pop = (u) => u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2);
const bump = (s, at, w) => Math.exp(-Math.pow((s - at) / w, 2));
function spawnLook(style, s, radius) {
  const L = { scale: 1, halo: 0, haloSize: 1, lift: 0, waveAt: -1, wave: 0, strikeAt: -1, classic: false };
  switch (style) {
    case 1: {
      L.scale = pop((s - 0.3) / 0.45);
      const p = bump(s, 0.76, 0.06);
      L.halo = 0.25 * ease(s / 0.3) * (1 - ease((s - 0.75) / 0.2)) + p * 0.7;
      L.haloSize = 1 + p * 0.5;
      break;
    }
    case 2: {
      L.scale = pop((s - 0.68) / 0.16);
      const f = bump(s, 0.69, 0.05);
      L.halo = f * 1.3;
      L.haloSize = 0.4 + f * 1.4;
      L.waveAt = 0.68;
      L.wave = 1.2;
      break;
    }
    case 3: {
      L.scale = pop((s - 0.35) / 0.55);
      const p = bump(s, 0.92, 0.05);
      L.halo = 0.45 * ease((s - 0.15) / 0.6) * (1 - ease((s - 0.88) / 0.12)) + p * 0.7;
      L.haloSize = 0.6 + 0.4 * ease(s) + p * 0.5;
      break;
    }
    case 4: {
      L.strikeAt = 0.22;
      L.scale = pop((s - 0.24) / 0.2);
      const f = bump(s, 0.25, 0.05);
      L.halo = f * 1.6;
      L.haloSize = 1 + f * 1.2;
      L.waveAt = 0.24;
      L.wave = 1.6;
      break;
    }
    case 5: {
      L.lift = (radius * 3 + 2) * (1 - ease(s / 0.8));
      L.scale = 0.6 + 0.4 * ease(s);
      const p = bump(s, 0.5, 0.07);
      L.halo = 0.35 * ease(s / 0.4) * (1 - ease((s - 0.8) / 0.2)) + p * 0.6;
      L.haloSize = 1 + p * 0.4;
      L.waveAt = 0.45;
      L.wave = 1;
      break;
    }
    default:
      L.classic = true;
  }
  return L;
}
const PORTAL_VERT = (
  /* glsl */
  `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
);
const PORTAL_FRAG = (
  /* glsl */
  `
uniform float uOpen; uniform float uTime; uniform float uAlpha;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  vec2 q = vec2(p.x / max(uOpen, 0.015), p.y / min(1.0, uOpen * 2.5 + 0.1));
  float r = length(q), a = atan(q.y, q.x);
  float rim = exp(-pow((r - 0.8) * 9.0, 2.0));
  float swirl = 0.5 + 0.5 * sin(a * 5.0 - r * 10.0 + uTime * 6.0);
  float inside = smoothstep(0.82, 0.45, r) * (0.3 + 0.7 * swirl) * (1.0 - 0.6 * r);
  vec3 col = vec3(0.55, 0.85, 1.0) * rim * 1.6 + vec3(0.2, 0.45, 1.0) * inside * 0.8 + vec3(1.0) * pow(rim, 3.0) * 0.7;
  gl_FragColor = vec4(col * uAlpha, 1.0);
}`
);
const DOT_VERT = (
  /* glsl */
  `
attribute float aA; attribute float aS;
uniform float uPx;
varying float vA;
void main() {
  vA = aA;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * aS / max(-mv.z, 0.1) : 0.0;
}`
);
const DOT_FRAG = (
  /* glsl */
  `
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float g = exp(-d * d * 4.0) + 0.6 * exp(-d * d * 30.0);
  gl_FragColor = vec4(mix(vec3(0.45, 0.75, 1.0), vec3(1.0), exp(-d * d * 20.0)) * g * vA, 1.0);
}`
);
const N = 320;
const TRAIL = 24;
function makeSpawnFx() {
  const group = new Group();
  group.visible = false;
  const portalMat = new ShaderMaterial({ uniforms: { uOpen: { value: 0 }, uTime: { value: 0 }, uAlpha: { value: 0 } }, vertexShader: PORTAL_VERT, fragmentShader: PORTAL_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const portalGeo = new PlaneGeometry(1, 1);
  const portal = new Mesh(portalGeo, portalMat);
  portal.renderOrder = 6;
  portal.frustumCulled = false;
  group.add(portal);
  const pos = new Float32Array(N * 3), aA = new Float32Array(N), aS = new Float32Array(N);
  const dotGeo = new BufferGeometry();
  dotGeo.setAttribute("position", new BufferAttribute(pos, 3));
  dotGeo.setAttribute("aA", new BufferAttribute(aA, 1));
  dotGeo.setAttribute("aS", new BufferAttribute(aS, 1));
  const dotMat = new ShaderMaterial({ uniforms: { uPx: { value: 600 } }, vertexShader: DOT_VERT, fragmentShader: DOT_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const dots = new Points(dotGeo, dotMat);
  dots.frustumCulled = false;
  dots.renderOrder = 7;
  group.add(dots);
  const start = Array.from({ length: N }, () => {
    const a = Math.random() * Math.PI * 2, y = -0.15 + Math.random() * 1.1;
    const d = new Vector3(Math.cos(a), y, Math.sin(a)).normalize();
    return { d, far: 18 + Math.random() * 28, delay: Math.random() * 0.35, size: 0.25 + Math.random() * 0.5, spin: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 2) };
  });
  const v = new Vector3();
  const sparkAt = (s, orb, out) => {
    const e = ease(s / 0.5);
    out.set(16, 7, 6).multiplyScalar(1 - e);
    const w = (1 - e) * 1.8 + 0.12;
    out.x += Math.sin(s * 41) * w;
    out.y += Math.cos(s * 33) * w * 0.7;
    out.z += Math.sin(s * 27 + 1) * w;
    return out.add(orb);
  };
  const update = (style, s, clock, orb, radius, camera, px) => {
    group.visible = s > 0 && s < 1 && (style === 1 || style === 2 || style === 3);
    if (!group.visible) return;
    dotMat.uniforms.uPx.value = px;
    portal.visible = style === 1;
    if (portal.visible) {
      const open = ease(s / 0.35), close = ease((s - 0.78) / 0.22);
      portalMat.uniforms.uOpen.value = open * (1 - close) + 1e-3;
      portalMat.uniforms.uAlpha.value = Math.min(1, s / 0.05) * (1 - close);
      portalMat.uniforms.uTime.value = clock;
      portal.position.copy(orb);
      portal.quaternion.copy(camera.quaternion);
      portal.scale.setScalar(radius * 5.5);
    }
    dots.visible = style === 2 || style === 3;
    if (!dots.visible) return;
    aA.fill(0);
    if (style === 3) {
      for (let i = 0; i < N; i++) {
        const m = start[i], u = clamp01((s - m.delay) / 0.5);
        if (u <= 0 || u >= 1) continue;
        const e = u * u * u, ang = (1 - e) * m.spin;
        v.copy(m.d).multiplyScalar(m.far * (1 - e));
        const c = Math.cos(ang), sn = Math.sin(ang);
        pos[i * 3] = orb.x + v.x * c - v.z * sn;
        pos[i * 3 + 1] = orb.y + v.y;
        pos[i * 3 + 2] = orb.z + v.x * sn + v.z * c;
        aA[i] = ease(u / 0.15) * (1 - ease((u - 0.9) / 0.1));
        aS[i] = m.size * (0.6 + 0.6 * e);
      }
    } else if (s < 0.72) {
      const flick = s > 0.5 ? 0.6 + 0.4 * Math.sin(clock * 90) * Math.sin(clock * 37) : 1;
      for (let i = 0; i < TRAIL; i++) {
        const t = s - i * 6e-3;
        if (t < 0) break;
        sparkAt(t, orb, v);
        pos[i * 3] = v.x;
        pos[i * 3 + 1] = v.y;
        pos[i * 3 + 2] = v.z;
        aA[i] = (i === 0 ? 1.4 : 0.7 * (1 - i / TRAIL)) * flick * Math.min(1, s / 0.03);
        aS[i] = i === 0 ? 1.2 + (s > 0.5 ? 0.8 * (s - 0.5) / 0.18 : 0) : 0.5 * (1 - i / TRAIL);
      }
    }
    dotGeo.attributes.position.needsUpdate = true;
    dotGeo.attributes.aA.needsUpdate = true;
    dotGeo.attributes.aS.needsUpdate = true;
  };
  return { group, update, disposables: [portalGeo, portalMat, dotGeo, dotMat] };
}
{
  SPAWN_NAMES,
  makeSpawnFx,
  spawnLook
};

return {makeSpawnFx,spawnLook};})();
const __sp={prev:0,wt:-1,w:0,x:0,z:0,fx:null,sc:null};

const __st={el:null,lp:'none yet',at:0,fps:0};
