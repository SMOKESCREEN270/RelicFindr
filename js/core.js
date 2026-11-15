
const $=id=>document.getElementById(id),V=(x,y,z)=>new THREE.Vector3(x,y,z);
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});R.outputEncoding=THREE.sRGBEncoding;const T=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t};R.setPixelRatio(Math.min(devicePixelRatio,(("ontouchstart" in window)||navigator.maxTouchPoints>0)?1.5:2));R.shadowMap.enabled=true;R.setSize(innerWidth,innerHeight);
const cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,400);cam.rotation.order='YXZ';
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();vfSize()});
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o));
const box=(g,w,h,d,c,x,y,z,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,o));m.position.set(x,y,z);g.add(m);return m};
const cyl=(g,a,b,h,c,x,y,z,s=16,o)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s),M(c,o));m.position.set(x,y,z);g.add(m);return m};
const GOLD=0xd9a441,SIL=0xcfd3d8,DK=0x2a3a66;
