/* ---------- procedural texture library (no downloads: every surface is generated) ---------- */
const GEN=(()=>{
const mul=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const lat=(seed,nx,ny)=>{const r=mul(seed),g=new Float32Array(nx*ny);for(let i=0;i<g.length;i++)g[i]=r();return g};
const vn=(g,nx,ny,x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),x0=((xi%nx)+nx)%nx,y0=((yi%ny)+ny)%ny,x1=(x0+1)%nx,y1=(y0+1)%ny;
 return(g[y0*nx+x0]*(1-u)+g[y0*nx+x1]*u)*(1-v)+(g[y1*nx+x0]*(1-u)+g[y1*nx+x1]*u)*v};
/* tileable fractal noise, values 0..1. bx,by = lattice cells of the first octave */
function fbm(seed,W,H,oct=5,bx=4,by=bx,gain=.5){const o=new Float32Array(W*H);let a=1,s=0;
 for(let k=0;k<oct;k++){const nx=bx<<k,ny=by<<k,g=lat(seed+k*977,nx,ny);for(let j=0;j<H;j++){const y=j/H*ny;for(let i=0;i<W;i++)o[j*W+i]+=a*vn(g,nx,ny,i/W*nx,y)}s+=a;a*=gain}
 let mn=1e9,mx=-1e9;for(let i=0;i<o.length;i++){o[i]/=s;if(o[i]<mn)mn=o[i];if(o[i]>mx)mx=o[i]}const d=mx-mn||1;for(let i=0;i<o.length;i++)o[i]=(o[i]-mn)/d;return o}
const smp=(a,W,H,x,y)=>{x=((x%W)+W)%W;y=((y%H)+H)%H;const xi=x|0,yi=y|0,fx=x-xi,fy=y-yi,x1=(xi+1)%W,y1=(yi+1)%H;return(a[yi*W+xi]*(1-fx)+a[yi*W+x1]*fx)*(1-fy)+(a[y1*W+xi]*(1-fx)+a[y1*W+x1]*fx)*fy};
const cv=(W,H)=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const px=(W,H,fn)=>{const c=cv(W,H),x=c.getContext('2d'),d=x.createImageData(W,H),b=d.data,o=[0,0,0,255];for(let j=0;j<H;j++)for(let i=0;i<W;i++){o[3]=255;fn(i,j,o);const k=(j*W+i)*4;b[k]=o[0];b[k+1]=o[1];b[k+2]=o[2];b[k+3]=o[3]}x.putImageData(d,0,0);return c};
const hx=h=>[h>>16&255,h>>8&255,h&255];
const ramp=(st,t,o)=>{t=Math.max(0,Math.min(1,t));let k=0;while(k<st.length-2&&t>st[k+1][0])k++;const a=st[k],b=st[k+1],u=(t-a[0])/(b[0]-a[0]||1);o[0]=a[1][0]+(b[1][0]-a[1][0])*u;o[1]=a[1][1]+(b[1][1]-a[1][1])*u;o[2]=a[1][2]+(b[1][2]-a[1][2])*u};
const wrap9=(W,H,fn)=>{for(const dx of[-W,0,W])for(const dy of[-H,0,H])fn(dx,dy)};
const R=a=>mul(a);
const clamp=v=>v<0?0:v>255?255:v;
const G={};
/* polished floor tile: 4x4 stone slabs with grout and per-slab tint */
G.tile=(a,b,seed=1)=>{const n=fbm(seed,512,512,4,16,16),A=hx(a),B=hx(b),r=R(seed+5),tv=Array.from({length:16},()=>r()*.3-.15);
 return px(512,512,(i,j,o)=>{const ti=(i>>7)+(j>>7)*4,q=n[j*512+i],m=.8+q*.45+tv[ti];const gx=i&127,gy=j&127;
  if(gx<3||gy<3){o[0]=o[1]=o[2]=10;return}const e=Math.min(gx,gy,127-gx,127-gy)<6?1.18:1,w=q*.7;
  o[0]=(A[0]+(B[0]-A[0])*w)*m*e;o[1]=(A[1]+(B[1]-A[1])*w)*m*e;o[2]=(A[2]+(B[2]-A[2])*w)*m*e})};
/* brushed-metal wall: 2x2 panels, bevel, rivets */
G.panel=(col,seed=2)=>{const n=fbm(seed,512,512,3,2,96),C=hx(col);
 return px(512,512,(i,j,o)=>{const gx=i&255,gy=j&255,d=Math.min(gx,gy,255-gx,255-gy),q=.75+n[j*512+i]*.5;let e=1;
  if(d<2)e=.25;else if(d<5)e=1.25;else if(d<9)e=.9;const rx=Math.min(gx,255-gx)-14,ry=Math.min(gy,255-gy)-14;if(rx*rx+ry*ry<14)e=1.6;if(rx*rx+ry*ry>12&&rx*rx+ry*ry<22)e=Math.min(e,.5);
  const v=((j>>8)+(i>>8))&1?1:.93;o[0]=C[0]*q*e*v;o[1]=C[1]*q*e*v;o[2]=C[2]*q*e*v})};
/* ceiling: dark cells with a glowing light bar */
G.ceil=(seed=3,tint=0xcfe3ff)=>{const n=fbm(seed,512,512,3,8,8),T=hx(tint);return px(512,512,(i,j,o)=>{const gx=i&127,gy=j&127;let l=0;if(gx>30&&gx<98&&gy>54&&gy<74)l=1;const e=(gx<2||gy<2)?.3:1,q=.12+n[j*512+i]*.1;
  o[0]=T[0]*(l?.95:q)*e;o[1]=T[1]*(l?.95:q)*e;o[2]=T[2]*(l?.95:q)*e})};
/* dark deck plates with a glowing seam in the accent colour */
G.plate=(col,seed=4)=>{const n=fbm(seed,512,512,4,16,16),C=hx(col);return px(512,512,(i,j,o)=>{const gx=i&63,gy=j&63,d=Math.min(gx,gy,63-gx,63-gy),q=.55+n[j*512+i]*.6;let r=12*q,g=16*q,b=26*q;
  if(d<2){r=C[0]*.9;g=C[1]*.9;b=C[2]*.9}else if(d<4){r*=.4;g*=.4;b*=.4}else if(d<8){r*=1.3;g*=1.3;b*=1.3}if((i>>6)%4==0&&(j>>6)%4==0&&d>20&&d<30){r=C[0]*.3;g=C[1]*.3;b=C[2]*.3}
  o[0]=r;o[1]=g;o[2]=b})};
/* craters + pebbles painted over a base canvas (wraps at the edges so it tiles) */
function craters(c,seed,count,dark,lite,rmin,rmax){const x=c.getContext('2d'),r=R(seed),W=c.width,H=c.height;
 for(let k=0;k<count;k++){const cx=r()*W,cy=r()*H,rad=rmin+Math.pow(r(),2.2)*(rmax-rmin);wrap9(W,H,(dx,dy)=>{const X=cx+dx,Y=cy+dy;if(X<-rad||Y<-rad||X>W+rad||Y>H+rad)return;
  const g=x.createRadialGradient(X,Y,rad*.1,X,Y,rad);g.addColorStop(0,dark);g.addColorStop(.6,dark.replace(/[\d.]+\)$/,'.0)'));g.addColorStop(.88,lite);g.addColorStop(1,lite.replace(/[\d.]+\)$/,'0)'));x.fillStyle=g;x.beginPath();x.arc(X,Y,rad,0,7);x.fill()})}}
function pebbles(c,seed,count,col,sh){const x=c.getContext('2d'),r=R(seed),W=c.width,H=c.height;for(let k=0;k<count;k++){const X=r()*W,Y=r()*H,s=1+r()*3.4;wrap9(W,H,(dx,dy)=>{const a=X+dx,b=Y+dy;if(a<-8||b<-8||a>W+8||b>H+8)return;x.fillStyle=sh;x.beginPath();x.ellipse(a+s*.7,b+s*.5,s*1.1,s*.7,0,0,7);x.fill();x.fillStyle=col;x.beginPath();x.ellipse(a,b,s,s*.7,0,0,7);x.fill()})}}
G.regolith=(seed=5)=>{const n=fbm(seed,512,512,6,4),m=fbm(seed+3,512,512,3,32);const c=px(512,512,(i,j,o)=>{const v=.2+n[j*512+i]*.5+(m[j*512+i]-.5)*.12;o[0]=v*255*1.0;o[1]=v*255*.97;o[2]=v*255*.93});
 craters(c,seed,22,'rgba(25,25,28,.38)','rgba(215,215,208,.22)',14,110);pebbles(c,seed+1,260,'#9a9890','rgba(0,0,0,.45)');return c};
G.rust=(seed=6)=>{const n=fbm(seed,512,512,6,4),w=fbm(seed+2,512,512,3,3);const st=[[0,[58,26,16]],[.4,[122,58,34]],[.75,[181,96,58]],[1,[225,150,98]]];
 const c=px(512,512,(i,j,o)=>{const k=j*512+i,rip=Math.sin((j+w[k]*70)/5.5)*.5+.5;ramp(st,n[k]*.85+rip*.12,o)});
 craters(c,seed,10,'rgba(40,16,8,.4)','rgba(240,170,120,.3)',12,70);pebbles(c,seed+1,320,'#8a4a2c','rgba(30,10,5,.55)');return c};
/* Nebula scene (colour) with stars + diffraction spikes. pal = ramp stops */
function stars(c,seed,count,spike){const x=c.getContext('2d'),r=R(seed),W=c.width,H=c.height;for(let k=0;k<count;k++){const X=r()*W,Y=r()*H,m=Math.pow(r(),4),s=.6+m*3,al=.35+m*.65;
 const g=x.createRadialGradient(X,Y,0,X,Y,s*3);g.addColorStop(0,`rgba(255,250,240,${al})`);g.addColorStop(1,'rgba(255,250,240,0)');x.fillStyle=g;x.fillRect(X-s*3,Y-s*3,s*6,s*6);
 if(spike&&m>.45){const L=s*9+m*30;x.strokeStyle=`rgba(255,255,255,${.35*m})`;x.lineWidth=.8;x.beginPath();x.moveTo(X-L,Y);x.lineTo(X+L,Y);x.moveTo(X,Y-L);x.lineTo(X,Y+L);x.stroke()}}}
G.nebula=(seed=7,pal,W=512,H=512,withStars=1)=>{const f1=fbm(seed,W,H,6,3),f2=fbm(seed+1,W,H,5,2),f3=fbm(seed+2,W,H,4,5);const P=pal||[[0,[2,3,10]],[.35,[40,10,60]],[.6,[170,40,70]],[.8,[255,150,90]],[1,[255,240,210]]];
 const c=px(W,H,(i,j,o)=>{const k=j*W+i,w=smp(f1,W,H,i+(f2[k]-.5)*160,j+(f2[k]-.5)*120),v=Math.pow(Math.max(0,w*1.25-.18),1.7);ramp(P,v,o);const dust=Math.pow(f3[k],2.4);o[0]*=1-dust*.55;o[1]*=1-dust*.55;o[2]*=1-dust*.5});
 if(withStars)stars(c,seed+9,Math.round(W*H/1500),1);return c};
/* Eagle-style pillars: tall dark columns glowing at the edges, in red/green/blue gas */
G.pillars=(seed=8)=>{const W=512,H=512,n=fbm(seed,W,H,6,3,3),m=fbm(seed+4,W,H,5,5,5),g2=fbm(seed+6,W,H,4,2,2),P=[[.27,.085,.2],[.5,.075,.1],[.73,.07,.3]];
 const c=px(W,H,(i,j,o)=>{const k=j*W+i,u=i/W,v=j/H;let ins=-1,rim=0;
  for(const[cx,w0,top]of P){const t=Math.max(0,(v-top)/(1-top)),w=w0*(.35+.9*Math.sqrt(t))+(n[k]-.5)*.03,x0=cx+(m[k]-.5)*.05*t,d=Math.abs(u-x0);let dd=d/w;if(v<top+.05)dd=Math.hypot(d/w,(top+.05-v)/.05*.9);if(dd<1&&v>top-.01){ins=Math.max(ins,1-dd);rim=Math.max(rim,Math.pow(dd,3))}}
  const gl=Math.pow(g2[k],1.6);
  if(ins>=0){const t=m[k];o[0]=34+t*44+rim*200;o[1]=18+t*26+rim*120;o[2]=12+t*14+rim*40}
  else{o[0]=24+gl*190*(1-v*.4);o[1]=44+gl*170;o[2]=44+gl*120*(.4+v)}});
 stars(c,seed+9,140,1);return c};
G.deepfield=(seed=9)=>{const W=512,H=512,c=cv(W,H),x=c.getContext('2d'),r=R(seed);x.fillStyle='#02030a';x.fillRect(0,0,W,H);
 for(let k=0;k<210;k++){const X=r()*W,Y=r()*H,s=2+Math.pow(r(),2.2)*16,ar=.35+r()*.65,a=r()*3.14,t=r(),col=t<.45?[255,200+r()*40|0,150]:t<.8?[170,200,255]:[255,120,120];
  x.save();x.translate(X,Y);x.rotate(a);x.scale(1,ar);const g=x.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,`rgba(${col},.95)`);g.addColorStop(.35,`rgba(${col},.4)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.arc(0,0,s,0,7);x.fill();
  if(s>9){x.strokeStyle=`rgba(${col},.3)`;x.lineWidth=1.2;x.beginPath();x.ellipse(0,0,s*.7,s*.7*.5,0,0,6.3);x.stroke()}x.restore()}
 stars(c,seed+9,26,1);return c};
G.jupiter=(seed=10)=>{const W=1024,H=512,t=fbm(seed,W,H,5,6,3),b=lat(seed+2,1,64),st=[[0,[96,58,40]],[.25,[198,140,96]],[.5,[240,226,200]],[.75,[184,110,70]],[1,[110,64,44]]];
 const c=px(W,H,(i,j,o)=>{const k=j*W+i,la=j/H,band=vn(b,1,64,0,la*64)*.8+Math.sin(la*58)*.1+.1,sw=(t[k]-.5)*.22;ramp(st,band+sw+(t[k]-.5)*.5,o)});
 const x=c.getContext('2d');const g=x.createRadialGradient(700,340,4,700,340,60);g.addColorStop(0,'rgba(170,70,40,.95)');g.addColorStop(.6,'rgba(190,100,60,.8)');g.addColorStop(1,'rgba(200,130,90,0)');x.save();x.translate(700,340);x.scale(1,.55);x.translate(-700,-340);x.fillStyle=g;x.beginPath();x.arc(700,340,60,0,7);x.fill();x.restore();return c};
G.saturn=(seed=11)=>{const W=1024,H=512,t=fbm(seed,W,H,4,6,2),b=lat(seed+3,1,48),st=[[0,[150,120,72]],[.5,[222,200,150]],[1,[246,232,196]]];
 return px(W,H,(i,j,o)=>{const k=j*W+i,la=j/H,band=vn(b,1,48,0,la*48)*.7+.3,pol=Math.abs(la-.5)>.4?Math.min(1,(Math.abs(la-.5)-.4)*8):0;ramp(st,band*.85+(t[k]-.5)*.25,o);o[0]*=1-pol*.15;o[1]*=1-pol*.1;o[2]*=1+pol*.15})};
G.earth=(seed=12)=>{const W=1024,H=512,n=fbm(seed,W,H,7,4,2),cl=fbm(seed+5,W,H,6,6,3),m=fbm(seed+7,W,H,3,8,4);
 return px(W,H,(i,j,o)=>{const k=j*W+i,la=Math.abs(j/H-.5)*2,land=n[k]>.52;let r,g,b;
  if(land){const e=(n[k]-.52)*3,dry=m[k];r=40+dry*110+e*60;g=95+(1-dry)*70-e*20;b=40+dry*20}else{const d=(.52-n[k])*2.4;r=6+20*(1-d);g=30+60*(1-d);b=90+90*(1-d)}
  if(la>.86){const a=Math.min(1,(la-.86)*9);r+=(240-r)*a;g+=(245-g)*a;b+=(250-b)*a}
  const c=Math.max(0,cl[k]*1.7-.95)*1.7;r+=(250-r)*Math.min(1,c);g+=(250-g)*Math.min(1,c);b+=(255-b)*Math.min(1,c);o[0]=r;o[1]=g;o[2]=b})};
/* ring strip: u = radius. alpha carries density. Cassini Division and Encke gap included */
G.rings=()=>{const W=1024,H=8,c=cv(W,H),x=c.getContext('2d'),d=x.createImageData(W,H),r=R(11);
 for(let i=0;i<W;i++){const u=i/W;let a=0;if(u<.14)a=.04;else if(u<.3)a=.2;else if(u<.64)a=.85;else if(u<.7)a=.06;else if(u<.98)a=.55;else a=0;
  if(u>.9&&u<.915)a*=.05;a*=.78+.22*Math.sin(u*190)+r()*.12;a=Math.max(0,Math.min(1,a));
  for(let j=0;j<H;j++){const k=(j*W+i)*4;d.data[k]=222-u*30;d.data[k+1]=204-u*40;d.data[k+2]=168-u*40;d.data[k+3]=a*255}}x.putImageData(d,0,0);return c};
G.glow=(col='255,220,160')=>{const c=cv(256,256),x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(.15,`rgba(${col},.7)`);g.addColorStop(.5,`rgba(${col},.15)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(0,0,256,256);return c};
G.record=()=>{const c=cv(512,512),x=c.getContext('2d'),g=x.createRadialGradient(200,190,20,256,256,256);g.addColorStop(0,'#fff0b0');g.addColorStop(.5,'#d9a441');g.addColorStop(1,'#7a5410');x.fillStyle=g;x.beginPath();x.arc(256,256,250,0,7);x.fill();
 x.strokeStyle='rgba(60,35,0,.3)';for(let r=70;r<244;r+=2.4){x.lineWidth=.8;x.beginPath();x.arc(256,256,r,0,7);x.stroke()}
 x.fillStyle='#20180a';x.beginPath();x.arc(256,256,34,0,7);x.fill();x.strokeStyle='rgba(20,12,0,.75)';x.lineWidth=2;
 for(let k=0;k<14;k++){const a=k/14*6.283+.3,L=60+((k*37)%9)*14;x.beginPath();x.moveTo(256+Math.cos(a)*40,256+Math.sin(a)*40);x.lineTo(256+Math.cos(a)*(40+L),256+Math.sin(a)*(40+L));x.stroke();for(let q=0;q<5;q++){const s=44+L*(q+1)/6;x.beginPath();x.arc(256+Math.cos(a)*s,256+Math.sin(a)*s,2,0,7);x.fill()}}
 x.fillStyle='rgba(20,12,0,.8)';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('DECORATIVE · NOT THE REAL COVER',256,486);return c};
G.plaque=()=>{const c=cv(640,400),x=c.getContext('2d'),g=x.createLinearGradient(0,0,640,400);g.addColorStop(0,'#e6c46a');g.addColorStop(.5,'#c79a3a');g.addColorStop(1,'#8c6a22');x.fillStyle=g;x.fillRect(0,0,640,400);x.strokeStyle='#2a1c06';x.lineWidth=3;x.strokeRect(14,14,612,372);x.fillStyle='#2a1c06';
 const cx=150,cy=200;x.beginPath();x.arc(cx,cy,12,0,7);x.fill();for(let k=0;k<14;k++){const a=k/14*6.283+.5,L=40+((k*29)%7)*17;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*L,cy+Math.sin(a)*L);x.lineWidth=2;x.stroke();for(let q=0;q<4;q++){x.fillRect(cx+Math.cos(a)*(L-q*6)-1,cy+Math.sin(a)*(L-q*6)-1,3,3)}}
 const sx=300,sy=330;x.beginPath();x.arc(sx,sy,6,0,7);x.fill();for(let k=1;k<=9;k++){x.beginPath();x.arc(sx+20+k*28,sy,1.5+(k==5||k==6?4:k>6?2:1),0,7);x.fill()}x.lineWidth=2.4;x.beginPath();x.moveTo(sx+80,sy-18);x.bezierCurveTo(sx+120,sy-80,sx+180,sy-80,sx+240,sy-18);x.stroke();x.beginPath();x.moveTo(sx+240,sy-18);x.lineTo(sx+226,sy-24);x.lineTo(sx+232,sy-8);x.fill();
 x.font='bold 15px sans-serif';x.textAlign='center';x.fillText('DECORATIVE · NOT THE REAL PLAQUE',320,60);return c};
const memo={};
const api={c:(name,...a)=>memo[name+a.join()]||(memo[name+a.join()]=G[name](...a)),raw:G,fbm,smp,cv,px,stars,mul};
return api})();
