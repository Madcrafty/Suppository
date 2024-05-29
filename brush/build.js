import { GUI } from 'dat.gui';
import * as THREE from 'three';
import {material} from './material.js'
import { globals } from "../globals.js";
import { uv } from 'three/examples/jsm/nodes/Nodes.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';


//Core Variables
var renderer;
var scene;
var camera;
var gui;

//Sphere Texture and Displacement Arrays (now moved to makeSphere())
// var textureArr;
// var displaceArr;
// var specArr;

//Sphere variables
var resolution=1000;
var offset = 0;
var sphere;
var radius = 1;

// Faces
var faceIndexOut;

//The mouse position
var mouseX;
var mouseY;
var intersectedObject;
var mouseDown;
var raycaster;
var mouse;

var active = true;

//Lighting
var cameraLight;
var ambietLight;
var light_dir

var shapes = [];

//init is used to initialise any core variables.
export function init(_renderer, _scene, _camera, _gui) {
    renderer=_renderer;
    scene=_scene;
    camera=_camera;
    gui = _gui;
    
}

//called on start
export function start() {
    setupMouse();
    setLight();
    createSkybox();
    setDragControls();  

    for (let i = 0; i < 3; i++) {
        let sphere = makeSphere(1);
        sphere.position.set(i * 5, 0, 0);
        let cube = makeCube(2, 2, 2);
        cube.position.set(i * 5, 5, 0);
        let cylinder = makeCylinder(1, 1, 2);
        cylinder.position.set(i * 5, -5, 0);
    }

    addShapes();
}

export function run() {
    render();
}

function setDragControls()
{
    const dControls = new DragControls(shapes, camera, renderer.domElement);
    dControls.enabled = false;

    window.addEventListener('keydown', function (event) {
        var keyCode = event.code;
        console.log(keyCode); 
        if(keyCode == "Space"){
            dControls.enabled = !dControls.enabled;
            active = !active;
        }
    }, false);
}

function render() {
    if (intersectedObject) {
        if ((intersectedObject.geometry instanceof THREE.BoxGeometry) || (intersectedObject.geometry instanceof THREE.CylinderGeometry)) {
            var texarr = intersectedObject.textureArrs[faceIndexOut];
            var mat = intersectedObject.material[faceIndexOut];
        } else {
            var texarr = intersectedObject.textureArr;
            var mat = intersectedObject.material;
        }

        AddMarker(intersectedObject.wrapX, intersectedObject.wrapY, texarr);

        renderer.render(scene, camera);

        RemoveMarker(intersectedObject.wrapX, intersectedObject.wrapY, texarr);
        let texture = new THREE.DataTexture(texarr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        texture.needsUpdate = true;
        mat.map = texture;
        mat.needsUpdate = true;
    } else {
        renderer.render(scene, camera);
    }

}

function setupMouse() {
    mouseX=0;
    mouseY=0;
    mouseDown=false;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove, false);

    window.addEventListener('mousedown', function (event) {
        if(event.button == 0){
            mouseDown = true;
            onMouseMove(event);
        }
    }, false);

    window.addEventListener('mouseup', function (event) {
        if(event.button == 0){
            mouseDown = false;
        }
    }, false);
}
function createSkybox() {
    const cubeLoader = new THREE.CubeTextureLoader();
    const skybox = cubeLoader.load([
    'models/skybox_left-x.png',
    'models/skybox_right-x.png',
    'models/skybox_up-y.png',
    'models/skybox_down-y.png',
    'models/skybox_front-z.png',
    'models/skybox_back-z.png',
    ]);
    scene.background = skybox;
}
function createTexture(textureArr, displaceArr, specArr, factor) {
    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // parameters.brushAlpha.
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = factor;   
            displaceArr[cell + 3]=0;  
            specArr[cell] = specArr[cell + 1] = specArr[cell + 2] = 0;                               
        }
    }
}

function AddMarker(wrapX, wrapY, textureArr){
    for (var y = 0; y < globals.textureRes; y++) {
        for (var x = 0; x < globals.textureRes; x++){
            //here, ytexcell has parameters flipped to align the axes of the brush texture and the sphere texture!
            var xtexcell = (mouseX + x - Math.ceil(globals.textureRes/2))
            var ytexcell = (mouseY - y + Math.ceil(globals.textureRes/2))

            if(wrapY && (ytexcell >= resolution || ytexcell < 0)){
                continue;
            }
            if(wrapX && (xtexcell >= resolution || xtexcell < 0)){
                continue;
            }

            var texcell = ((xtexcell + (ytexcell* resolution)) * 4) % (4*resolution*resolution);
            var cell = (x + y * globals.textureRes) * 4; 

            if(material.brushTexture[cell + 3] > 0 || material.heightTexture[cell + 3] > 0 || material.shineTexture[cell + 3] > 0){
                textureArr[texcell+1] += 50;
            }
        }
    }
}

function RemoveMarker(wrapX,wrapY, textureArr){
    for (var y = 0; y < globals.textureRes; y++) {
        for (var x = 0; x < globals.textureRes; x++){
            //here, ytexcell has parameters flipped to align the axes of the brush texture and the sphere texture!
            var xtexcell = (mouseX + x - Math.ceil(globals.textureRes/2))
            var ytexcell = (mouseY - y + Math.ceil(globals.textureRes/2))

            if(wrapY && (ytexcell >= resolution || ytexcell < 0)){
                continue;
            }
            if(wrapX && (xtexcell >= resolution || xtexcell < 0)){
                continue;
            }

            var texcell = ((xtexcell + (ytexcell* resolution)) * 4) % (4*resolution*resolution);
            var cell = (x + y * globals.textureRes) * 4; 
            
            if(material.brushTexture[cell + 3] > 0 || material.heightTexture[cell + 3] > 0 || material.shineTexture[cell + 3] > 0){
                textureArr[texcell+1] -= 50;
            }
        }
    }
}

function changeTexture(wrapX, wrapY, textureArr, displaceArr, specArr) {
    for (var y = 0; y < globals.textureRes; y++) {
        for (var x = 0; x < globals.textureRes; x++){
            //here, ytexcell has parameters flipped to align the axes of the brush texture and the sphere texture!
            var xtexcell = (mouseX + x - Math.ceil(globals.textureRes/2))
            var ytexcell = (mouseY - y + Math.ceil(globals.textureRes/2))

            if(wrapY && (ytexcell >= resolution || ytexcell < 0)){
                continue;
            }
            if(wrapX && (xtexcell >= resolution || xtexcell < 0)){
                continue;
            }

            var texcell = ((xtexcell + (ytexcell*resolution)) * 4) % (4*resolution*resolution);
            var cell = (x + y * globals.textureRes) * 4; 
            let alpha = material.brushTexture[cell+3]/255;
            let brushR =  alpha*material.brushTexture[cell];
            let brushG = alpha*material.brushTexture[cell+1];
            let brushB = alpha*material.brushTexture[cell+2];
            let texR = (1-alpha)*textureArr[texcell]
            let texG = (1-alpha)*textureArr[texcell+1]
            let texB = (1-alpha)*textureArr[texcell+2]
            textureArr[texcell] = Math.ceil(brushR+texR);
            textureArr[texcell+1] = Math.ceil(brushG+texG);
            textureArr[texcell+2] = Math.ceil(brushB+texB);

            var brushHeight = ((material.heightTexture[cell] + material.heightTexture[cell+1] + material.heightTexture[cell+2])/3)/25;
            var finalBrushHeight = brushHeight * (material.heightTexture[cell+3]/255);
            var newH = Math.min(255,Math.max(0,displaceArr[texcell] + finalBrushHeight));
            displaceArr[texcell] = displaceArr[texcell+1] = displaceArr[texcell+2] = newH;

            var brushShine = ((material.shineTexture[cell] + material.shineTexture[cell+1] + material.shineTexture[cell+2])/3)/25;
            var finalBrushShine = brushShine * (material.shineTexture[cell+3]/255);
            var newSH = Math.min(100,Math.max(0,specArr[texcell] + finalBrushShine));

            specArr[texcell] = specArr[texcell+1] = specArr[texcell+2] = newSH;
        }
    }
}

function makeSphere(radius) {
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let textureArr = new Uint8Array( 4 * resolution * resolution );
    let displaceArr = new Uint8Array( 4 * resolution * resolution );
    let specArr = new Uint8Array( 4 * resolution * resolution );

    createTexture(textureArr, displaceArr, specArr, 100);

    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);

    texture.needsUpdate = true;
    htexture.needsUpdate = true;
    stexture.needsUpdate = true;

    var specCol = new THREE.Color(0,0,0);

    let material = new THREE.MeshPhongMaterial({
        map: texture,
        displacementMap:htexture,
        displacementScale: 1,
        specularMap:stexture,
        specular:specCol
    });

    material.needsUpdate = true;

    let sphere = new THREE.Mesh(geometry,material);
    sphere.receiveShadow=true;
    sphere.castShadow=true;

    sphere.textureArr = new Uint8Array(textureArr);
    sphere.displaceArr = new Uint8Array(displaceArr);
    sphere.specArr = new Uint8Array(specArr);
    sphere.wrapX = false;
    sphere.wrapY = true;

    shapes.push(sphere);
    scene.add(sphere); 

    return sphere;
}

function makeCube(wi, hi, le){
    let geometry = new THREE.BoxGeometry(wi, hi, le, 20, 20, 20);

    let textureArrs = [];
    let displaceArrs = [];
    let specArrs = [];
    let materials = [];

    for (let i = 0; i < 6; i++) {
        let textureArr = new Uint8Array(4 * resolution * resolution);
        let displaceArr = new Uint8Array(4 * resolution * resolution);
        let specArr = new Uint8Array(4 * resolution * resolution);

        createTexture(textureArr, displaceArr, specArr, 0);

        let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);

        texture.needsUpdate = true;
        htexture.needsUpdate = true;
        stexture.needsUpdate = true;

        let material = new THREE.MeshPhongMaterial({
            map: texture,
            displacementMap: htexture,
            displacementScale: 1,
            specularMap: stexture,
        });

        material.needsUpdate = true;

        textureArrs.push(textureArr);
        displaceArrs.push(displaceArr);
        specArrs.push(specArr);
        materials.push(material);
    }

    let cube = new THREE.Mesh(geometry, materials);
    cube.receiveShadow=true;
    cube.castShadow=true;

    cube.textureArrs = textureArrs;
    cube.displaceArrs = displaceArrs;
    cube.specArrs = specArrs;
    cube.wrapX = true;
    cube.wrapY = true;

    shapes.push(cube);
    scene.add(cube);

    return cube;
}

function makeCylinder(rtop, rbot, height){
    let geometry = new THREE.CylinderGeometry(rtop, rbot, height, 200, 200);

    let textureArrs = [];
    let displaceArrs = [];
    let specArrs = [];
    let materials = [];

    for (let i = 0; i < 3; i++) {
        let textureArr = new Uint8Array(4 * resolution * resolution);
        let displaceArr = new Uint8Array(4 * resolution * resolution);
        let specArr = new Uint8Array(4 * resolution * resolution);

        createTexture(textureArr, displaceArr, specArr, 0);

        let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);

        texture.needsUpdate = true;
        htexture.needsUpdate = true;
        stexture.needsUpdate = true;

        let material = new THREE.MeshPhongMaterial({
            map: texture,
            displacementMap: htexture,
            displacementScale: 1,
            specularMap: stexture,
        });

        material.needsUpdate = true;

        textureArrs.push(textureArr);
        displaceArrs.push(displaceArr);
        specArrs.push(specArr);
        materials.push(material);
    }

    let cylinder = new THREE.Mesh(geometry, materials);
    cylinder.receiveShadow=true;
    cylinder.castShadow=true;

    cylinder.textureArrs = textureArrs;
    cylinder.displaceArrs = displaceArrs;
    cylinder.specArrs = specArrs;
    cylinder.wrapX = false;
    cylinder.wrapY = true;

    shapes.push(cylinder);
    scene.add(cylinder);

    return cylinder;
}

//Add initial shapes to scene
function addShapes() {
    scene.add(ambietLight);
    scene.add(light_dir);
    scene.add(camera);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),1.0);
    camera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.2);
    light_dir = new THREE.DirectionalLight(0xffffff, 1.0);
    light_dir.position.set(-50, 40, 50);
    light_dir.castShadow=true;
}

function onMouseMove(event) {
    
    mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        let obj = intersects[0].object;

        let u = intersects[0].uv.x;
        let v = intersects[0].uv.y;

        let textureArr;
        let displaceArr;
        let specArr;


        intersectedObject = obj;

        mouseX = Math.floor(u * resolution);
        mouseY = Math.floor(v * resolution);

        if (obj.geometry instanceof THREE.BoxGeometry) {
            let faceNormal = intersects[0].face.normal;
            let faceIndex;
            if (faceNormal.x === 1) {
                faceIndex = 0;
            } else if (faceNormal.x === -1) {
                faceIndex = 1;
            } else if (faceNormal.y === 1) {
                faceIndex = 2;
            } else if (faceNormal.y === -1) {
                faceIndex = 3;
            } else if (faceNormal.z === 1) {
                faceIndex = 4;
            } else if (faceNormal.z === -1) {
                faceIndex = 5;
            }

            textureArr = obj.textureArrs[faceIndex];
            displaceArr = obj.displaceArrs[faceIndex];
            specArr = obj.specArrs[faceIndex];
            faceIndexOut = faceIndex;
        } else if (obj.geometry instanceof THREE.CylinderGeometry) {
            let faceNormal = intersects[0].face.normal;
            let faceIndex;
            if (faceNormal.y === 1) {
                faceIndex = 1;
            } else if (faceNormal.y === -1) {
                faceIndex = 2;
            } else {
                faceIndex = 0;
            }
            console.log(faceIndex);

            textureArr = obj.textureArrs[faceIndex];
            displaceArr = obj.displaceArrs[faceIndex];
            specArr = obj.specArrs[faceIndex];
            faceIndexOut = faceIndex;
        } else {
            textureArr = obj.textureArr;
            displaceArr = obj.displaceArr;
            specArr = obj.specArr;
        }

        if(mouseDown && active){
            changeTexture(obj.wrapX, obj.wrapY, textureArr, displaceArr, specArr);

            let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            htexture.needsUpdate = true;

            let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            stexture.needsUpdate = true;

            if (obj.geometry instanceof THREE.BoxGeometry || obj.geometry instanceof THREE.CylinderGeometry) {
                obj.material[faceIndexOut].displacementMap = htexture;
                obj.material[faceIndexOut].specularMap = stexture;
                obj.material.needsUpdate = true;
            } else {
                obj.material.displacementMap = htexture;
                obj.material.specularMap = stexture;
                obj.material.needsUpdate = true;
            }

            active = false;
            setTimeout(() => {
                active = true;
            },globals.tickRate)

        }
    }
}

// function onMouseMove(event) {
    
//     mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
//     raycaster.setFromCamera(mouse, camera);
  
//     let intersects = raycaster.intersectObjects(scene.children, true);


//     if(intersects[0]){
//         let u = intersects[0].uv.x;
//         let v = intersects[0].uv.y;

//         mouseX = Math.floor(u * resolution);
//         mouseY = Math.floor(v * resolution);

//         if(mouseDown && active){
//             changeAreaTexture(false,true);
//             changeHeightTexture(false,true);
//             changeShineTexture(false,true);
//             let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
//             htexture.needsUpdate = true;

//             let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
//             stexture.needsUpdate = true;

//             sphere.material.displacementMap = htexture;
//             sphere.material.specularMap = stexture;


//         }
//     }
// }