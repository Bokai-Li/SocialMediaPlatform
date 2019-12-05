import fontJSON from "./font.js"
import * as Three from "./three.js"
import "./OrbitControls.js"
let scene, camera, renderer,controls,earth,light;
let speed = 0.0005;
let id = null;
function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
    75,
    1/2*window.innerWidth/window.innerHeight,
    0.1,
    1000
    );


    //renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({ alpha: true });
    controls = new THREE.OrbitControls(camera, renderer.domElement );
    
    // disable rotate
    controls.rotateSpeed = 0.1;
    controls.zoomSpeed = 0.1;
    controls.panSpeed = 0.1;

    controls.dynamicDampingFactor = 0.3;
    renderer.setSize(window.innerWidth/2, window.innerHeight);
    scene.add(camera);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    createEarth();

    light = new THREE.SpotLight( 0xd3d3d3, 4, 0);
    light.position.y = 60;
    light.position.x = -60;
    light.target = earth;

    light.castShadow = true;
    let lightCamera = new THREE.PerspectiveCamera(100,1,500,1000)
    light.shadow = new THREE.LightShadow(lightCamera)
    light.shadow.bias = 0.0001
    light.shadow.mapSize.width = 2048 * 2;
    light.shadow.mapSize.height = 2048 * 2;
    scene.add(light);
    camera.add(light);

    camera.position.z = 100;
    renderer.render(scene, camera);
    document.getElementById("canvas").appendChild(renderer.domElement);
}

function createEarth(){
        // geometry for the earth http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
        const earth_geometry = new THREE.SphereGeometry(50, 32, 32);
        const earth_texture = new THREE.TextureLoader().load("earth_dark.jpg");
        const earth_material = new THREE.MeshLambertMaterial({map:earth_texture});

        earth = new THREE.Mesh(earth_geometry, earth_material);
        const cloud_geometry = new THREE.SphereGeometry(50.2, 32, 32);
        const cloud_texture = new THREE.TextureLoader().load("earthcloudmap.jpg");
        const cloud_material = new THREE.MeshLambertMaterial({map:cloud_texture, opacity: 0.2,transparent : true});
        let cloud = new THREE.Mesh(cloud_geometry, cloud_material);

        earth.castShadow = true; //default is false
        earth.receiveShadow = false; //default

        cloud.castShadow = true; //default is false
        cloud.receiveShadow = false; //default

        scene.add(earth);
        scene.add(cloud);

        earth.add(cloud)
        earth.renderOrder = 200;

        // America
        addFlag(37,-105,0x000000);
        //china
        addFlag(40,90,0x000000);
        //canada
        addFlag(60,-120,0x000000);
        //england
        addFlag(52.4,-1.2,0x000000);
        //austrilia
        addFlag(-33,151,0x000000);
        addFlag(40.82,140.74,0x000000);
        addFlag(19.897,-155.58,0x000000);
        addFlag(-35.6751,-71.5430,0x000000);
        addFlag(22.3569,91.7832,0x000000);

}

export default function addFlag(lat, lon,color){
    let flag =  createFlag(color);
    placeObjectOnPlanet(flag,lat,lon,50 )
    flag.renderOrder = 999;
    scene.add(flag);
    earth.add(flag);
}

function animate() {
    speed = speed * 0.5;
    if (id != null){
        cancelAnimationFrame(id);
    }
    id = requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    renderer.render(scene, camera);



}
// https://stackoverflow.com/questions/46017167/how-to-place-marker-with-lat-lon-on-3d-globe-three-js/46027856
function placeObjectOnPlanet(object, lat, lon, radius) {
    var latRad = (lat-2) * (Math.PI / 180) ;
    var lonRad = -lon * (Math.PI / 180) ;
    object.position.set(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius
    );
    object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
}




function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function createFlag(color){
    let resize = 0.15
    const geometry = new THREE.Geometry();
    geometry.vertices.push(

        new THREE.Vector3(-10 * resize, 0 * resize,  1 * resize),  // 0
        new THREE.Vector3( -9 * resize, 0 * resize,  1 * resize),  // 1
        new THREE.Vector3(-10 * resize,  15 * resize,  1 * resize),  // 2
        new THREE.Vector3( -9 * resize,  15 * resize,  1 * resize),  // 3
        new THREE.Vector3(-10 * resize, 0 * resize, -1 * resize),  // 4
        new THREE.Vector3( -9 * resize, 0 * resize, -1 * resize),  // 5
        new THREE.Vector3(-10 * resize,  15 * resize, -1 * resize),  // 6
        new THREE.Vector3( -9 * resize,  15 * resize, -1 * resize),  // 7
      new THREE.Vector3( 10 * resize, 15 * resize,  1 * resize),  // 8
      new THREE.Vector3(-10 * resize,  28 * resize,  1 * resize),  // 9
      new THREE.Vector3( 10 * resize,  28 * resize,  1 * resize),  // 10
      new THREE.Vector3( 10 * resize, 15 * resize, -1 * resize),  // 11
      new THREE.Vector3(-10 * resize,  28 * resize, -1 * resize),  // 12
      new THREE.Vector3( 10 * resize,  28 * resize, -1 * resize),  // 13

    );

    geometry.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),


        // front
        new THREE.Face3(2, 10, 9),
        new THREE.Face3(2, 8, 10),
        // right
        new THREE.Face3(8, 13, 10),
        new THREE.Face3(8, 11, 13),
        // back
        new THREE.Face3(11, 12, 13),
        new THREE.Face3(11, 6, 12),
        // left
        new THREE.Face3(6, 9, 12),
        new THREE.Face3(6, 2, 9),
        // top
        new THREE.Face3(9, 13, 12),
        new THREE.Face3(9, 10, 13),
        // bottom
        new THREE.Face3(6, 8, 2),
        new THREE.Face3(6, 11, 8),

      );


    let material = new THREE.MeshBasicMaterial( {color: color} );
    let flag = new THREE.Mesh( geometry, material );
    return flag
}

window.addEventListener('resize', onWindowResize,false);
init();
animate();


