import fontJSON from "./font.js"
import * as Three from "./three.js"
import "./OrbitControls.js"
let scene, camera, renderer, cube, text, textLists,controls,earth;
let speed = 0.0005;
let id = null;
let num_vertices = 32;
function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
    );

    // renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({ alpha: true });
    function render() {
        renderer.render( scene, camera );
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new THREE.OrbitControls(camera, renderer.domElement );
    
    // disable rotate
    controls.rotateSpeed = 0.1;
    controls.zoomSpeed = 0.1;
    controls.panSpeed = 0.1;

    controls.noZoom = true;
    controls.noPan = true;

    //vertical limit
    controls.minPolarAngle = Math.PI/3.5;
    controls.maxPolarAngle = Math.PI/1.5;

    //horizontal limit
    controls.minAzimuthAngle = -Math.PI/6;
    controls.maxAzimuthAngle = Math.PI/6;

    controls.dynamicDampingFactor = 0.3;

    document.body.appendChild(renderer.domElement);


    // geometry for the rotating users
    const geometry = new THREE.SphereGeometry(52,6,6,Math.PI *0.5);
    const material = new THREE.MeshBasicMaterial({color:0xffffff});

    createEarth();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.renderOrder = -999;
    console.log(cube.geometry.vertices);
  
    camera.position.z = 100;

    let loader = new THREE.FontLoader();
    let font = loader.parse(fontJSON);
    let textmaterial = new THREE.MeshBasicMaterial({color:0x000000});
    let textgeometry = new THREE.TextGeometry("hello", {font: font, size: 2, height: 0, curveSegments: 0.000001});
    textLists = [];
    for (let i = 0; i < num_vertices; i ++){
        text = new THREE.Mesh(textgeometry, textmaterial);
        //text.renderOrder = 999;
        text.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        scene.add(text);
        text.position.set(cube.geometry.vertices[i].x, cube.geometry.vertices[i].y, cube.geometry.vertices[i].z);
        textLists.push(text);
    } 
    

}

async function createEarth(){
        // geometry for the earth
        const earth_geometry = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        const earth_texture = new THREE.TextureLoader().load("earth.jpg");
        const earth_material = new THREE.MeshBasicMaterial({map:earth_texture});
        //const material = new THREE.MeshBasicMaterial({color:0x000000});
        earth = new THREE.Mesh(earth_geometry, earth_material);
        await scene.add(earth);
        earth.renderOrder = 200;

}

function animate() {
    speed = speed * 0.5;
    if (id != null){
        cancelAnimationFrame(id);
        cube.rotation.x += speed;
        cube.rotation.y += speed;
    }
    id = requestAnimationFrame(animate);
    // earth.rotation.x += 0.0003;
    earth.rotation.y += 0.0003;
    renderer.render(scene, camera);
    cube.updateMatrixWorld();
   

    for (let i = 0; i < num_vertices; i ++){
        let vector = cube.localToWorld(cube.geometry.vertices[i]);
        let text = textLists[i];
        if (vector.z > 0){
          text.renderOrder = 999;
        }
        else{
            text.renderOrder = -200;
        }
        text.matrix.setPosition(vector);
        text.matrixAutoUpdate = false;
        //text.renderOrder = 999;
    }

}


function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize,false);
init();
animate();


