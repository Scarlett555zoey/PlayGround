import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169/build/three.module.js';

const animals=[['Gray Wolf','Wolf','gray'],['Coyote','Coyote','sand'],['Black Bear','Bear','black'],['Grizzly Bear','Bear','brown'],['Mountain Lion','Cat','tan'],['Bobcat','Cat','ginger'],['Canadian Lynx','Cat','snow'],['Wolverine','Mammal','brown'],['Red Fox','Fox','red'],['Elk','Ungulate','brown'],['Moose','Ungulate','dark'],['Mule Deer','Ungulate','tan'],['White-tailed Deer','Ungulate','tan'],['Mountain Goat','Ungulate','white'],['Bighorn Sheep','Ungulate','brown'],['Beaver','Mammal','brown'],['Snowshoe Hare','Mammal','white'],['Rabbit','Mammal','gray'],['Chipmunk','Mammal','brown'],['Bald Eagle','Bird','brown'],['Mallard Duck','Bird','green'],['Canada Goose','Bird','gray']];
const grid=document.querySelector('#speciesGrid');let selected=0,sex='Female';animals.forEach((a,i)=>{const b=document.createElement('button');b.className='species'+(i===0?' active':'');b.innerHTML=`<b>${a[0]}</b><span>${a[1]}</span>`;b.onclick=()=>{document.querySelectorAll('.species').forEach(x=>x.classList.remove('active'));b.classList.add('active');selected=i};grid.appendChild(b)});
document.querySelectorAll('.sex').forEach(b=>b.onclick=()=>{document.querySelectorAll('.sex').forEach(x=>x.classList.remove('active'));b.classList.add('active');sex=b.dataset.sex});

const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xb7c6bc,.0019);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,3000);const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.querySelector('#game').appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight(0xd8e7ed,0x4d583a,2.1);scene.add(hemi);const sun=new THREE.DirectionalLight(0xfff1c7,2.5);sun.position.set(-180,220,-120);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=sun.shadow.camera.right=650;sun.shadow.camera.top=sun.shadow.camera.bottom=650;scene.add(sun);

const geo=new THREE.PlaneGeometry(1800,1800,90,90);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);const dist=Math.sqrt(x*x+y*y);let z=22*Math.sin(x*.018)*Math.sin(y*.017)+12*Math.cos(x*.031+y*.014);z+=Math.max(0,(dist-260)/3.5);pos.setZ(i,z)}geo.computeVertexNormals();const ground=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x536b43,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

function mountain(x,z,s,c){
 const g=new THREE.SphereGeometry(s,28,18);g.scale(1.15,.82,.78);g.translate(0,-.18,0);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.92,flatShading:false}));m.position.set(x,s*.45,z);m.rotation.y=Math.random()*Math.PI;m.castShadow=m.receiveShadow=true;scene.add(m);
 const snow=new THREE.Mesh(new THREE.ConeGeometry(s*.43,s*.58,16),new THREE.MeshStandardMaterial({color:0xdedfd7,roughness:.9,flatShading:false}));snow.position.set(x,s*.92,z);snow.scale.z=.78;snow.castShadow=true;scene.add(snow);
 for(let r=0;r<5;r++){const ridge=new THREE.Mesh(new THREE.ConeGeometry(s*.09,s*.38,5),new THREE.MeshStandardMaterial({color:0x7c8176,roughness:1,flatShading:false}));const a=r/5*Math.PI*2;ridge.position.set(x+Math.cos(a)*s*.58,s*.58,z+Math.sin(a)*s*.43);ridge.rotation.z=Math.cos(a)*.35;scene.add(ridge)}
}
for(let i=0;i<16;i++){let angle=i/16*Math.PI*2,r=650+(i%3)*55;mountain(Math.cos(angle)*r,-Math.sin(angle)*r,130+(i%4)*32,i%2?0x536355:0x68715d)}
const lake=new THREE.Mesh(new THREE.CircleGeometry(190,64),new THREE.MeshPhysicalMaterial({color:0x4e8794,roughness:.16,metalness:.05,transparent:true,opacity:.88}));lake.rotation.x=-Math.PI/2;lake.position.set(-310,31,-220);scene.add(lake);

const pineGeo=new THREE.ConeGeometry(7,24,7),pineMat=new THREE.MeshStandardMaterial({color:0x23452f,roughness:1});for(let i=0;i<420;i++){let x=(Math.random()-.5)*1500,z=(Math.random()-.5)*1500;if(Math.hypot(x+310,z+220)<220||Math.abs(x)>720||Math.abs(z)>720)continue;const p=new THREE.Mesh(pineGeo,pineMat);p.position.set(x,groundHeight(x,z)+10,z);p.scale.setScalar(.65+Math.random()*.7);p.castShadow=true;scene.add(p)}
const logGeo=new THREE.CylinderGeometry(.9,.9,13,8);for(let i=0;i<35;i++){const l=new THREE.Mesh(logGeo,new THREE.MeshStandardMaterial({color:0x57412d}));let x=(Math.random()-.5)*1000,z=(Math.random()-.5)*1000;l.position.set(x,groundHeight(x,z)+1,z);l.rotation.z=Math.PI/2;l.rotation.y=Math.random()*Math.PI;scene.add(l)}

function groundHeight(x,z){return 22*Math.sin(x*.018)*Math.sin(z*.017)+12*Math.cos(x*.031+z*.014)+Math.max(0,(Math.sqrt(x*x+z*z)-260)/3.5)}

const speciesSpeeds={Wolf:{walk:.035,trot:.065,run:.11,sprint:.17},Coyote:{walk:.038,trot:.07,run:.12,sprint:.19},Bear:{walk:.032,trot:.058,run:.095,sprint:.14},Cat:{walk:.04,trot:.075,run:.13,sprint:.21},Fox:{walk:.04,trot:.073,run:.125,sprint:.20},Ungulate:{walk:.045,trot:.09,run:.16,sprint:.24},Mammal:{walk:.038,trot:.068,run:.115,sprint:.18},Bird:{walk:.025,trot:.05,run:.09,sprint:.14}};

function makeAnimal(a,isMale=false){
 const col=a[2]==='white'?0xe9ede4:a[2]==='brown'?0x6d563b:a[2]==='red'?0xb64c31:a[2]==='snow'?0xaaa9a0:a[2]==='tan'?0xa28a62:a[2]==='dark'?0x3d352d:a[2]==='gray'?0x777c75:a[2]==='black'?0x252927:a[2]==='green'?0x536941:a[2]==='sand'?0xb69a72:a[2]==='ginger'?0x9a6a43:0x7a6f5c;
 const g=new THREE.Group(),fur=new THREE.MeshStandardMaterial({color:col,roughness:.78});
 const body=new THREE.Mesh(new THREE.SphereGeometry(a[1]==='Bird'?3:5,14,9),fur);body.scale.set(1.35,a[1]==='Ungulate'?1:.75,.8);body.castShadow=true;g.add(body);
 if(a[1]!=='Bird'){
  const head=new THREE.Mesh(new THREE.SphereGeometry(3.2,12,8),fur);head.position.set(5,a[1]==='Ungulate'?1:0,0);head.castShadow=true;g.add(head);
 }
 g.userData.legs=[];
 if(a[1]!=='Bird'){
  for(const side of [-1,1])for(const fore of [-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.58,.72,5.2,8),fur);leg.position.set(fore*2.7,-4.5,side*2.35);leg.castShadow=true;leg.userData.phase=side+fore;g.add(leg);g.userData.legs.push(leg)}
 }
 // Anatomical detail is only shown on species that naturally lack covering fur.
 if(isMale&&['Red Fox','Rabbit','Snowshoe Hare','Chipmunk','Mallard Duck','Canada Goose'].includes(a[0])){
  const skin=new THREE.MeshStandardMaterial({color:0xb98b70,roughness:.65});
  for(const side of [-1,1]){const ball=new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),skin);ball.position.set(-2.7,-3.8,side*.75);g.add(ball)}
  const penis=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,1.15,8),skin);penis.position.set(-3.4,-3.5,0);penis.rotation.z=Math.PI/2.8;g.add(penis);
 }
 g.userData.body=body;g.userData.fur=fur;g.userData.kind=a[1];g.userData.gait='walk';
 return g;
}

function animateGait(g,phase,gait,speed){
 if(!g.userData.legs)return;
 const amplitudes={walk:.18,trot:.38,run:.72,sprint:1.05},freq={walk:2.2,trot:4.2,run:7,sprint:9.5};
 const amp=amplitudes[gait],f=freq[gait];
 g.userData.legs.forEach((leg,i)=>{leg.rotation.x=Math.sin(phase*f+(i%2)*Math.PI)*amp;leg.rotation.z=Math.sin(phase*f+(i%2)*Math.PI)*amp*.35});
 if(g.userData.body){g.userData.body.rotation.z=Math.sin(phase*f*2)*amp*.035;g.userData.body.position.y=Math.abs(Math.sin(phase*f))*amp*.35}
}

const wildlife=[];for(let i=0;i<32;i++){const spec=animals[Math.floor(Math.random()*animals.length)],npcSex=Math.random()>.5?'Male':'Female',g=makeAnimal(spec,npcSex==='Male');let x=(Math.random()-.5)*1100,z=(Math.random()-.5)*1100;g.position.set(x,groundHeight(x,z)+5,z);g.scale.setScalar(.55+Math.random()*.45);g.rotation.y=Math.random()*6;scene.add(g);wildlife.push({mesh:g,spec,sex:npcSex,down:false,dir:Math.random()*6.28,gait:'walk',gaitTime:Math.random()*10})}

let player;let yaw=0,pitch=-.15;let keys={},touchMove={x:0,y:0};camera.position.set(0,groundHeight(0,0)+18,70);function setPlayer(){player=makeAnimal(animals[selected],sex==='Male');let x=20,z=20;player.position.set(x,groundHeight(x,z)+5,z);player.scale.set(selected===19||selected===20||selected===21?.85:1.25,1.25,1.25);scene.add(player);camera.position.set(x,player.position.y+12,z+28);camera.lookAt(player.position)}

const clockStart=performance.now();let elapsed=6.2;
function animate(now){requestAnimationFrame(animate);if(player){let dx=(keys.KeyD||touchMove.x>.2?1:0)-(keys.KeyA||touchMove.x<-.2?1:0),dz=(keys.KeyW||touchMove.y<-.2?1:0)-(keys.KeyS||touchMove.y>.2?1:0);if(dx||dz){const ang=yaw+Math.atan2(dx,dz),moving=Math.abs(dx)+Math.abs(dz)>0;let gait='walk';if(keys.KeyR)gait='trot';if(keys.ControlLeft)gait='run';if(keys.ShiftLeft||keys.ShiftRight)gait='sprint';const speeds=speciesSpeeds[player.userData.kind]||speciesSpeeds.Mammal, speed=speeds[gait];player.position.x+=Math.sin(ang)*speed;player.position.z+=Math.cos(ang)*speed;player.rotation.y=ang-Math.PI/2;player.userData.gait=gait;player.userData.gaitTime=(player.userData.gaitTime||0)+.016;animateGait(player,player.userData.gaitTime,gait,speed)}else{player.userData.gait='walk';animateGait(player,0,'walk',0)}let ph=Math.max(.1,groundHeight(player.position.x,player.position.z)+5);player.position.y+= (ph-player.position.y)*.15;yaw=pitch;camera.position.lerp(new THREE.Vector3(player.position.x-Math.sin(yaw)*26,player.position.y+14-Math.sin(pitch)*10,player.position.z-Math.cos(yaw)*26),.12);camera.lookAt(player.position.x,player.position.y+2,player.position.z)}else{camera.position.y+= (groundHeight(0,0)+14-camera.position.y)*.05;camera.lookAt(0,30,0)}
for(const w of wildlife){if(!w.down&&Math.random()<.004){w.dir+=(Math.random()-.5)*.8;if(Math.random()<.16)w.gait=['walk','walk','trot','run'][Math.floor(Math.random()*4)]}if(!w.down){const speeds=speciesSpeeds[w.mesh.userData.kind]||speciesSpeeds.Mammal,roll=Math.random(),speed=(speeds[w.gait]||speeds.walk)*(roll<.008?1.25:1);w.mesh.position.x+=Math.cos(w.dir)*speed;w.mesh.position.z+=Math.sin(w.dir)*speed;w.mesh.rotation.y=w.dir-Math.PI/2;w.gaitTime+=.016;animateGait(w.mesh,w.gaitTime,w.gait,speed);let y=groundHeight(w.mesh.position.x,w.mesh.position.z)+(w.spec[1]==='Bird'?8:4);w.mesh.position.y+=(y-w.mesh.position.y)*.1}}
 elapsed=6.1+((now-clockStart)/1000)/60*20;if(elapsed>=24)elapsed-=24;let h=Math.floor(elapsed),m=Math.floor((elapsed-h)*60);document.querySelector('#clock').textContent=`${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;const day=.55+.45*Math.cos((elapsed-6)/24*Math.PI*2);scene.fog.color.setRGB(.45*day+.25,.58*day+.28,.58*day+.31);hemi.intensity=.45+day*1.8;sun.intensity=.25+day*2.2;if(elapsed>20||elapsed<5)renderer.toneMappingExposure=.55;else renderer.toneMappingExposure=1;renderer.render(scene,camera)}requestAnimationFrame(animate);

function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800)}
document.querySelector('#start').onclick=()=>{document.querySelector('#menu').classList.add('hidden');document.querySelector('#speciesName').textContent=animals[selected][0].toUpperCase()+' · '+sex.toUpperCase();setPlayer();toast('You are a newborn '+sex.toLowerCase()+' '+animals[selected][0])};
window.addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyC')document.querySelector('#callbox').classList.toggle('open')});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){pitch+=e.movementY*.002;yaw-=e.movementX*.002;pitch=Math.max(-.8,Math.min(.5,pitch));}});renderer.domElement.addEventListener('click',()=>{if(!document.querySelector('#menu').classList.contains('hidden'))return;renderer.domElement.requestPointerLock?.()});
document.querySelector('#calls').onclick=()=>document.querySelector('#callbox').classList.toggle('open');document.querySelectorAll('.call').forEach(b=>b.onclick=()=>toast(b.textContent+' — call echoed across the valley'));document.querySelector('#drink').onclick=()=>{toast('You drink deeply from the cold water');document.querySelector('#water').style.width='100%'};document.querySelector('#attack').onclick=()=>{let target=null,best=999;for(const w of wildlife){const d=player.position.distanceTo(w.mesh.position);if(d<best&&d<18){best=d;target=w}}if(target){target.down=!target.down;target.mesh.rotation.z=target.down?Math.PI/2:0;toast(target.down?'Prey is pinned — hold on!':'Prey escaped')}else toast('No prey within reach')};
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');let joyActive=false;joy.addEventListener('pointerdown',e=>{joyActive=true;joy.setPointerCapture(e.pointerId)});joy.addEventListener('pointermove',e=>{if(!joyActive)return;const r=joy.getBoundingRect();let x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);x=Math.max(-35,Math.min(35,x));y=Math.max(-35,Math.min(35,y));stick.style.transform=`translate(${x}px,${y}px)`;touchMove={x:x/35,y:y/35}});joy.addEventListener('pointerup',()=>{joyActive=false;stick.style.transform='';touchMove={x:0,y:0}});
