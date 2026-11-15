/* ---------- shared rocky Mars terrain for the Mars rooms ---------- */
function marsTex(seed,kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');let q=seed*7919+13;const rnd=()=>(q=(q*16807)%2147483647)/2147483647;
 x.fillStyle=kind=='rock'?'#7a4a34':'#a8582f';x.fillRect(0,0,512,512);
 for(let n=0;n<2600;n++){const a=rnd(),r=rnd()*7+1,l=kind=='rock'?28+a*30:28+a*34;x.fillStyle=`hsla(${14+rnd()*10},${45+rnd()*20}%,${l}%,${.12+rnd()*.25})`;x.beginPath();x.ellipse(rnd()*512,rnd()*512,r*(1+rnd()),r,rnd()*3,0,7);x.fill()}
 if(kind!='rock'){for(let n=0;n<420;n++){const px=rnd()*512,py=rnd()*512,r=1+rnd()*3.5;x.fillStyle=`hsla(${10+rnd()*14},35%,${22+rnd()*22}%,.85)`;x.beginPath();x.ellipse(px,py,r*1.2,r,rnd()*3,0,7);x.fill();x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px+r*.5,py+r*.5,r,r*.7,0,0,7);x.fill()}
  x.strokeStyle='rgba(255,200,150,.07)';x.lineWidth=2;for(let n=0;n<60;n++){const y0=rnd()*512;x.beginPath();x.moveTo(0,y0);for(let u=0;u<=512;u+=32)x.lineTo(u,y0+Math.sin(u*.03+n)*6);x.stroke()}}
 else{x.strokeStyle='rgba(20,8,4,.35)';x.lineWidth=1.5;for(let n=0;n<40;n++){x.beginPath();let u=rnd()*512,v=rnd()*512;x.moveTo(u,v);for(let k=0;k<5;k++){u+=(rnd()-.5)*70;v+=(rnd()-.5)*70;x.lineTo(u,v)}x.stroke()}
  x.strokeStyle='rgba(255,190,150,.10)';x.lineWidth=3;for(let n=0;n<10;n++){const y0=rnd()*512;x.beginPath();x.moveTo(0,y0);x.lineTo(512,y0+(rnd()-.5)*40);x.stroke()}}
 const t=T(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function marsTerrain(s,seed,o){o=o||{};let q=seed*104729+7;const rnd=()=>(q=(q*16807)%2147483647)/2147483647,clear=o.clear||[],big=[];
 const ok=(x,z,r)=>!clear.some(c=>Math.hypot(x-c[0],z-c[1])<c[2]+r);
 const gt=marsTex(seed,'soil');gt.repeat.set(52,52);const gr=new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshStandardMaterial({map:gt,roughness:1}));gr.rotation.x=-Math.PI/2;gr.position.y=.02;gr.receiveShadow=true;s.add(gr);
 const rt=marsTex(seed+50,'rock'),mats=[0xffffff,0xd9a58a,0x9a7766].map(c=>new THREE.MeshStandardMaterial({map:rt,color:c,roughness:1,flatShading:true}));
 const geos=[];for(let g=0;g<6;g++){const ge=new THREE.IcosahedronGeometry(1,1),pa=ge.attributes.position,a=g*1.7,b=g*2.3,c=g*.9;for(let k=0;k<pa.count;k++){const x=pa.getX(k),y=pa.getY(k),z=pa.getZ(k),f=1+.25*Math.sin(x*5.1+a)*Math.cos(y*4.3+b)+.18*Math.sin(z*6.7+c)+.08*Math.sin((x+y+z)*11+a);pa.setXYZ(k,x*f,y*f,z*f)}ge.computeVertexNormals();geos.push(ge)}
 for(let n=0;n<(o.rocks||230);n++){const rr=8+Math.pow(rnd(),.8)*100,an=rnd()*6.283,x=Math.cos(an)*rr,z=Math.sin(an)*rr,sz=.3+Math.pow(rnd(),3)*2.4;if(!ok(x,z,sz))continue;
  const m=new THREE.Mesh(geos[n%6],mats[n%3]);m.scale.set(sz*(.8+rnd()*.6),sz*(.45+rnd()*.35),sz*(.8+rnd()*.6));m.position.set(x,sz*.28,z);m.rotation.y=rnd()*6.28;m.castShadow=sz>1.2;m.receiveShadow=true;s.add(m);if(sz>1.3)big.push({x,z,r:sz*.95})}
 const N=o.pebbles||700,pg=new THREE.IcosahedronGeometry(1,0),im=new THREE.InstancedMesh(pg,new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,flatShading:true}),N),dm=new THREE.Object3D(),col=new THREE.Color();
 for(let n=0;n<N;n++){let x,z,t=0;do{const rr=3+rnd()*95,an=rnd()*6.283;x=Math.cos(an)*rr;z=Math.sin(an)*rr;t++}while(!ok(x,z,.3)&&t<8);const sz=.08+rnd()*.22;dm.position.set(x,sz*.3,z);dm.scale.set(sz*(1+rnd()*.6),sz*.6,sz*(1+rnd()*.6));dm.rotation.set(rnd()*3,rnd()*3,rnd()*3);dm.updateMatrix();im.setMatrixAt(n,dm.matrix);col.setHSL(.03+rnd()*.05,.35+rnd()*.2,.16+rnd()*.2);im.setColorAt(n,col)}
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;s.add(im);
 const dn=new THREE.MeshStandardMaterial({color:0xc2834f,roughness:1});for(let n=0;n<10;n++){const an=rnd()*6.283,rr=28+rnd()*60,x=Math.cos(an)*rr,z=Math.sin(an)*rr,w=9+rnd()*10;if(!ok(x,z,w*.5))continue;const d=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),dn);d.scale.set(w,.9+rnd()*.8,w*.55);d.position.set(x,0,z);d.rotation.y=rnd()*3;d.receiveShadow=true;s.add(d)}
 for(let n=0;n<4;n++){const an=rnd()*6.283,rr=18+rnd()*45,x=Math.cos(an)*rr,z=Math.sin(an)*rr,r=3+rnd()*3;if(!ok(x,z,r))continue;const cr=new THREE.Mesh(new THREE.TorusGeometry(r,.5,8,32),new THREE.MeshStandardMaterial({color:0x8a4a30,roughness:1}));cr.rotation.x=-Math.PI/2;cr.scale.z=.45;cr.position.set(x,.15,z);s.add(cr)}
 const hm=new THREE.MeshStandardMaterial({map:rt,color:0xb07a60,roughness:1,flatShading:true});for(let n=0;n<14;n++){const an=n/14*6.283+rnd()*.3,rr=104+rnd()*12,h=new THREE.Mesh(new THREE.ConeGeometry(16+rnd()*14,7+rnd()*9,7),hm);h.position.set(Math.cos(an)*rr,2,Math.sin(an)*rr);h.rotation.y=rnd()*3;s.add(h)}
 return{big}}
function opViking(i){const E=EXH[i],s=opScene(i),m=models[i].clone(true);m.scale.setScalar(1.3);s.add(m);
marsTerrain(s,11,{clear:[[0,0,13]]});
const base=V(0,2.6,0),tgt=V(4,0,5),tip=new THREE.Mesh(new THREE.SphereGeometry(.3,12,12),M(0x333333)),arm=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1,8),M(0xcccccc));s.add(tip,arm);
const SITES=[{x:4,z:5,n:'Sandy flat'},{x:-6,z:5,n:'Soil beside a rock'},{x:7,z:-2,n:'Crusty drift'},{x:-3,z:-7,n:'Dark patch'}];
SITES.forEach(S=>{S.ring=new THREE.Mesh(new THREE.TorusGeometry(1.3,.14,8,40),new THREE.MeshBasicMaterial({color:0x5ee1ff}));S.ring.rotation.x=Math.PI/2;S.ring.position.set(S.x,.12,S.z);s.add(S.ring);
 S.pin=new THREE.Mesh(new THREE.ConeGeometry(.45,1,8),new THREE.MeshBasicMaterial({color:0x5ee1ff}));S.pin.rotation.x=Math.PI;S.pin.position.set(S.x,2.6,S.z);s.add(S.pin)});
const lab=new THREE.Mesh(new THREE.SphereGeometry(.55,16,16),new THREE.MeshBasicMaterial({color:0x445566,transparent:true,opacity:.9}));lab.position.set(0,5.4,0);s.add(lab);
const EXP={1:['Gas Exchange','<b>Gas Exchange:</b> oxygen burst when the soil was wetted, then it faded. Consistent with reactive chemicals, not clearly life.'],2:['Labeled Release','<b>Labeled Release:</b> gas appeared at first, which looked promising. Heated soil gave none, but the result was later explained by non-biological chemistry.'],3:['GC-MS (organics)','<b>Gas chromatograph–mass spectrometer:</b> found no organic molecules. Later work suggested perchlorates in the soil can destroy organics when heated.']};
const EC={1:0x6dffa8,2:0xffd27a,3:0xb58cff};
const bm=document.createElement('div');bm.className='g';bm.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);width:min(780px,92vw);box-sizing:border-box;background:#0b0f1af2;border:2px solid var(--cy);border-radius:16px;padding:16px 24px;font-size:clamp(18px,2.6vw,26px);line-height:1.35;text-align:center;z-index:50;pointer-events:none;box-shadow:0 8px 40px #000a';document.body.appendChild(bm);
let ang=.5,sam=0,ph=-1,res={},log=[],run=null,near=null,site=null,warn='',warnT=0,last='',tm=0;
const say=(h,c)=>{bm.innerHTML=h+(last?`<div style="font-size:.66em;margin-top:10px;padding-top:10px;border-top:1px solid #ffffff33;text-align:left;opacity:.95">${last}</div>`:'');bm.style.borderColor=c||'var(--cy)'};
opUI('Viking Lander · Sampling arm','Follow the big message at the bottom of the screen. Arrows: move the scoop · Space: scoop · 1 2 3: experiments · A / D: orbit camera · mouse drag also orbits.');
return{s,drag(dx){ang-=dx*.006},done(){bm.remove()},
key(k){if(k==' '){if(ph>=0||run)return;if(sam>=3){warn='Your sample bin is full. Press <b>1</b>, <b>2</b> or <b>3</b> to test a sample first.';warnT=3;return}if(!near){warn='Move the scoop over a <b>glowing ring</b> first (arrow keys).';warnT=3;return}site=near;ph=0}
 else if(k.length==1&&'123'.includes(k)){if(run||ph>=0)return;if(res[k]){warn='You already ran <b>'+EXP[k][0]+'</b>. Try another experiment.';warnT=3}else if(!sam){warn='No soil sample yet. Scoop some from a glowing ring first.';warnT=3}else{sam--;run={k,t:0};tip.material.color.set(sam?0x7a4a30:0x333333)}}},
upd(dt){tm+=dt;tgt.x=Math.max(-9,Math.min(9,tgt.x+(K('arrowright')-K('arrowleft'))*5*dt));tgt.z=Math.max(-9,Math.min(9,tgt.z+(K('arrowdown')-K('arrowup'))*5*dt));if(Math.hypot(tgt.x,tgt.z)<3){const q=Math.hypot(tgt.x,tgt.z)||1;tgt.x*=3/q;tgt.z*=3/q}
ang+=(K('d')-K('a'))*dt;near=SITES.find(S=>!S.done&&Math.hypot(S.x-tgt.x,S.z-tgt.z)<1.7)||null;
let y=1.2;if(ph>=0){ph+=dt;y=ph<.6?1.2-ph/.6*1.1:.1+(ph-.6)/.6*1.1;if(ph>=1.2){ph=-1;sam++;site.done=1;site.ring.material.color.set(0x6dffa8);site.pin.visible=false;const d=new THREE.Mesh(new THREE.CircleGeometry(.6,16),new THREE.MeshBasicMaterial({color:0x3a1c10}));d.rotation.x=-Math.PI/2;d.position.set(site.x,.14,site.z);s.add(d);tip.material.color.set(0x7a4a30);log.push('Sample collected: '+site.n+' ('+sam+' held).')}}
if(run){run.t+=dt;lab.material.color.set(EC[run.k]);lab.scale.setScalar(1+.25*Math.sin(tm*10));if(run.t>=3.5){res[run.k]=1;last=EXP[run.k][1];log.push('Experiment done: '+EXP[run.k][0]);run=null;lab.scale.setScalar(1);lab.material.color.set(0x445566)}}
SITES.forEach(S=>{if(S.done)return;const hot=S===near;S.ring.material.color.set(hot?0xffd27a:0x5ee1ff);S.ring.scale.setScalar(hot?1.15+.1*Math.sin(tm*8):1);S.pin.material.color.set(hot?0xffd27a:0x5ee1ff);S.pin.position.y=2.3+Math.sin(tm*3+S.x)*.3});
tip.position.set(tgt.x,y,tgt.z);arm.position.copy(base).add(tip.position).multiplyScalar(.5);arm.scale.y=base.distanceTo(tip.position);arm.lookAt(tip.position);arm.rotateX(Math.PI/2);
cam.position.set(Math.sin(ang)*16,7,Math.cos(ang)*16);cam.lookAt(0,2,1);
const nres=Object.keys(res).length,left=['1','2','3'].filter(k=>!res[k]);
if(warnT>0){warnT-=dt;say(warn,'#ff7a7a')}
else if(nres==3&&!run)say('<b style="color:#6dffa8">Mission complete.</b> Viking’s verdict: no clear evidence of life, but the question stayed open.<br><span style="font-size:.7em;opacity:.85">Press R to leave.</span>','#6dffa8');
else if(run)say(`Running <b>${EXP[run.k][0]}</b>… ${Math.round(Math.min(1,run.t/3.5)*100)}%`,'#ffd27a');
else if(ph>=0)say('Scooping…','#ffd27a');
else if(near&&sam<3)say('▶ Press <b>SPACE</b> to scoop soil here: <b>'+near.n+'</b>','#ffd27a');
else if(sam>0)say(`You hold <b>${sam}</b> sample${sam>1?'s':''}. Press ${left.map(k=>'<b>'+k+'</b> ('+EXP[k][0]+')').join(', ')} to test ${sam>1?'one':'it'}${sam<3?', or move to another glowing ring':''}.`);
else say(`Step ${SITES.some(S=>S.done)?'1 again':'1'}: use the <b>ARROW KEYS</b> to move the scoop over a <b>glowing ring</b>, then press <b>SPACE</b>.`);
L(`<div style="font-size:15px;line-height:1.5">Samples held <b>${sam}</b> · Dig sites <b>${SITES.filter(S=>S.done).length}/${SITES.length}</b> · Experiments <b>${nres}/3</b></div><hr>${log.slice(-3).join('<br>')||'Nothing collected yet.'}`)}}}
function opRover(i){const E=EXH[i],s=opScene(i),m=models[i].clone(true);m.scale.setScalar(.9);s.add(m);
const D=[['Hematite “blueberries”','Iron-rich spherules that formed in water.'],['Layered sandstone','Sediments laid down by flowing water.'],['Jarosite-rich outcrop','A mineral that forms in acidic water.'],['“Heat Shield Rock”','The first meteorite identified on another planet.'],['Crater-rim bedrock','Clay minerals hinting at gentler ancient water.']];
const R=D.map((d,k)=>{const a=k*1.3+.3,r=20+k*10,o=new THREE.Mesh(new THREE.IcosahedronGeometry(1.1,0),M(0x6d3a28,{flatShading:true}));o.position.set(Math.cos(a)*r,.6,Math.sin(a)*r);const mk=new THREE.Mesh(new THREE.ConeGeometry(.5,1.2,8),new THREE.MeshBasicMaterial({color:0x5ee1ff}));mk.rotation.x=Math.PI;mk.position.set(0,2.4,0);o.add(mk);s.add(o);return{o,mk,d,done:0}});
const TER=marsTerrain(s,3,{clear:[[0,0,6],...R.map(r=>[r.o.position.x,r.o.position.z,3.5])]});
const p=V(0,0,0);let yaw=0,bat=80,dust=0,tm=0,storm=0,cd=0,dead=0,log=['Drive to a marker and press E to use the arm.'];
opUI('Opportunity · Mars rover','W / S drive, A / D steer. E: analyse a glowing-marker rock when close. X: ask the wind to clear dust (every 15 s). Boulders block your path, so steer around them.');
return{s,key(k){if(k=='e'&&!dead){const r=R.filter(r=>!r.done).sort((a,b)=>a.o.position.distanceTo(p)-b.o.position.distanceTo(p))[0];if(r&&r.o.position.distanceTo(p)<7){r.done=1;bat-=4;r.mk.material.color.set(0x6dffa8);log.push('<b>'+r.d[0]+':</b> '+r.d[1])}else log.push('No unanalysed rock in reach.')}
if(k=='x'&&cd<=0){dust*=.3;cd=15;log.push('A gust cleared some dust from the panels.')}},
upd(dt){tm+=dt;cd-=dt;const f=K('w')-K('s');if(!dead){yaw+=(K('a')-K('d'))*1.6*dt*(f?Math.sign(f):1);const sp=bat>0?f*5:0;p.x+=Math.sin(yaw)*sp*dt;p.z+=Math.cos(yaw)*sp*dt;bat-=Math.abs(sp)*.06*dt+.15*dt;dust=Math.min(1,dust+Math.abs(sp)*.002*dt)
const sun=storm?Math.max(0,1-storm):1;bat=Math.min(100,bat+2.4*sun*(1-dust*.8)*dt);
if(!storm&&(tm>240||R.every(r=>r.done))){storm=.001;log.push('<b>A global dust storm is blotting out the Sun.</b>')}if(storm)storm=Math.min(1,storm+dt/35);
if(bat<=0&&storm>.9){dead=1;log.push('<b>Power lost.</b> Opportunity’s last signal came on 10 June 2018, after about 14 years.')}
const q=Math.hypot(p.x,p.z);if(q>100){p.x*=100/q;p.z*=100/q}}
for(const b of TER.big){const dx=p.x-b.x,dz=p.z-b.z,d=Math.hypot(dx,dz),mr=b.r+1.7;if(d<mr&&d>1e-3){p.x=b.x+dx/d*mr;p.z=b.z+dz/d*mr}}
const dk=1-storm*.75;s.background.set(E.bg).multiplyScalar(dk);if(s.fog)s.fog.color.copy(s.background);
m.position.set(p.x,0,p.z);m.rotation.y=yaw;R.forEach(r=>r.mk.position.y=2.4+Math.sin(tm*3)*.2);
cam.position.set(p.x-Math.sin(yaw)*11,5.5,p.z-Math.cos(yaw)*11);cam.lookAt(p.x,1.2,p.z);
L(`Battery <b>${fx(Math.max(0,bat))}%</b> · Dust on panels <b>${fx(dust*100)}%</b><br>Rocks analysed <b>${R.filter(r=>r.done).length}/5</b>${storm?'<br><span style="color:#ff9d6c">Dust storm: '+fx(storm*100)+'% opacity</span>':''}<hr>${log.slice(-3).join('<br>')}${R.every(r=>r.done)?'<hr><b style="color:#6dffa8">Water evidence confirmed, as Opportunity found in 2004.</b>':''}`)}}}
function opHeli(i){const E=EXH[i],s=opScene(i),m=models[i].clone(true);s.add(m);
const top=new THREE.Box3().setFromObject(m).max.y,bl=[];for(const y of[top+.05,top+.35]){const b=new THREE.Mesh(new THREE.BoxGeometry(5,.04,.25),M(0x222222));b.position.y=y;m.add(b);bl.push(b)}
const pad=new THREE.Mesh(new THREE.RingGeometry(4.6,5.4,40),new THREE.MeshBasicMaterial({color:0x6dffa8,side:2}));pad.rotation.x=-Math.PI/2;pad.position.y=.05;s.add(pad);
marsTerrain(s,7,{clear:[[0,0,8]],rocks:160});
const WP=[[0,5,-26],[24,8,-48],[40,4,-78],[14,9.5,-104],[-18,6,-90],[-36,3,-62],[-16,8,-32]];
const W=WP.map((w,k)=>{const r=ring(s,w[0],w[1],w[2],4.2,0x666666),q=WP[k-1]||[0,0,0];r.rotation.y=Math.atan2(w[0]-q[0],w[2]-q[2]);return{p:V(...w),r,done:0}});
const bm=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,30,8,1,true),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.35,side:2}));s.add(bm);
const p=V(0,0,0),v=V(0,0,0);let yaw=0,bat=100,rpm=0,a=0,dist=0,end=0,msg='Hold Space (▲) to spin up and lift off.';const nxt=()=>W.find(w=>!w.done);
opUI('Ingenuity · Mars helicopter','Fly through all 7 rings (follow the gold beam) at different heights, then land on the green pad. Space/▲ climb, Shift/▼ descend, joystick or W A S D move, drag the screen or Q / E to turn. Over the pad it lowers itself gently.');
return{s,key(k){if(k=='enter'&&end){p.set(0,0,0);v.set(0,0,0);end=0;bat=100;W.forEach(w=>{w.done=0});msg='Hold Space to lift off.'}},drag(dx){yaw-=dx*.006},upd(dt){const up=K(' ')-K('shift'),air=p.y>.05;if(air)yaw+=(K('q')+K('arrowleft')-K('e')-K('arrowright'))*2.4*dt;
if(bat>0&&!end){v.y+=(up*3.5-v.y)*Math.min(1,3*dt);const mv=p.y>.6?10:0,fi=K('w')-K('s'),ri=K('d')-K('a'),tx=(-Math.sin(yaw)*fi+Math.cos(yaw)*ri)*mv,tz=(-Math.cos(yaw)*fi-Math.sin(yaw)*ri)*mv;v.x+=(tx-v.x)*Math.min(1,2*dt);v.z+=(tz-v.z)*Math.min(1,2*dt)}else{v.y=air?-3:0;v.x*=.9;v.z*=.9}
if(!nxt()&&!end&&bat>0&&Math.hypot(p.x,p.z)<6&&p.y<4&&up<=0){v.y=-1.6;v.x*=.9;v.z*=.9}
const o=p.clone();p.addScaledVector(v,dt);if(p.y>10){p.y=10;v.y=Math.min(0,v.y);msg='Thin air: Ingenuity cannot climb above about 10 m.'}if(p.y<0){p.y=0;v.y=0}dist+=p.distanceTo(o);
rpm+=((up>0||air)&&bat>0?2400-rpm:-rpm)*Math.min(1,2*dt);bat=air?bat-.45*dt:Math.min(100,bat+4*dt);if(bat<=0&&air)msg='Battery empty: forced descent.';
a+=rpm/2400*35*dt;bl[0].rotation.y=a;bl[1].rotation.y=-a;m.position.copy(p);m.rotation.order='YXZ';m.rotation.set(-(v.x*-Math.sin(yaw)+v.z*-Math.cos(yaw))*.04,yaw,-(v.x*Math.cos(yaw)-v.z*Math.sin(yaw))*.04);
const nx=W.find(w=>!w.done);if(nx&&p.distanceTo(nx.p)<4.8){nx.done=1;nx.r.material.color.set(0x6dffa8);msg='Ring '+W.filter(w=>w.done).length+' of '+W.length+' cleared!'}bm.visible=!!nxt();if(nxt())bm.position.set(nxt().p.x,15,nxt().p.z);
W.forEach(w=>{if(!w.done)w.r.material.color.set(w===nx?0xffd27a:0x666666)});
if(!nx&&!end&&!air&&Math.hypot(p.x,p.z)<5.6){end=1;msg='Flight complete! (Enter / Retry flies again.) In 2021 Ingenuity made the first powered, controlled flight on another planet.'}
cam.position.set(p.x+Math.sin(yaw)*11,p.y+3.5,p.z+Math.cos(yaw)*11);cam.lookAt(p.x-Math.sin(yaw)*8,p.y+1,p.z-Math.cos(yaw)*8);
let gd='';if(nx){const dx=nx.p.x-p.x,dz=nx.p.z-p.z,fw=dx*-Math.sin(yaw)+dz*-Math.cos(yaw),rt=dx*Math.cos(yaw)-dz*Math.sin(yaw),an=Math.atan2(rt,fw);gd='<br>Next ring: <b>'+fx(Math.hypot(dx,dz))+' m</b> '+(Math.abs(an)<.35?'straight ahead ⬆':Math.abs(an)>2.6?'behind you, turn around ⬇':an>0?'to your right ➡ (drag right / E)':'to your left ⬅ (drag left / Q)')+' · height '+fx(nx.p.y)+' m'}
L(`Altitude <b>${fx(p.y,1)}</b> m · Rotors <b>${Math.round(rpm)}</b> rpm<br>Battery <b>${fx(Math.max(0,bat))}%</b> · Distance flown <b>${fx(dist)}</b> m<br>Rings <b>${W.filter(w=>w.done).length}/${W.length}</b>${gd}${!nx&&!end?' · Land on the pad':''}<hr>${msg}`)}}}
const OPS=[i=>opLander(i,{title:'Descent stage',ctl:'Hold Space (or THRUST) to slow the fall. W A S D / joystick: sideways, drift fades by itself. Land inside the green ring at under 4.5 m/s. Drift limit 3 m/s.',g:1.62,alt:90,T:4.6,burn:3,rcs:3,vmax:4.5,latmax:3,damp:.6,padR:8,pad:[16,0],x0:-24,vy0:-2,win:'“The Eagle has landed.” After the crew left, this descent stage stayed behind as their launch pad.'}),
i=>opLander(i,{title:'Touch down on Eros',ctl:'Hold Space (or THRUST) to thrust up. W A S D / joystick: sideways. Gravity is tiny, but drift now fades when you let go. Touch down under 3 m/s.',g:.12,alt:60,T:1.1,burn:1.4,rcs:1,vmax:3,latmax:3,damp:.35,x0:0,vx:2,vy0:-.5,win:'NEAR Shoemaker was never designed to land. It touched down in 2001 and kept sending data for about two weeks.'}),
opKepler,opViking,opRover,opHeli,opHubble,opVoyager,opCassini,opPioneer];
function startOp(i,site){opPrev={mode,scene,site};op=OPS[i](i);op.i=i;op.init&&op.init();mode='o';scene=op.s;$('panel').style.display='none';$('opui').style.display='block';hud()}
function exitOp(nc){if(op&&op.done)op.done();cam.up.set(0,1,0);cam.fov=70;cam.updateProjectionMatrix();$('opui').style.display=$('opx').style.display='none';mode=opPrev.mode;scene=opPrev.scene;const st=opPrev.site;op=null;if(st&&!nc)closeGame();hud()}
$('bOp').onclick=()=>mode=='o'?exitOp():mode=='x'?startOp(EXH.indexOf(world.E)):toast('Step into a relic photo to enter its room, then press O. Or use the Operate button on the website.');
let last=performance.now();
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;if(!started)return;if(mode=='o'){op.upd(dt,t);R.render(op.s,cam);return}
if(started){const sp=(mode=='m'?3.6:4.4)*dt,f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),r=(keys.d?1:0)-(keys.a?1:0);
if(keys.arrowleft)yaw+=1.8*dt;if(keys.arrowright)yaw-=1.8*dt;
const mx=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*sp,mz=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*sp;
if(mode=='m'){if(walkable(P.x+mx,P.z+mz)){P.x+=mx;P.z+=mz}else if(walkable(P.x+mx,P.z))P.x+=mx;else if(walkable(P.x,P.z+mz))P.z+=mz;
pedModels.forEach(m=>m.rotation.y+=dt);spinners.forEach(f=>f(dt));
ghost.visible=false;if(sel>=0){const h=aim(solids.filter(s=>s.visible))[0];if(h&&h.distance<12){const ph=photos[sel],tx=ph.tx||(ph.tx=T(ph.cv));if(ghost.material.map!==tx){ghost.material.map=tx;ghost.material.needsUpdate=true}pose(ghost,h);ghost.visible=true}}
let near=false;for(const p of portals){const d=Math.min(P.distanceTo(p.position),V(P.x,0,P.z).distanceTo(p.position));if(d<1.2)near=true;if(armed&&d<1){enter(p.userData.ex,p.userData.cv);break}}if(!near)armed=true;
if(t%30<17)hud()}
else{const w=world;P.x+=mx;P.z+=mz;w.spin.forEach(f=>f(dt));P.x=Math.max(-7,Math.min(7,P.x));P.z=Math.max(-18.6,Math.min(18.6,P.z));
const dx=P.x,dz=P.z-2,dd=Math.hypot(dx,dz);if(dd<2.8){P.x=dx/dd*2.8;P.z=2+dz/dd*2.8}
w.m.rotation.y+=dt*.25;$('panel').style.display='none';
w.pan.forEach(p=>{if(!p.read&&Math.abs(P.z-p.z)<2.3&&Math.abs(P.x-p.x)<6.2){p.read=1;p.lamp.material.color.set(0x6dffa8)}});
if(!w.door.open&&w.pan.every(p=>p.read)){w.door.open=1;w.door.gl.material.color.set(0x6dffa8);toast('Every station read. The exit at the far end is open.')}
if(P.z<-17.8&&Math.abs(P.x)<2){if(w.door.open)leave();else if(t-(loop.w||0)>2500){loop.w=t;toast('The exit is locked. Read every timeline panel and station first. (R rewinds anytime)')}}
if(t%30<17)hud()}}
cam.position.copy(P);cam.rotation.set(pitch,yaw,0);R.render(scene,cam)}
requestAnimationFrame(loop);hud();
(()=>{const TCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;if(!TCH)return;document.body.classList.add('touch');
const tc=document.createElement('div');tc.id='tc';tc.className='g';tc.innerHTML='<div id="joy"><i></i></div><div id="abt"></div>';document.body.appendChild(tc);
const joy=$('joy'),knob=joy.firstChild,abt=$('abt');
const vk=(k,d)=>dispatchEvent(new KeyboardEvent(d?'keydown':'keyup',{key:k,cancelable:true}));
const A='arrowup,arrowleft,arrowdown,arrowright'.split(',');
const MAP={w:{u:['w'],l:['a'],d:['s'],r:['d']},a:{u:[A[0]],l:[A[1]],d:[A[2]],r:[A[3]]},ad:{u:[A[0]],l:[A[1],'a'],d:[A[2]],r:[A[3],'d']}};
const TH=['THRUST',' ',1],RT=['Retry','enter'],AC=['Action',' '],CFG={o0:{j:'w',b:[TH,RT]},o1:{j:'w',b:[TH,RT]},o2:{j:'a',b:[['Hold',' ']]},o3:{j:'ad',b:[AC]},o4:{j:'w',b:[['Analyse','e',1],['Dust','x']]},
o5:{j:'w',b:[['▲ Up',' ',1],['▼ Down','shift'],['⟲','q'],['⟳','e'],RT]},o6:{j:'a',b:[['Hold',' ']]},o7:{j:'a',b:[['Record','g'],RT]},o8:{j:'ad',b:[AC]},o9:{j:'ad',b:[['Fire',' ',1],RT]},
m:{j:'w',b:[['Snap','c',1],['Place','f']]},x:{j:'w',b:[['Operate','o',1]]}};
let held=new Set(),jp=null,cur=null,mapk='w',bp=new Map();
const setHeld=n=>{for(const k of held)if(!n.has(k))vk(k,0);for(const k of n)if(!held.has(k))vk(k,1);held=n};
const jmove=e=>{const r=joy.getBoundingClientRect();let dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
knob.style.transform=`translate(${dx*36}px,${dy*36}px)`;const n=new Set(),q=MAP[mapk],T=.35;if(dy<-T)q.u.forEach(k=>n.add(k));if(dy>T)q.d.forEach(k=>n.add(k));if(dx<-T)q.l.forEach(k=>n.add(k));if(dx>T)q.r.forEach(k=>n.add(k));setHeld(n)};
joy.addEventListener('pointerdown',e=>{e.preventDefault();jp=e.pointerId;joy.setPointerCapture(e.pointerId);jmove(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===jp)jmove(e)});
const jend=e=>{if(e.pointerId!==jp)return;jp=null;knob.style.transform='';setHeld(new Set())};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
abt.addEventListener('pointerdown',e=>{const b=e.target.closest('.tb');if(!b)return;e.preventDefault();abt.setPointerCapture&&0;bp.set(e.pointerId,b);b.classList.add('on');vk(b.dataset.k,1)});
const bend=e=>{const b=bp.get(e.pointerId);if(!b)return;bp.delete(e.pointerId);b.classList.remove('on');vk(b.dataset.k,0)};addEventListener('pointerup',bend);addEventListener('pointercancel',bend);
function build(k){const c=CFG[k];setHeld(new Set());for(const b of bp.values())vk(b.dataset.k,0);bp.clear();joy.style.display=c&&c.j?'block':'none';mapk=c&&c.j||'w';
abt.innerHTML=c?c.b.map(b=>`<button class="tb${b[2]?' big':''}" data-k="${b[1]}">${b[0]}</button>`).join(''):''}
setInterval(()=>{const k=!started?'':mode=='o'&&op?'o'+op.i:mode=='m'?'m':mode=='x'?'x':'';if(k!==cur){cur=k;build(k)}},150);
$('help').innerHTML='Drag: look · joystick: walk · tap a wall: place photo';
document.querySelectorAll('.btns button').forEach(b=>b.childNodes.forEach(n=>{if(n.nodeType==3)n.textContent=n.textContent.replace(/\s*\([A-Z]\)/,'')}));
$('opui').addEventListener('click',()=>$('opui').classList.toggle('min'));
document.addEventListener('contextmenu',e=>{if(document.body.classList.contains('play'))e.preventDefault()});
})();
