import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import spline from './spline.js'
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
const w=window.innerWidth;
const h=window.innerHeight;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);


const fov=75;
const aspect=w/h;
const near=0.3;
const far=7;
const camera=new THREE.PerspectiveCamera(fov,aspect,near,far);
camera.position.z=2;
const scene= new THREE.Scene();

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=0.03;






//post processing with glow effect
const renderScene=new RenderPass(scene,camera);
const bloompass =new UnrealBloomPass(new THREE.Vector2(w,h),1.5,0.4,100);
bloompass.threshold=0.002;
bloompass.Strength=1.5;
bloompass.radius=0;
const composer=new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloompass);


scene.fog=new THREE.FogExp2( 0x0000,0.3);







//construct line from points
const points=spline.getPoints(100);
const geometry=new THREE.BufferGeometry().setFromPoints(points);
const matrial=new THREE.LineBasicMaterial( { color: 0xff0000 });
const curvePath=new THREE.Line(geometry,matrial);


const tubegeo=new THREE.TubeGeometry(spline,222,0.65,16,true);
const tubemat=new THREE.MeshBasicMaterial({ color: 0x00ff00,side:THREE.DoubleSide,wireframe:true });
const tube=new THREE.Mesh(tubegeo,tubemat);
scene.add(tube);





//move camera inside the wireframe 

function movecam(t)
{
   
    const time=t*0.3;
    const looptime=20*1000;
    const p=(time%looptime)/looptime;
    
    const pos=tubegeo.parameters.path.getPointAt(p);
   
    const lookat=tubegeo.parameters.path.getPointAt((p+0.03)%1);
    camera.position.copy(pos);
    camera.lookAt(lookat);

}

//generate boxes using the positon of the tube

const nboxes=55;
const size=0.072;
const boxmat=new THREE.MeshBasicMaterial({color:0xEE4B2B,wireframe:true});
const boxgeo=new THREE.BoxGeometry(size,size,size);
for (let i =0; i<nboxes;i++)
{
    const box=new THREE.Mesh(boxgeo,boxmat);
    const pb=(i/nboxes + Math.random()*0.1)%1;
   
    const bpos= tubegeo.parameters.path.getPointAt(pb);
    bpos.x+=Math.random()-0.4;
    bpos.z+=Math.random()-0.4;
    box.position.copy(bpos);
    const rot=new THREE.Vector3(
        Math.random()*Math.PI,
        Math.random()*Math.PI,
        Math.random()*Math.PI,

    )
    box.rotation.set(rot.x,rot.y,rot.z);
    const boxh=new THREE.BoxHelper(box,0xEE4B2B);
    scene.add(boxh);
   
}







function animation(t=0){
   
    requestAnimationFrame(animation);
    movecam(t);
    composer.render(scene,camera);
    controls.update();

}

animation();