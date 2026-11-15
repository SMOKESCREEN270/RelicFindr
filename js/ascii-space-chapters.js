(()=>{/* ASCII space */
const cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');document.body.prepend(cv);const x=cv.getContext('2d');
let W,H,D,FS=13,CW=8,mx=-999,my=-999,sy=0,ST=[],SS=null;const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
function rs(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';x.setTransform(D,0,0,D,0,0);x.font=FS+'px ui-monospace,Menlo,Consolas,monospace';x.textBaseline='top';CW=x.measureText('M').width;
ST=Array.from({length:Math.min(420,W*H/5500|0)},()=>({x:Math.random()*W,y:Math.random()*H,c:'..·:+*'[Math.random()*6|0],p:Math.random()*6,s:.5+Math.random()*2,d:.02+Math.random()*.14}))}
const PL=[{r:12,fx:.84,fy:.2,d:.1,col:'#cfd6e6',sp:.00012,k:0},{r:9,fx:.07,fy:.6,d:.16,col:'#ff9d6c',sp:.0002,k:1},{r:8,fx:.7,fy:.9,d:.22,col:'#ffd9a0',sp:.00015,k:2,ring:1}];
const RAMP=' .:-=+*#%@';
function planet(p,t){const R=p.r*FS,cx=((p.fx*W-sy*0)%W),span=H+4*R,cy=(((p.fy*H-sy*p.d)%span)+span)%span-2*R,rot=t*p.sp;x.fillStyle=p.col;
const ring=(back)=>{if(!p.ring)return;for(let k=1.45;k<2.1;k+=.2)for(let a=0;a<6.283;a+=.045){const s=Math.sin(a);if((s<0)!==back)continue;const rx=Math.cos(a)*k*R,ry=s*k*R*.3,c=Math.cos(-.35),sn=Math.sin(-.35),X=cx+rx*c-ry*sn,Y=cy+rx*sn+ry*c;if(back&&Math.hypot(X-cx,(Y-cy))<R)continue;x.globalAlpha=.4;x.fillText('=',X,Y)}};
ring(1);const ro=Math.ceil(p.r);for(let j=-ro;j<=ro;j++){for(let i=-Math.ceil(R/CW);i<=Math.ceil(R/CW);i++){const nx=i*CW/R,ny=j*FS/R,d=nx*nx+ny*ny;if(d>1)continue;const nz=Math.sqrt(1-d),L=-.5*nx-.45*ny+.74*nz;if(L<=.02)continue;const lo=Math.atan2(nx,nz)+rot,la=Math.asin(-ny);let t2=.5+.5*(Math.sin(lo*3+la*2)*.5+Math.sin(lo*7-la*5)*.3+Math.sin(la*(p.k==2?14:9)+lo*2)*.2);if(p.k==0)t2=Math.sin(lo*11+la*7)*Math.sin(la*13-lo*5)>.55?.2:.8;const v=Math.min(1,L)*(.5+.5*t2),ch=RAMP[v*9.99|0];if(ch==' ')continue;x.globalAlpha=.25+.45*v;x.fillText(ch,cx+i*CW,cy+j*FS)}}ring(0)}
function frame(t){if(document.body.classList.contains('play')){requestAnimationFrame(frame);return}
x.clearRect(0,0,W,H);x.fillStyle='#fff';for(const s of ST){const y=(((s.y-sy*s.d)%H)+H)%H,near=Math.hypot(s.x-mx,y-my)<130;x.globalAlpha=Math.min(1,.12+.4*(.5+.5*Math.sin(t*.001*s.s+s.p))+(near?.5:0));x.fillText(near?'*':s.c,s.x,y)}
PL.forEach(p=>planet(p,t));
if(!SS&&Math.random()<.004)SS={x:Math.random()*W,y:Math.random()*H*.4,l:0};if(SS){x.fillStyle='#ffb347';for(let k=0;k<9;k++){x.globalAlpha=1-k/9;x.fillText(k?'-':'*',SS.x-k*CW*.8+SS.l*CW*.8,SS.y+(SS.l-k)*.6*FS*.35)}SS.l+=1.2;if(SS.l>60)SS=null}
x.globalAlpha=1;if(!RM)setTimeout(()=>requestAnimationFrame(frame),30)}
addEventListener('resize',rs);addEventListener('scroll',()=>{sy=scrollY},{passive:true});addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});rs();requestAnimationFrame(frame);
/* chapters */
const $=s=>document.querySelector(s);
const card=m=>`<article class="dos" style="--a:${m.c}"><div class="dh"><span class="tag">${m.t}</span><span class="st">${m.st}</span></div><h3>${m.n}</h3><blockquote>“${m.v}”<cite>IMAGINED VOICE · BASED ON REAL MISSION EVENTS</cite></blockquote><dl>${m.f.map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl><p class="lr"><b>What it taught us.</b> ${m.l}</p><details><summary>Mission timeline</summary><ol>${m.e.map(e=>`<li><time>${e[0]}</time>${e[1]}</li>`).join('')}</ol></details><a class="src" href="${m.u}" target="_blank" rel="noopener">Source: ${m.s} ${IC.s('ext',12)}</a></article>`;
const M=[
{g:'moon',c:'#cfd6e6',t:'Moon · 1971–72',st:'Parked since 1972',n:'Lunar Roving Vehicles',v:'We rode to the Moon folded flat like lawn chairs. Then we carried two people farther than anyone had ever walked.',f:[['Left on the Moon','3 (Apollo 15, 16, 17)'],['Top speed','About 13 km/h'],['Longest drive','35.9 km, Apollo 17'],['Power','Two batteries, no recharge']],l:'Driving let crews reach places far from the lander and bring back rocks from many settings, including the orange soil at Shorty crater on Apollo 17.',e:[['31 Jul 1971','Apollo 15 drives the first rover at Hadley–Apennine.'],['Apr 1972','Apollo 16 uses a rover in the Descartes Highlands.'],['Dec 1972','Apollo 17 drives the farthest of all.'],['Each mission','The rover’s TV camera, steered from Earth, films the liftoff, and the rover is left behind.']],u:'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',s:'NSSDCA'},
{g:'moon',c:'#9fd0ff',t:'Moon · 1969–77',st:'Switched off 30 Sep 1977',n:'ALSEP science stations',v:'The astronauts went home. We stayed behind and listened to the Moon.',f:[['Full stations','5 (Apollo 12, 14, 15, 16, 17)'],['Power','Plutonium-238 generator'],['Instruments','Seismometers, magnetometers, heat probes'],['Still useful','Laser reflectors (Apollo 11, 14, 15)']],l:'Seismometers showed the Moon rings after impacts and has moonquakes. The reflectors let scientists measure that the Moon drifts away from Earth about 3.8 cm each year.',e:[['Jul 1969','Apollo 11 leaves a small package with a seismometer and a laser reflector.'],['Nov 1969','Apollo 12 sets up the first full ALSEP.'],['1971–72','Apollo 14, 15, 16 and 17 add four more stations.'],['30 Sep 1977','The stations are switched off by command from Earth.'],['Today','Observatories still bounce lasers off the reflectors.']],u:'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',s:'NSSDCA'},
{g:'moon',c:'#b9ffcf',t:'Moon · 1967',st:'Visited by astronauts, 1969',n:'Surveyor 3',v:'I bounced twice before I settled on a crater slope. Two and a half years later, visitors walked up to me.',f:[['Landed','20 Apr 1967, Ocean of Storms'],['Job','Prove a soft landing and test the soil'],['Visited','Apollo 12, about 160 m away'],['Brought home','Its camera and other parts']],l:'Its scoop and pictures showed the ground was firm enough for astronauts. Parts returned to Earth showed how materials aged over 31 months on the Moon.',e:[['20 Apr 1967','Touches down, bounces twice and comes to rest.'],['1967','Sends thousands of pictures and digs trenches with its scoop.'],['19 Nov 1969','Apollo 12 astronauts Pete Conrad and Alan Bean walk to it.'],['After','Pieces of it are carried back to Earth.']],u:'https://science.nasa.gov/mission/surveyor-3/',s:'NASA Science'},
{g:'deep',c:'#d6c9ff',t:'Asteroid belt · 2018',st:'Silent, circling Ceres',n:'Dawn',v:'I ran out of the fuel I use to point myself. So I fell quiet, but I am still circling Ceres.',f:[['Launched','27 Sep 2007'],['A first','Orbited two worlds: Vesta then Ceres'],['Engine','Ion thrusters using xenon'],['Last contact','1 Nov 2018']],l:'Vesta and Ceres are leftover building blocks from the early solar system. Dawn found bright salt deposits on Ceres that point to briny water in its past.',e:[['27 Sep 2007','Launches toward the asteroid belt.'],['Jul 2011','Enters orbit around Vesta.'],['Mar 2015','Reaches Ceres.'],['1 Nov 2018','Out of fuel, NASA ends the mission. Dawn stays in orbit for at least 20 years.']],u:'https://science.nasa.gov/mission/dawn/',s:'NASA Science'},
{g:'deep',c:'#ffe29a',t:'Deep space · 1972–2003',st:'Silent, heading outward',n:'Pioneer 10 and 11',v:'We carry a small gold plaque. It says where we came from, in case anyone finds it.',f:[['Pioneer 10','First through the asteroid belt and first at Jupiter'],['Pioneer 11','First flyby of Saturn, 1979'],['Last signals','Pioneer 10: 23 Jan 2003 · Pioneer 11: 1995'],['Carries','A gold plaque with a message']],l:'They measured Jupiter’s harsh radiation, which helped engineers protect later spacecraft such as Voyager.',e:[['Mar 1972','Pioneer 10 launches.'],['Apr 1973','Pioneer 11 launches.'],['Dec 1973','Pioneer 10 flies past Jupiter.'],['Sep 1979','Pioneer 11 flies past Saturn.'],['23 Jan 2003','Pioneer 10 sends its last signal.']],u:'https://science.nasa.gov/mission/pioneer-10/',s:'NASA Science'},
{g:'mars',c:'#ff9d6c',t:'Mars · 1997',st:'Silent since Sep 1997',n:'Sojourner and Pathfinder',v:'I was the size of a microwave oven, and I had to learn to drive on a planet that was not on my side of the radio link.',f:[['Landed','4 Jul 1997, Ares Vallis'],['Rover mass','About 10.6 kg'],['Landing','Airbags bounced it to a stop'],['Lander lifetime','83 sols, well beyond plan']],l:'It proved low-cost airbag landings and small rovers work. Its instrument measured rock chemistry, and the site showed signs of ancient floods.',e:[['4 Jul 1997','Pathfinder lands, bouncing on airbags.'],['Jul 1997','Sojourner rolls out and studies nearby rocks.'],['27 Sep 1997','The lander sends its last signal.']],u:'https://science.nasa.gov/mission/mars-pathfinder/',s:'NASA Science'},
{g:'mars',c:'#9be7ff',t:'Mars · 2008',st:'Lost to polar winter, Nov 2008',n:'Phoenix',v:'I dug into the Arctic soil and found the ice that scientists had predicted.',f:[['Landed','25 May 2008, northern plains'],['Tool','A robotic arm with a scoop'],['Found','Water ice and perchlorate salts'],['Last contact','2 Nov 2008']],l:'It confirmed that water ice lies just under the soil in the far north, and it measured soil chemistry that matters for whether life could live there.',e:[['4 Aug 2007','Launches.'],['25 May 2008','Lands in the Martian arctic.'],['Jun 2008','Digs up bright chunks that vanish: ice.'],['2 Nov 2008','Contact ends as winter sunlight fades.']],u:'https://nssdc.gsfc.nasa.gov/',s:'NSSDCA'},
{g:'mars',c:'#ffc58a',t:'Mars · 2018–2022',st:'Ended 21 Dec 2022',n:'InSight',v:'For four years I listened to a planet’s heartbeat, until dust covered my sun.',f:[['Landed','26 Nov 2018, Elysium Planitia'],['Instrument','SEIS seismometer'],['Detected','1,300+ marsquakes'],['Ended','Declared over on 21 Dec 2022']],l:'Quake waves revealed the thickness of Mars’s crust and a liquid core about 1,800 km in radius. InSight also heard meteorite impacts.',e:[['5 May 2018','Launches.'],['26 Nov 2018','Lands in Elysium Planitia.'],['2019','Records its first marsquake.'],['4 May 2022','Records its biggest quake, about magnitude 5.'],['21 Dec 2022','NASA ends the mission as power runs out.']],u:'https://science.nasa.gov/mission/insight/',s:'NASA Science'}];
const MO=[['Apollo 11','Tranquility Base · 20 Jul 1969',.67,23.47,['Descent stage of the lander Eagle','A small seismometer and a laser reflector','A commemorative plaque on the lander leg']],['Apollo 12','Ocean of Storms · 19 Nov 1969',-3.01,-23.42,['Descent stage of Intrepid','The first full ALSEP station','Surveyor 3 lies about 160 m away']],['Apollo 14','Fra Mauro · 5 Feb 1971',-3.65,-17.47,['Descent stage of Antares','An ALSEP station and a laser reflector']],['Apollo 15','Hadley–Apennine · 30 Jul 1971',26.13,3.63,['Descent stage of Falcon','Lunar Roving Vehicle 1','An ALSEP station and a laser reflector']],['Apollo 16','Descartes Highlands · 21 Apr 1972',-8.97,15.5,['Descent stage of Orion','Lunar Roving Vehicle 2','An ALSEP station']],['Apollo 17','Taurus–Littrow · 11 Dec 1972',20.19,30.77,['Descent stage of Challenger','Lunar Roving Vehicle 3','An ALSEP station and a plaque']],['Surveyor 3','Ocean of Storms · 20 Apr 1967',-6.5,-27.5,['The Surveyor 3 lander (its camera was taken home)','Drawn slightly apart from Apollo 12 so both can be tapped']]];
const MA=[['Viking 1','Chryse Planitia',22.7,-48,'20 Jul 1976 to Nov 1982','The first U.S. lander to work on Mars. It photographed a rust-red desert and tested soil for life.'],['Viking 2','Utopia Planitia',48,-134,'3 Sep 1976 to Apr 1980','It watched frost form on the ground in winter.'],['Sojourner + Pathfinder','Ares Vallis',19.1,-33.2,'4 Jul 1997 to 27 Sep 1997','The first rover on Mars, in an ancient flood channel.'],['Spirit','Gusev crater',-14.6,175.5,'4 Jan 2004 to Mar 2010','Found silica-rich deposits that suggest ancient hot water.'],['Opportunity','Meridiani Planum',-1.9,-5.5,'25 Jan 2004 to Jun 2018','Found minerals that formed in water. A dust storm ended its mission.'],['Phoenix','Vastitas Borealis',68.2,-125.7,'25 May 2008 to Nov 2008','Dug up water ice in the far north.'],['InSight','Elysium Planitia',4.5,135.6,'26 Nov 2018 to 21 Dec 2022','Listened to marsquakes to map the planet’s insides.'],['Ingenuity','Jezero crater',18.4,77.5,'Feb 2021 to Jan 2024','The first powered flight on another planet.']];
const cs=Math.cos,sn=Math.sin,rd=Math.PI/180;
/* ===== interactive planets: procedural globe, rotation, markers, speech boxes ===== */
const MOS=MO.map((s,i)=>({n:s[0],place:s[1],lat:s[2],lon:s[3],items:s[4],ic:s[0]=='Surveyor 3'?'lander':'flag',lb:s[0].replace('Apollo ','A').replace('Surveyor ','S')}));
/* nudge crowded markers apart so each one has a full-size tap target */
MOS[1].lon=-26;MOS[2].lon=-14;MOS[6].lat=-10;MOS[6].lon=-33;
const MAI=['lander','lander','bot','bot','bot','lander','radio','heli'],MAL=['Viking 1','Viking 2','Sojourner','Spirit','Opportunity','Phoenix','InSight','Ingenuity'];
const MAS=MA.map((s,i)=>({n:s[0],place:s[1],lat:s[2],lon:s[3],dates:s[4],txt:s[5],ic:MAI[i],lb:MAL[i]}));
const bubMoon=s=>`<div class="sbh">${IC.s('flag',14)}<span>Left behind here</span></div><h4>${s.n}</h4><div class="sbs">${s.place}</div><ul>${s.items.map(q=>`<li>${q}</li>`).join('')}</ul>`;
const bubMars=s=>`<div class="sbh">${IC.s(s.ic,14)}<span>Resting place</span></div><h4>${s.n}</h4><div class="sbs">${s.place} · ${Math.abs(s.lat)}°${s.lat<0?'S':'N'}, ${Math.abs(s.lon)}°${s.lon<0?'W':'E'}</div><p class="sbd">${s.dates}</p><p>${s.txt}</p>`;
const plan=(id,kind,sites,ph,nm)=>`<div class="plan" id="pl-${id}" data-k="${kind}"><div class="pbox"><div class="pph"></div><canvas role="img" aria-label="Rotating globe of ${nm} with markers"></canvas>${sites.map((s,i)=>`<button class="pin" data-i="${i}" aria-label="${s.n}, ${s.place}"><b>${IC.s(s.ic,15)}</b><em>${s.lb}</em></button>`).join('')}</div><p class="phint">${IC.s('pointer',14)}<span>${ph}</span></p><div class="pchips">${sites.map((s,i)=>`<button class="pchip" data-i="${i}">${IC.s(s.ic,14)}<span>${s.n}</span></button>`).join('')}<button class="ppb" aria-pressed="false">${IC.s('pause',14)}<span>Pause</span></button></div></div>`;

function initPlanets(){
const TAU=Math.PI*2,PI=Math.PI,DG=PI/180;
const cl01=(v,a,b)=>v<a?a:v>b?b:v;
const ss=(a,b,v)=>{const t=cl01((v-a)/(b-a),0,1);return t*t*(3-2*t)};
const rng=s=>()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=(t+Math.imul(t^t>>>7,61|t))^t;return((t^t>>>14)>>>0)/4294967296};
const hs=(x,y,z,s)=>{let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,1274126177)+Math.imul(s,1103515245))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296};
const vn=(x,y,z,s)=>{const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),fx=x-xi,fy=y-yi,fz=z-zi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);
const a=hs(xi,yi,zi,s),b=hs(xi+1,yi,zi,s),c=hs(xi,yi+1,zi,s),d=hs(xi+1,yi+1,zi,s),e=hs(xi,yi,zi+1,s),f=hs(xi+1,yi,zi+1,s),g=hs(xi,yi+1,zi+1,s),h=hs(xi+1,yi+1,zi+1,s);
const x0=a+(b-a)*u,x1=c+(d-c)*u,x2=e+(f-e)*u,x3=g+(h-g)*u,y0=x0+(x1-x0)*v,y1=x2+(x3-x2)*v;return y0+(y1-y0)*w};
const fbm=(x,y,z,o,s)=>{let a=.5,f=1,t=0,n=0;for(let i=0;i<o;i++){t+=a*vn(x*f,y*f,z*f,s+i*7);n+=a;a*=.5;f*=2.03}return t/n};

/* ---------- procedural surface (albedo + height), equirectangular, seamless ---------- */
const MARIA=[[33,-16,17,1,.5,1],[28,18,10.5,1,.4,1],[8.5,31,12,1,.7,0],[17,59,7.5,1,.3,1],[-7.5,51,9,.95,.6,0],[-15,34,5,.9,.3,1],[-21,-16,11,.95,.6,0],[-24,-39,6,.95,.3,1],[18,-55,22,.92,.9,0],[-10,-23,5,.9,.4,0],[13,3,6,.85,.4,0],[56,-22,6,.8,.9,0],[59,-4,6,.8,.9,0],[57,16,5,.75,.9,0],[-4,-62,4,.8,.4,0],[2,-33,6,.6,.6,0]];
const MDARK=[[9,69,11,1,.5],[48,-22,20,.9,.8],[45,110,14,.5,.8],[-26,-90,9,.7,.5],[-35,-150,16,.9,.6],[-25,145,15,.95,.6],[-15,95,9,.8,.5],[-2,-5,8,.7,.5],[-10,-25,8,.6,.5],[-52,-100,10,.6,.7],[65,-100,18,.5,.8],[-20,115,8,.6,.6],[-28,-45,9,.7,.6],[5,-160,10,.4,.8]];
const MBRIGHT=[[-42,70,17,1,.3],[-50,-43,8,.9,.3],[22,20,16,.7,.9],[25,150,10,.5,.6],[10,-155,12,.7,.8],[0,-100,20,.4,.8]];
const mkBlobs=a=>a.map(b=>({s:Math.sin(b[0]*DG),c:Math.cos(b[0]*DG),sl:Math.sin(b[1]*DG),cl:Math.cos(b[1]*DG),r:b[2]*DG,cr:Math.cos(b[2]*DG*1.8),k:b[3],nz:b[4]*1.1,ring:b[5]||0}));
const MRC=[[0,[40,18,12]],[.28,[104,46,26]],[.5,[162,80,44]],[.7,[200,124,76]],[.86,[224,164,112]],[1,[248,242,236]]];
const LUT=new Array(1025);for(let i=0;i<=1024;i++){const a=i/1024;let k=1;while(k<MRC.length-1&&a>MRC[k][0])k++;const p=MRC[k-1],q=MRC[k],t=cl01((a-p[0])/(q[0]-p[0]),0,1);LUT[i]=[0,1,2].map(j=>p[1][j]+(q[1][j]-p[1][j])*t)}

function build(kind){
const moon=kind=='moon',W=1024,H=512,N=W*H,hg=new Float32Array(N),al=new Float32Array(N),mk=new Float32Array(N),tn=new Float32Array(N);
const R=rng(moon?5:9);
const sl=new Float32Array(H),cl=new Float32Array(H),sx=new Float32Array(W),cx=new Float32Array(W);
for(let y=0;y<H;y++){const p=(.5-(y+.5)/H)*PI;sl[y]=Math.sin(p);cl[y]=Math.cos(p)}
for(let x=0;x<W;x++){const l=((x+.5)/W-.5)*TAU;sx[x]=Math.sin(l);cx[x]=Math.cos(l)}
const dark=mkBlobs(moon?MARIA:MDARK),bright=moon?[]:mkBlobs(MBRIGHT);
const inf=(bl,sp,cp,x,nb,n2)=>{let m=0,rg=0;for(const b of bl){const dot=sp*b.s+cp*b.c*(cx[x]*b.cl+sx[x]*b.sl);if(dot<b.cr)continue;const d=Math.acos(dot>1?1:dot),v=1-d/b.r+(nb-.5)*b.nz*1.9+(n2-.5)*.32,q=ss(0,.3,v)*b.k;if(q>m)m=q;if(b.ring){const g=d/b.r;rg+=Math.exp(-Math.pow((g-1.02)/.1,2))}}return[m,rg]};
for(let y=0;y<H;y++){const sp=sl[y],cp=cl[y];for(let x=0;x<W;x++){const i=y*W+x,px=cp*sx[x],py=sp,pz=cp*cx[x];
const n1=fbm(px*3,py*3,pz*3,4,1),n2=fbm(px*14+9,py*14,pz*14,3,2),nb=fbm(px*4+3,py*4+3,pz*4,3,3),n3=vn(px*46,py*46,pz*46,4);
const dm=inf(dark,sp,cp,x,nb,n2),m=dm[0];mk[i]=m;tn[i]=n2;
if(moon){const hi=.6+(n1-.5)*.42+(n2-.5)*.2+(n3-.5)*.1,ma=.25+(n2-.5)*.16+(n1-.5)*.1+(n3-.5)*.05;al[i]=hi+(ma-hi)*m;hg[i]=((n1-.5)*.0042+(nb-.5)*.0016)*(1-.75*m)-.0012*m+dm[1]*.0042}
else{const bm=inf(bright,sp,cp,x,nb,n2)[0];al[i]=cl01(.5+(n1-.5)*.36+(n2-.5)*.2+(n3-.5)*.1-m*(.24+.14*n2)+.22*bm,.05,.86);hg[i]=(n1-.5)*.0035+(nb-.5)*.0012}}}
/* stamp a radially symmetric feature */
const stamp=(lat,lon,r,fn)=>{const c0=Math.cos(lat),ry=Math.ceil(r/(PI/H))+1,y0=((.5-lat/PI)*H)|0,rx=Math.min(W>>1,Math.ceil(r/Math.max(c0,.12)/(TAU/W))+1),x0=((lon/TAU+.5)*W)|0;
for(let dy=-ry;dy<=ry;dy++){const y=y0+dy;if(y<0||y>=H)continue;const cm=(cl[y]+c0)/2,dla=dy*(PI/H);for(let dx=-rx;dx<=rx;dx++){let x=(x0+dx)%W;if(x<0)x+=W;const t=Math.hypot(dx*(TAU/W)*cm,dla)/r;if(t>1.8)continue;fn(y*W+x,t)}}};
const crater=(lat,lon,r,o)=>{o=o||{};const dp=(o.d||1)*.2*r,rm=.07*r;stamp(lat,lon,r*1.9,(i,t)=>{const u=t*1.9;let h=0,a=0;
if(u<1){if(o.flat){h=-dp*.35*(1-Math.pow(u,6))}else{h=-dp*(1-Math.pow(u,2.3));if(r>.028)h+=dp*.45*Math.exp(-(u*u)/.015)}a-=(o.f==null?.035:o.f)*(1-u*u)}
h+=rm*Math.exp(-Math.pow((u-1)/.17,2));if(u>1)h+=rm*.3*Math.exp(-(u-1)*3.5);if(o.b)a+=o.b*Math.exp(-u*1.5);hg[i]+=h;al[i]+=a})};
if(!moon){/* Mars: volcanoes, basins, canyon */
const cone=(lat,lon,r,ht,alb)=>stamp(lat*DG,lon*DG,r,(i,t)=>{if(t<1){hg[i]+=ht*(1-.55*t*t);al[i]+=alb}else hg[i]+=ht*.45*Math.exp(-(t-1)*9)});
stamp(2*DG,-105*DG,.42,(i,t)=>{const k=1-ss(0,1,t);hg[i]+=.0035*k;al[i]+=.07*k});
cone(18.6,-133.8,.1,.0075,.05);cone(-9.1,-120.6,.05,.004,.03);cone(1.1,-113.4,.05,.004,.03);cone(11.8,-104.5,.05,.004,.03);cone(25,147,.05,.0035,.03);
stamp(-42*DG,70*DG,.3,(i,t)=>{hg[i]-=.0045*(1-ss(0,1,t))});stamp(-50*DG,-43*DG,.12,(i,t)=>{hg[i]-=.003*(1-ss(0,1,t))});
const vm=[[-7,-98],[-9,-92],[-10.5,-86],[-12,-80],[-12.5,-74],[-13,-68],[-12.5,-62],[-11,-56],[-9,-51],[-7.5,-47]],tr=new Float32Array(N);
for(let k=0;k<vm.length-1;k++)for(let q=0;q<4;q++){const f=q/4,la=vm[k][0]+(vm[k+1][0]-vm[k][0])*f,lo=vm[k][1]+(vm[k+1][1]-vm[k][1])*f;stamp(la*DG,lo*DG,.034,(i,t)=>{const d=1-ss(.55,1,t);if(d>tr[i])tr[i]=d})}
for(let i=0;i<N;i++)if(tr[i]>0){hg[i]-=.0045*tr[i];al[i]-=.13*tr[i]}}
/* craters */
const nC=moon?3800:1100,cp0=[];
if(moon){[[-43.3,-11.4,.038,{b:.3,d:1.1}],[9.7,-20.1,.036,{b:.24}],[8.1,-38,.026,{b:.2}],[23.7,-47.4,.028,{b:.32}],[51.6,-9.3,.03,{flat:1,f:.22}],[-5.2,-68.3,.05,{flat:1,f:.2}],[-58.8,-14.4,.065,{f:.03}],[-9.3,-1.9,.045,{flat:1,f:.1}],[29.7,-4,.03,{flat:1,f:.2}],[14.5,-11.3,.02,{b:.08}],[-8.9,60.9,.034,{b:.1}],[-25.3,60.4,.044,{}],[-11.4,26.4,.03,{b:.12}],[-16,-3,.03,{}],[-30,-5,.032,{b:.06}],[-63,-60,.05,{}],[40,-32,.02,{b:.14}]].forEach(c=>crater(c[0]*DG,c[1]*DG,c[2],c[3]))}
else{[[-5.4,137.8,.014,{}],[-14.5,175.4,.026,{flat:1,f:.05}],[-14,55,.05,{}],[-3,17,.042,{}],[-70,-5,.06,{}],[40,-170,.05,{}]].forEach(c=>crater(c[0]*DG,c[1]*DG,c[2],c[3]))}
for(let k=0;k<nC;k++){const u=R();let r=.0058*Math.pow(1-u*.985,-.62);if(r>.06)r=.06*(.35+R()*.6);const lat=Math.asin(2*R()-1),lon=(R()*2-1)*PI;
if(moon){const m=mk[Math.min(H-1,Math.max(0,((.5-lat/PI)*H)|0))*W+(((lon/TAU+.5)*W)|0)];if(m>.4&&R()<.8)continue}
crater(lat,lon,r,{d:.6+R()*.8,b:R()<.07?.1+R()*.12:0})}
/* bright ejecta rays (Moon) */
if(moon){[[-43.3,-11.4,.95,.5,3],[9.7,-20.1,.55,.34,5],[8.1,-38,.3,.25,7],[23.7,-47.4,.3,.25,9]].forEach(s=>{const la=s[0]*DG,lo=s[1]*DG,sS=Math.sin(la),cS=Math.cos(la),mx=Math.cos(s[2]),k0=s[3],sd=s[4];
for(let y=0;y<H;y++){const sp=sl[y],cp=cl[y];for(let x=0;x<W;x++){const dl=((x+.5)/W-.5)*TAU-lo,cd=Math.cos(dl),dot=sp*sS+cp*cS*cd;if(dot<mx)continue;const d=Math.acos(dot>1?1:dot),b=Math.atan2(Math.sin(dl)*cp,cS*sp-sS*cp*cd),q=vn(Math.cos(b)*4.2+sd,Math.sin(b)*4.2,sd*1.7,sd),ray=ss(.5,.78,q),f=Math.exp(-d/(s[2]*.5))*ss(.03,.07,d);al[y*W+x]+=k0*ray*f*.55}}})}
/* polar caps (Mars) */
if(!moon){for(let y=0;y<H;y++){const la=Math.asin(sl[y])/DG;if(Math.abs(la)<73)continue;for(let x=0;x<W;x++){const nb=fbm(cl[y]*sx[x]*5,sl[y]*5,cl[y]*cx[x]*5,3,6),e=la>0?79+(nb-.5)*8:-82-(nb-.5)*6,c=la>0?ss(e,e+2.5,la):ss(-e,-e+2.5,-la);if(c>0){const i=y*W+x;al[i]=al[i]+(1-al[i])*c;hg[i]+=.0004*c}}}}
/* gradients for relief shading */
const gE=new Float32Array(N),gN=new Float32Array(N);
for(let y=0;y<H;y++){const cp=Math.max(cl[y],.18),ke=1/(2*(TAU/W)*cp),kn=1/(2*(PI/H)),ym=Math.max(y-1,0),yp=Math.min(y+1,H-1);for(let x=0;x<W;x++){const xm=(x-1+W)%W,xp=(x+1)%W,i=y*W+x;gE[i]=cl01((hg[y*W+xp]-hg[y*W+xm])*ke,-1.6,1.6);gN[i]=cl01((hg[ym*W+x]-hg[yp*W+x])*kn,-1.6,1.6)}}
/* colour */
const col=new Uint32Array(N);
for(let i=0;i<N;i++){let a=al[i];if(a<0)a=0;if(a>1)a=1;let r,g,b;
if(moon){const t=Math.pow(a,.95)*255,m=mk[i];r=t*(1-m*.03);g=t*.985;b=t*(.96+m*.06)}
else{const c=LUT[(a*1024)|0],v=tn[i]-.5;r=c[0]*(1+v*.1);g=c[1];b=c[2]*(1-v*.14)}
col[i]=(255<<24)|((b>255?255:b)<<16)|((g>255?255:g)<<8)|(r>255?255:r)}
return{W,H,col,gE,gN}}

/* ---------- loop manager ---------- */
const ps=[];let run=false;
function tick(t){run=false;let any=false;for(const p of ps)if(p.vis&&p.ready){any=true;p.step(t)}if(any&&!document.hidden){run=true;requestAnimationFrame(tick)}}
function kick(){if(!run){run=true;requestAnimationFrame(tick)}}
document.addEventListener('visibilitychange',kick);

/* ---------- planet ---------- */
function Planet(root,cfg){
const box=root.querySelector('.pbox'),cv=box.querySelector('canvas'),pins=[...box.querySelectorAll('.pin')],chips=[...root.querySelectorAll('.pchip')],pb=root.querySelector('.ppb');
const N=600,ctx=cv.getContext('2d');cv.width=cv.height=N;
const img=ctx.createImageData(N,N),u32=new Uint32Array(img.data.buffer);
const S=cfg.sites,tilt=cfg.tilt*DG,ct=Math.cos(tilt),st=Math.sin(tilt);
let tex=null,cnt=0,pix,ty,lon0,base,eL,nL,al8,hz;
let rot=0,hover=false,lock=false,sel=-1,hov=-1,tw=null,dirty=true,shown=-2,lt=0;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,speed=reduce?0:cfg.speed;
const bub=document.createElement('div');bub.className='sbx';bub.setAttribute('role','status');box.appendChild(bub);
const me={vis:false,ready:false,busy:false};ps.push(me);
function prep(){const n2=N*N;pix=new Int32Array(n2);ty=new Int16Array(n2);lon0=new Float32Array(n2);base=new Float32Array(n2);eL=new Float32Array(n2);nL=new Float32Array(n2);al8=new Uint8Array(n2);hz=new Float32Array(n2);
const Lx=-.62,Ly=.3,Lz=.72,ll=Math.hypot(Lx,Ly,Lz),lx=Lx/ll,ly=Ly/ll,lz=Lz/ll,h=N/2,Hh=tex.H;let c=0;
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i+.5-h)/h,y=-(j+.5-h)/h,d2=x*x+y*y;if(d2>1.02)continue;const d=Math.sqrt(d2),aa=cl01((1-d)*h+.5,0,1);if(aa<=0)continue;
let vx=x,vy=y,vz=Math.sqrt(Math.max(0,1-d2));if(d>1){vx/=d;vy/=d;vz=0}
const xp=vx,yp=vy*ct+vz*st,zp=-vy*st+vz*ct,ph=Math.asin(cl01(yp,-1,1)),lm=Math.atan2(xp,zp),cph=Math.cos(ph),sph=Math.sin(ph),sn2=Math.sin(lm),cs2=Math.cos(lm);
const ey=0,ez=-sn2,ny=cph,nz=-sph*cs2,Ex=cs2,Ey=ey*ct-ez*st,Ez=ey*st+ez*ct,Nx=-sph*sn2,Ny=ny*ct-nz*st,Nz=ny*st+nz*ct;
pix[c]=j*N+i;lon0[c]=lm;ty[c]=Math.min(Hh-1,Math.max(0,((.5-ph/PI)*Hh)|0));base[c]=vx*lx+vy*ly+vz*lz;eL[c]=Ex*lx+Ey*ly+Ez*lz;nL[c]=Nx*lx+Ny*ly+Nz*lz;al8[c]=(aa*255)|0;hz[c]=Math.pow(1-vz,3);c++}
cnt=c}
function render(){const W=tex.W,col=tex.col,gE=tex.gE,gN=tex.gN,gain=cfg.gain,amb=cfg.amb,hzc=cfg.haze,ir=1/TAU;
for(let k=0;k<cnt;k++){let u=(lon0[k]-rot)*ir+.5;u-=Math.floor(u);const idx=ty[k]*W+((u*W)|0),c=col[idx];let l=base[k]-gain*(gE[idx]*eL[k]+gN[idx]*nL[k]);l=l<0?0:l;l=amb+(1-amb)*l*1.1;
const hh=hz[k]*hzc;let r=(c&255)*l+hh*90,g=((c>>8)&255)*l+hh*46,b=((c>>16)&255)*l+hh*22;if(r>255)r=255;if(g>255)g=255;if(b>255)b=255;u32[pix[k]]=(al8[k]<<24)|(b<<16)|(g<<8)|r}
ctx.putImageData(img,0,0)}
function proj(s){const lm=s.lon*DG+rot,ph=s.lat*DG,cp=Math.cos(ph),xp=cp*Math.sin(lm),yp=Math.sin(ph),zp=cp*Math.cos(lm);return{x:xp,y:yp*ct-zp*st,z:yp*st+zp*ct}}
function place(i){const p=proj(S[i]),bw=bub.offsetWidth,bh=bub.offsetHeight,bx=box.getBoundingClientRect(),px=(.5+.5*p.x)*bx.width,py=(.5-.5*p.y)*bx.height;let top=py-bh-28,below=false;if(bx.top+top<8){top=py+28;below=true}
const ab=cl01(bx.left+px-bw/2,8,Math.max(8,innerWidth-bw-8)),left=ab-bx.left;bub.style.left=left+'px';bub.style.top=top+'px';bub.style.setProperty('--tx',cl01(px-left,24,bw-24)+'px');bub.classList.toggle('dn',below)}
function showBubble(){const i=hov>=0?hov:sel;if(i!==shown){shown=i;pins.forEach((p,k)=>p.classList.toggle('on',k==i));chips.forEach((c,k)=>c.classList.toggle('on',k==i));if(i>=0)bub.innerHTML=cfg.html(S[i]);bub.classList.toggle('on',i>=0)}if(i>=0)place(i)}
function layout(){pins.forEach((el,i)=>{const p=proj(S[i]);el.style.left=(50+50*p.x)+'%';el.style.top=(50-50*p.y)+'%';el.style.opacity=cl01(p.z/.18,0,1);el.style.pointerEvents=p.z>.1?'auto':'none';el.tabIndex=p.z>.1?0:-1;el.style.visibility=p.z>.01?'visible':'hidden'});showBubble()}
function setPB(){pb.setAttribute('aria-pressed',lock);pb.innerHTML=IC.s(lock?'play':'pause',14)+'<span>'+(lock?'Rotate':'Pause')+'</span>'}
me.step=t=>{if(t-lt<26)return;const dt=Math.min(.1,(t-lt)/1000);lt=t;let mv=false;
if(tw){const k=cl01((t-tw.t0)/tw.d,0,1),e=1-Math.pow(1-k,3);rot=tw.a+(tw.b-tw.a)*e;mv=true;if(k>=1)tw=null}
else if(!(hover||lock||sel>=0||hov>=0)&&speed){rot+=speed*dt;if(rot>TAU)rot-=TAU;mv=true}
if(mv||dirty){render();layout();dirty=false}};
function wake(){dirty=true;kick()}
function goTo(i){const tgt=-S[i].lon*DG;const d=(((tgt-rot)%TAU)+TAU+PI)%TAU-PI;tw={a:rot,b:rot+d,t0:performance.now(),d:900};sel=i;hov=-1;wake();window.RS&&RS.chime()}
const touch=e=>e.pointerType==='touch';
box.addEventListener('pointerenter',e=>{if(!touch(e)){hover=true;wake()}});
box.addEventListener('pointerleave',()=>{hover=false;hov=-1;wake()});
pins.forEach((el,i)=>{el.addEventListener('pointerenter',e=>{if(!touch(e)){hov=i;wake()}});el.addEventListener('pointerleave',()=>{if(hov===i){hov=-1;wake()}});
el.addEventListener('focus',()=>{hov=i;wake()});el.addEventListener('blur',()=>{if(hov===i){hov=-1;wake()}});
el.addEventListener('click',e=>{e.stopPropagation();tw=null;sel=sel===i?-1:i;wake();window.RS&&RS.chime()})});
cv.addEventListener('click',()=>{if(sel>=0)sel=-1;else lock=!lock;setPB();wake()});
chips.forEach((c,i)=>c.addEventListener('click',e=>{e.stopPropagation();goTo(i)}));
pb.addEventListener('click',e=>{e.stopPropagation();lock=!lock;if(!lock)sel=-1;setPB();wake()});
document.addEventListener('click',e=>{if(sel>=0&&!root.contains(e.target)){sel=-1;wake()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(sel>=0||lock)){sel=-1;lock=false;setPB();wake()}});
addEventListener('resize',()=>{if(me.ready)wake()});
function ensure(){if(me.ready||me.busy)return;me.busy=true;setTimeout(()=>{tex=build(cfg.kind);prep();render();layout();root.classList.add('rdy');me.ready=true;kick()},40)}
new IntersectionObserver(es=>es.forEach(e=>{me.vis=e.isIntersecting;if(me.vis){ensure();kick()}}),{rootMargin:'300px'}).observe(root)}

const mo=document.getElementById('pl-m'),ma=document.getElementById('pl-a');
mo&&Planet(mo,{kind:'moon',sites:MOS,tilt:5,speed:.075,gain:1.05,amb:.05,haze:0,html:bubMoon});
ma&&Planet(ma,{kind:'mars',sites:MAS,tilt:14,speed:.075,gain:1.1,amb:.06,haze:.45,html:bubMars});
}

const chap=(id,n,t,p,map,list)=>`<section class="sec chap" id="${id}"><p class="eyebrow">CHAPTER ${n}</p><h2>${t}</h2><p>${p}</p>${map}${list.length?`<h3 class="big">Meet the machines</h3><div class="dgrid">${list.map(card).join('')}</div>`:''}</section>`;
const ins=(id,html)=>{const e=document.getElementById(id);e&&e.insertAdjacentHTML('beforebegin',html)};
ins('r0',chap('moon','1 · THE MOON','Footprints, tire tracks and science stations.','Between 1967 and 1972, robots and astronauts left hardware on the lunar surface. With no wind or rain, much of it is still there. Point at a marker to see what each site left behind. The Moon pauses while you read. The markers show the six Apollo landings and Surveyor 3.',plan('m','moon',MOS,'Hover the Moon to pause it. Point at a marker, or pick a site below.','the Moon'),M.filter(m=>m.g=='moon')));
ins('r1',chap('deep','2 · BEYOND THE MOON','Out past the planets.','Not every machine landed. Some circle asteroids, some drift in space, and some are still travelling away from the Sun. Meet Dawn and the Pioneers here, then dive into NEAR Shoemaker and Kepler.','',M.filter(m=>m.g=='deep')));
ins('r3',chap('mars','3 · MARS','A planet full of parked robots.','Mars is the most visited world after the Moon. Eight retired NASA machines rest on this globe. Point at a marker to see where each one stopped, then meet Sojourner, Phoenix and InSight before diving deep into Viking, Opportunity and Ingenuity.',plan('a','mars',MAS,'Hover Mars to pause it. Point at a marker, or pick a machine below.','Mars'),M.filter(m=>m.g=='mars')));
ins('r6',chap('outer','4 · THE OUTER PLANETS','Telescopes and probes that kept going.','The next four machines are not parked on a surface. One watches the universe from orbit, and three travelled to Jupiter, Saturn and beyond. Step into the Deep Space Gallery in the museum to photograph each one, then operate it yourself.','',[]));
initPlanets();

})();
