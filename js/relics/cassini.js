/* ================= CASSINI ================= */
function opCassini(i){const s=new THREE.Scene();s.add(starSphere());s.add(new THREE.HemisphereLight(0xffffff,0x332a1a,.8));const dl=new THREE.DirectionalLight(0xfff2d8,1.5);dl.position.set(-20,30,20);s.add(dl);
 const sat=new THREE.Group(),b=planet('saturn',60);sat.add(b);sat.add(ringMesh(68.5,136));sat.position.set(64.5,0,-30);s.add(sat);const atm=new THREE.Mesh(new THREE.SphereGeometry(61.5,48,24),new THREE.MeshBasicMaterial({color:0xffcf8a,transparent:true,opacity:.14,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));sat.add(atm);
 const g=ctr(models[i].clone(true));g.scale.setScalar(.55);s.add(g);const hga=V(-1,0,0),qA=new THREE.Quaternion().setFromUnitVectors(hga,V(0,.35,1).normalize()),qB=new THREE.Quaternion().setFromUnitVectors(hga,V(0,0,-1)),qc=new THREE.Quaternion();
 const NP=420,pp=new Float32Array(NP*3);for(let k=0;k<NP;k++)pp.set([-3.5-Math.random()*40,(Math.random()-.5)*1.2,-80+Math.random()*90],k*3);const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xd8c8a8,size:.35,transparent:true,opacity:.8}));s.add(dust);
 const cor=new THREE.Mesh(new THREE.BoxGeometry(4,.05,90),new THREE.MeshBasicMaterial({color:0x5ee1ff,transparent:true,opacity:.16}));cor.position.set(0,0,-35);s.add(cor);
 const st={x:0,vx:0,t:0,hp:100,cross:0,sh:0,mode:'dive',pl:0,data:0,end:0,why:''};
 opUI('Cassini · Grand Finale','A / D (or arrow keys) steer into the middle of the gap between Saturn and its rings. Press H as the ring plane crosses to turn the dish into a shield. Enter restarts.');
 const gp=t=>.8*Math.sin(t*.5)+.5*Math.sin(t*1.3+1);
 const GG={s,drag(){},wheel(){},click(){},key(k){if(k=='h'&&st.mode=='dive')st.sh=3;else if(k=='enter'){Object.assign(st,{x:0,vx:0,t:0,hp:100,cross:0,sh:0,mode:'dive',pl:0,data:0,end:0})}},done(){},
 upd(dt){if(st.mode!='over'&&st.mode!='lost'){st.t+=dt;st.sh=Math.max(0,st.sh-dt)}const gC=gp(st.t);
  if(st.mode=='dive'||st.mode=='plunge'){st.vx+=(K('arrowright')+K('d')-K('arrowleft')-K('a'))*7*dt;st.vx*=Math.pow(.35,dt);st.x=cl(st.x+st.vx*dt,-9,9);st.vx+=(Math.random()-.5)*3*dt}
  const per=10,y=4*Math.sin(st.t*2*Math.PI/per),prev=4*Math.sin((st.t-dt)*2*Math.PI/per);let warn='';
  if(st.mode=='dive'){const off=st.x-gC,inGap=Math.abs(off)<2;if(!inGap){const r=off<0?12:8;st.hp-=r*dt;st.why=off<0?'Ring dust is hitting the spacecraft.':'Saturn’s upper atmosphere is dragging and heating Cassini.'}else st.why='';
   if(Math.sign(y)!=Math.sign(prev)&&st.t>1){st.cross++;if(st.sh<=0){st.hp-=20;toast('Ring particles hit the unprotected instruments!')}else toast('The dish shielded Cassini.');if(st.cross>=6){st.mode='plunge';st.t=0;toast('Final plunge: keep transmitting!')}}
   const nx=(per/2)-((st.t%(per/2)));warn=`Next ring-plane crossing in <b>${nx.toFixed(1)} s</b>${nx<2.6&&st.sh<=0?' <b style="color:#ffb347">– press H now</b>':''}`;
   if(st.hp<=0){st.mode='over'}}
  if(st.mode=='plunge'){const q=st.t/14;if(K(' '))st.data=Math.min(100,st.data+dt*9);sat.position.x=64.5-q*22;atm.material.opacity=.14+q*.5;cam.position.x+=(Math.random()-.5)*.1*q;if(st.t>14){st.mode='lost'}}
  const qq=st.sh>0?1:0;qc.copy(g.quaternion);g.quaternion.slerp(qq?qB:qA,Math.min(1,dt*4));
  g.position.set(st.x,st.mode=='dive'?y:0,0);g.rotation.z+=0;
  const pa=pg.attributes.position;for(let k=0;k<NP;k++){let z=pa.getZ(k)+dt*14;if(z>10)z=-80;pa.setZ(k,z)}pa.needsUpdate=true;
  cor.position.x=gC;cor.visible=st.mode=='dive';
  cam.position.set(st.x*.6,st.mode=='dive'?y*.4+2.2:2.2,9);cam.lookAt(st.x*.4+8,0,-20);if(cam.fov!=60){cam.fov=60;cam.updateProjectionMatrix()}
  let h=`Instrument health: <b style="color:${st.hp>50?'#6dffa8':'#ffb347'}">${Math.max(0,st.hp).toFixed(0)}%</b> · Crossings: <b>${st.cross}/6</b><br>`;
  if(st.mode=='dive')h+=warn+(st.why?'<br><b style="color:#ffb347">'+st.why+'</b>':'<br>Stay inside the cyan corridor.');
  else if(st.mode=='plunge')h+=`<b>Final plunge.</b> Hold Space to keep the dish pointed home. Data sent: <b>${st.data.toFixed(0)}%</b>`;
  else if(st.mode=='lost')h+=`<b style="color:#6dffa8">Signal lost.</b> Data sent before the end: ${st.data.toFixed(0)}%. On 15 Sep 2017 Cassini burned up in Saturn, so Earth microbes could never reach Enceladus or Titan. Press Enter to fly again.`;
  else h+='<b style="color:#ffb347">Instruments failed.</b> Press Enter to try again.';L(h)}};
 const A=[{n:'High-gain antenna, 4 m',p:[0,1.7,.35],t:'The 4 m dish was Cassini’s main link to Earth. It also worked as a radar antenna, a radio-science instrument and, in the Grand Finale, a shield against ring particles.'},
 {n:'Huygens probe',p:[.9,2.4,-.6],t:'A 320 kg probe with its own heat shield rode on the side of Cassini for seven years. It separated on 25 December 2004 and landed on Titan on 14 January 2005, the farthest landing ever made.'},
 {n:'Radioisotope generators (RTGs)',p:[-.6,.4,-.8],t:'Three generators turned the heat of decaying plutonium into about 700 watts at launch. At Saturn the Sun is 100 times fainter than at Earth, so solar panels would not have worked.'},
 {n:'Main engine',p:[0,.3,0],t:'A rocket engine fired to put Cassini into orbit around Saturn on 1 July 2004. It burned for about 96 minutes. Its nozzle was protected by a cover until it was needed.'},
 {n:'Magnetometer boom',p:[1.95,1.68,0],t:'An 11 m boom held the magnetometers away from the spacecraft’s own magnetic field. They mapped Saturn’s magnetic field, which turned out to be almost perfectly aligned with its spin.'},
 {n:'Remote-sensing pallet',p:[-.9,1.0,-.7],t:'Cameras, infrared and ultraviolet spectrometers and a spectrograph were bolted together on one pallet and pointed as a group. This is how Cassini photographed the rings, Titan’s haze and Enceladus’s plumes.'},
 {n:'Radar',p:[0,1.7,.1],hid:1,t:'The radar shared the high-gain dish. It saw through Titan’s orange haze and mapped hundreds of methane lakes and seas near the poles.'},
 {n:'Fields and particles instruments',p:[.5,1.0,.7],hid:1,t:'Instruments that measure dust, plasma, ions and radio waves sample the space around Saturn. They tasted the icy plume of Enceladus and found salt, water and organic molecules.'},
 {n:'Thrusters and reaction wheels',p:[-.3,.9,.4],hid:1,t:'Small thrusters and three spinning reaction wheels pointed the spacecraft. Pointing it is a constant trade-off: the cameras, the antenna and the radar can never all face the right way at once.'}];
 const SP=[['Launched','15 Oct 1997, Titan IVB–Centaur rocket'],['Mass at launch','About 5,700 kg, including Huygens and fuel'],['Size','About 6.7 m tall, with a 4 m dish and an 11 m boom'],['Science','12 instruments on the orbiter, 6 on Huygens'],['At Saturn','1 July 2004 to 15 September 2017'],['Ended','Planned dive into Saturn’s atmosphere']];
 const insp=mkInsp(i,A,{title:'Cassini–Huygens · Inspect',dist:11,near:5.5,min:3,max:26,ty:1.7,real:.9,smooth:1,auto:.1,specs:SP});
 const HZ=(()=>{const EV=[{t:0,n:'Entry',d:'Huygens meets the top of Titan’s atmosphere at about 1,270 km, travelling about 6 km/s. The heat shield takes the heat.'},{t:2.5,n:'Parachute opens',d:'A pilot parachute pulls out the main one at about 160 km. The heat shield is dropped soon after.'},{t:15,n:'Smaller parachute',d:'A smaller parachute takes over so the probe falls faster and finishes its descent while Cassini is still listening.'},{a:50,n:'Surface in view',d:'From about 50 km the camera sees ridges, channels and a dry shoreline-like boundary.'},{a:.7,n:'Lamp on',d:'A lamp lights the ground so the spectrometer can read its colours.'},{t:147,n:'Touchdown',d:'Huygens lands at walking pace. The ground is damp, like clay with a thin crust. This is the first landing in the outer solar system.'},{t:219,n:'Signal ends',d:'After about 72 minutes of data from the surface, Cassini drops below Titan’s horizon.'}];
  const altAt=t=>t<=0?1270:t<2.5?160+1110*Math.pow(1-t/2.5,2):t<147?160*Math.pow((147-t)/144.5,1.35):0;
  EV.forEach(e=>{if(e.a!==undefined){let lo=2.5,hi=147;for(let k=0;k<40;k++){const mid=(lo+hi)/2;altAt(mid)>e.a?lo=mid:hi=mid}e.t=(lo+hi)/2}});EV.sort((a,b)=>a.t-b.t);
  const TA=[[0,94],[40,71],[100,110],[160,150],[400,175],[1270,170]],tmp=a=>{for(let k=1;k<TA.length;k++)if(a<=TA[k][0]){const f=(a-TA[k-1][0])/(TA[k][0]-TA[k-1][0]);return TA[k-1][1]+(TA[k][1]-TA[k-1][1])*f}return 170};
  const prs=a=>1.47*Math.pow(22/(22+.045*a),1/.045),fmtP=p=>p<.01?p.toExponential(1)+' bar':p.toFixed(2)+' bar';
  const IN=[['HASI','Atmosphere structure','Measured temperature, pressure and electrical properties all the way down.'],['DISR','Camera and spectrometer','Returned about 350 pictures. Half were lost because one of the two radio channels to Cassini was never switched on.'],['GCMS','Gas analyser','Sniffed the air and the ground. Methane rose from the soil as the warm probe heated it.'],['ACP','Haze sampler','Collected haze particles and heated them, finding organic compounds containing carbon and nitrogen.'],['DWE','Wind experiment','Tracked winds by the Doppler shift of the probe’s radio signal. Radio telescopes on Earth rescued the data after the lost channel.'],['SSP','Surface package','Measured how hard the ground was and what it was made of as the probe touched down.']];
  let t=0,play=0,ins=-1,built=0,cv,cx;
  const html=()=>`<b style="color:var(--cy);font-size:15px">Huygens · Descent to Titan</b><div style="${LABCSS};opacity:.75;margin:4px 0 8px">Press play or drag the slider through the 2 hours 27 minute fall. Click an event to jump to it, or an instrument to see what it measured. Values are simplified.</div>
   <canvas id="hzc" width="520" height="300" style="width:100%;border-radius:8px;background:#0a0603"></canvas>
   <div style="display:flex;gap:8px;align-items:center;margin:8px 0"><button class="chip" id="hzp">Play</button><input id="hzs" type="range" min="0" max="219" step=".1" value="0" style="flex:1;accent-color:#5ee1ff" aria-label="Time since entry"><span id="hzt" style="min-width:74px;text-align:right"></span></div>
   <div id="hzr" style="${LABCSS}"></div><div id="hzd" style="${LABCSS};margin:6px 0"></div>
   <div>${EV.map((e,k)=>`<button class="chip" data-ev="${k}">${e.n}</button>`).join('')}</div>
   <div style="margin-top:6px">${IN.map((q,k)=>`<button class="chip" data-in="${k}">${q[0]}</button>`).join('')}</div><div id="hzi" style="${LABCSS};margin-top:6px"></div>`;
  function draw(){const W=520,H=300,g=cx,al=altAt(t),gy=H-26,yy=a=>gy-Math.sqrt(a/1270)*(H-60),py=yy(al),pxx=170;
   const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#120a05');gr.addColorStop(.45,'#5a3414');gr.addColorStop(1,'#c98a45');g.fillStyle=gr;g.fillRect(0,0,W,H);
   g.fillStyle='#3a2410';g.fillRect(0,gy,W,H-gy);g.strokeStyle='#ffffff22';g.fillStyle='#d9c7a8';g.font='11px sans-serif';[0,10,50,160,500,1270].forEach(a=>{const y=yy(a);g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();g.fillText(a+' km',6,y-3)});
   const tx=360;g.strokeStyle='#ffffff55';g.strokeRect(tx,16,140,gy-16);g.fillStyle='#d9c7a8';g.fillText('Temperature (K)',tx+6,12);g.strokeStyle='#5ee1ff';g.beginPath();for(let a=0;a<=1270;a+=10){const x=tx+(tmp(a)-60)/130*140,y=yy(a);a?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(tx+(tmp(al)-60)/130*140,py,4,0,7);g.fill();
   if(t<2.5&&t>=0){g.fillStyle='#ffb347';g.beginPath();g.moveTo(pxx-8,py-4);g.lineTo(pxx+8,py-4);g.lineTo(pxx,py-44);g.fill()}
   if(t>=2.5&&t<147){const r=t<15?26:12;g.strokeStyle='#e8e0d0';g.fillStyle='#ece4d4aa';g.beginPath();g.moveTo(pxx-r,py-r*1.9);g.quadraticCurveTo(pxx,py-r*3.3,pxx+r,py-r*1.9);g.fill();g.beginPath();g.moveTo(pxx-r,py-r*1.9);g.lineTo(pxx,py-4);g.lineTo(pxx+r,py-r*1.9);g.stroke()}
   g.fillStyle='#d9d4c8';g.beginPath();g.arc(pxx,Math.min(py,gy-5),9,Math.PI,0);g.fill();g.fillStyle='#8a8f98';g.fillRect(pxx-9,Math.min(py,gy-5)-1,18,3);
   if(t>=147){g.strokeStyle='#6dffa8';for(let k=1;k<=3;k++){g.beginPath();g.arc(pxx,gy-6,12+k*10+((performance.now()/60)%10),Math.PI*1.25,Math.PI*1.75);g.stroke()}}
   g.fillStyle='#fff';g.font='12px sans-serif';g.fillText('Huygens',pxx+16,Math.min(py,gy-5)+4)}
  function upd(dt){if(!built)return;if(play){t=Math.min(219,t+dt*10);if(t>=219)play=0;$('hzs').value=t;$('hzp').textContent=play?'Pause':'Play'}
   const al=altAt(t),T=tmp(al);$('hzt').textContent=(t<60?t.toFixed(0)+' min':Math.floor(t/60)+' h '+String(Math.floor(t%60)).padStart(2,'0')+' min');
   $('hzr').innerHTML=`Altitude <b>${al<10?al.toFixed(1):al.toFixed(0)} km</b> · Temperature <b>${Math.round(T-273)} °C</b> (${Math.round(T)} K) · Pressure <b>${fmtP(prs(al))}</b>`;
   let cur=EV[0];EV.forEach(e=>{if(e.t<=t)cur=e});$('hzd').innerHTML=`<b>${cur.n}.</b> ${cur.d}`;draw()}
  return{show(){LAB.style.display='block';LAB.innerHTML=html();built=1;cv=$('hzc');cx=cv.getContext('2d');
    LAB.onclick=e=>{if(e.target.closest('#hzp')){if(t>=219)t=0;play=play?0:1;$('hzp').textContent=play?'Pause':'Play'}const ev=e.target.closest('[data-ev]');if(ev){t=EV[+ev.dataset.ev].t+.05;play=0;$('hzs').value=t;$('hzp').textContent='Play'}const q=e.target.closest('[data-in]');if(q){const n=IN[+q.dataset.in];$('hzi').innerHTML=`<b>${n[0]}: ${n[1]}.</b> ${n[2]}`}};
    LAB.oninput=e=>{if(e.target.id=='hzs'){t=+e.target.value;play=0;$('hzp').textContent='Play'}}},hide(){built=0},upd};})();
 let view=0;
 function tab(k){view=k;scTab(k);insp.hide();HZ.hide();labOff();
  if(k==0){op.s=insp.s;opUI('Cassini–Huygens · Inspect','Tabs: 1 inspect, 2 Grand Finale, 3 Huygens descent. Drag to rotate, scroll to zoom, click the markers.');insp.show()}
  else if(k==1){op.s=s;opUI('Cassini · Grand Finale','A / D (or arrow keys) steer into the middle of the gap between Saturn and its rings. Press H as the ring plane crosses to turn the dish into a shield. Enter restarts.')}
  else{op.s=HS;opUI('Huygens · Descent to Titan','Tabs: 1 inspect, 2 Grand Finale, 3 Huygens descent. Everything for this tab is in the panel on the right.');HZ.show()}}
 const HS=new THREE.Scene();HS.add(starSphere());const hp=planet('saturn',9);hp.position.set(-14,3,-30);HS.add(hp);const hs=new THREE.Mesh(new THREE.SphereGeometry(5,40,24),new THREE.MeshStandardMaterial({color:0xd8923a,roughness:1}));hs.position.set(9,-1,-22);HS.add(hs);HS.add(new THREE.HemisphereLight(0xffffff,0x332a1a,.9));
 scTabs(['Inspect','Grand Finale','Huygens'],tab);
 return{s:insp.s,init(){tab(0)},click(){},done(){scOff()},drag(dx,dy){view==0?insp.drag(dx,dy):view==1?GG.drag(dx,dy):0},wheel(dy){view==0?insp.wheel(dy):0},
  key(k){if(k=='1')tab(0);else if(k=='2')tab(1);else if(k=='3')tab(2);else if(view==0)insp.key(k);else if(view==1)GG.key(k)},
  upd(dt){if(view==0){insp.upd(dt);L('Cassini carried Huygens for seven years, then stayed to orbit Saturn for thirteen.');return}if(view==2){hs.rotation.y+=dt*.1;cam.up.set(0,1,0);cam.position.set(0,0,6);cam.lookAt(0,0,-30);if(cam.fov!=50){cam.fov=50;cam.updateProjectionMatrix()}HZ.upd(dt);L('Huygens descent. Use the panel on the right.');return}GG.upd(dt)}};
}
