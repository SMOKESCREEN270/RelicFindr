/* ---------- scope toolkit: inspector, sky camera, zoom HUD ---------- */
const SCP=$('scp'),HOTS=$('hots'),LAB=$('lab'),DEG=Math.PI/180,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const dirOf=(ya,pi)=>V(-Math.sin(ya)*Math.cos(pi),Math.sin(pi),-Math.cos(ya)*Math.cos(pi));
function scTabs(names,go){SCP.innerHTML=names.map((n,i)=>`<button data-t="${i}">${i+1} · ${n}</button>`).join('')+'<span class="sep"></span><button data-z="1" title="Zoom out">−</button><input id="zs" type="range" min="0" max="100" value="0" aria-label="Zoom"><button data-z="-1" title="Zoom in">+</button><span id="zv"></span>';SCP.style.display='flex';
 SCP.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.t!==undefined)go(+b.dataset.t);else if(b.dataset.z&&SCP.zoom)SCP.zoom(+b.dataset.z*170)};
 SCP.oninput=e=>{if(e.target.id=='zs'&&SCP.setz)SCP.setz(e.target.value/100)}}
const scTab=i=>[...SCP.querySelectorAll('[data-t]')].forEach(b=>b.classList.toggle('on',+b.dataset.t==i));
function scOff(){SCP.style.display='none';SCP.zoom=SCP.setz=null;LAB.style.display='none';LAB.innerHTML='';LAB.onclick=null;HOTS.innerHTML='';$('opx').style.display='none'}
function scZ(f,t){const z=$('zs');if(z&&document.activeElement!==z)z.value=Math.round(f*100);const v=$('zv');if(v)v.textContent=t}
const starSphere=()=>new THREE.Mesh(new THREE.SphereGeometry(140,48,24),new THREE.MeshBasicMaterial({map:TX.star,side:THREE.BackSide}));
function ctr(m){const b=new THREE.Box3().setFromObject(m),c=b.getCenter(V(0,0,0));m.position.sub(c);const g=new THREE.Group();g.add(m);return g}
const hsh=n=>{n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)};
const LABCSS='font-size:13px;line-height:1.45';

/* ---- reflection environment for metallic spacecraft materials ---- */
let ENVT=null;
function envTex(){if(ENVT)return ENVT;try{const es=new THREE.Scene(),g=new THREE.SphereGeometry(50,32,16),pos=g.attributes.position,col=new Float32Array(pos.count*3);
 for(let k=0;k<pos.count;k++){const y=pos.getY(k)/50,c=new THREE.Color();if(y<0){const u=-y;c.setRGB(.10+u*.15,.22+u*.25,.45+u*.5).multiplyScalar(.5+u*1.3)}else c.setRGB(.01,.012,.03).lerp(new THREE.Color(.12,.16,.28),Math.max(0,1-y*6));col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));es.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
 const sn=new THREE.Mesh(new THREE.SphereGeometry(5,16,8),new THREE.MeshBasicMaterial({color:new THREE.Color(14,12.5,10)}));sn.position.set(30,38,25);es.add(sn);
 const pm=new THREE.PMREMGenerator(R);ENVT=pm.fromScene(es,.02).texture;pm.dispose()}catch(e){console.warn('environment map failed',e);ENVT=null}return ENVT}
function labOff(){LAB.style.display='none';LAB.innerHTML='';LAB.onclick=null;LAB.oninput=null;LAB.onmousemove=null;LAB.onmouseleave=null;SCP.zoom=SCP.setz=null}
function blurC(c){const w=c.width,h=c.height,a=GEN.cv(40,40),x=a.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,40,40);const b=GEN.cv(w,h),y=b.getContext('2d');y.imageSmoothingQuality='high';y.drawImage(a,0,0,w,h);
 const c2=GEN.cv(14,14);c2.getContext('2d').drawImage(c,0,0,14,14);y.globalAlpha=.5;y.globalCompositeOperation='lighter';y.drawImage(c2,-w*.1,-h*.1,w*1.2,h*1.2);return b}

/* ---- 3D inspector: drag to orbit (with inertia), scroll to zoom, numbered hotspots, spec table, tool toggles ---- */
function mkInsp(i,A,o){const s=new THREE.Scene();s.add(starSphere());s.add(new THREE.HemisphereLight(0xffffff,0x445566,o.hi||.6));
 const d=new THREE.DirectionalLight(0xffffff,o.si||1.7);d.position.set(6,8,5);s.add(d);const d2=new THREE.DirectionalLight(0x88aaff,.55);d2.position.set(-6,-3,-5);s.add(d2);
 const m=models[i].clone(true),mats=[];
 if(o.real){const ev=envTex();m.traverse(n=>{if(!n.isMesh)return;const f=q=>{const c=q.clone();if(ev&&c.isMeshStandardMaterial){c.envMap=ev;c.envMapIntensity=o.real}c.userData.e0=o.real;mats.push(c);return c};n.material=Array.isArray(n.material)?n.material.map(f):f(n.material)})}
 s.add(m);const X=(o.setup&&o.setup(s,m,d,d2,mats))||{};
 const st={az:o.az0||.7,el:o.el0||.3,dist:o.dist,gd:o.dist,tgt:V(0,o.ty,0),goal:V(0,o.ty,0),sel:-1,on:0,va:0,ve:0,idle:0},P3=A.map(a=>V(...a.p));
 const bt=A.map((a,k)=>{const b=document.createElement('button');b.className='hot'+(a.hid?' hid':'');b.textContent=k+1;b.title=a.n;b.style.display='none';b.onclick=e=>{e.stopPropagation();pick(k)};HOTS.appendChild(b);return b});
 const card=()=>{LAB.style.display='block';const tl=o.tools||[];
  LAB.innerHTML=`<b style="color:var(--cy);font-size:15px">${o.title}</b><div style="opacity:.75;margin:4px 0 8px;${LABCSS}">Drag to rotate · scroll to zoom · click a numbered marker or a row below · F resets the view</div>`
  +(tl.length?'<div style="margin:2px 0 8px">'+tl.map((t,k)=>`<button class="chip${t.on&&t.on()?' on':''}" data-tool="${k}" title="${t.d||''}">${t.t} (${t.k.toUpperCase()})</button>`).join('')+'</div>':'')
  +A.map((a,k)=>`<div class="pt${k==st.sel?' on':''}" data-k="${k}"><b>${k+1}. ${a.n}</b>${k==st.sel?`<div style="margin-top:4px;${LABCSS}">${a.t}</div>`:''}</div>`).join('')
  +(o.specs?'<div style="display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin-top:10px;padding-top:8px;border-top:1px solid #ffffff22;font-size:12.5px;line-height:1.4">'+o.specs.map(q=>`<span style="opacity:.6">${q[0]}</span><span>${q[1]}</span>`).join('')+'</div>':'')
  +(o.extra?o.extra():'')
  +'<div style="opacity:.55;margin-top:8px;font-size:11px">Marker positions are approximate. Dashed markers are inside the spacecraft.</div>'};
 function pick(k){st.sel=k;st.goal.copy(P3[k]);st.gd=Math.min(st.gd,o.near);st.idle=0;card()}
 function reset(){st.sel=-1;st.goal.set(0,o.ty,0);st.gd=o.dist;card()}
 const zf=()=>1-(Math.log(st.gd)-Math.log(o.min))/(Math.log(o.max)-Math.log(o.min));
 return{s,st,reset,card,show(){st.on=1;card();LAB.onclick=e=>{const c=e.target.closest('[data-tool]');if(c){o.tools[+c.dataset.tool].fn();card();return}const p=e.target.closest('.pt');if(p)pick(+p.dataset.k)};SCP.zoom=dy=>this.wheel(dy);SCP.setz=f=>{st.gd=Math.exp(Math.log(o.max)-f*(Math.log(o.max)-Math.log(o.min)))};$('opx').style.display='none'},hide(){st.on=0;bt.forEach(b=>b.style.display='none')},
 drag(dx,dy){st.az-=dx*.008;st.el=cl(st.el+dy*.006,-1.3,1.4);if(o.smooth){st.va=cl(-dx*.48,-4,4);st.ve=cl(dy*.36,-3,3);st.idle=0}},wheel(dy){st.gd=cl(st.gd*Math.exp(dy*.0012),o.min,o.max);st.idle=0},
 key(k){if(k=='f')reset();else(o.tools||[]).forEach(t=>{if(t.k==k){t.fn();card()}})},
 upd(dt){st.idle+=dt;
  if(o.smooth){if(st.idle>.12){st.az+=st.va*dt;st.el=cl(st.el+st.ve*dt,-1.3,1.4);const k=Math.exp(-dt*3.2);st.va*=k;st.ve*=k}if(o.auto&&st.idle>4&&st.sel<0)st.az+=o.auto*dt*Math.min(1,(st.idle-4)/2)}
  const q=o.smooth?1-Math.exp(-dt*5.5):Math.min(1,dt*4);st.tgt.lerp(st.goal,q);st.dist+=(st.gd-st.dist)*q;const ce=Math.cos(st.el);cam.up.set(0,1,0);cam.position.set(st.tgt.x+Math.sin(st.az)*ce*st.dist,st.tgt.y+Math.sin(st.el)*st.dist,st.tgt.z+Math.cos(st.az)*ce*st.dist);cam.lookAt(st.tgt);
  if(cam.fov!=45){cam.fov=45;cam.updateProjectionMatrix()}
  X.upd&&X.upd(dt,st);
  bt.forEach((b,k)=>{const p=P3[k].clone().project(cam),vis=st.on&&p.z<1&&Math.abs(p.x)<1.05&&Math.abs(p.y)<1.05;b.style.display=vis?'flex':'none';if(vis){b.style.left=((p.x+1)/2*innerWidth)+'px';b.style.top=((1-p.y)/2*innerHeight)+'px'}b.classList.toggle('on',k==st.sel)});
  scZ(zf(),(o.dist/st.dist).toFixed(1)+'×')}}}

/* ---- shared sky camera state (drag grabs the sky, scroll changes field of view) ---- */
function skyCam(o){const st={ya:o.ya,pi:o.pi,fv:o.fv,gya:o.ya,gpi:o.pi,gfv:o.fv,rl:0,grl:0,tw:0,lim:o.lim||0};
 const api={st,drag(dx,dy){const a=st.fv*DEG/innerHeight;st.tw=0;st.ya+=dx*a;st.pi+=dy*a;if(o.smooth){st.vya=cl(dx*a*60,-1.5,1.5);st.vpi=cl(dy*a*60,-1.5,1.5);st.dg=.1}},wheel(dy){st.tw=0;const f=cl((o.smooth?st.gfv:st.fv)*Math.exp(dy*.0015),o.fmin,o.fmax);st.gfv=f;if(o.smooth)st.zz=1;else st.fv=f},
  slew(ya,pi,fv){st.gya=ya;st.gpi=pi;st.gfv=fv;st.tw=1},
  zf:()=>1-(Math.log(st.fv)-Math.log(o.fmin))/(Math.log(o.fmax)-Math.log(o.fmin)),
  setz(f){st.tw=0;const v=Math.exp(Math.log(o.fmax)-f*(Math.log(o.fmax)-Math.log(o.fmin)));st.gfv=v;if(o.smooth)st.zz=1;else st.fv=v},
  upd(dt,sl){sl=sl||1;if(o.smooth){st.dg=Math.max(0,(st.dg||0)-dt);if(st.dg<=0&&!st.tw){st.ya+=(st.vya||0)*dt;st.pi+=(st.vpi||0)*dt;const kk=Math.exp(-dt*4);st.vya=(st.vya||0)*kk;st.vpi=(st.vpi||0)*kk}if(st.zz&&!st.tw){st.fv+=(st.gfv-st.fv)*(1-Math.exp(-dt*9));if(Math.abs(st.gfv-st.fv)<1e-4*st.fv){st.fv=st.gfv;st.zz=0}}}const sp=st.fv*DEG*.6*dt*sl;if(K('arrowleft')||K('arrowright')||K('arrowup')||K('arrowdown'))st.tw=0;st.ya+=(K('arrowleft')-K('arrowright'))*sp;st.pi+=(K('arrowup')-K('arrowdown'))*sp;
   if(st.tw){const q=Math.min(1,dt*3*sl);st.ya+=(st.gya-st.ya)*q;st.pi+=(st.gpi-st.pi)*q;st.fv+=(st.gfv-st.fv)*q;if(Math.abs(st.gya-st.ya)+Math.abs(st.gpi-st.pi)+Math.abs(st.gfv-st.fv)<.002)st.tw=0}
   st.rl+=(st.grl-st.rl)*Math.min(1,dt*3);
   if(st.lim){st.ya=cl(st.ya,o.ya-st.lim,o.ya+st.lim);st.pi=cl(st.pi,o.pi-st.lim,o.pi+st.lim)}st.pi=cl(st.pi,-1.5,1.5);
   cam.position.set(0,0,0);cam.rotation.set(st.pi,st.ya,st.rl);if(Math.abs(cam.fov-st.fv)>1e-4){cam.fov=st.fv;cam.updateProjectionMatrix()}
   scZ(api.zf(),(o.fv0/st.fv).toFixed(1)+'×  ·  '+(st.fv<1?(st.fv*60).toFixed(0)+'′':st.fv.toFixed(1)+'°'))},
  proj(v){const p=v.clone().project(cam);return{x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight,vis:p.z<1&&p.z>-1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1}},
  attach(){SCP.zoom=dy=>api.wheel(dy);SCP.setz=f=>api.setz(f)}};return api}
function chipHTML(b,on){return`<button class="chip${on?' on':''}" ${b.k?`data-k="${b.k}"`:''}>${b.t}</button>`}
