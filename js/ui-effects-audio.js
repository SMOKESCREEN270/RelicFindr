(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],B=document.body;
let AC,on=0,amb;
function tn(f,d=.08,t='sine',v=.05,f2){if(!on)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const a=AC,o=a.createOscillator(),g=a.createGain(),n=a.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g).connect(a.destination);o.start();o.stop(n+d)}catch(e){}}
const S={tick:()=>tn(1900,.035,'square',.012),click:()=>{tn(500,.14,'triangle',.07,900)},whoosh:()=>tn(90,.5,'sawtooth',.025,700),chime:()=>{tn(880,.4,'sine',.05);setTimeout(()=>tn(1320,.5,'sine',.04),90)}};
window.RS=S;function ambient(v){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(v&&!amb){const g=AC.createGain(),f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=380;g.gain.value=0;[55,82.4,110.3].forEach(q=>{const o=AC.createOscillator();o.frequency.value=q;o.type='sine';o.connect(f);o.start()});f.connect(g).connect(AC.destination);amb=g}if(amb)amb.gain.linearRampToValueAtTime(v?.05:0,AC.currentTime+1.5)}catch(e){}}
function snd(v){on=v;$('#snd').innerHTML=(v?IC.s('volume',15)+'<span class="sl">Sound on</span>':IC.s('volumeoff',15)+'<span class="sl">Sound off</span>');$('#snd').setAttribute('aria-pressed',v?'true':'false');$('#snd').classList.toggle('on',!!v);ambient(v);if(v)S.chime()}
$('#snd').onclick=()=>{snd(on?0:1)};
/* preloader */
let n=0;const t0=performance.now(),pn=$('#pn'),pb=$('#pb');
(function c(t){n=Math.min(100,Math.round((t-t0)/18));pn.textContent=n;pb.style.width=n+'%';if(n<100)requestAnimationFrame(c);else{$('#pbt').style.opacity=1;$('#pbt').style.pointerEvents='auto'}})(t0);
$('#pbt').onclick=e=>{const b=e.target.closest('button');if(!b)return;snd(+b.dataset.s);S.whoosh();$('#pre').classList.add('out');B.classList.add('ready');reveal();setTimeout(()=>$('#pre').remove(),1800)};
/* reveal + scramble */
function scr(el){const o=el.dataset.o||(el.dataset.o=el.textContent),ch='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';let i=0;const id=setInterval(()=>{el.textContent=[...o].map((c,k)=>c==' '||k<i/1.5?c:ch[Math.random()*ch.length|0]).join('');if(++i>o.length*1.5){el.textContent=o;clearInterval(id)}},28)}
function reveal(){$$('.sec h2,.sec>p,.steps div,.stats div,.facts div,.stick .lead,.stick .cap,.strip div,.cta,.stick .tag,.dos,.plan,.sec>.eyebrow').forEach((e,i)=>{e.classList.add('rv');e.style.transitionDelay=(i%4)*.09+'s'});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});$$('.rv').forEach(e=>io.observe(e));
const h2=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){scr(x.target);h2.unobserve(x.target)}}),{threshold:.6});$$('.rel h2').forEach(e=>h2.observe(e));
const li=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){S.tick();li.unobserve(x.target)}}),{threshold:.6});$$('.tl li').forEach(e=>li.observe(e));
const rs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&x.intersectionRatio>.45)S.whoosh()}),{threshold:.45});$$('.rel').forEach(e=>rs.observe(e))}
/* cursor, spotlight, magnetic, glow */
const cu=$('.cur'),c2=$('.cur2');let mx=0,my=0,x2=0,y2=0;
addEventListener('mousemove',e=>{document.body.classList.add('mm');mx=e.clientX;my=e.clientY;cu.style.transform=`translate(${mx}px,${my}px)`;const h=$('.hero');if(h){const r=h.getBoundingClientRect();h.style.setProperty('--hx',(mx-r.left)+'px');h.style.setProperty('--hy',(my-r.top)+'px');$('.orb').style.transform=`translate(${(mx/innerWidth-.5)*-30}px,${(my/innerHeight-.5)*-30}px)`}
const g=e.target.closest&&e.target.closest('.steps div,.facts div,.stats div,.dos');if(g){const r=g.getBoundingClientRect();g.style.setProperty('--mx',e.clientX-r.left+'px');g.style.setProperty('--my',e.clientY-r.top+'px')}
const f=$('#ftw');if(f){const r=f.getBoundingClientRect();f.style.setProperty('--fx',e.clientX-r.left+'px');f.style.setProperty('--fy',e.clientY-r.top+'px')}},{passive:true});
(function l(){x2+=(mx-x2)*.16;y2+=(my-y2)*.16;c2.style.transform=`translate(${x2}px,${y2}px)`;requestAnimationFrame(l)})();
const HS='a,button,.pill a';
document.addEventListener('mouseover',e=>{const t=e.target.closest(HS);c2.classList.toggle('h',!!t);if(t&&!t._h){t._h=1;S.tick()}});document.addEventListener('mouseout',e=>{const t=e.target.closest(HS);if(t)t._h=0});
document.addEventListener('click',e=>{if(e.target.closest('button,a'))S.click()},true);
document.addEventListener('mousemove',e=>{const m=e.target.closest('.enter,.cta');$$('.enter,.cta').forEach(b=>{if(b!==m)b.style.translate=''});if(m){const r=m.getBoundingClientRect();m.style.translate=((e.clientX-r.left-r.width/2)*.2)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'}});
/* tubelight active + back to top + game key sounds */
function act(){let k='top';for(const id of ['start','moon','deep','mars','outer','end']){const e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<innerHeight*.45)k=id}$$('.pill a').forEach(a=>a.classList.toggle('on',a.dataset.k==k))}
addEventListener('scroll',act,{passive:true});act();
$('#top2').onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('keydown',e=>{if(!B.classList.contains('play'))return;const k=e.key.toLowerCase();if(k=='c')tn(1200,.18,'square',.05,300);else if('qrfo'.includes(k))S.tick()});
})();
