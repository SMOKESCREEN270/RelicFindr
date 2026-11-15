/* ---------- state ---------- */
let scene=museum,mode='m',world=null,saved=null,armed=true,yaw=0,pitch=0,sel=-1,roll=0,started=false;
const P=V(0,1.6,1),photos=[],places=[],portals=[],worlds={},done=EXH.map(()=>0),keys={};
const ray=new THREE.Raycaster(),ghost=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.8),new THREE.MeshBasicMaterial({transparent:true,opacity:.5,side:2}));ghost.visible=false;museum.add(ghost);
function toast(t){const m=$('msg');m.textContent=t;m.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>m.style.opacity=0,2600)}
function hud(){const n=done.filter(Boolean).length;$('hud').style.display='flex';$('hud').style.alignItems='center';$('hud').style.gap='8px';$('hud').innerHTML=mode=='o'?`${IC.s("gamepad",14)} Operating <b>${EXH[op.i].n}</b> · R to exit`:mode=='m'?`${IC.s("museum",14)} <b>${P.z>6?'Deep Space Gallery':P.x<0?'Moon & Deep Space':'Mars Wing'}</b> · Relics explored: ${n}/${EXH.length}`:`${IC.s("search",14)} Room: <b>${world.E.n}</b> · Panels read: ${world.pan.filter(p=>p.read).length}/${world.pan.length}`;$('vf').style.display=mode=='m'?'block':'none'}
function vfSize(){const w=Math.min(innerWidth*.45,420);$('vf').style.width=w+'px';$('vf').style.height=w*.75+'px'}vfSize();
function tray(){$('tray').innerHTML='';photos.forEach((p,i)=>{const d=document.createElement('div');d.className='ph'+(i==sel?' sel':'');d.innerHTML=`<i>${i+1}</i><img src="${p.url}">${EXH[p.ex].n}`;d.onclick=()=>{sel=sel==i?-1:i;tray()};$('tray').appendChild(d)})}
function aim(objs){ray.setFromCamera({x:0,y:0},cam);return ray.intersectObjects(objs)}
function exOf(o){while(o&&o.userData.ex===undefined)o=o.parent;return o?o.userData.ex:undefined}
function snap(){if(mode!='m')return toast('Photos can only be taken in the museum.');
const h=aim(frames.concat(pedModels))[0];const ex=h&&exOf(h.object);$('flash').classList.remove('on');void $('flash').offsetWidth;$('flash').classList.add('on');
if(!h||ex===undefined||h.distance>14)return toast('Blurry shot. Aim the viewfinder at a framed relic.');
ghost.visible=false;R.render(museum,cam);const w=Math.min(innerWidth*.45,420),hh=w*.75,q=R.domElement.width/innerWidth,c=document.createElement('canvas');c.width=800;c.height=600;
c.getContext('2d').drawImage(R.domElement,(innerWidth/2-w/2)*q,(innerHeight/2-hh/2)*q,w*q,hh*q,0,0,800,600);
photos.push({ex:ex,url:c.toDataURL('image/jpeg',.9),cv:c});sel=photos.length-1;tray();toast('Photo of '+EXH[ex].n+' captured!')}
function pose(m,hit){const n=hit.face.normal.clone().transformDirection(hit.object.matrixWorld);m.position.copy(hit.point).addScaledVector(n,.05);
if(Math.abs(n.y)<.5)m.position.y=Math.max(hit.point.y,1.1);m.up.set(0,Math.abs(n.y)>.9?0:1,Math.abs(n.y)>.9?1:0);m.lookAt(m.position.clone().add(n));m.rotateZ(roll*Math.PI/2);return n}
function place(){if(mode!='m'||sel<0)return;const h=aim(solids.filter(s=>s.visible))[0];if(!h||h.distance>12)return toast('Aim at a wall or the floor to project the photo.');
const ph=photos[sel],m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.8),new THREE.MeshBasicMaterial({map:T(ph.cv),side:2}));
pose(m,h);m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:0x5ee1ff})));m.userData.ex=ph.ex;m.userData.cv=ph.cv;museum.add(m);portals.push(m);places.push({m,ph});photos.splice(sel,1);sel=-1;tray();toast('Photo projected! Step into it.');armed=true}
function rewind(){$('rw').classList.remove('on');void $('rw').offsetWidth;$('rw').classList.add('on');
if(mode=='x')return leave();const p=places.pop();if(!p)return toast('Nothing to rewind.');museum.remove(p.m);portals.splice(portals.indexOf(p.m),1);photos.push(p.ph);sel=photos.length-1;tray();toast('Placement undone, photo returned.')}
function enter(i,cv){saved={p:P.clone(),yaw,pitch};world=makeWorld(i,cv);scene=world.s;mode='x';P.set(0,1.6,17);yaw=0;pitch=-.02;toast('You stepped through your photo. Read the timeline on the left and the stations on the right. Press O to operate the relic.');hud()}
function leave(){if(world.pan.every(p=>p.read)&&!done[EXH.indexOf(world.E)]){done[EXH.indexOf(world.E)]=1;fmat[EXH.indexOf(world.E)].color.set(0x6dffa8);fmat[EXH.indexOf(world.E)].emissive.set(0x115522)}
scene=museum;mode='m';P.copy(saved.p);yaw=saved.yaw;pitch=saved.pitch;armed=false;$('panel').style.display='none';hud();badges();toast('Back in the museum.');if(done.every(Boolean))$('win').style.display='flex'}
/* ---------- input ---------- */
let drag=null;const cv=$('c');
const ptrs=new Map();let pd0=0;const pdist=()=>{const a=[...ptrs.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};
function zoomBy(dy){if(!started)return;if(mode=='o'){op.wheel&&op.wheel(dy)}else{cam.fov=Math.max(25,Math.min(80,cam.fov*Math.exp(dy*.0012)));cam.updateProjectionMatrix()}}
cv.addEventListener('wheel',e=>{if(!started)return;e.preventDefault();zoomBy(e.deltaY*(e.deltaMode==1?16:1))},{passive:false});
cv.onpointerdown=e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);drag={x:e.clientX,y:e.clientY,m:0};if(ptrs.size==2)pd0=pdist()};
addEventListener('pointermove',e=>{if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(ptrs.size==2){const d=pdist();zoomBy((pd0-d)*2.2);pd0=d;if(drag)drag.m+=99;return}if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.m+=Math.abs(dx)+Math.abs(dy);if(mode=='o'){op.drag&&op.drag(dx,dy)}else{const sn=e.pointerType=='touch'?.0065:.004;yaw-=dx*sn;pitch=Math.max(-1.3,Math.min(1.3,pitch-dy*sn))}drag.x=e.clientX;drag.y=e.clientY});
addEventListener('pointerup',e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(drag&&drag.m<6&&started&&mode!='o')place();drag=null});addEventListener('pointercancel',e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);drag=null});
addEventListener('keydown',e=>{if(!started)return;const k=e.key.toLowerCase();keys[k]=1;if(mode=='o'){if(k==' '||k.startsWith('arrow'))e.preventDefault();if(k=='r'||k=='escape')exitOp();else op.key(k);return}if(k=='o'){$('bOp').click();return}if(k==' '||k=='c'){e.preventDefault();snap()}if(k=='f')place();if(k=='r')rewind();if(k=='q')rot();if(k>='1'&&k<='9'&&photos[k-1]){sel=sel==k-1?-1:k-1;tray()}});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function rot(){roll=(roll+1)%4;toast('Photo rotated')}
$('bSnap').onclick=snap;$('bRot').onclick=rot;$('bRw').onclick=rewind;$('bClose').onclick=()=>closeGame();
/* ---------- loop ---------- */
EXH.forEach((E,i)=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;gap:8px;align-items:center;margin:6px 0;text-align:left';r.innerHTML=`<span style="display:inline-flex;align-items:center;gap:8px">${IC.s(E.e,16)} ${E.n}</span><input type="file" accept="image/*">`;r.querySelector('input').onchange=e=>{const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=768;const x=c.getContext('2d'),s=Math.max(1024/im.width,768/im.height);x.drawImage(im,(1024-im.width*s)/2,(768-im.height*s)/2,im.width*s,im.height*s);real[i]=1;frames[i].material.map=T(c);frames[i].material.needsUpdate=true;toast(E.n+' image loaded')};im.src=URL.createObjectURL(f)};$('rows').appendChild(r)});
$('bImg').onclick=()=>$('imgs').style.display='flex';$('imgOk').onclick=()=>$('imgs').style.display='none';

const TX={};
const loadTX=()=>Promise.all(IMG_KEYS.map(k=>new Promise(ok=>new THREE.TextureLoader().load('assets/images/'+k+'.jpg',t=>{t.encoding=THREE.sRGBEncoding;t.anisotropy=8;TX[k]=t;ok()}))));
