import * as THREE from 'three'

export default function starfield({numstar=500,r=25}={})
{
    function getrandompositions()
    {
       
       const radius= Math.random()*25+r;

       let u=Math.random();
       let v=Math.random();
       let theta=2*Math.PI*u;
       let phi=Math.acos(2*v-1);
       let z=radius*Math.cos(phi);
       let y=radius*Math.sin(phi)*Math.sin(theta);
       let x=radius*Math.sin(phi)*Math.cos(theta);
       return{
        pos:new THREE.Vector3(x,y,z),
        heu:Math.random()*(360-0)-0,
        minDis:radius
       }



    }
    let vertices=[];
    let colors=[];
    let position=[];
    let color;
    

     for(let i =0;i<numstar;i++)
    {
        let p=getrandompositions();
       
        const {heu,pos}=p;
        position.push(p);
        
        vertices.push(pos.x,pos.y,pos.z);
        color=new THREE.Color().setHSL(heu,0.2,Math.random());
        colors.push(color.r,color.g,color.b);
       
    }
    const geo= new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors,3));
   
    const mat =new THREE.PointsMaterial({
        size:1,
        vertexColors:true,
        map:new THREE.TextureLoader().load("../textures/Stars/circle.png"),
        emissive: 0xfffffff, // same color as the star
        emissiveIntensity: 10 
    })
    
    const points= new THREE.Points(geo,mat);
    console.log("hello",points)
    return points;

    
}