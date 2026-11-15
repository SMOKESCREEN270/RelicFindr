/* ---------- museum ---------- */
const museum=new THREE.Scene();museum.background=new THREE.Color(0x070a12);
const solids=[],frames=[],fmat=[],pedModels=[],FPOS=[],spinners=[];
const tx=(c,rx=1,ry=1)=>{const t=T(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return t};
/* geometry whose UVs are in metres, so one 512px texture covers `tile` metres on every face */
function tbox(g,w,h,d,mat,x,y,z,tile=4){const ge=new THREE.BoxGeometry(w,h,d),uv=ge.attributes.uv,sz=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
 for(let f=0;f<6;f++)for(let v=0;v<4;v++){const k=f*4+v;uv.setXY(k,uv.getX(k)*sz[f][0]/tile,uv.getY(k)*sz[f][1]/tile)}
 const m=new THREE.Mesh(ge,mat);m.position.set(x,y,z);g.add(m);return m}
function tplane(w,h,mat,tile=4){const ge=new THREE.PlaneGeometry(w,h),uv=ge.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*w/tile,uv.getY(k)*h/tile);return new THREE.Mesh(ge,mat)}
const SM=(canvas,o)=>new THREE.MeshStandardMaterial(Object.assign({map:tx(canvas),roughness:.75},o));
function sign(t,w,h,col,bg='#0b0f1add'){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.strokeStyle=col;x.lineWidth=6;x.strokeRect(6,6,c.width-12,c.height-12);x.fillStyle=col;x.font='bold '+Math.round(c.height*.4)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,c.width/2,c.height/2+3);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:T(c)}))}
function wall(w,h,d,x,y,z,mat){const m=tbox(museum,w,h,d,mat,x,y,z,4);solids.push(m);return m}
const MT={
 fL:SM(GEN.c('tile',0x1a2540,0x3a4a70,1),{roughness:.32,metalness:.25}),fR:SM(GEN.c('tile',0x3a1a20,0x6a3a30,2),{roughness:.32,metalness:.25}),
 wL:SM(GEN.c('panel',0x5a6a92,2),{roughness:.55,metalness:.35}),wR:SM(GEN.c('panel',0x8a5a50,3),{roughness:.55,metalness:.35}),wG:SM(GEN.c('panel',0x3c566e,4),{roughness:.5,metalness:.4}),
 fG:SM(GEN.c('plate',0x5ee1ff,4),{roughness:.3,metalness:.5}),ce:new THREE.MeshBasicMaterial({map:tx(GEN.c('ceil',3),3.5,3),color:0xb8c4e0})};
for(const[s,fm,wm]of[[-1,MT.fL,MT.wL],[1,MT.fR,MT.wR]]){const f=tplane(14,12,fm,3.5);f.rotation.x=-Math.PI/2;f.position.set(s*7,0,0);museum.add(f);solids.push(f);
 const ce=tplane(14,12,MT.ce,4);ce.rotation.x=Math.PI/2;ce.position.set(s*7,5,0);museum.add(ce);solids.push(ce);
 const gc=s<0?0x5ee1ff:0xffb347;box(museum,13,.06,.15,gc,s*7,4.9,-5.9,{emissive:gc});box(museum,13,.06,.15,gc,s*7,4.9,5.9,{emissive:gc});
 wall(14,5,.3,s*7,2.5,-6,wm);wall(.3,5,12,s*14,2.5,0,wm);
 /* south wall of each wing, with a doorway into the gallery at |x| = 5.5..8.5 */
 wall(5.5,5,.3,s*11.25,2.5,6,wm);wall(5.5,5,.3,s*2.75,2.5,6,wm);wall(3,1.8,.3,s*7,4.1,6,wm);
 for(const px of[5.5,8.5])box(museum,.3,3.2,.5,gc,s*px,1.6,6,{emissive:gc,emissiveIntensity:.5});
 box(museum,3.3,.18,.5,gc,s*7,3.2,6,{emissive:gc,emissiveIntensity:.8});
 const sg=sign('DEEP SPACE GALLERY  ▶',2.9,.5,'#ffd27a');sg.position.set(s*7,3.7,5.84);sg.rotation.y=Math.PI;museum.add(sg);
 const sg2=sign('◀  MOON · MARS WINGS',2.9,.5,s<0?'#5ee1ff':'#ffb347');sg2.position.set(s*7,3.7,6.16);museum.add(sg2);
 const wn=sign(s<0?'MOON & DEEP SPACE':'MARS WING',5.4,.7,s<0?'#5ee1ff':'#ffb347');wn.position.set(s*7,4.2,-5.82);museum.add(wn)}
wall(.3,5,4.5,0,2.5,-3.75,MT.wL);wall(.3,5,4.5,0,2.5,3.75,MT.wR);
/* ---- Deep Space Gallery (south of the wings) ---- */
{const f=tplane(28,18,MT.fG,3);f.rotation.x=-Math.PI/2;f.position.set(0,0,15);museum.add(f);solids.push(f);
 const ce=tplane(28,18,MT.ce,4);ce.rotation.x=Math.PI/2;ce.position.set(0,5,15);museum.add(ce);solids.push(ce);
 wall(.3,5,18,-14,2.5,15,MT.wG);wall(.3,5,18,14,2.5,15,MT.wG);wall(28,5,.3,0,2.5,24,MT.wG);
 for(const z of[6.4,23.6])box(museum,27,.06,.15,0x5ee1ff,0,4.9,z,{emissive:0x5ee1ff});
 const gs=sign('DEEP SPACE GALLERY',7,.8,'#ffd27a');gs.position.set(0,4.25,23.82);gs.rotation.y=Math.PI;museum.add(gs);
 const sub=sign('Telescopes and probes that left the planets behind',9,.5,'#9fd8ff');sub.position.set(0,.6,23.82);sub.rotation.y=Math.PI;museum.add(sub);
 museum.add(new THREE.AmbientLight(0xaab8ff,.28));for(const[x,z]of[[0,10],[-8,19],[8,19],[0,19]]){const l=new THREE.PointLight(0xbcd0ff,.75,20);l.position.set(x,4.4,z);museum.add(l)}
 /* centrepiece: a slowly turning Saturn on a plinth */
 const base=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.3,.75,40),SM(GEN.c('plate',0xffd27a,5),{roughness:.4,metalness:.5}));base.position.set(0,.375,14.5);museum.add(base);
 const sat=new THREE.Group(),ball=new THREE.Mesh(new THREE.SphereGeometry(.7,48,32),new THREE.MeshStandardMaterial({map:T(GEN.c('saturn')),roughness:.9}));sat.add(ball);
 const rg=new THREE.RingGeometry(.95,1.7,96),p=rg.attributes.position,uv=rg.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(Math.hypot(p.getX(i),p.getY(i))-.95)/.75,.5);
 const rm=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({map:T(GEN.c('rings')),transparent:true,side:2,depthWrite:false}));rm.rotation.x=-Math.PI/2;sat.add(rm);sat.rotation.z=.42;sat.position.set(0,2.05,14.5);museum.add(sat);spinners.push(dt=>{sat.rotation.y+=dt*.3});
 const pl=new THREE.PointLight(0xffe6b0,.9,8);pl.position.set(0,3.1,14.5);museum.add(pl)}
/* walking bounds: wings, two doorways, gallery, and a keep-out circle around the centrepiece */
function walkable(x,z){if(Math.abs(x)>13.5||z<-5.4||z>23.4)return false;
 if(z<=5.5)return!(Math.abs(x)<.55&&Math.abs(z)>1.5);
 if(z<6.9){const a=Math.abs(x);return a>5.75&&a<8.25}
 return Math.hypot(x,z-14.5)>1.7}
museum.add(new THREE.AmbientLight(0xffffff,.5));for(const x of[-7,7]){const l=new THREE.PointLight(x<0?0x9fd8ff:0xffc58a,.9,22);l.position.set(x,4.5,0);museum.add(l)}

function pic(i,E){const c=document.createElement('canvas');c.width=320;c.height=240;const x=c.getContext('2d');
const g=x.createLinearGradient(0,0,0,240);g.addColorStop(0,E.sky[0]);g.addColorStop(1,E.sky[1]);x.fillStyle=g;x.fillRect(0,0,320,240);
for(let k=0;k<40;k++){x.fillStyle='#fff8';x.fillRect(Math.random()*320,Math.random()*150,2,2)}
x.fillStyle=E.gr;x.fillRect(0,175,320,65);x.save();x.translate(100,52);x.scale(5,5);x.strokeStyle='#fff';x.globalAlpha=.9;x.lineWidth=1.5;x.lineCap='round';x.lineJoin='round';(IC.P[E.e]||[]).forEach(d=>x.stroke(new Path2D(d)));x.restore();
x.fillStyle='#fff';x.font='bold 18px sans-serif';x.fillText(E.n,160,205);x.font='12px sans-serif';x.fillStyle='#ffd9a0';x.fillText('FIG. '+(i+1)+' · '+E.fig,160,226);return c}

const FX=[-10.5,-7,-3.5,3.5,7,10.5,-9,-3,3,9];
EXH.forEach((E,i)=>{const gal=i>=6,x=FX[i],z=gal?23.8:-5.8,ry=gal?Math.PI:0,d=gal?-1:1;FPOS.push({x,z,ry,d,pz:z+d*1.4});
const fr=box(museum,3.1,2.4,.08,0xffd27a,x,2.3,z,{emissive:0x222222});fmat.push(fr.material);
const p=new THREE.Mesh(new THREE.PlaneGeometry(2.8,2.1),new THREE.MeshBasicMaterial({map:T(pic(i,E))}));p.position.set(x,2.3,z+d*.06);p.rotation.y=ry;p.userData.ex=i;museum.add(p);frames.push(p);
box(museum,2,.05,.1,0xfff2c0,x,3.62,z+d*.1,{emissive:0xffe9a8})});

/* ---------- photo worlds ---------- */
function label(t,col='#5ee1ff'){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='bold 26px sans-serif';x.textAlign='center';x.fillStyle=col;x.fillText(t,128,40);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:T(c),transparent:true,depthTest:false}));s.scale.set(3,.75,1);return s}
function wrap(x,t,w){let l='',o=[];for(const q of t.split(' ')){const u=l?l+' '+q:q;if(x.measureText(u).width>w&&l){o.push(l);l=q}else l=u}o.push(l);return o}
function plaque(a){const c=document.createElement('canvas');c.width=1024;c.height=640;const x=c.getContext('2d');
x.fillStyle='#0d1322';x.fillRect(0,0,1024,640);x.fillStyle=a.c;x.fillRect(0,0,1024,14);x.fillRect(0,626,1024,14);
x.font='bold 22px sans-serif';x.fillText(a.tag,40,64);let y=140;
if(a.date){x.font='72px Georgia,serif';x.fillText(a.date,40,y+10);y+=70}
x.fillStyle='#fff';x.font=a.date?'bold 42px sans-serif':'64px Georgia,serif';
for(const l of wrap(x,a.head,944)){x.fillText(l,40,y);y+=a.date?50:74}
y+=18;x.font='32px sans-serif';x.fillStyle='#d7deee';for(const l of wrap(x,a.body,944)){x.fillText(l,40,y);y+=44}return T(c)}
/* ---------- themed relic rooms ---------- */
const PAL={vio:null,teal:[[0,[1,4,12]],[.4,[10,40,70]],[.7,[40,140,170]],[1,[230,250,255]]],gold:[[0,[6,4,2]],[.4,[60,30,10]],[.7,[200,130,40]],[1,[255,240,190]]],blue:[[0,[2,3,14]],[.45,[20,30,90]],[.75,[80,120,230]],[1,[230,240,255]]]};
const ROOM={
 lm:{f:()=>GEN.c('regolith',5),ft:6,fr:1,wl:0x66708a,ce:'star'},
 near:{f:()=>GEN.c('regolith',15),ft:6,fr:1,wl:0x6a6a72,ce:'star'},
 kep:{f:()=>GEN.c('plate',0x5ee1ff,4),ft:3,fr:.4,fm:.5,wl:0x4a6a96,ce:['nebula',21,PAL.teal]},
 vik:{f:()=>GEN.c('rust',6),ft:6,fr:1,wl:0x8a5a48,ce:'star'},
 opp:{f:()=>GEN.c('rust',16),ft:6,fr:1,wl:0x8a5a48,ce:'star'},
 ing:{f:()=>GEN.c('rust',26),ft:6,fr:1,wl:0x8a5a48,ce:'star'},
 hub:{f:()=>GEN.c('plate',0x7fb8ff,4),ft:3,fr:.35,fm:.6,wl:0x4a68a0,ce:['nebula',31,PAL.blue],prop:'earth'},
 voy:{f:()=>GEN.c('plate',0xffd27a,5),ft:3,fr:.35,fm:.6,wl:0x7a6a48,ce:['nebula',41,PAL.gold],prop:'record'},
 cas:{f:()=>GEN.c('plate',0xd8c28a,6),ft:3,fr:.35,fm:.6,wl:0x7a7258,ce:['nebula',51,PAL.gold],prop:'saturn'},
 pio:{f:()=>GEN.c('plate',0xffb347,7),ft:3,fr:.35,fm:.6,wl:0x84603c,ce:['nebula',61,null],prop:'jupiter'}};
function ringMesh(a,b,seg=96){const g=new THREE.RingGeometry(a,b,seg),p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(Math.hypot(p.getX(i),p.getY(i))-a)/(b-a),.5);
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:T(GEN.c('rings')),transparent:true,side:2,depthWrite:false}));m.rotation.x=-Math.PI/2;return m}
const PFB={earth:0x2a4a7a,saturn:0xc2a26a,jupiter:0xb08a6a};
function planet(tex,r){let mat;try{mat=new THREE.MeshStandardMaterial({map:T(GEN.c(tex)),roughness:.9})}catch(e){console.warn('planet texture failed',tex,e);mat=new THREE.MeshBasicMaterial({color:PFB[tex]||0x334466})}return new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat)}
function makeWorld(i,pc){const E=EXH[i],T0=TL[i],A=new THREE.Color(T0.c),s=new THREE.Scene(),th=ROOM[E.k];s.background=new THREE.Color(0x05070d);
const AM=()=>new THREE.MeshBasicMaterial({color:A}),spin=[];
const wm=SM(GEN.c('panel',th.wl,E.k.length+i),{roughness:.6,metalness:.35});
const fm=SM(th.f(),{roughness:th.fr,metalness:th.fm||0});const fl=tplane(16,40,fm,th.ft);fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;s.add(fl);
let cm;if(th.ce=='star')cm=new THREE.MeshBasicMaterial({map:TX.star,color:0x9aa4c0});else{const c=GEN.c('nebula',th.ce[1],th.ce[2]),t=tx(c,1,2.5);cm=new THREE.MeshBasicMaterial({map:t,color:0xbbbbbb})}
const ce=new THREE.Mesh(new THREE.PlaneGeometry(16,40),cm);ce.rotation.x=Math.PI/2;ce.position.y=6;s.add(ce);
tbox(s,.3,6,40,wm,-8,3,0);tbox(s,.3,6,40,wm,8,3,0);tbox(s,16,6,.3,wm,0,3,20);tbox(s,16,6,.3,wm,0,3,-20);
for(const x of[-5.8,5.8]){const st=new THREE.Mesh(new THREE.BoxGeometry(.12,.02,36),AM());st.position.set(x,.01,0);s.add(st)}
s.add(new THREE.AmbientLight(0xffffff,.62));for(const z of[14,2,-12]){const l=new THREE.PointLight(0xffffff,.7,22);l.position.set(0,5,z);s.add(l)}
const d=new THREE.DirectionalLight(0xffffff,.9);d.position.set(3,8,8);d.target.position.set(0,0,2);s.add(d.target);d.castShadow=true;d.shadow.mapSize.set(1024,1024);const c=d.shadow.camera;c.left=c.bottom=-6;c.right=c.top=6;c.far=30;s.add(d);
const gk={lm:'moon',near:'phobos'}[E.k];let gm=SM(th.f(),{roughness:1});if(gk){const t=TX[gk].clone();t.needsUpdate=true;if(gk=='moon'){t.repeat.set(.4,.4);t.offset.set(.58,.02)}gm=new THREE.MeshStandardMaterial({map:t,roughness:1})}
const pd=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.6,.3,48),gm);pd.position.set(0,.15,2);pd.receiveShadow=true;s.add(pd);
const rg=new THREE.Mesh(new THREE.TorusGeometry(3.5,.05,8,64),AM());rg.rotation.x=Math.PI/2;rg.position.set(0,.32,2);s.add(rg);
const m=new THREE.Group();const mo=models[i].clone(true);mo.scale.setScalar(1.1);m.add(mo);m.position.set(0,.3,2);s.add(m);
const pt=T(pc);const fr=box(s,8.6,6.6,.15,0xffd27a,0,3.3,19.8);const ph=new THREE.Mesh(new THREE.PlaneGeometry(8,6),new THREE.MeshBasicMaterial({map:pt}));ph.rotation.y=Math.PI;ph.position.set(0,3.3,19.7);s.add(ph);
const lb=label('Your photograph: the doorway you stepped through','#ffd27a');lb.scale.set(7,1.75,1);lb.position.set(0,.8,19.4);s.add(lb);
const pan=[],add=(a,x,z,ry,count)=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.625),new THREE.MeshBasicMaterial({map:plaque(a)}));mesh.position.set(x,2.4,z);mesh.rotation.y=ry;s.add(mesh);
const bk=box(s,4.4,2.8,.05,T0.c,x,2.4,z);bk.rotation.y=ry;if(ry==0)bk.position.z-=.04;else bk.position.x+=x<0?-.04:.04;bk.material=AM();
if(count){const lamp=new THREE.Mesh(new THREE.SphereGeometry(.13,12,12),new THREE.MeshBasicMaterial({color:0xffb347}));lamp.position.set(x,4.05,z);s.add(lamp);pan.push({x,z,read:0,lamp})}};
const n=T0.ev.length;T0.ev.forEach((e,k)=>add({tag:'TIMELINE · '+(k+1)+' OF '+n,date:e[0],head:e[1],body:e[2],c:T0.c},-7.78,14-k*4.6,Math.PI/2,1));
E.t.forEach((t,k)=>add({tag:'STATION '+(k+1)+' OF 4',head:t[0],body:t[1],c:T0.c},7.78,12-k*7,-Math.PI/2,1));
add({tag:'RELIC ROOM',head:E.n,body:E.fig+'. Timeline on the left, stations on the right. Read everything to unlock the exit.',c:T0.c},-4.8,-19.78,0,0);
/* themed props */
if(th.prop=='earth'){const e=planet('earth',1.5);e.position.set(0,4,-8);s.add(e);const o=new THREE.Mesh(new THREE.TorusGeometry(2.4,.02,8,96),AM());o.rotation.x=Math.PI/2.4;o.position.copy(e.position);s.add(o);spin.push(dt=>{e.rotation.y+=dt*.2});const l=new THREE.PointLight(0xaaccff,.8,12);l.position.set(0,4,-6);s.add(l)}
if(th.prop=='saturn'||th.prop=='jupiter'){const g=new THREE.Group(),b=planet(th.prop,1.5);g.add(b);if(th.prop=='saturn')g.add(ringMesh(1.9,3.4));g.rotation.z=.4;g.position.set(0,4,-8);s.add(g);spin.push(dt=>{b.rotation.y+=dt*.2});const l=new THREE.PointLight(0xffe0b0,.8,12);l.position.set(0,4,-6);s.add(l)}
if(th.prop=='record'||(E.k=='pio')){const isR=th.prop=='record',cn=isR?GEN.c('record'):GEN.c('plaque'),w=isR?3.2:3.6,h=isR?3.2:2.25,mm=new THREE.Mesh(isR?new THREE.CircleGeometry(1.6,64):new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:T(cn),roughness:.35,metalness:.7,emissive:0x221100,emissiveMap:T(cn)}));mm.position.set(4.8,2.5,-19.7);s.add(mm);
 const t=label(isR?'Golden Record':'Plaque','#ffd27a');t.scale.set(5,1.25,1);t.position.set(4.8,.7,-19.5);s.add(t);if(isR)spin.push(dt=>{mm.rotation.z-=dt*.4})}
const gl=new THREE.Mesh(new THREE.PlaneGeometry(3,4),new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:.55}));gl.position.set(0,2,-19.8);s.add(gl);
box(s,.3,4.3,.3,0xcccccc,-1.65,2.15,-19.7);box(s,.3,4.3,.3,0xcccccc,1.65,2.15,-19.7);box(s,3.6,.3,.3,0xcccccc,0,4.3,-19.7);
const dl=label('Exit to museum','#ffffff');dl.position.set(0,5.1,-19.6);s.add(dl);
if(E.k=='near')boulders(s,[[-4.6,3.0,.5],[4.4,.2,.6],[-3.6,-1.4,.4],[4,4.2,.45]]);
if(E.k=='ing'){m.updateMatrixWorld(true);const top=new THREE.Box3().setFromObject(m).max.y-m.position.y,bl=[];m.position.y=1.1;
 for(const dy of[.05,.3]){const disc=new THREE.Mesh(new THREE.CircleGeometry(1.9,48),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));disc.rotation.x=-Math.PI/2;disc.position.y=top+dy;m.add(disc);
  const b=new THREE.Mesh(new THREE.BoxGeometry(3.8,.03,.2),M(0x222222));b.position.y=top+dy;m.add(b);bl.push(b)}
 const dust=new THREE.Mesh(new THREE.RingGeometry(1.3,2.1,48),new THREE.MeshBasicMaterial({color:0xd8a070,transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));dust.rotation.x=-Math.PI/2;dust.position.set(0,.34,2);s.add(dust);
 let a=0,t=0;spin.push(dt=>{a+=dt*40;t+=dt;bl[0].rotation.y=a;bl[1].rotation.y=-a;m.position.y=1.1+Math.sin(t*2)*.05;const k=1+.08*Math.sin(t*3);dust.scale.set(k,k,1)})}
return{s,m,pan,door:{gl,open:0},E,spin}}
/* ---------- orbital backdrops for pictures ---------- */
function limb(sc,E){const o=E.orb;if(o.k=='sun'){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:T(GEN.c('glow')),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(26,26,1);sp.position.set(-30,12,-60);sc.add(sp);
  const dot=new THREE.Sprite(new THREE.SpriteMaterial({map:T(GEN.c('glow','150,190,255')),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));dot.scale.set(1.6,1.6,1);dot.position.set(26,9,-50);sc.add(dot);return}
 const g=new THREE.Group(),b=planet(o.tex,o.r);g.add(b);if(o.ring)g.add(ringMesh(o.r*1.24,o.r*2.27));
 if(o.k=='limb'){g.position.set(0,-o.r-o.dy,o.z);const at=new THREE.Mesh(new THREE.SphereGeometry(o.r*1.03,64,32),new THREE.MeshBasicMaterial({color:o.atm,transparent:true,opacity:.22,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(at)}
 else{g.position.set(o.x,o.y,o.z);g.rotation.z=.4}sc.add(g)}
function plinth(sc,E,r){const R=Math.min(6,r||6);const d=new THREE.Mesh(new THREE.CircleGeometry(R,64),new THREE.MeshBasicMaterial({color:E.gnd,transparent:true,opacity:.35}));d.rotation.x=-Math.PI/2;d.position.y=.01;sc.add(d);const g=new THREE.Mesh(new THREE.RingGeometry(R-.4,R,64),new THREE.MeshBasicMaterial({color:0xffb347,side:THREE.DoubleSide,transparent:true,opacity:.6}));g.rotation.x=-Math.PI/2;g.position.y=.02;sc.add(g)}
const isPlinth=E=>E.k=='kep'||(E.orb&&['sun','limb','bg'].includes(E.orb.k));
function boulders(sc,pts){const bm=M(0x6f6a66,{roughness:1,flatShading:true});pts.forEach(([x,z,s])=>{const b=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),bm);b.position.set(x,s*.45,z);b.rotation.set(x,z,s);b.scale.y=.75;b.castShadow=b.receiveShadow=true;sc.add(b)})}
function stage(sc,E,r){const gk={lm:'moon',near:'phobos'}[E.k];
if(E.orb)limb(sc,E);if(isPlinth(E))plinth(sc,E,r);if(!E.orb&&!isPlinth(E)){let gm=M(E.gnd);
if(gk){const t=TX[gk].clone();t.needsUpdate=true;if(gk=='moon'){t.repeat.set(.4,.4);t.offset.set(.58,.02)}gm=new THREE.MeshStandardMaterial({map:t,roughness:1})}
const g=new THREE.Mesh(new THREE.CircleGeometry(r,64),gm);g.rotation.x=-Math.PI/2;g.receiveShadow=true;sc.add(g)}
if(E.k=='near')boulders(sc,[[-4,1.2,.9],[3.8,-2.6,1.3],[-2.2,-4.8,.7],[5.6,3.1,1.1]]);
if(E.stars){const t=TX.star;sc.add(new THREE.Mesh(new THREE.SphereGeometry(140,48,24),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false})))}
else{const t=TX.band.clone();t.needsUpdate=true;t.wrapS=THREE.RepeatWrapping;t.repeat.x=3;const b=new THREE.Mesh(new THREE.CylinderGeometry(95,95,60,64,1,true),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false,color:0xdddddd}));b.position.y=22;sc.add(b)}
sc.add(new THREE.HemisphereLight(0xffffff,0x555566,E.stars?.45:.8));const d=new THREE.DirectionalLight(0xffffff,E.stars?1.7:1.2);d.position.set(7,11,6);d.castShadow=true;d.shadow.mapSize.set(2048,2048);const c=d.shadow.camera;c.left=c.bottom=-9;c.right=c.top=9;c.far=40;d.shadow.bias=-.0005;sc.add(d)}
