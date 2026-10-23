"""Owner-v2 source-only extraction, body registration and grid-atlas delivery."""
from pathlib import Path
from hashlib import sha256
from PIL import Image, ImageDraw
import numpy as np
import json, math, sys
from collections import deque

ROOT=Path(sys.argv[1]).resolve()
REPO=Path(__file__).resolve().parents[1]
FRAME_W,FRAME_H=288,192
STANDING_HEIGHT,GROUND=132,183
DEST=REPO/'artifacts/ddg-control/public/employee-animations'
manifest=json.loads((DEST/'manifest.json').read_text())
# Visible sprite inventory, not the often duplicated/missing printed numbers.
# Each row is one contiguous action; emotes below are separate held poses.
SPECS={
 'heimdall':((350,936),(950,1518),[(50,169,6),(50,169,7),(242,363,8),(243,365,7),(438,553,7),(432,553,7),(622,741,7),(620,741,7)],['idle','walk','turn','heavy-swing','guard','alert','scan','interact'],(812,948,11)),
 'tyr':((350,938),(960,1518),[(45,154,8),(45,154,8),(222,336,8),(223,338,6),(418,520,8),(418,520,7),(604,718,7),(604,718,7)],['idle','walk','turn','heavy-slash','guard','alert','rally','interact'],(801,938,11)),
 'freya':((360,944),(960,1518),[(51,162,8),(51,162,8),(237,356,8),(237,356,8),(432,536,6),(432,536,5),(609,730,7),(609,730,4)],['idle','walk','turn','nature-magic','create-content','social-planning','rally','pet-interact'],(810,935,11)),
 'plutus':((370,944),(965,1518),[(49,153,7),(49,153,8),(225,343,7),(225,343,8),(421,523,8),(421,523,8),(603,717,7),(603,717,7)],['idle','walk','turn','analyze','calculate','invest','approve','deny'],(800,940,12)),
 'mimir':((340,940),(950,1518),[(47,161,7),(47,161,7),(232,347,8),(230,347,7),(431,537,7),(429,537,7),(611,729,7),(611,729,7)],['idle','walk','turn','research','analyze','share-insight','raven-command','meditate'],(809,941,15)),
 'daedalus':((400,960),(978,1518),[(51,163,7),(51,163,7),(234,350,7),(234,350,6),(432,556,7),(430,556,7),(630,744,6),(631,744,6)],['idle','walk','turn','build','analyze','experiment','companion-command','interact'],(814,946,13)),
 'harald':((448,996),(1012,1518),[(49,164,7),(49,164,7),(237,348,7),(237,348,7),(430,538,7),(430,538,7),(625,735,7),(625,735,7)],['idle','walk','turn','review','advise','enforce','command','think'],(818,940,13)),
 'njord':((450,990),(1006,1518),[(50,164,7),(50,164,7),(237,348,7),(237,348,7),(430,539,6),(430,539,7),(625,735,7),(625,735,6)],['idle','walk','turn','negotiate','plan','rally','observe','command'],(819,941,15)),
 'hermes':((440,984),(1006,1518),[(64,164,7),(64,164,7),(239,349,7),(239,349,7),(433,539,6),(433,539,7),(630,736,6),(630,736,6)],['idle','walk','turn','review','organize','deliver','communicate','observe'],(829,937,15)),
}
EMOTES={
 'heimdall':['rest','nod','confused','think','sit','scratch','eat','bird-friend','pray','point','sleep'],
 'tyr':['rest','nod','confused','think','sit','drink','eat','cheer','boast','sleep','bird-friend'],
 'freya':['wave','cheer','laugh','think','idea','love-boar','raven-fly','raven-perch','drink','eat','nap'],
 'plutus':['wave','think','count','laugh','money-rain','pig-pet','drink','nap','idea','confused','stressed','celebrate'],
 'mimir':['wave','nod','think','confused','idea','laugh','facepalm','drink','pet-raven','read','nap','scroll-nap','scroll','map','stare'],
 'daedalus':['wave','think','laugh','confused','idea','approve','facepalm','raven-fly','pet-dog','drink','sketch','sleep','fix'],
 'harald':['wave','nod','think','confused','approve','disapprove','laugh','scold','pet-wolf','read','drink','sleep','celebrate'],
 'njord':['wave','nod','think','confident','approve','disapprove','laugh','idea','drink','read','plan','point','lookout','lookout-cheer','celebrate'],
 'hermes':['wave','nod','think','confident','approve','disapprove','laugh','idea','point','check-map','drink','rest','shrug','clean','celebrate'],
}

def isolate(cell):
 a=np.array(cell.convert('RGBA')); rgb=a[:,:,:3].astype(float); h,w=rgb.shape[:2]
 # Estimate flattened sheet background from the darkest border samples.
 border=np.concatenate([rgb[:3].reshape(-1,3),rgb[-3:].reshape(-1,3),rgb[:,:3].reshape(-1,3),rgb[:,-3:].reshape(-1,3)])
 dark=border[np.max(border,axis=1)<40]
 base=np.median(dark,axis=0) if len(dark) else np.array([10,16,13])
 candidate=np.max(np.abs(rgb-base),axis=2)<12
 # Remove background reachable from outside only. Interior dark armor stays.
 seen=np.zeros((h,w),bool); q=deque()
 for x in range(w):
  for y in [0,h-1]:
   if candidate[y,x] and not seen[y,x]:seen[y,x]=1;q.append((y,x))
 for y in range(h):
  for x in [0,w-1]:
   if candidate[y,x] and not seen[y,x]:seen[y,x]=1;q.append((y,x))
 while q:
  y,x=q.popleft()
  for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]:
   if 0<=yy<h and 0<=xx<w and candidate[yy,xx] and not seen[yy,xx]:seen[yy,xx]=1;q.append((yy,xx))
 a[seen,3]=0
 return Image.fromarray(a)

def split_row(board,left,right,top,bottom,count):
 band=np.array(isolate(board.crop((0,top,board.width,bottom))))
 energy=(band[:,:,3]>0).sum(0)*1000
 energy=np.convolve(energy,np.ones(3)/3,mode='same')
 # Global gutter partition: nonuniform source spacing can move later poses
 # by half a nominal cell. A local equal-grid adjustment cuts through bodies.
 width=right-left;average=width/count;minimum=max(18,int(average*.40));maximum=int(average*1.85)
 dp=np.full((count+1,width+1),np.inf);back=np.full((count+1,width+1),-1,dtype=int);dp[0,0]=0
 for j in range(1,count+1):
  for x in ([width] if j==count else range(j*minimum,min(width-(count-j)*minimum,j*maximum)+1)):
   lo=max((j-1)*minimum,x-maximum);hi=x-minimum
   if hi<lo:continue
   previous=np.arange(lo,hi+1)
   costs=dp[j-1,previous]+((x-previous-average)**2)*.12
   k=int(np.argmin(costs));best=int(previous[k])
   dp[j,x]=costs[k]+(energy[left+x] if j<count else 0);back[j,x]=best
 cuts=[right];cursor=width
 for j in range(count,0,-1):
  cursor=int(back[j,cursor])
  if cursor<0:raise ValueError('No feasible source gutter partition')
  cuts.append(left+cursor)
 cuts=list(reversed(cuts))
 return [(isolate(board.crop((l,top,r,bottom))),(l,top,r,bottom)) for l,r in zip(cuts,cuts[1:])]

def body_anchor(cell):
 a=np.array(cell);mask=a[:,:,3]>0;h,w=mask.shape
 # Torso band, rather than the extreme antler/axe/raven/coin extent.
 weights=mask[round(h*.36):round(h*.70)].sum(0)
 xs=np.arange(w);central=(xs>w*.12)&(xs<w*.88);weights=weights*central
 if weights.sum():cx=float(np.searchsorted(np.cumsum(weights),weights.sum()/2))
 else:cx=w/2
 lo=max(0,round(cx-w*.18));hi=min(w,round(cx+w*.18))
 ys=np.flatnonzero(mask[:,lo:hi].sum(1)>2)
 ground=int(ys[-1]) if len(ys) else h-1
 return cx,ground

provenance={};summaries=[]
for name,(left,right,rows,ids,emotes) in SPECS.items():
 source=ROOT/f'{name}-owner-v2.png';board=Image.open(source).convert('RGBA')
 clips=[];all_cells=[]
 for index,((top,bottom,count),action) in enumerate(zip(rows,ids)):
  l,r=left if index%2==0 else right
  cells=split_row(board,l,r,top,bottom,count)
  clips.append((action,cells));all_cells.extend(cells)
 top,bottom,count=emotes
 cells=split_row(board,20,1518,top,bottom,count)
 for label,cell in zip(EMOTES[name],cells):
  clips.append((f'emote-{label}',[cell]));all_cells.append(cell)
 idle=clips[0][1]
 idle_h=[c.getbbox()[3]-c.getbbox()[1] for c,_ in idle if c.getbbox()]
 # One scale for all poses, so action changes never resize the character.
 boxes=[c.getbbox() for c,_ in all_cells if c.getbbox()]
 clean_idle=[]
 for index,(cell,_) in enumerate(idle):
  alpha=np.array(cell)[:,:,3]>0;hh,ww=alpha.shape
  band=alpha[round(hh*.22):round(hh*.88)]
  border=max(band[:,2:5].sum(0).max(),band[:,-5:-2].sum(0).max())
  if border<max(22,round(hh*.32)):clean_idle.append(index)
 if not clean_idle:raise ValueError(f'No whole standing reference for {name}')
 reference_index=min(clean_idle,key=lambda i:abs((idle[i][0].getbbox()[3]-idle[i][0].getbbox()[1])-np.median(idle_h)))
 reference_box=idle[reference_index][0].getbbox()
 scale=STANDING_HEIGHT/(reference_box[3]-reference_box[1])
 reference_area=float(np.median([(np.array(c)[:,:,3]>0).sum() for c,_ in idle]))
 prepared=[];actions=[];notes=[]
 for action,cells in clips:
  start=len(prepared);rects=[];usable=[]
  for cell,rect in cells:
   bbox=cell.getbbox()
   if not bbox:raise ValueError(f'Empty owner pose: {name}/{action}/{rect}')
   cx,ground=body_anchor(cell)
   sprite=cell.crop(bbox);sprite=sprite.resize((max(1,round(sprite.width*scale)),max(1,round(sprite.height*scale))),Image.Resampling.NEAREST)
   x=round(FRAME_W/2+(bbox[0]-cx)*scale);y=round(GROUND+(bbox[1]-ground)*scale)
   # Effects can extend beyond the torso. Keep a full pose in the cell by a
   # translation only; never rescale individual frames to fit.
   x=min(max(x,0),max(0,FRAME_W-sprite.width));y=min(max(y,0),max(0,FRAME_H-sprite.height))
   if sprite.width>FRAME_W or sprite.height>FRAME_H:raise ValueError(f'Pose exceeds padded canvas: {name}/{action}/{rect}')
   frame=Image.new('RGBA',(FRAME_W,FRAME_H));frame.paste(sprite,(x,y));prepared.append(frame);rects.append(rect)
   alpha=np.array(cell)[:,:,3]>0;hh,ww=alpha.shape
   band=alpha[round(hh*.22):round(hh*.88)]
   border=max(band[:,2:5].sum(0).max(),band[:,-5:-2].sum(0).max())
   acceptable=bool((len(cells)==1 or (border<max(22,round(hh*.32)) and alpha.sum()>=reference_area*.5)) and bbox[2]-bbox[0]>18)
   if acceptable:usable.append(len(prepared)-1)
   notes.append({'action':action,'source_rect':rect,'body_anchor':[cx+rect[0],ground+rect[1]],'scale':scale,'offset':[x,y],'overflow':sprite.width>FRAME_W or sprite.height>FRAME_H,'playback_eligible':acceptable,'border_contact_pixels':int(border)})
  # Do not flash a severed/adjacent partial character in playback. Keep all
  # source cells in the archived atlas/provenance; the playable order omits
  # cells touching a cut through the torso. No replacement frame is invented.
  if not usable:
   raise ValueError(f'No clean source poses in {name}/{action}; revise source cuts')
  actions.append({'id':action,'label':action.replace('emote-','').replace('-',' ').title(),'src':f'employee-animations/{name}-owner-v3.webp','start':start,'indices':usable,'sourceFrames':len(cells),'frames':len(usable),'frameMs':min(320,max(180,2400//len(usable))) if len(usable)>1 else 1600})
 columns=8;nr=math.ceil(len(prepared)/columns)
 atlas=Image.new('RGBA',(columns*FRAME_W,nr*FRAME_H))
 for index,frame in enumerate(prepared):atlas.paste(frame,((index%8)*FRAME_W,(index//8)*FRAME_H))
 atlas.save(DEST/f'{name}-owner-v3.webp',lossless=True,method=6)
 poster_index=reference_index
 prepared[poster_index].save(DEST/f'{name}-owner-v3-rest.webp',lossless=True,method=6)
 for action in actions:action.update(columns=8,rows=nr,canvasAspect=FRAME_W/FRAME_H,poster=f'employee-animations/{name}-owner-v3-rest.webp')
 key='person-heimdall-gm' if name=='heimdall' else f'person-{name}'
 manifest[key]=actions
 provenance[name]={'source':source.name,'sha256':sha256(source.read_bytes()).hexdigest(),'method':'edge-connected background flood removal; preserve enclosed dark pixels; equal standing silhouette height; padded rectangular cells; no invented poses','canvas':[FRAME_W,FRAME_H],'standing_height':STANDING_HEIGHT,'poster_index':poster_index,'cells':notes}
 sheet=Image.new('RGB',(1024,math.ceil(len(prepared)/8)*140),(18,35,39));draw=ImageDraw.Draw(sheet)
 for i,f in enumerate(prepared):
  f=f.resize((128,128),Image.Resampling.NEAREST);sheet.paste(f,((i%8)*128,(i//8)*140+12),f)
  draw.text(((i%8)*128+3,(i//8)*140),str(i),fill='white')
 sheet.save(ROOT/f'{name}-v3-contact.jpg',quality=94)
 previews=[]
 for f in prepared[:len(idle)]:
  bg=Image.new('RGBA',(FRAME_W,FRAME_H),(18,35,39));bg.alpha_composite(f);previews.append(bg.convert('RGB'))
 previews[0].save(ROOT/f'{name}-v3-idle.gif',save_all=True,append_images=previews[1:],duration=320,loop=0,disposal=2)
 summaries.append({'character':name,'actions':len(actions),'cells':len(prepared),'overflow':sum(n['overflow'] for n in notes)})
(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(REPO/'artifacts/ddg-control/src/lib/employee-animations.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(DEST/'owner-v3-provenance.json').write_text(json.dumps(provenance,indent=2),encoding='utf8')
print(json.dumps(summaries))
