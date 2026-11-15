/* ================= KEPLER ================= */
const KST=[
 {n:'Kepler-10',u:-3.4,v:2.9,R:1.065,M:.91,Te:5708,mag:10.96,pl:[{P:.837495,Rp:1.47,t0:.31}],r:'Planet b: about 1.5 Earth radii, rocky, and it circles its star in under a day. Confirmed in 2011 as the first rocky planet Kepler found, though its surface is probably molten.'},
 {n:'Kepler-22',u:4.1,v:-1.8,R:.979,M:.97,Te:5518,mag:11.7,pl:[{P:289.86,Rp:2.38,t0:122.1}],r:'Planet b: about 2.4 Earth radii in the habitable zone of a Sun-like star. It was announced in 2011 and is the first planet Kepler found there.'},
 {n:'Kepler-186',u:-1.2,v:-4,R:.52,M:.48,Te:3788,mag:14.9,pl:[{P:129.94,Rp:1.17,t0:60.2}],r:'Planet f: about 1.2 Earth radii, the first Earth-size planet found in a habitable zone (2014). Its star is a small red dwarf.'},
 {n:'Kepler-452',u:2.6,v:3.7,R:1.11,M:1.04,Te:5757,mag:13.4,pl:[{P:384.84,Rp:1.6,t0:210.4}],r:'Planet b: about 1.6 Earth radii, circling a Sun-like star every 385 days. Announced in 2015 as an older cousin of Earth.'},
 {n:'Eclipsing binary',u:-5.2,v:-1.2,R:1,M:1,Te:5800,mag:12.2,bin:{P:3.21,d1:.012,d2:.005,D:.2,t0:.7},r:'Two stars orbiting each other, one passing in front of the other. The second, shallower dip is the giveaway. Catching false positives like this is half of planet hunting.'}];
KST.forEach((S,k)=>{S.id=k*17+3;S.done=0;S.Tk=0;(S.pl||[]).forEach(p=>{p.dep=Math.pow(p.Rp*.009168/S.R,2);p.D=.5417*Math.pow(p.P/365.25,1/3)*S.R/Math.cbrt(S.M)});
 S.dmax=S.bin?S.bin.d1:S.pl[0].dep;S.nz=Math.max(.3*S.dmax,S.bin?.0004:0);S.vr=.25*S.dmax;S.vf=2*Math.PI/(9+k*3);S.L=S.R*S.R*Math.pow(S.Te/5772,4);S.hz=[.75*Math.sqrt(S.L),1.77*Math.sqrt(S.L)]});
const kflux=(S,t)=>{let f=1;if(S.bin){const b=S.bin;const x=((t-b.t0)%b.P+b.P)%b.P,h=b.D/2;const tri=(a,dp)=>{if(a<h)f-=dp*(1-a/h)};tri(Math.min(x,b.P-x),b.d1);tri(Math.abs(x-b.P/2),b.d2)}
 else for(const p of S.pl){let x=((t-p.t0)%p.P+p.P)%p.P;if(x>p.P/2)x-=p.P;const a=Math.abs(x),h=p.D/2,ing=Math.min(h*.5,.02+h*.12);if(a<h)f-=p.dep*(a<h-ing?1:(h-a)/ing)}
 f+=S.vr*Math.sin(t*S.vf+S.id);const k=Math.floor(t/.0204);return f+S.nz*(hsh(k+S.id)+hsh(k*3+S.id+7)+hsh(k*5+S.id+13)-1.5)*2};
function kbls(S,Tk){const n=Math.min(12000,Math.ceil(Tk/.0204)),dt=Tk/n,f=new Float32Array(n);let mu=0;for(let k=0;k<n;k++){f[k]=kflux(S,(k+.5)*dt);mu+=f[k]}mu/=n;let sd=0;for(let k=0;k<n;k++){f[k]-=mu;sd+=f[k]*f[k]}sd=Math.sqrt(sd/n);
 const NB=400,sb=new Float64Array(NB),cb=new Int32Array(NB),W=[1,2,3,4,6,8,12,16,24,40];let best={snr:0,P:0,t0:0};const Pmax=Math.min(Tk/2.2,700),Pmin=.35;if(Pmax<=Pmin)return best;
 for(let q=0;q<1400;q++){const P=Pmin*Math.pow(Pmax/Pmin,q/1399);sb.fill(0);cb.fill(0);for(let k=0;k<n;k++){const b=(((k+.5)*dt/P)%1)*NB|0;sb[b]+=f[k];cb[b]++}
  for(const w of W){let s=0,c=0;for(let b=0;b<w;b++){s+=sb[b];c+=cb[b]}for(let a=0;a<NB;a++){if(a){const e=(a+w-1)%NB;s+=sb[e]-sb[a-1];c+=cb[e]-cb[a-1]}if(c>4){const snr=-(s/c)*Math.sqrt(c)/sd;if(snr>best.snr)best={snr,P,t0:(a+w/2)/NB*P}}}}}
 return best}
function opKepler(i){const E=EXH[i];let view=0,sel=null;const sc=skyCam({ya:0,pi:.55,fv:22,fmin:.7,fmax:40,lim:.14,fv0:22}),f0=dirOf(0,.55),rt=V(1,0,0),up=rt.clone().cross(f0).normalize();
 const dirUV=(u,v)=>f0.clone().addScaledVector(rt,u*DEG).addScaledVector(up,v*DEG).normalize();
 const A=[{n:'Aperture and Schmidt corrector',p:[0,3.95,0],t:'Starlight enters at the top through a 0.95 m corrector lens, then falls onto a 1.4 m primary mirror. At the time it was the largest camera mirror launched beyond Earth orbit.'},
 {n:'Sunshade and baffle',p:[0,3.35,.85],t:'The gold-coloured shade and baffles keep sunlight and Earth-shine out of the telescope, so that very faint dips in starlight stay visible.'},
 {n:'Solar array',p:[-.84,2.1,0],t:'The dark panel with grid-like cells is the solar array. It powers the photometer and had to face the Sun all year, which is why Kepler rolled 90° every three months.'},
 {n:'Photometer (focal plane)',p:[0,1.8,0],hid:1,t:'Inside the tube sits the camera: 42 CCDs, about 95 megapixels, watching around 150,000 stars at once for a tiny dip in brightness. It has no shutter and never changes its view.'},
 {n:'High-gain antenna',p:[-.15,.38,-1],t:'About once a month Kepler turned away from its field to point this dish at Earth and send home its stored data.'},
 {n:'Bus, reaction wheels and thrusters',p:[.4,.3,.4],t:'Reaction wheels spin to point the telescope with extreme steadiness. Two of the four failed (2012 and 2013), which ended the original mission and led to the K2 mission.'}];
 const insp=mkInsp(i,A,{title:'Kepler Space Telescope · Inspect',dist:11,near:5.5,min:3,max:26,ty:2});
 /* sky */
 const s=new THREE.Scene();s.add(starSphere());const r=GEN.mul(77),N=6500,pos=new Float32Array((N+KST.length)*3),col=new Float32Array((N+KST.length)*3),sz=new Float32Array(N+KST.length);
 for(let k=0;k<N;k++){const d=dirUV((r()*2-1)*10,(r()*2-1)*10).multiplyScalar(100),b=Math.pow(r(),3.4),t=r(),c=t<.2?[.7,.8,1]:t<.7?[1,.97,.85]:[1,.8,.6],a=.3+.7*b;pos.set([d.x,d.y,d.z],k*3);col.set([c[0]*a,c[1]*a,c[2]*a],k*3);sz[k]=2+b*8}
 KST.forEach((S,k)=>{S.d=dirUV(S.u,S.v);const d=S.d.clone().multiplyScalar(100),j=N+k;pos.set([d.x,d.y,d.z],j*3);col.set([1,.96,.82],j*3);sz[j]=11});
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));pg.setAttribute('col',new THREE.BufferAttribute(col,3));pg.setAttribute('size',new THREE.BufferAttribute(sz,1));
 const pm=new THREE.ShaderMaterial({uniforms:{zm:{value:1}},vertexShader:'attribute float size;attribute vec3 col;varying vec3 vc;uniform float zm;void main(){vc=col;gl_PointSize=size*zm;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 vc;void main(){float d=length(gl_PointCoord-.5)*2.;float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vc*a,1.);}',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
 const pts=new THREE.Points(pg,pm);pts.frustumCulled=false;s.add(pts);
 /* focal-plane footprint: 21 modules (5x5 minus corners), fixed to the telescope */
 const fv=[],mod=2.2*.01746,ms=2*.01746;for(let a=0;a<5;a++)for(let b=0;b<5;b++){if((a%4==0)&&(b%4==0))continue;const x=(a-2)*mod,y=(b-2)*mod,h=ms/2;fv.push(x-h,y-h,0,x+h,y-h,0,x+h,y-h,0,x+h,y+h,0,x+h,y+h,0,x-h,y+h,0,x-h,y+h,0,x-h,y-h,0)}
 const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fv,3));const fp=new THREE.LineSegments(fg,new THREE.LineBasicMaterial({color:0x5ee1ff,transparent:true,opacity:.55,depthTest:false}));fp.renderOrder=9;fp.frustumCulled=false;s.add(fp);
 const tg=KST.map((S,k)=>{const b=document.createElement('button');b.className='tg';b.innerHTML='<i></i><span></span>';b.style.display='none';b.onclick=e=>{e.stopPropagation();aim(k)};HOTS.appendChild(b);return b});
 function aim(k){const S=KST[k];sel=k;if(view==2){openPhoto();return}const ya=Math.atan2(-S.d.x,-S.d.z),pi=Math.asin(S.d.y);sc.slew(ya,pi,3.5);toast('Slewing to '+S.n+'…');setTimeout(()=>{if(op&&sel===k&&view!==2)tab(2)},1700)}
 /* ---- photometer lab ---- */
 const lb={zoomLo:0,zoomHi:1,A:null,B:null,P:1,t0:null,follow:1,res:null,bls:null,fs:null};
 function labHTML(){const S=KST[sel];LAB.style.display='block';
  LAB.innerHTML=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px"><button class="chip" id="kback">← Survey</button>${KST.map((q,k)=>`<button class="chip${k==sel?' on':''}" data-s="${k}">${q.done?'✓ ':''}${q.n}</button>`).join('')}</div><div style="opacity:.6;font-size:11px;margin:-4px 0 6px">Switch stars any time here, or press [ and ]. Each star keeps its own observations.</div><b style="color:var(--cy);font-size:15px">${S.n}</b> <span style="opacity:.7">· ${S.Te<4500?'red dwarf':'Sun-like'} star · R ${S.R} R☉ · mag ${S.mag}</span><div id="kt" style="${LABCSS};margin:4px 0">Hold <b>Space</b> to observe.</div>
  <canvas id="kc1" width="1120" height="300"></canvas><div style="opacity:.7;font-size:12px">Scroll over the graph to zoom time · drag to pan · click two neighbouring dips to measure the spacing</div>
  <div style="margin:8px 0;${LABCSS}">Trial period: <b id="kP">–</b> days <input id="kPs" type="range" min="0" max="1000" style="width:46%;vertical-align:middle"> <button class="chip" id="kh">÷2</button><button class="chip" id="kd">×2</button><button class="chip" id="kb">Auto-search</button></div>
  <canvas id="kc2" width="1120" height="260"></canvas><div id="kr" style="${LABCSS};margin:6px 0"></div>
  <div id="ka" style="display:flex;gap:6px;flex-wrap:wrap"><button class="chip" data-c="p">It is a planet</button><button class="chip" data-c="b">It is a binary star</button><button class="chip" id="kz">Reset time</button></div><div id="kv" style="${LABCSS};margin-top:6px"></div>`;
  const c1=$('kc1'),c2=$('kc2');const ps=$('kPs'),lg=v=>.3*Math.pow(700/.3,v/1000);
  ps.oninput=()=>{lb.P=lg(ps.value);lb.fs=1;draw()};
  const setP=v=>{lb.P=cl(v,.3,700);ps.value=Math.round(1000*Math.log(lb.P/.3)/Math.log(700/.3));lb.fs=1;draw()};lb.setP=setP;
  $('kh').onclick=()=>setP(lb.P/2);$('kd').onclick=()=>setP(lb.P*2);
  $('kb').onclick=()=>{if(S.Tk<40){$('kr').innerHTML='Observe longer first. Hold Space.';return}const b=kbls(S,S.Tk);lb.t0=b.t0;lb.bls=b;setP(b.P);$('kr').innerHTML=`Search found a repeating dip: period <b>${b.P.toFixed(3)} d</b> (signal strength ${b.snr.toFixed(1)}). Now press <b>Measure</b>.`;measureBtn()};
  $('kz').onclick=()=>{S.Tk=0;lb.A=lb.B=lb.t0=lb.bls=null;lb.zoomLo=0;lb.zoomHi=1;lb.follow=1;draw()};
  const x2t=e=>{const r=c1.getBoundingClientRect();return(e.clientX-r.left)/r.width};
  c1.addEventListener('wheel',e=>{e.preventDefault();const u=(x2t(e)*1120-70)/1040,span=lb.zoomHi-lb.zoomLo,ns=cl(span*Math.exp(e.deltaY*.0015),.0005,1),c=lb.zoomLo+cl(u,0,1)*span;lb.zoomLo=cl(c-cl(u,0,1)*ns,0,1-ns);lb.zoomHi=lb.zoomLo+ns;lb.follow=ns>=1;draw()},{passive:false});
  let dg=null;c1.onpointerdown=e=>{dg={x:e.clientX,lo:lb.zoomLo,m:0};c1.setPointerCapture(e.pointerId)};c1.onpointermove=e=>{if(!dg)return;const dx=e.clientX-dg.x;dg.m=Math.max(dg.m,Math.abs(dx));const r=c1.getBoundingClientRect(),span=lb.zoomHi-lb.zoomLo,nl=cl(dg.lo-dx/r.width*1120/1040*span,0,1-span);lb.zoomLo=nl;lb.zoomHi=nl+span;lb.follow=0;draw()};
  c1.onpointerup=e=>{if(dg&&dg.m<4)clickDip(x2t(e));dg=null};
  LAB.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>classify(b.dataset.c));LAB.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sel=+b.dataset.s;openPhoto()});$('kback').onclick=()=>tab(1);draw();measureBtn()}
 function measureBtn(){const kr=$('kr');if(!kr)return;if(!$('km')){kr.insertAdjacentHTML('afterend','<div><button class="chip" id="km">Measure</button></div>');$('km').onclick=measure}}
 function tspan(S){const Tk=Math.max(S.Tk,5);return[lb.zoomLo*Tk,lb.zoomHi*Tk]}
 function snap(S,tc){const[a,b]=tspan(S),w=(b-a)/22;let bt=tc,bv=9;for(let k=0;k<50;k++){const t=tc-w+k*2*w/49;if(t<0||t>S.Tk)continue;let f=0;for(let q=0;q<8;q++)f+=kflux(S,t+(q-4)*w/100);f/=8;if(f<bv){bv=f;bt=t}}return bt}
 function clickDip(u){const S=KST[sel];if(S.Tk<5)return;const[a,b]=tspan(S),tc=a+cl((u*1120-70)/1040,0,1)*(b-a),t=snap(S,tc);
  if(lb.A==null||lb.B!=null){lb.A=t;lb.B=null;lb.t0=t;$('kr').innerHTML='First dip marked at day '+t.toFixed(2)+'. Click the next one.'}else{lb.B=t;const P=Math.abs(lb.B-lb.A);lb.t0=Math.min(lb.A,lb.B);lb.setP(P);$('kr').innerHTML=`Spacing between dips: <b>${P.toFixed(2)} d</b>. If the fold below is smeared, you skipped or added a dip. Try ÷2 or ×2, or nudge the slider.`;measureBtn()}draw()}
 function plot(c,S){const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);return x}
 function draw(){const S=KST[sel],c1=$('kc1');if(!c1)return;const W=1120,H=300,x=c1.getContext('2d');x.fillStyle='#05080f';x.fillRect(0,0,W,H);
  const Tk=Math.max(S.Tk,5),[a,b]=tspan(S),y0=1+1.2*S.dmax,y1=1-2.6*S.dmax,Y=v=>10+(y0-v)/(y0-y1)*(H-46),X=t=>70+(t-a)/(b-a)*1040;
  x.strokeStyle='#ffffff18';x.fillStyle='#8aa';x.font='20px sans-serif';for(let k=0;k<=4;k++){const v=y1+(y0-y1)*k/4,yy=Y(v);x.beginPath();x.moveTo(70,yy);x.lineTo(W-10,yy);x.stroke();x.fillText(((v-1)*1e6).toFixed(0),4,yy+6)}
  x.fillText('ppm',4,H-24);for(let k=0;k<=5;k++){const t=a+(b-a)*k/5;x.fillText(t<10?t.toFixed(2):t.toFixed(0)+' d',X(t)-18,H-8)}
  if(S.Tk>0){x.fillStyle='#5ee1ff';const cols=520,span=(b-a)/cols;for(let q=0;q<cols;q++){const t=a+(q+.5)*span;if(t>S.Tk)break;const K2=Math.min(8,Math.ceil(span/.0204));let f=0;for(let e=0;e<K2;e++)f+=kflux(S,t+(e/K2-.5)*span);f/=K2;x.fillRect(X(t)-1.5,Y(f)-1.5,3.2,3.2)}}
  else{x.fillStyle='#8aa';x.font='24px sans-serif';x.fillText('No data yet. Hold Space to observe.',330,H/2)}
  for(const m of[lb.A,lb.B])if(m!=null&&m>=a&&m<=b){x.strokeStyle='#ffd27a';x.setLineDash([6,5]);x.beginPath();x.moveTo(X(m),10);x.lineTo(X(m),H-34);x.stroke();x.setLineDash([])}
  const c2=$('kc2'),y=c2.getContext('2d'),H2=260;y.fillStyle='#05080f';y.fillRect(0,0,W,H2);y.fillStyle='#8aa';y.font='20px sans-serif';y.fillText('Folded at '+lb.P.toFixed(3)+' days',74,24);
  if(S.Tk>20){const n=Math.min(15000,Math.ceil(S.Tk/.0204)),dt=S.Tk/n,nb=160,sb=new Float64Array(nb),cn=new Int32Array(nb),t0=lb.t0==null?0:lb.t0;
   const fy=v=>12+(y0-v)/(y0-y1)*(H2-40);y.fillStyle='#5ee1ff2a';for(let k=0;k<n;k+=Math.ceil(n/3500)){const t=(k+.5)*dt,ph=(((t-t0)/lb.P)%1+1.5)%1-.5,f=kflux(S,t);y.fillRect(70+(ph+.5)*1040,fy(f),2,2)}
   for(let k=0;k<n;k++){const t=(k+.5)*dt,ph=(((t-t0)/lb.P)%1+1.5)%1-.5,bn=Math.min(nb-1,((ph+.5)*nb)|0);sb[bn]+=kflux(S,t);cn[bn]++}
   const mv=[];y.strokeStyle='#ffd27a';y.lineWidth=3;y.beginPath();let st=0;for(let q=0;q<nb;q++){if(!cn[q]){mv.push(1);continue}const v=sb[q]/cn[q];mv.push(v);const px=70+(q+.5)/nb*1040;st?y.lineTo(px,fy(v)):y.moveTo(px,fy(v));st=1}y.stroke();y.lineWidth=1;lb.mv=mv;
   y.fillStyle='#8aa';y.fillText('phase −0.5',70,H2-4);y.fillText('0',590,H2-4);y.fillText('+0.5',1040,H2-4)}
  else{y.fillStyle='#8aa';y.font='22px sans-serif';y.fillText('Observe at least 20 days to fold the data.',330,H2/2)}
  if(Tk<S.Tk){}
  }
 function measure(){const S=KST[sel],mv=lb.mv;if(!mv||S.Tk<20){$('kr').innerHTML='Observe longer first.';return}
  const srt=[...mv].sort((p,q)=>p-q),med=srt[mv.length>>1],mad=srt.map(v=>Math.abs(v-med)).sort((p,q)=>p-q)[mv.length>>1]*1.4826||1e-6;let mn=9,mi=0;for(let q=0;q<mv.length;q++){let s=0;for(let w=-2;w<=2;w++)s+=mv[(q+w+mv.length)%mv.length];s/=5;if(s<mn){mn=s;mi=q}}
  const dep=med-mn,snr=dep/(mad/Math.sqrt(2));const truth=S.bin?S.bin.P:S.pl[0].P,ok=Math.abs(lb.P-truth)/truth<.03;
  if(snr<4||dep<=0){$('kr').innerHTML='<b>No clear dip at this period.</b> The folded points are scattered. Adjust the period, or measure again after observing longer.';lb.res=null;return}
  const Rp=Math.sqrt(dep)*S.R/.009168,a=Math.cbrt(S.M*Math.pow(lb.P/365.25,2)),z=a<S.hz[0]?'too hot (inside the habitable zone)':a>S.hz[1]?'too cold (outside the habitable zone)':'<b style="color:#6dffa8">inside the habitable zone</b>';
  lb.res={ok,dep};$('kr').innerHTML=`${ok?'':'<b style="color:#ffb347">The fold is smeared, so these numbers may be off.</b><br>'}Dip depth: <b>${(dep*1e6).toFixed(0)} ppm</b> (${(dep*100).toFixed(2)}%)<br>Size if a planet: <b>${Rp.toFixed(1)} Earth radii</b> (R★√depth)<br>Orbit: <b>${a.toFixed(3)} AU</b> (Kepler’s third law)<br>For this star the habitable zone is ${S.hz[0].toFixed(2)} to ${S.hz[1].toFixed(2)} AU, so the orbit is ${z}.<br>${S.bin?'Look for a second, shallower dip at phase ±0.5.':''}`}
 function classify(c){const S=KST[sel];if(S.done)return;if(!lb.res||!lb.res.ok){$('kv').innerHTML='Measure a clean, aligned dip first (the period must fold the dips on top of each other).';return}
  const right=(c=='b')==!!S.bin;if(right){S.done=1;$('kv').innerHTML='<b style="color:#6dffa8">Correct.</b> '+S.r;toast(S.n+' catalogued')}else $('kv').innerHTML=S.bin?'Not quite. A planet cannot produce a second dip of a different depth at phase 0.5. Fold at the period again and compare the two dips.':'Not quite. A single, flat-bottomed dip of this size repeating at one steady period points to a planet.'}
 function tab(k){if(k==2&&sel==null){toast('Click a star marker first (or zoom in and press Enter on one)');k=1}view=k;scTab(k);insp.hide();LAB.onclick=null;HOTS.querySelectorAll('.tg').forEach(b=>b.style.display='none');
  if(k==0){op.s=insp.s;insp.show();SCP.zoom=dy=>insp.wheel(dy);$('opx').style.display='none';cam.rotation.set(0,0,0)}
  else{op.s=s;sc.attach();$('opx').style.display='block';if(k==1){LAB.style.display='block';surveyHTML()}else openPhoto()}}
 function openPhoto(){lb.zoomLo=0;lb.zoomHi=1;lb.follow=1;lb.A=lb.B=null;lb.t0=null;lb.res=null;lb.mv=null;const S=KST[sel];lb.P=Math.max(.5,S.bin?3:20);sc.slew(Math.atan2(-S.d.x,-S.d.z),Math.asin(S.d.y),3.5);labHTML();lb.setP(lb.P)}
 function surveyHTML(){LAB.style.display='block';LAB.innerHTML=`<b style="color:var(--cy);font-size:15px">Kepler Space Telescope · Survey</b><div style="${LABCSS};margin:4px 0 8px">Kepler stares at one patch of sky near Cygnus. The cyan boxes are its 21 camera modules. Scroll to zoom, drag to nudge the pointing (Kepler can only shift a few degrees), arrow keys slew. Click a numbered star to lock the photometer.</div>`+KST.map((S,k)=>`<div class="pt${S.done?' on':''}" data-k="${k}"><b>${S.done?IC.s('check',12)+' ':''}${S.n}</b> <span style="opacity:.7">mag ${S.mag}</span></div>`).join('')+`<div style="margin:8px 0"><button class="chip" id="kr90">Quarterly roll 90° (T)</button> <button class="chip" id="kfp">Footprint on/off (F)</button></div><div id="kq" style="${LABCSS}"></div>`;
  LAB.onclick=e=>{const p=e.target.closest('.pt');if(p)aim(+p.dataset.k)};$('kr90').onclick=roll90;$('kfp').onclick=()=>fp.visible=!fp.visible}
 function roll90(){sc.st.grl+=Math.PI/2;toast('Rolled 90°. Kepler did this every three months to keep its solar array facing the Sun.')}
 opUI('Kepler Space Telescope · Planet hunter','Tabs: 1 inspect the spacecraft, 2 survey the star field, 3 measure a star’s brightness. Scroll zooms everywhere.');
 scTabs(['Inspect','Survey','Photometer'],tab);
 const op0={s:insp.s,
  drag(dx,dy){view==0?insp.drag(dx,dy):sc.drag(dx,dy)},wheel(dy){view==0?insp.wheel(dy):sc.wheel(dy)},click(){},
  key(k){if(k=='1')tab(0);else if(k=='2')tab(1);else if(k=='3')tab(2);else if(view==2&&(k=='['||k==']')){sel=(sel+(k==']'?1:KST.length-1))%KST.length;openPhoto()}else if(view==0)insp.key(k);else if(k=='t')roll90();else if(k=='f'&&view==1)fp.visible=!fp.visible;else if(k=='enter'&&view==1){let bk=-1,bd=9;KST.forEach((S,q)=>{const a=S.d.angleTo(dirOf(cam.rotation.y,cam.rotation.x));if(a<bd){bd=a;bk=q}});if(bd<sc.st.fv*DEG*.3){sel=bk;tab(2)}else toast('Center a star in the crosshair first')}},
  done(){scOff()},
  upd(dt){if(view==0){insp.upd(dt);L('Inspect the spacecraft.');return}
   sc.upd(dt);pm.uniforms.zm.value=cl(Math.pow(22/sc.st.fv,.55),1,5)*R.getPixelRatio();fp.position.copy(cam.position);fp.quaternion.copy(cam.quaternion);fp.translateZ(-1);fp.scale.setScalar(1);
   tg.forEach((b,k)=>{const S=KST[k],p=sc.proj(S.d.clone().multiplyScalar(100)),vis=p.vis&&view!==2||(view==2&&k==sel&&p.vis);b.style.display=vis?'block':'none';b.classList.toggle('done',!!S.done);b.classList.toggle('on',k==sel);if(vis){b.style.left=p.x+'px';b.style.top=p.y+'px';b.lastChild.textContent=sc.st.fv<9||k==sel?S.n:''}});
   const n=KST.filter(S=>S.done).length;
   if(view==2){const S=KST[sel],hold=K(' ');if(hold&&S.Tk<1460){S.Tk=Math.min(1460,S.Tk+dt*60);lb.fs=1}
    const kt=$('kt');if(kt)kt.innerHTML=`Observed: <b>${S.Tk.toFixed(0)}</b> of 1460 days (Kepler’s 4-year prime mission). ${hold?'<span style="color:#6dffa8">Observing…</span>':'Hold <b>Space</b> to observe.'}`;
    if(hold||lb.fs){lb.fs=0;draw()}
    L('Photometer locked on <b>'+S.n+'</b>.<br>Stars catalogued: <b>'+n+'/'+KST.length+'</b>')}
   else{const q=$('kq');if(q)q.innerHTML='Stars catalogued: <b>'+n+'/'+KST.length+'</b>'+(n==KST.length?'<br><b style="color:#6dffa8">Catalogue complete. By the end of its mission, Kepler had found over 2,600 confirmed planets, showing that planets are common.</b>':'');
    L(sc.st.fv<4?'High magnification. Stars resolve into points of different brightness.':'Scroll to zoom. Click a numbered star to lock on.')}
   if(n==KST.length&&!opKepler.won){opKepler.won=1;toast('Kepler catalogue complete!')}}};
 return op0}
