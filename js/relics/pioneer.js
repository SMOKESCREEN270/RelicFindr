/* ================= PIONEER 10 ================= */
function opPioneer(i){const s=new THREE.Scene();s.add(new THREE.AmbientLight(0xffffff,.9));const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(0,30,0);s.add(dl);
 const bk=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshBasicMaterial({map:TX.star}));bk.rotation.x=-Math.PI/2;bk.position.y=-2;s.add(bk);
 const jup=planet('jupiter',1);jup.rotation.x=Math.PI/2;s.add(jup);
 const zone=new THREE.Mesh(new THREE.RingGeometry(1.02,2.6,64),new THREE.MeshBasicMaterial({color:0xff4a3a,transparent:true,opacity:.22,side:2}));zone.rotation.x=-Math.PI/2;zone.position.y=.05;s.add(zone);
 for(const r of[10,20,30]){const c=new THREE.Mesh(new THREE.RingGeometry(r-.05,r+.05,96),new THREE.MeshBasicMaterial({color:0x5ee1ff,transparent:true,opacity:.25,side:2}));c.rotation.x=-Math.PI/2;c.position.y=.02;s.add(c)}
 const arrow=new THREE.ArrowHelper(V(0,0,-1),V(-26,0,22),9,0xffd27a,1.6,1);s.add(arrow);
 const m=ctr(models[i].clone(true));m.scale.setScalar(.5);m.rotation.x=Math.PI/2;const sh=new THREE.Group();sh.add(m);s.add(sh);
 const GM=1.2669e8,RJ=71492,u=[0,13.06],vs=[10,6],vr=[vs[0]-u[0],vs[1]-u[1]],vm=Math.hypot(...vr),dn=[vr[0]/vm,vr[1]/vm],nl=[-dn[1],dn[0]],ESC=18.5;
 function sim(b){let p=[-dn[0]*45*RJ+nl[0]*b*RJ,-dn[1]*45*RJ+nl[1]*b*RJ],v=[vr[0],vr[1]],path=[[p[0]/RJ,p[1]/RJ]],rp=1e9;
  for(let n=0;n<6000;n++){const r=Math.hypot(...p);rp=Math.min(rp,r);if(r<RJ*.99){return{path,rp:r/RJ,crash:1}}const dt=Math.min(900,r/Math.hypot(...v)/25),a=-GM/(r*r*r);v[0]+=a*p[0]*dt;v[1]+=a*p[1]*dt;p[0]+=v[0]*dt;p[1]+=v[1]*dt;if(n%4==0)path.push([p[0]/RJ,p[1]/RJ]);if(r>46*RJ&&p[0]*v[0]+p[1]*v[1]>0)break}
  const hv=[u[0]+v[0],u[1]+v[1]];return{path,rp:rp/RJ,crash:0,hs:Math.hypot(...hv),ang:Math.atan2(v[1],v[0])-Math.atan2(vr[1],vr[0]),vo:v}}
 const st={b:-6,res:null,t:-1,line:null,h:55,px:0,pz:0,won:0};
 function rebuild(){st.res=sim(st.b);const pts=st.res.path.map(q=>V(q[0],.2,-q[1]));if(st.line)s.remove(st.line);st.line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:st.res.crash?0xff4a3a:0xffd27a}));s.add(st.line)}
 opUI('Pioneer 10 · Slingshot past Jupiter','A / D (or ← →) move the aim point. Space launches. Scroll zooms, drag pans. Jupiter moves up the screen; the craft comes in from the lower left. Escape speed here is '+ESC+' km/s.');rebuild();
 const GG={s,drag(dx,dy){const k=st.h*Math.tan(25*DEG)*2/innerHeight;st.px-=dx*k;st.pz-=dy*k},wheel(dy){st.h=cl(st.h*Math.exp(dy*.0012),10,120)},click(){},done(){cam.up.set(0,1,0)},
 key(k){if(k==' '&&st.t<0&&!st.res.crash){st.t=0;st.won=0;if(st.gl)s.remove(st.gl);st.gl=st.line.clone();st.gl.material=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.28});s.add(st.gl)}else if(k=='enter'){st.t=-1}},
 upd(dt){const ch=(K('arrowright')+K('d')-K('arrowleft')-K('a'));if(ch&&st.t<0){st.b=cl(st.b+ch*dt*10,-30,30);rebuild()}
  if(st.t>=0){st.t=Math.min(1,st.t+dt/7);const n=st.res.path.length,f=st.t*(n-1),k=Math.floor(f),q=st.res.path[k],r=st.res.path[Math.min(n-1,k+1)],e=f-k;sh.position.set(q[0]+(r[0]-q[0])*e,.4,-(q[1]+(r[1]-q[1])*e));if(st.t>=1&&!st.won){st.won=1}}else{const q=st.res.path[0];sh.position.set(q[0],.4,-q[1])}
  cam.up.set(0,0,-1);cam.position.set(st.px,st.h,st.pz);cam.lookAt(st.px,0,st.pz);if(cam.fov!=50){cam.fov=50;cam.updateProjectionMatrix()}
  const r=st.res;let h=`Aim point: <b>${Math.abs(st.b).toFixed(1)} Jupiter radii ${st.b<0?'behind Jupiter (trailing side)':'ahead of Jupiter (leading side)'}</b><br>`;
  if(r.crash)h+='<b style="color:#ff6b5a">This path hits Jupiter.</b> Move the aim point.';
  else{const fast=r.hs>ESC,rad=Math.pow(2.8/r.rp,3)*100;h+=`Closest approach: <b>${r.rp.toFixed(1)} Jupiter radii</b>${r.rp<2.6?' <b style="color:#ffb347">(inside the radiation zone)</b>':''}<br>Radiation at closest approach: <b style="color:${rad>300?'#ff6b5a':rad>150?'#ffb347':'#6dffa8'}">${rad.toFixed(0)}%</b> of what Pioneer 10 met${rad>300?' (the electronics would fail)':''}<br>Speed relative to the Sun after the flyby: <b style="color:${fast?'#6dffa8':'#ffb347'}">${r.hs.toFixed(1)} km/s</b> (before: ${Math.hypot(...vs).toFixed(1)})<br>${fast?'Above escape speed: the craft leaves the solar system.':'Below escape speed: the craft stays bound to the Sun.'}`;
   if(st.t<0)h+='<br>Press Space to launch.';else if(st.t>=1)h+=`<br><b>${fast?'Pioneer 10 passed about 130,000 km above the clouds, and Jupiter’s gravity flung it out of the solar system.':'This path loses speed. Pioneer 10 went behind Jupiter, so the planet’s own motion added to its speed.'}</b> Press Enter to aim again.`}
  L(h)}};
 const A=[{n:'High-gain dish, 2.7 m',p:[0,3.31,-.5],t:'The dish stays pointed at Earth. Pioneer 10 spins about 4.8 times a minute for stability, so the dish axis is also the spin axis, and a single antenna can keep aiming home.'},
 {n:'Feed horn',p:[0,3.3,-.6],t:'The horn at the focus of the dish sends and receives the radio signal. At Jupiter Pioneer 10 sent up to about 2,048 bits per second. Today, signals from such craft would be a very faint whisper.'},
 {n:'Equipment compartment',p:[0,3.2,.25],t:'A hexagonal box behind the dish holds the electronics and most of the instruments, kept warm by the spacecraft’s own heat and louvres that open and close.'},
 {n:'Gold plaque',p:[.35,3.0,.35],t:'A 23 cm gold-anodised aluminium plate is bolted to the antenna struts, placed so that the dish shields it from dust. Carl Sagan, Frank Drake and Linda Salzman Sagan designed it. See the Plaque tab to decode it.'},
 {n:'RTG booms',p:[1.0,3.8,.3],t:'Four nuclear power units sit on two long booms, two per boom, far from the instruments. They gave about 155 watts at launch and dropped over the years as the plutonium decayed.'},
 {n:'Magnetometer boom',p:[0,1.4,0],t:'A boom more than 6 m long carries a helium magnetometer away from the spacecraft’s own magnetic field.'},
 {n:'Imaging photopolarimeter',p:[-.2,3.45,-.1],hid:1,t:'The only instrument that made pictures. Using the spin of the craft, it scanned Jupiter one thin strip at a time, building up the first close-up images of the planet.'},
 {n:'Radiation and particle detectors',p:[.2,3.1,.1],hid:1,t:'Geiger tubes and particle telescopes measured Jupiter’s radiation belts. Their data showed engineers how much shielding Voyager and Galileo would need.'},
 {n:'Meteoroid detectors',p:[-.35,3.1,-.1],t:'Panels on the back of the dish counted dust grains. Pioneer 10 found the asteroid belt was far emptier than feared, which cleared the way for later missions.'}];
 const SP=[['Launched','2 Mar 1972, Atlas–Centaur rocket'],['Mass','About 258 kg'],['Power','About 155 W from four RTGs at launch'],['Instruments','11'],['Jupiter flyby','3 Dec 1973, about 130,000 km above the clouds'],['Last signal','23 Jan 2003, about 80 times Earth’s distance from the Sun'],['Plaque','22.9 cm by 15.2 cm, gold-anodised aluminium']];
 const insp=mkInsp(i,A,{title:'Pioneer 10 · Inspect',dist:9,near:4.5,min:2.5,max:22,ty:2.8,real:1,smooth:1,auto:.12,az0:.5,el0:.15,specs:SP});
 const PL=(()=>{const R0=[
  {k:'h',n:'The hydrogen atom',x:18,y:16,w:96,h:60,d:'This is the plaque’s ruler. A hydrogen atom flips its spin and gives off radio waves 21 cm long. That 21 cm is the unit for every size on the plate.'},
  {k:'p',n:'Pulsar map',x:14,y:96,w:150,h:130,d:'Fifteen lines start from one point. Fourteen point to pulsars, with their spin rates written in binary. The longest line points to the centre of the Galaxy. Pulsars slow down at known rates, so a finder could work out when Pioneer left.'},
  {k:'s',n:'The solar system',x:14,y:250,w:350,h:68,d:'Nine planets were known in 1972. A line starts from the third one, Earth, swings past Jupiter and Saturn and leaves the system. This shows where Pioneer came from and where it went.'},
  {k:'f',n:'The man and woman',x:222,y:46,w:130,h:190,d:'A man and a woman, drawn to scale. The man’s raised hand is a greeting. The binary mark beside the woman is 8, meaning eight times 21 cm, or 168 cm tall.'},
  {k:'c',n:'The spacecraft outline',x:178,y:90,w:42,h:150,d:'A silhouette of Pioneer 10 drawn behind the figures to the same scale, so a finder could judge how big the people were.'}];
  let cv,cx,hov=null,sel=null;
  const draw=()=>{const g=cx,W=380,H=340,gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#e9c46a');gr.addColorStop(1,'#b08a2e');g.fillStyle=gr;g.fillRect(0,0,W,H);g.strokeStyle='#3b2a08';g.lineWidth=3;g.strokeRect(6,6,W-12,H-12);g.lineWidth=1.6;g.fillStyle='#3b2a08';
   // hydrogen
   g.beginPath();g.arc(36,34,10,0,7);g.stroke();g.beginPath();g.arc(86,34,10,0,7);g.stroke();g.beginPath();g.moveTo(46,34);g.lineTo(76,34);g.stroke();g.beginPath();g.moveTo(61,26);g.lineTo(61,42);g.stroke();g.beginPath();g.moveTo(36,28);g.lineTo(36,40);g.stroke();g.beginPath();g.moveTo(86,28);g.lineTo(86,40);g.stroke();
   // pulsars
   const cx0=80,cy0=170;for(let k=0;k<15;k++){const a=k*(Math.PI*2/15)+.35,l=k==3?64:30+((k*37)%34);g.beginPath();g.moveTo(cx0,cy0);g.lineTo(cx0+Math.cos(a)*l,cy0+Math.sin(a)*l);g.stroke();if(k!=3)for(let q=0;q<3;q++){const u=l-4-q*5;g.beginPath();g.moveTo(cx0+Math.cos(a)*u-Math.sin(a)*3,cy0+Math.sin(a)*u+Math.cos(a)*3);g.lineTo(cx0+Math.cos(a)*u+Math.sin(a)*3,cy0+Math.sin(a)*u-Math.cos(a)*3);g.stroke()}}
   // solar system
   const y0=290;g.beginPath();g.arc(28,y0,7,0,7);g.fill();const pr=[40,9],px=[48,62,76,90,118,150,178,200,214];[2,2,3,3,6,5,4,4,2].forEach((r,k)=>{g.beginPath();g.arc(px[k]+(k>3?(k-3)*10:0)+38,y0,r,0,7);g.fill()});
   g.beginPath();g.moveTo(104,y0-6);g.quadraticCurveTo(190,y0-52,260,y0-30);g.stroke();g.beginPath();g.moveTo(260,y0-30);g.lineTo(250,y0-32);g.moveTo(260,y0-30);g.lineTo(253,y0-22);g.stroke();
   // spacecraft outline
   g.beginPath();g.arc(200,130,20,Math.PI*.9,Math.PI*2.1);g.stroke();g.beginPath();g.moveTo(180,134);g.lineTo(220,134);g.moveTo(200,134);g.lineTo(200,176);g.moveTo(190,176);g.lineTo(210,176);g.stroke();
   // figures
   const fig=(x,s,man)=>{g.beginPath();g.arc(x,92,11,0,7);g.stroke();g.beginPath();g.moveTo(x,103);g.lineTo(x,148);g.stroke();g.beginPath();g.moveTo(x,148);g.lineTo(x-10,214);g.moveTo(x,148);g.lineTo(x+10,214);g.stroke();g.beginPath();g.moveTo(x,114);g.lineTo(x-16,150);g.stroke();g.beginPath();if(man){g.moveTo(x,114);g.lineTo(x+16,92);g.lineTo(x+20,84)}else{g.moveTo(x,114);g.lineTo(x+16,150)}g.stroke()};fig(250,1,0);fig(310,1,1);
   g.font='11px sans-serif';g.fillText('1000',262,226);
   [hov,sel].forEach((k,n)=>{const r=R0.find(q=>q.k==k);if(!r)return;g.strokeStyle=n?'#0b3d91':'#7a1f00';g.lineWidth=2.5;g.setLineDash(n?[]:[6,4]);g.strokeRect(r.x,r.y,r.w,r.h);g.setLineDash([]);g.lineWidth=1.6;g.strokeStyle='#3b2a08'});};
  const at=e=>{const b=cv.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*380,y=(e.clientY-b.top)/b.height*340;const r=R0.slice().reverse().find(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);return r?r.k:null};
  const info=()=>{const r=R0.find(q=>q.k==(hov||sel));$('plx').innerHTML=r?`<b>${r.n}.</b> ${r.d}`:'Move over a part of the plaque, or click one, to decode it.'};
  return{show(){LAB.style.display='block';LAB.innerHTML=`<b style="color:var(--cy);font-size:15px">Pioneer 10 · Decode the plaque</b><div style="${LABCSS};opacity:.75;margin:4px 0 8px">The plaque is a message for anyone who finds the spacecraft. Hover or click a part of it to see what it says. Simplified redraw.</div><canvas id="plc" width="380" height="340" style="width:100%;max-width:420px;display:block;margin:auto;cursor:pointer"></canvas><div id="plx" style="${LABCSS};margin-top:8px"></div>`;
    cv=$('plc');cx=cv.getContext('2d');draw();info();cv.onmousemove=e=>{const k=at(e);if(k!==hov){hov=k;draw();info()}};cv.onmouseleave=()=>{hov=null;draw();info()};cv.onclick=e=>{sel=at(e);draw();info()}}}})();
 let view=0;
 function tab(k){view=k;scTab(k);insp.hide();labOff();cam.up.set(0,1,0);
  if(k==0){op.s=insp.s;opUI('Pioneer 10 · Inspect','Tabs: 1 inspect, 2 slingshot past Jupiter, 3 decode the plaque. Drag to rotate, scroll to zoom, click the markers.');insp.show()}
  else if(k==1){op.s=s;opUI('Pioneer 10 · Slingshot past Jupiter','A / D (or ← →) move the aim point. Space launches. Scroll zooms, drag pans. Jupiter moves up the screen; the craft comes in from the lower left. Escape speed here is '+ESC+' km/s.')}
  else{op.s=insp.s;opUI('Pioneer 10 · Plaque','Tabs: 1 inspect, 2 slingshot past Jupiter, 3 decode the plaque.');PL.show()}}
 scTabs(['Inspect','Slingshot','Plaque'],tab);
 return{s:insp.s,init(){tab(0)},click(){},done(){cam.up.set(0,1,0);scOff()},drag(dx,dy){view==1?GG.drag(dx,dy):insp.drag(dx,dy)},wheel(dy){view==1?GG.wheel(dy):insp.wheel(dy)},
  key(k){if(k=='1')tab(0);else if(k=='2')tab(1);else if(k=='3')tab(2);else if(view==1)GG.key(k);else insp.key(k)},
  upd(dt){if(view==1){GG.upd(dt);return}insp.upd(dt);L(view==2?'Pioneer 10 carries a message in case anyone ever finds it.':'Pioneer 10 was the first spacecraft to cross the asteroid belt and fly past Jupiter.')}};
}
