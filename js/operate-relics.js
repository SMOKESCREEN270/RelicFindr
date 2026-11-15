/* ---------- operate the relics ---------- */
let op=null,opPrev=null;
const K=k=>keys[k]?1:0,fx=(a,n=0)=>a.toFixed(n);
function opUI(t,c){$('opui').innerHTML=`<h3 id="opui-h" style="margin:0;color:var(--cy);font-size:15px;font-weight:700">${t}</h3><div style="opacity:.75;margin:4px 0 8px">${c}</div><div id="opl"></div><div id="opc"></div>`}
const L=h=>{const e=$('opl');if(e)e.innerHTML=h};
function opScene(i){const E=EXH[i],s=new THREE.Scene();s.background=new THREE.Color(E.bg);if(!E.stars)s.fog=new THREE.Fog(E.bg,50,140);stage(s,E,120);return s}
function ring(s,x,y,z,r,col){const t=new THREE.Mesh(new THREE.TorusGeometry(r,.18,8,40),new THREE.MeshBasicMaterial({color:col}));t.position.set(x,y,z);s.add(t);return t}
function opLander(i,c){const E=EXH[i],s=opScene(i),m=models[i].clone(true);s.add(m);
const fl=new THREE.Mesh(new THREE.ConeGeometry(.9,2.6,12),new THREE.MeshBasicMaterial({color:0xffa040}));fl.rotation.x=Math.PI;fl.position.y=-.9;m.add(fl);
if(c.pad){const PR=c.padR||5.2,r=new THREE.Mesh(new THREE.RingGeometry(PR-1.4,PR,48),new THREE.MeshBasicMaterial({color:0x6dffa8,side:2}));r.rotation.x=-Math.PI/2;r.position.set(c.pad[0],.06,c.pad[1]);s.add(r);const bc=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,60,8,1,true),new THREE.MeshBasicMaterial({color:0x6dffa8,transparent:true,opacity:.28,side:2}));bc.position.set(c.pad[0],30,c.pad[1]);s.add(bc)}
const p=V(c.x0,c.alt,0),v=V(c.vx||0,c.vy0,0);let fuel=100,res=null,why='',age=0;
{const rk=M(E.k=='lm'?0x8a8a88:0x6f6a66,{roughness:1,flatShading:true});let q=(i+1)*9301;const rnd=()=>(q=(q*16807)%2147483647)/2147483647;
 for(let n=0;n<46;n++){const sz=.25+rnd()*.9,x=(rnd()*2-1)*70,z=(rnd()*2-1)*50-8;if(Math.hypot(x-(c.pad?c.pad[0]:0),z)<6)continue;const b=new THREE.Mesh(new THREE.DodecahedronGeometry(sz,0),rk);b.position.set(x,sz*.35,z);b.rotation.set(rnd()*6,rnd()*6,rnd()*6);b.scale.y=.7;b.castShadow=b.receiveShadow=true;s.add(b)}}
const px=c.x0-8,pm=new THREE.MeshBasicMaterial({color:0x5ee1ff,transparent:true,opacity:.55});
{const pole=new THREE.Mesh(new THREE.BoxGeometry(.14,c.alt,.14),pm);pole.position.set(px,c.alt/2,0);s.add(pole);
 const step=c.alt>=80?20:10;for(let a=0;a<=c.alt;a+=step){const t=new THREE.Mesh(new THREE.BoxGeometry(1.8,.14,.14),pm);t.position.set(px,a,0);s.add(t);if(a){const l2=label(a+' m','#5ee1ff');l2.scale.set(6,1.5,1);l2.position.set(px-3.6,a,0);s.add(l2)}}}
const plumb=new THREE.Mesh(new THREE.BoxGeometry(.06,1,.06),new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:.45}));s.add(plumb);
const blob=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5,depthWrite:false}));blob.rotation.x=-Math.PI/2;blob.position.y=.05;s.add(blob);
opUI(E.n+' · '+c.title,c.ctl);
return{s,key(k){if(k=='enter'&&res){p.set(c.x0,c.alt,0);v.set(c.vx||0,c.vy0,0);fuel=100;res=null;age=0}},
upd(dt){age+=dt;let th=0;if(!res){th=K(' ')&&fuel>0;if(th){v.y+=c.T*dt;fuel-=c.burn*dt}
const lx=K('d')-K('a'),lz=K('s')-K('w');if((lx||lz)&&fuel>0){v.x+=lx*c.rcs*dt;v.z+=lz*c.rcs*dt;fuel-=.6*dt}else{const dm=Math.exp(-(c.damp||.5)*dt);v.x*=dm;v.z*=dm}
v.y-=c.g*dt;p.addScaledVector(v,dt);fuel=Math.max(0,fuel);
if(p.y<=0){p.y=0;why='';const sp=-v.y,lat=Math.hypot(v.x,v.z),on=!c.pad||Math.hypot(p.x-c.pad[0],p.z-c.pad[1])<(c.padR||5.2);
if(sp>=c.vmax)why='You hit at '+fx(sp,1)+' m/s. The limit is '+c.vmax+'.';else if(lat>=(c.latmax||1.5))why='Too much sideways drift ('+fx(lat,1)+' m/s).';else if(!on)why='Missed the landing ring.';
res=why?'bad':'ok';if(res=='ok')why=c.win;v.set(0,0,0)}}
fl.visible=!!th;m.position.copy(p);plumb.scale.y=Math.max(.01,p.y);plumb.position.set(p.x,p.y/2,p.z);blob.position.x=p.x;blob.position.z=p.z;blob.material.opacity=.55*Math.max(.15,1-p.y/120);m.rotation.z=-v.x*.03;m.rotation.x=v.z*.03;
{const hh=Math.max(0,p.y),D=20+hh*.75;cam.position.set(p.x*.7,hh*.5+3,p.z+D);cam.lookAt(p.x*.7,hh*.5,p.z)}
L(`${res?'':`<div style="color:#ffd27a;margin-bottom:6px">${th?'▲ Engine firing':'▼ Free fall'}${age<10?' · Hold <b>Space</b> to slow the fall, then touch down gently.':''}</div>`}Altitude <b>${fx(p.y)}</b> m${res?'':' · impact in <b>'+fx((-(-v.y)+Math.sqrt(v.y*v.y+2*c.g*p.y))/c.g,0)+'</b> s if you do nothing'}<br>Vertical speed <b style="color:${-v.y>c.vmax?'#ff7a7a':'#6dffa8'}">${fx(v.y,1)}</b> m/s<br>Sideways speed <b style="color:${Math.hypot(v.x,v.z)>(c.latmax||1.5)?'#ff7a7a':'#6dffa8'}">${fx(Math.hypot(v.x,v.z),1)}</b> m/s (limit ${c.latmax||1.5})${c.pad?'<br>Distance to pad <b>'+fx(Math.hypot(p.x-c.pad[0],p.z-c.pad[1]))+'</b> m · follow the green beam':''}<br>Fuel <b>${fx(fuel)}%</b>${res?`<hr><b style="color:${res=='ok'?'#6dffa8':'#ff7a7a'}">${res=='ok'?'Touchdown!':'Crash.'}</b> ${why}<br>Press Enter (or Retry) to try again.`:''}`)}}}
