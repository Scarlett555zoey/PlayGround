import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169/build/three.module.js';

const animals=[['Gray Wolf','Wolf','gray'],['Coyote','Coyote','sand'],['Black Bear','Bear','black'],['Grizzly Bear','Bear','brown'],['Mountain Lion','Cat','tan'],['Bobcat','Cat','ginger'],['Canadian Lynx','Cat','snow'],['Wolverine','Mammal','brown'],['Red Fox','Fox','red'],['Elk','Ungulate','brown'],['Moose','Ungulate','dark'],['Mule Deer','Ungulate','tan'],['White-tailed Deer','Ungulate','tan'],['Mountain Goat','Ungulate','white'],['Bighorn Sheep','Ungulate','brown'],['Beaver','Mammal','brown'],['Snowshoe Hare','Mammal','white'],['Rabbit','Mammal','gray'],['Chipmunk','Mammal','brown'],['Bald Eagle','Bird','brown'],['Mallard Duck','Bird','green'],['Canada Goose','Bird','gray']];
let menuPreview=null;
const portraitColors={gray:'#747c78',sand:'#b69a72',black:'#252927',brown:'#6d563b',tan:'#a28a62',dark:'#3d352d',snow:'#c4c5bc',red:'#b64c31',ginger:'#9a6a43',white:'#e9ede4',green:'#536941'};
function updatePortrait(){const a=animals[selected];const portrait=document.querySelector('.portrait-silhouette');portrait.style.setProperty('--portrait',portraitColors[a[2]]||'#777c75');const name=document.querySelector('#speciesNameMenu');if(name)name.textContent=a[0].toUpperCase();const desc=document.querySelector('#speciesDescription');if(desc){const descriptions={Elk:'Elks are one of the largest species of deer. They graze on grasses, leaves, and bark, live in herds, and migrate long distances to find food and water.',Wolf:'Gray wolves travel and hunt in packs. They have keen hearing, powerful bodies, and thick fur suited to cold mountain valleys.',Bear:'Bears are powerful omnivores with strong shoulders, broad paws, and a keen sense of smell.'};desc.textContent=descriptions[a[0]]||`${a[0]} is a wild ${a[1].toLowerCase()} native to Glacier National Park. It adapts to forests, valleys, and changing mountain seasons.`}if(menuPreview&&scene){scene.remove(menuPreview);menuPreview=makeAnimal(a,sex==='Male');menuPreview.position.set(-5,groundHeight(-5,20)+7,20);menuPreview.scale.setScalar(a[1]==='Bird'?.72:.78);menuPreview.rotation.y=-.12;scene.add(menuPreview)}}
const grid=document.querySelector('#speciesGrid');let selected=9,sex='Female';animals.forEach((a,i)=>{const b=document.createElement('button');b.className='species'+(i===selected?' active':'');b.innerHTML=`<b>${a[0]}</b><span>${a[1]}</span>`;b.onclick=()=>{document.querySelectorAll('.species').forEach(x=>x.classList.remove('active'));b.classList.add('active');selected=i;updatePortrait()};grid.appendChild(b)});updatePortrait();
function stepSpecies(delta){selected=(selected+delta+animals.length)%animals.length;updatePortrait()}document.querySelector('#prevSpecies')?.addEventListener('click',()=>stepSpecies(-1));document.querySelector('#nextSpecies')?.addEventListener('click',()=>stepSpecies(1));
document.querySelectorAll('.sex').forEach(b=>b.onclick=()=>{document.querySelectorAll('.sex').forEach(x=>x.classList.remove('active'));b.classList.add('active');sex=b.dataset.sex;updatePortrait()});

function makeGroundTexture(){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
 ctx.fillStyle='#667653';ctx.fillRect(0,0,512,512);
 for(let i=0;i<18000;i++){const x=Math.random()*512,y=Math.random()*512,r=1+Math.random()*9;ctx.globalAlpha=.035+Math.random()*.11;ctx.fillStyle=Math.random()>.5?'#b4a77b':'#263e2d';ctx.beginPath();ctx.ellipse(x,y,r,r*.5,Math.random()*Math.PI,0,Math.PI*2);ctx.fill()}
 ctx.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(28,28);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function makeFurTexture(){
 const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#d5c8ae';ctx.fillRect(0,0,512,256);
 for(let i=0;i<14500;i++){const x=Math.random()*512,y=Math.random()*256;ctx.globalAlpha=.08+Math.random()*.22;ctx.strokeStyle=Math.random()>.52?'#fff1d2':'#544638';ctx.lineWidth=.4+Math.random()*1.25;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(Math.random()-.5)*3,y+2+Math.random()*8);ctx.stroke()}
 ctx.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
const groundTexture=makeGroundTexture(),furTexture=makeFurTexture();
const scene=new THREE.Scene();scene.background=new THREE.Color(0x91a6a5);scene.fog=new THREE.FogExp2(0x9aa99f,.00135);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,3000);const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.querySelector('#game').appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight(0xdce9ef,0x59613f,2.35);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffedbd,3.25);sun.position.set(-180,220,-120);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=sun.shadow.camera.right=650;sun.shadow.camera.top=sun.shadow.camera.bottom=650;scene.add(sun);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;

const geo=new THREE.PlaneGeometry(1800,1800,90,90);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);const dist=Math.sqrt(x*x+y*y);let z=22*Math.sin(x*.018)*Math.sin(y*.017)+12*Math.cos(x*.031+y*.014);z+=Math.max(0,(dist-260)/3.5);pos.setZ(i,z)}geo.computeVertexNormals();const ground=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xffffff,map:groundTexture,roughness:1,bumpMap:groundTexture,bumpScale:.22}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

function mountain(x,z,s,c){
 const rings=[{r:1,y:0},{r:.94,y:.12},{r:.79,y:.28},{r:.62,y:.47},{r:.43,y:.66},{r:.25,y:.83},{r:.11,y:.96}],segments=40,vertices=[],colors=[],indices=[];
 const base=new THREE.Color(c),rock=new THREE.Color(0x747c73),snow=new THREE.Color(0xd9ddd8);
 for(let j=0;j<rings.length;j++){const ring=rings[j];for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2;const ridge=1+.09*Math.sin(a*5+j*.7)+.035*Math.sin(a*11-j);const rr=ring.r*ridge;vertices.push(Math.cos(a)*rr,ring.y,Math.sin(a)*rr);const shade=.78+.28*Math.sin(a*3+j*.9);const col=base.clone().lerp(rock,.32).multiplyScalar(shade);if(ring.y>.70)col.lerp(snow,THREE.MathUtils.smoothstep(ring.y,.69,.97));colors.push(col.r,col.g,col.b)}}
 const peak=vertices.length/3;vertices.push(.025,.1,0);const cap=new THREE.Color(0xdfe3df);colors.push(cap.r,cap.g,cap.b);
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){const a=j*segments+i,b=j*segments+(i+1)%segments,d=(j+1)*segments+i,e=(j+1)*segments+(i+1)%segments;indices.push(a,d,b,b,d,e)}
 const last=(rings.length-1)*segments;for(let i=0;i<segments;i++)indices.push(last+i,peak,last+(i+1)%segments);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,flatShading:true}));mesh.scale.set(s*1.15,s*1.27,s*.9);mesh.position.set(x,groundHeight(x,z)-4,z);mesh.rotation.y=Math.random()*Math.PI;mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);
}
for(let i=0;i<16;i++){let angle=i/16*Math.PI*2,r=650+(i%3)*55;mountain(Math.cos(angle)*r,-Math.sin(angle)*r,130+(i%4)*32,i%2?0x536355:0x68715d)}
const lake=new THREE.Mesh(new THREE.CircleGeometry(190,64),new THREE.MeshPhysicalMaterial({color:0x4e8794,roughness:.16,metalness:.05,transparent:true,opacity:.88}));lake.rotation.x=-Math.PI/2;lake.position.set(-310,31,-220);scene.add(lake);

const treePositions=[];for(let i=0;i<420;i++){const x=(Math.random()-.5)*1500,z=(Math.random()-.5)*1500;if(Math.hypot(x+310,z+220)<220||Math.abs(x)>720||Math.abs(z)>720)continue;treePositions.push({x,z,y:groundHeight(x,z),scale:.72+Math.random()*.8,turn:Math.random()*Math.PI*2,tint:new THREE.Color().setHSL(.31+Math.random()*.045,.34,.19+Math.random()*.07)})}
const treeDummy=new THREE.Object3D(),trunkGeo=new THREE.CylinderGeometry(.62,.95,13,7),tierGeos=[new THREE.ConeGeometry(8.7,17,9),new THREE.ConeGeometry(6.7,15,9),new THREE.ConeGeometry(4.5,12,8)];
const trunks=new THREE.InstancedMesh(trunkGeo,new THREE.MeshStandardMaterial({color:0x5b4530,roughness:1}),treePositions.length);trunks.castShadow=true;trunks.receiveShadow=true;
const tiers=tierGeos.map(geo=>{const mesh=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.98}),treePositions.length);mesh.castShadow=true;mesh.receiveShadow=true;return mesh});
treePositions.forEach((p,i)=>{treeDummy.position.set(p.x,p.y+6.5*p.scale,p.z);treeDummy.rotation.set(0,p.turn,0);treeDummy.scale.set(p.scale,p.scale,p.scale);treeDummy.updateMatrix();trunks.setMatrixAt(i,treeDummy.matrix);trunks.setColorAt(i,new THREE.Color().setHSL(.08,.27,.25+Math.random()*.08));[9.5,18,26].forEach((height,j)=>{treeDummy.position.set(p.x,p.y+height*p.scale,p.z);treeDummy.scale.set(p.scale*(1-j*.07),p.scale,p.scale*(1-j*.07));treeDummy.updateMatrix();tiers[j].setMatrixAt(i,treeDummy.matrix);tiers[j].setColorAt(i,p.tint.clone().multiplyScalar(1-j*.07))})});scene.add(trunks,...tiers);
const rockGeo=new THREE.DodecahedronGeometry(1,1);const rocks=new THREE.InstancedMesh(rockGeo,new THREE.MeshStandardMaterial({color:0x74776e,roughness:1,flatShading:true}),90);rocks.castShadow=true;rocks.receiveShadow=true;for(let i=0;i<90;i++){let x=(Math.random()-.5)*1200,z=(Math.random()-.5)*1200;const s=1.5+Math.random()*5;treeDummy.position.set(x,groundHeight(x,z)+s*.28,z);treeDummy.rotation.set(Math.random()*.4,Math.random()*6,Math.random()*.4);treeDummy.scale.set(s,s*.55,s*.8);treeDummy.updateMatrix();rocks.setMatrixAt(i,treeDummy.matrix)}scene.add(rocks);
const logGeo=new THREE.CylinderGeometry(.9,.9,13,8);for(let i=0;i<35;i++){const l=new THREE.Mesh(logGeo,new THREE.MeshStandardMaterial({color:0x57412d,roughness:1}));let x=(Math.random()-.5)*1000,z=(Math.random()-.5)*1000;l.position.set(x,groundHeight(x,z)+1,z);l.rotation.z=Math.PI/2;l.rotation.y=Math.random()*Math.PI;l.castShadow=true;scene.add(l)}

function groundHeight(x,z){return 22*Math.sin(x*.018)*Math.sin(z*.017)+12*Math.cos(x*.031+z*.014)+Math.max(0,(Math.sqrt(x*x+z*z)-260)/3.5)}

const speciesSpeeds={Wolf:{walk:.035,trot:.065,run:.11,sprint:.17},Coyote:{walk:.038,trot:.07,run:.12,sprint:.19},Bear:{walk:.032,trot:.058,run:.095,sprint:.14},Cat:{walk:.04,trot:.075,run:.13,sprint:.21},Fox:{walk:.04,trot:.073,run:.125,sprint:.20},Ungulate:{walk:.045,trot:.09,run:.16,sprint:.24},Mammal:{walk:.038,trot:.068,run:.115,sprint:.18},Bird:{walk:.025,trot:.05,run:.09,sprint:.14}};

function makeRealisticElk(g, fur, isMale, sex) {
  // Refined elk anatomy: sloping back, broad chest, long neck, tapered face,
  // defined legs, muzzle, ears, and a warm winter coat with a pale rump.
  const ellipse=(sx,sy,sz,mat=fur,segments=28)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,segments,18),mat);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;return m};
  const dark=new THREE.MeshStandardMaterial({color:0x3d3428,roughness:.88});
  const light=new THREE.MeshStandardMaterial({color:0xd9cda9,roughness:.9});
  const nose=new THREE.MeshStandardMaterial({color:0x171713,roughness:.72});
  g.userData.sex=isMale?'Male':'Female';

  const body=ellipse(5.9,2.55,2.15,fur,32);body.position.set(-.2,.65,0);body.rotation.z=-.035;g.add(body);
  const shoulder=ellipse(2.85,3.15,2.32,fur,30);shoulder.position.set(3.65,.35,0);g.add(shoulder);
  const haunch=ellipse(2.25,2.55,2.24,fur,30);haunch.position.set(-4.2,.25,0);g.add(haunch);
  const neck=ellipse(1.65,3.55,1.62,fur,26);neck.position.set(5.15,2.55,0);neck.rotation.z=-.35;g.add(neck);
  const head=ellipse(2.05,1.72,1.48,fur,24);head.position.set(6.55,4.65,0);head.rotation.z=.10;g.add(head);
  const brow=ellipse(.72,.38,.95,dark,16);brow.position.set(7.42,5.18,0);g.add(brow);
  const neckChest=ellipse(1.45,2.0,1.72,dark,22);neckChest.position.set(4.72,-.05,0);neckChest.rotation.z=-.28;g.add(neckChest);
  const bridge=ellipse(1.78,.78,1.18,fur,22);bridge.position.set(7.95,3.75,0);bridge.rotation.z=-.48;g.add(bridge);
  const muzzle=ellipse(1.65,.72,1.22,light,22);muzzle.position.set(8.72,3.05,0);g.add(muzzle);
  const nostrils=ellipse(.42,.28,.25,nose,12);nostrils.position.set(10.25,3.02,0);nostrils.scale.z=.75;g.add(nostrils);

  // Mane and darker neck shading.
  for(let i=0;i<7;i++){const hair=ellipse(.62,1.15+i*.08,.18,dark,12);hair.position.set(4.45+i*.28,3.0-i*.18,0);hair.rotation.z=-.55+i*.025;g.add(hair)}
  const rump=ellipse(2.15,.95,2.18,light,24);rump.position.set(-5.55,.9,0);rump.scale.z=1.02;g.add(rump);

  for(const side of [-1,1]){
    const ear=ellipse(.55,1.55,.28,fur,16);ear.position.set(6.25,6.15,side*1.48);ear.rotation.z=side*.30;ear.rotation.x=side*.12;g.add(ear);
    const inner=ellipse(.32,.95,.12,light,12);inner.position.set(6.32,6.12,side*1.69);inner.rotation.z=side*.30;g.add(inner);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.18,12,8),nose);eye.position.set(7.52,4.92,side*1.18);g.add(eye);
    const eyeGlint=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:0xeef2dc}));eyeGlint.position.set(7.61,5.02,side*1.23);g.add(eyeGlint);

    if(isMale||sex==='Male'){
      const antlerMat=new THREE.MeshStandardMaterial({color:0x7a6748,roughness:.65,metalness:.03});
      const main=new THREE.Mesh(new THREE.CapsuleGeometry(.24,6.2,7,12),antlerMat);main.position.set(6.15,7.45,side*1.75);main.rotation.z=-side*.42;main.rotation.x=side*.48;main.castShadow=true;g.add(main);
      for(let r=0;r<6;r++){const length=1.55+r*.18;const tine=new THREE.Mesh(new THREE.CapsuleGeometry(.13,length,5,8),antlerMat);tine.position.set(6.45+r*.36,7.55+r*.72,side*(1.86+r*.10));tine.rotation.z=side*(.58+r*.10);tine.rotation.x=side*.18;tine.castShadow=true;g.add(tine)}
    }
  }

  g.userData.legs=[];
  for(const side of [-1,1])for(const fore of [-1,1]){
    const x=fore*3.65-(fore>0?.35:0),z=side*1.62;
    const upper=ellipse(.48,2.65,.48,fur,16);upper.position.set(x,-2.05,z);g.add(upper);
    const lower=ellipse(.38,2.9,.38,dark,14);lower.position.set(x+(fore>0?.18:-.12),-5.15,z);g.add(lower);
    const hoof=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.72,5,10),new THREE.MeshStandardMaterial({color:0x171713,roughness:.75}));hoof.position.set(lower.position.x,-7.82,z);hoof.scale.set(1,.55,.85);hoof.castShadow=true;g.add(hoof);g.userData.legs.push(lower);
  }
  g.userData.body=body;
}

function makeAnimal(a,isMale=false){
 const col=a[2]==='white'?0xe9ede4:a[2]==='brown'?0x6d563b:a[2]==='red'?0xb64c31:a[2]==='snow'?0xc4c5bc:a[2]==='tan'?0xa28a62:a[2]==='dark'?0x3d352d:a[2]==='gray'?0x777c75:a[2]==='black'?0x252927:a[2]==='green'?0x536941:a[2]==='sand'?0xb69a72:a[2]==='ginger'?0x9a6a43:0x7a6f5c;
 const g=new THREE.Group(),fur=new THREE.MeshStandardMaterial({color:col,map:furTexture,bumpMap:furTexture,bumpScale:.045,roughness:.9,metalness:0});
 const dark=new THREE.MeshStandardMaterial({color:0x25251f,roughness:.9});
 const light=new THREE.MeshStandardMaterial({color:0xdedac5,roughness:.85});
 const kind=a[1], name=a[0];
 const ellipse=(sx,sy,sz,mat=fur,segments=20)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,segments,12),mat);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;return m};

 if(kind==='Bird'){
  const body=ellipse(name==='Bald Eagle'?4.2:3.8,name==='Mallard Duck'?2.1:2.8,name==='Mallard Duck'?2.5:2.3,fur,18);g.add(body);
  const neck=ellipse(1.7,2.7,1.6,name==='Canada Goose'?light:fur,14);neck.position.set(3.3,2.1,0);g.add(neck);
  const head=ellipse(name==='Bald Eagle'?2.2:1.8,1.9,1.7,name==='Bald Eagle'?light:fur,16);head.position.set(4.8,4.2,0);g.add(head);
  const beakMat=new THREE.MeshStandardMaterial({color:name==='Mallard Duck'?0xd1a22f:0xb6a95e,roughness:.65});
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.65,2.3,8),beakMat);beak.rotation.z=-Math.PI/2;beak.position.set(6.6,4.2,0);beak.castShadow=true;g.add(beak);
  if(name==='Bald Eagle'){const crown=ellipse(.4,1.5,1.5,light,10);crown.position.set(4.8,5.7,0);g.add(crown)}
  for(const side of [-1,1]){const wing=ellipse(4.8,.35,1.8,fur,12);wing.position.set(-.5,1.2,side*2.6);wing.rotation.z=-.12*side;wing.rotation.x=side*.18;g.add(wing);const feather=ellipse(3.4,.18,1.05,dark,10);feather.position.set(-1.2,-.1,side*3.55);feather.rotation.z=.12;g.add(feather)}
  for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.18,1.5,4,8),light);leg.position.set(1, -4,side*.65);leg.castShadow=true;g.add(leg);g.userData.legs=g.userData.legs||[];g.userData.legs.push(leg)}
  g.userData.body=body;
 } else {
  const ungulate=kind==='Ungulate',bear=kind==='Bear',cat=kind==='Cat',fox=kind==='Fox',longMuzzle=['Gray Wolf','Coyote','Red Fox','Wolverine'].includes(name);
  if(name==='Elk'){makeRealisticElk(g,fur,isMale,a[0]);g.userData.kind=kind;g.userData.gait='walk';g.userData.fur=fur;return g}
  const body=ellipse(ungulate?5.8:bear?5.8:4.8,ungulate?3.0:bear?3.7:3.1,ungulate?2.4:bear?3.1:2.5,fur,22);body.position.y=.45;g.add(body);
  const shoulder=ellipse(bear?3.2:2.4,bear?3.5:2.8,ungulate?2.45:2.4,fur,18);shoulder.position.set(ungulate?3.7:3.9,bear?1.0:1.0,0);g.add(shoulder);
  const head=ellipse(longMuzzle?2.9:2.35,ungulate?2.7:bear?2.55:2.2,2.15,fur,18);head.position.set(ungulate?6.2:6.1,ungulate?2.1:bear?.2:.7,0);g.add(head);
  if(longMuzzle){const muzzle=ellipse(2.15,.95,1.45,fox?light:fur,14);muzzle.position.set(ungulate?7.9:7.65,ungulate?1.2:.0,0);g.add(muzzle)}
  for(const side of [-1,1]){
   const earShape=new THREE.SphereGeometry(1,12,8);const ear=new THREE.Mesh(earShape,fur);ear.scale.set(cat?.65:.85,cat?1.35:1.15,.45);ear.position.set(ungulate?5.8:5.4,ungulate?4.7:2.9,side*1.75);ear.rotation.z=side*(ungulate?.12:.18);ear.castShadow=true;g.add(ear);
   if(name==='Bobcat'||name==='Canadian Lynx'){const tip=new THREE.Mesh(new THREE.ConeGeometry(.25,.9,7),dark);tip.position.set(ear.position.x,ear.position.y+1.15,side*1.75);tip.rotation.z=-side*.12;g.add(tip)}
  }
  if(name==='Gray Wolf'||name==='Coyote'||name==='Red Fox'||name==='Chipmunk'){const snout=new THREE.Mesh(new THREE.SphereGeometry(.32,8,6),dark);snout.position.set(8.15,-.18,0);snout.scale.set(1,.75,.75);g.add(snout)}
  if(name==='Gray Wolf'||name==='Black Bear'||name==='Grizzly Bear'){for(const side of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),dark);eye.position.set(7.05,1.25,side*.95);g.add(eye)}}
  if(name==='Red Fox'||name==='Gray Wolf'){const chest=ellipse(1.7,1.15,2.15,light,12);chest.position.set(6.0,-1.0,0);g.add(chest);const tail=ellipse(fox?4.7:3.5,fox?.95:1.15,.95,fur,16);tail.position.set(-5.8,.7,0);tail.rotation.z=fox?.75:.55;g.add(tail);if(fox){const tip=ellipse(1.5,.98,.98,light,12);tip.position.set(-9.0,3.7,0);g.add(tip)}}
  if(ungulate&&['Elk','Moose','Mule Deer','White-tailed Deer'].includes(name)){
   const antlerMat=new THREE.MeshStandardMaterial({color:name==='Moose'?0x604d38:0x76664d,roughness:.82});
   const isElk=name==='Elk';
   for(const side of [-1,1]){
    if(name==='Moose'){
     for(let r=0;r<5;r++){const palm=new THREE.Mesh(new THREE.CapsuleGeometry(.38,2.8,5,8),antlerMat);palm.position.set(6.3+r*.55,6.2,side*(2.2+r*.15));palm.rotation.z=side*(.22+r*.16);palm.rotation.x=side*.9;palm.scale.set(1.8,.22,1);g.add(palm)}
    }else{
     const main=new THREE.Mesh(new THREE.CapsuleGeometry(isElk?.26:.18,6.0,5,8),antlerMat);main.position.set(5.9,6.4,side*(isElk?1.95:1.65));main.rotation.z=-side*(isElk?.32:.18);main.rotation.x=side*.72;g.add(main);
     const tineCount=isElk?6:3;for(let r=0;r<tineCount;r++){const tine=new THREE.Mesh(new THREE.CapsuleGeometry(isElk?.16:.13,1.9+r*.16,4,7),antlerMat);tine.position.set(6.15+r*.48,7.05+r*.58,side*(2.05+r*.12));tine.rotation.z=side*(.42+r*.12);tine.rotation.x=side*.18;g.add(tine)}
    }
   }
   if(name==='Elk'||name==='White-tailed Deer'||name==='Mule Deer'){const rump=ellipse(2.2,1.05,1.95,light,14);rump.position.set(-4.8,.95,0);g.add(rump);const neckDark=ellipse(1.55,1.25,1.85,dark,14);neckDark.position.set(4.9,1.8,0);g.add(neckDark)}
  }
  if(name==='Bighorn Sheep'||name==='Mountain Goat'){for(const side of [-1,1]){const horn=new THREE.Mesh(new THREE.TorusGeometry(1.35,.28,8,18,Math.PI*1.35),new THREE.MeshStandardMaterial({color:name==='Bighorn Sheep'?0x5b4c38:0xcbd0c1,roughness:.82}));horn.position.set(5.9,3.8,side*1.55);horn.rotation.y=Math.PI/2;horn.rotation.z=side*.25;g.add(horn)}}
  g.userData.legs=[];
  for(const side of [-1,1])for(const fore of [-1,1]){const leg=ellipse(bear?.65:.52,bear?3.6:3.8, bear?.65:.55,fur,10);leg.position.set(fore*(ungulate?3.7:2.9),-3.8,side*(ungulate?1.7:2.1));leg.userData.phase=side+fore;g.add(leg);g.userData.legs.push(leg)}
  if(name==='Beaver'||name==='Chipmunk'||name==='Snowshoe Hare'||name==='Rabbit'){const tail=ellipse(name==='Beaver'?3.0:2.2, name==='Beaver'?1.0:.7, name==='Beaver'?1.8:.55, name==='Beaver'?dark:fur,12);tail.position.set(-6.2,.2,0);tail.rotation.z=.45;g.add(tail)}
  g.userData.body=body;
 }
 g.userData.legs=g.userData.legs||[];g.userData.kind=kind;g.userData.gait='walk';g.userData.fur=fur;
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

const clockStart=performance.now();let elapsed=7.2;
// Cinematic menu staging: focus the Elk with a closer, lower camera and softer horizon.
camera.position.set(-34,groundHeight(-34,72)+23,76);
camera.lookAt(-2,groundHeight(-2,18)+10,18);
function animate(now){requestAnimationFrame(animate);if(player){let dx=(keys.KeyD||touchMove.x>.2?1:0)-(keys.KeyA||touchMove.x<-.2?1:0),dz=(keys.KeyW||touchMove.y<-.2?1:0)-(keys.KeyS||touchMove.y>.2?1:0);if(dx||dz){const ang=yaw+Math.atan2(dx,dz),moving=Math.abs(dx)+Math.abs(dz)>0;let gait='walk';if(keys.KeyR)gait='trot';if(keys.ControlLeft)gait='run';if(keys.ShiftLeft||keys.ShiftRight)gait='sprint';const speeds=speciesSpeeds[player.userData.kind]||speciesSpeeds.Mammal, speed=speeds[gait];player.position.x+=Math.sin(ang)*speed;player.position.z+=Math.cos(ang)*speed;player.rotation.y=ang-Math.PI/2;player.userData.gait=gait;player.userData.gaitTime=(player.userData.gaitTime||0)+.016;animateGait(player,player.userData.gaitTime,gait,speed)}else{player.userData.gait='walk';animateGait(player,0,'walk',0)}let ph=Math.max(.1,groundHeight(player.position.x,player.position.z)+5);player.position.y+= (ph-player.position.y)*.15;yaw=pitch;camera.position.lerp(new THREE.Vector3(player.position.x-Math.sin(yaw)*26,player.position.y+14-Math.sin(pitch)*10,player.position.z-Math.cos(yaw)*26),.12);camera.lookAt(player.position.x,player.position.y+2,player.position.z)}else{camera.position.y+= (groundHeight(0,0)+14-camera.position.y)*.05;camera.lookAt(0,30,0)}
if(!player&&!menuPreview){menuPreview=makeAnimal(animals[selected],sex==='Male');menuPreview.position.set(-5,groundHeight(-5,20)+7,20);menuPreview.scale.setScalar(.78);menuPreview.rotation.y=-.12;scene.add(menuPreview)}
 for(const w of wildlife){if(!w.down&&Math.random()<.004){w.dir+=(Math.random()-.5)*.8;if(Math.random()<.16)w.gait=['walk','walk','trot','run'][Math.floor(Math.random()*4)]}if(!w.down){const speeds=speciesSpeeds[w.mesh.userData.kind]||speciesSpeeds.Mammal,roll=Math.random(),speed=(speeds[w.gait]||speeds.walk)*(roll<.008?1.25:1);w.mesh.position.x+=Math.cos(w.dir)*speed;w.mesh.position.z+=Math.sin(w.dir)*speed;w.mesh.rotation.y=w.dir-Math.PI/2;w.gaitTime+=.016;animateGait(w.mesh,w.gaitTime,w.gait,speed);let y=groundHeight(w.mesh.position.x,w.mesh.position.z)+(w.spec[1]==='Bird'?8:4);w.mesh.position.y+=(y-w.mesh.position.y)*.1}}
 elapsed=6.1+((now-clockStart)/1000)/60*20;if(elapsed>=24)elapsed-=24;let h=Math.floor(elapsed),m=Math.floor((elapsed-h)*60);document.querySelector('#clock').textContent=`${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;const day=.55+.45*Math.cos((elapsed-6)/24*Math.PI*2);scene.fog.color.setRGB(.45*day+.25,.58*day+.28,.58*day+.31);hemi.intensity=.45+day*1.8;sun.intensity=.25+day*2.2;if(elapsed>20||elapsed<5)renderer.toneMappingExposure=.55;else renderer.toneMappingExposure=1;renderer.render(scene,camera)}requestAnimationFrame(animate);

function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800)}
document.querySelector('#start').onclick=()=>{document.querySelector('#menu').classList.add('hidden');document.querySelector('#speciesName').textContent=animals[selected][0].toUpperCase()+' · '+sex.toUpperCase();setPlayer();toast('You are a baby '+sex.toLowerCase()+' '+animals[selected][0])};
window.addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyC')document.querySelector('#callbox').classList.toggle('open')});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){pitch+=e.movementY*.002;yaw-=e.movementX*.002;pitch=Math.max(-.8,Math.min(.5,pitch));}});renderer.domElement.addEventListener('click',()=>{if(!document.querySelector('#menu').classList.contains('hidden'))return;renderer.domElement.requestPointerLock?.()});
document.querySelector('#calls').onclick=()=>document.querySelector('#callbox').classList.toggle('open');document.querySelectorAll('.call').forEach(b=>b.onclick=()=>toast(b.textContent+' — call echoed across the valley'));document.querySelector('#drink').onclick=()=>{toast('You drink deeply from the cold water');document.querySelector('#water').style.width='100%'};document.querySelector('#attack').onclick=()=>{let target=null,best=999;for(const w of wildlife){const d=player.position.distanceTo(w.mesh.position);if(d<best&&d<18){best=d;target=w}}if(target){target.down=!target.down;target.mesh.rotation.z=target.down?Math.PI/2:0;toast(target.down?'Prey is pinned — hold on!':'Prey escaped')}else toast('No prey within reach')};
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');let joyActive=false;joy.addEventListener('pointerdown',e=>{joyActive=true;joy.setPointerCapture(e.pointerId)});joy.addEventListener('pointermove',e=>{if(!joyActive)return;const r=joy.getBoundingRect();let x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);x=Math.max(-35,Math.min(35,x));y=Math.max(-35,Math.min(35,y));stick.style.transform=`translate(${x}px,${y}px)`;touchMove={x:x/35,y:y/35}});joy.addEventListener('pointerup',()=>{joyActive=false;stick.style.transform='';touchMove={x:0,y:0}});
