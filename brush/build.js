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

// Drag
export var dControls;

//instantiate objects
var intersectionPoint = new THREE.Vector3();
var planeNormal = new THREE.Vector3();
var plane = new THREE.Plane();
//var mode = 0;
//var shape = 0;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
cubeRenderTarget.texture.type = THREE.HalfFloatType;

const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );



//init is used to initialise any core variables.
export function init(_renderer, _scene, _camera, _gui) {
    renderer=_renderer;
    scene=_scene;
    camera=_camera;
    gui = _gui;
    gui.add(globals, "mode", 0, 2).onChange(function(val){
        globals.mode = Math.round(val);
        console.log(globals.mode + " in menu");
        if (globals.mode == 0){
            dControls.enabled = false;
            active = true;
        } else if (globals.mode == 1){
            dControls.enabled = true;
            active = false;
        } else if (globals.mode == 2){
            dControls.enabled = false;
            active = false;
        }
    });
    gui.add(globals, "shape", 0, 2).onChange(function(val){
        globals.shape = Math.round(val);
        if (globals.shape == 0){
            let sphere = makeSphere(1);
            sphere.position.copy(intersectionPoint);
        }   else if (globals.shape == 1) {
            let cube = makeCube(2, 2, 2);
            cube.position.copy(intersectionPoint);
        }   else if (globals.shape == 2) {
            let cylinder = makeCylinder(1, 1, 2);
            cylinder.position.copy(intersectionPoint);
        }
    });   
}

//called on start
export function start() {
    setupMouse();
    setLight();
    createSkybox();
    setDragControls();  
    setInstantiationControls();

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

<<<<<<< HEAD
function setDragControls() {
    dControls = new DragControls(shapes, camera, renderer.domElement);
=======
function setDragControls()
{
    const dControls = new DragControls(shapes, camera, renderer.domElement);
  
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    dControls.enabled = false;

    window.addEventListener('keydown', function (event) {
        var keyCode = event.code;
        console.log(keyCode); 
        if(keyCode == "Space"){
            globals.mode++;
            console.log(globals.mode);
            if (globals.mode > 2) {globals.mode = 0;}

            if (globals.mode == 0){
                dControls.enabled = false;
                active = true;
            } else if (globals.mode == 1){
                dControls.enabled = true;
                active = false;
            } else if (globals.mode == 2){
                console.log("mode 2");
                dControls.enabled = false;
                active = false;
            }
        }
        if(keyCode == "KeyQ"){
            globals.shape++;
            if(globals.shape > 2){globals.shape = 0;}
        }
        if(keyCode == "KeyE"){
            globals.shape--;
            if(globals.shape < 0){globals.shape = 2;}
        }
    }, false);
}

function setInstantiationControls() {
    window.addEventListener('click', function(e){
        if  (globals.mode == 2){
            if (globals.shape == 0){
                let sphere = makeSphere(1);
                sphere.position.copy(intersectionPoint);
            }   else if (globals.shape == 1) {
                let cube = makeCube(2, 2, 2);
                cube.position.copy(intersectionPoint);
            }   else if (globals.shape == 2) {
                let cylinder = makeCylinder(1, 1, 2);
                cylinder.position.copy(intersectionPoint);
            }
            
        }        
    })
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
    ], function(texture){
        //texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = skybox;
        scene.environment = skybox;
    });
}
<<<<<<< HEAD
function createTexture(textureArr, displaceArr, specArr, alphArr, metArr, factor) {
=======
function createTexture(textureArr, displaceArr, specArr, alphArr, factor) {
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // parameters.brushAlpha.
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = factor;   
            displaceArr[cell + 3]=0;  
            specArr[cell] = specArr[cell + 1] = specArr[cell + 2] = 0; 
            metArr[cell] = metArr[cell + 1] = metArr[cell + 2] = 255;  
            alphArr[cell] = alphArr[cell + 1] = alphArr[cell + 2] = 255;                          
        }
    }
    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            alphArr[cell] = alphArr[cell + 1] = alphArr[cell + 2] = 0;                               
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

            if(material.brushTexture[cell + 3] > 0 || material.heightTexture[cell + 3] > 0 || material.roughTexture[cell + 3] > 0 
                || material.metalTexture[cell + 3] > 0 || material.alphTexture[cell + 3] > 0){
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
            
            if(material.brushTexture[cell + 3] > 0 || material.heightTexture[cell + 3] > 0 || material.roughTexture[cell + 3] > 0 
                || material.metalTexture[cell + 3] > 0 || material.alphTexture[cell + 3] > 0){
                textureArr[texcell+1] -= 50;
            }
        }
    }
}

<<<<<<< HEAD
function changeTexture(wrapX, wrapY, textureArr, displaceArr, specArr, alphArr, metArr) {
=======
function changeTexture(wrapX, wrapY, textureArr, displaceArr, specArr, alphArr) {
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
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

            var brushRough = ((material.roughTexture[cell] + material.roughTexture[cell+1] + material.roughTexture[cell+2])/3)/25;
            var finalBrushRough = brushRough * (material.roughTexture[cell+3]/255);
            var newSH = Math.min(255,Math.max(0,specArr[texcell] + finalBrushRough));

            specArr[texcell] = specArr[texcell+1] = specArr[texcell+2] = newSH;
<<<<<<< HEAD

            var brushMet = ((material.metalTexture[cell] + material.metalTexture[cell+1] + material.metalTexture[cell+2])/3)/25;
            var finalBrushMet = brushMet * (material.metalTexture[cell+3]/255);
            var newMH = Math.min(255,Math.max(0,specArr[texcell] + finalBrushMet));

            metArr[texcell] = metArr[texcell+1] = metArr[texcell+2] = newMH;
          
            var brushAlph = ((material.alphTexture[cell] + material.alphTexture[cell+1] + material.alphTexture[cell+2])/3)/25;
            var finalBrushAlph = brushAlph * (material.alphTexture[cell+3]/255);
            var newAH = Math.min(255,Math.max(0,alphArr[texcell] + finalBrushAlph));
=======
          
            var brushAlph = ((material.alphTexture[cell] + material.alphTexture[cell+1] + material.alphTexture[cell+2])/3);
            var finalBrushAlph = brushAlph * (material.alphTexture[cell+3]/255);
            var newAH = Math.min(100,Math.max(0,alphArr[texcell] + finalBrushAlph));
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

            alphArr[texcell] = alphArr[texcell+1] = alphArr[texcell+2] = newAH;
        }
    }
}


function changeAlphaTexture(wrapX,wrapY, alphArr){
    for (var y = 0; y < globals.textureRes; y++) {
        for (var x = 0; x < globals.textureRes; x++){
            //here, yhcell has parameters flipped to align the axes of the brush texture and the sphere texture!
            var xscell = (mouseX + x - Math.ceil(globals.textureRes/2))
            var yscell = (mouseY - y + Math.ceil(globals.textureRes/2))

            if(wrapY && (yscell >= resolution || yscell < 0)){
                continue;
            }
            if(wrapX && (xscell >= resolution || xscell < 0)){
                continue;
            }

            var scell = ((xscell + (yscell* resolution)) * 4) % (4*resolution*resolution);
            var cell = (x + y * globals.textureRes) * 4; 
            var brushAlph = ((material.alphTexture[cell] + material.alphTexture[cell+1] + material.alphTexture[cell+2])/3);
            var finalBrushAlph = brushAlph * (material.alphTexture[cell+3]/255);
            var newSH = Math.min(100,Math.max(0,alphArr[scell] + finalBrushAlph));

            alphArr[scell] = alphArr[scell+1] = alphArr[scell+2] = newSH;
        }
    }
}


function makeSphere(radius) {
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let textureArr = new Uint8Array( 4 * resolution * resolution );
    let displaceArr = new Uint8Array( 4 * resolution * resolution );
    let specArr = new Uint8Array( 4 * resolution * resolution );
    let alphArr = new Uint8Array( 4 * resolution * resolution );
<<<<<<< HEAD
    let metArr = new Uint8Array( 4 * resolution * resolution );

    createTexture(textureArr, displaceArr, specArr, alphArr, metArr, 100);
=======

    createTexture(textureArr, displaceArr, specArr, alphArr, 100);
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let atexture = new THREE.DataTexture(alphArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
<<<<<<< HEAD
    let mtexture = new THREE.DataTexture(metArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

    texture.needsUpdate = true;
    htexture.needsUpdate = true;
    stexture.needsUpdate = true;
    atexture.needsUpdate = true;
<<<<<<< HEAD
    mtexture.needsUpdate = true;
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

    var specCol = new THREE.Color(10,10,10);

    let material = new THREE.MeshPhysicalMaterial({
        map: texture,
        displacementMap:htexture,
        displacementScale: 1,
<<<<<<< HEAD
        roughnessMap:stexture,
        metalnessMap:mtexture,
        alphaMap: atexture,
        envMap: cubeRenderTarget.texture,
        transparent: true,
        reflectivity: 1.0,
=======
        specularMap:stexture,
        specular:specCol,
        alphaMap: atexture
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    });

    material.needsUpdate = true;

    let sphere = new THREE.Mesh(geometry,material);
    sphere.receiveShadow=true;
    sphere.castShadow=true;

    sphere.textureArr = new Uint8Array(textureArr);
    sphere.displaceArr = new Uint8Array(displaceArr);
    sphere.specArr = new Uint8Array(specArr);
    sphere.alphArr = new Uint8Array(alphArr);
<<<<<<< HEAD
    sphere.metArr = new Uint8Array(metArr);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

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
    let alphArrs = [];
<<<<<<< HEAD
    let metArrs = [];
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    let materials = [];

    for (let i = 0; i < 6; i++) {
        let textureArr = new Uint8Array(4 * resolution * resolution);
        let displaceArr = new Uint8Array(4 * resolution * resolution);
        let specArr = new Uint8Array(4 * resolution * resolution);
        let alphArr = new Uint8Array( 4 * resolution * resolution );
<<<<<<< HEAD
        let metArr = new Uint8Array( 4 * resolution * resolution );

        createTexture(textureArr, displaceArr, specArr, alphArr, metArr, 0);
=======

        createTexture(textureArr, displaceArr, specArr, alphArr, 0);
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

        let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let atexture = new THREE.DataTexture(alphArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
<<<<<<< HEAD
        let mtexture = new THREE.DataTexture(metArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

        texture.needsUpdate = true;
        htexture.needsUpdate = true;
        stexture.needsUpdate = true;
        atexture.needsUpdate = true;
<<<<<<< HEAD
        mtexture.needsUpdate = true;
        var specCol = new THREE.Color(10,10,10);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

        let material = new THREE.MeshPhysicalMaterial({
            map: texture,
            displacementMap: htexture,
            displacementScale: 1,
<<<<<<< HEAD
            roughnessMap: stexture,
            alphaMap: atexture,
            metalnessMap: mtexture,
            transparent: true,
            reflectivity: 1.0,
=======
            specularMap: stexture,
            alphaMap: atexture
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
        });

        material.needsUpdate = true;

        textureArrs.push(textureArr);
        displaceArrs.push(displaceArr);
        specArrs.push(specArr);
        alphArrs.push(alphArr);
<<<<<<< HEAD
        metArrs.push(metArr);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
        materials.push(material);
    }

    let cube = new THREE.Mesh(geometry, materials);
    cube.receiveShadow=true;
    cube.castShadow=true;

    cube.textureArrs = textureArrs;
    cube.displaceArrs = displaceArrs;
    cube.specArrs = specArrs;
    cube.alphArrs = alphArrs;
<<<<<<< HEAD
    cube.metArrs = metArrs;
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
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
    let alphArrs = [];
<<<<<<< HEAD
    let metArrs = [];
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    let materials = [];

    for (let i = 0; i < 3; i++) {
        let textureArr = new Uint8Array(4 * resolution * resolution);
        let displaceArr = new Uint8Array(4 * resolution * resolution);
        let specArr = new Uint8Array(4 * resolution * resolution);
        let alphArr = new Uint8Array( 4 * resolution * resolution );
        let metArr = new Uint8Array( 4 * resolution * resolution );

        createTexture(textureArr, displaceArr, specArr, alphArr, metArr, 0);

        let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
        let atexture = new THREE.DataTexture(alphArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
<<<<<<< HEAD
        let mtexture = new THREE.DataTexture(metArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

        texture.needsUpdate = true;
        htexture.needsUpdate = true;
        stexture.needsUpdate = true;
        atexture.needsUpdate = true;
<<<<<<< HEAD
        mtexture.needsUpdate = true;
        var specCol = new THREE.Color(10,10,10);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

        let material = new THREE.MeshPhysicalMaterial({
            map: texture,
            displacementMap: htexture,
            displacementScale: 1,
<<<<<<< HEAD
            roughnessMap: stexture,
            alphaMap: atexture,
            metalnessMap: mtexture,
            transparent: true,
            reflectivity: 1.0,
=======
            specularMap: stexture,
            alphaMap: atexture
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
        });

        material.needsUpdate = true;

        textureArrs.push(textureArr);
        displaceArrs.push(displaceArr);
        specArrs.push(specArr);
        alphArrs.push(alphArr);
<<<<<<< HEAD
        metArrs.push(metArr);
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
        materials.push(material);
    }

    let cylinder = new THREE.Mesh(geometry, materials);
    cylinder.receiveShadow=true;
    cylinder.castShadow=true;

    cylinder.textureArrs = textureArrs;
    cylinder.displaceArrs = displaceArrs;
    cylinder.specArrs = specArrs;
    cylinder.alphArrs = alphArrs;
<<<<<<< HEAD
    cylinder.metArrs = metArrs;
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039

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
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane,intersectionPoint);
  
    let intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        let obj = intersects[0].object;

        let u = intersects[0].uv.x;
        let v = intersects[0].uv.y;

        let textureArr;
        let displaceArr;
        let specArr;
        let alphArr;
<<<<<<< HEAD
        let metArr;
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039


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
            alphArr = obj.alphArrs[faceIndex];
<<<<<<< HEAD
            metArr = obj.metArrs[faceIndex];
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
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
            alphArr = obj.alphArrs[faceIndex];
<<<<<<< HEAD
            metArr = obj.metArrs[faceIndex];
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
            faceIndexOut = faceIndex;
        } else {
            textureArr = obj.textureArr;
            displaceArr = obj.displaceArr;
            specArr = obj.specArr;
            alphArr = obj.alphArr;
<<<<<<< HEAD
            metArr = obj.metArr;
=======
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
        }

        if(mouseDown && active){
          
<<<<<<< HEAD
            changeTexture(obj.wrapX, obj.wrapY, textureArr, displaceArr, specArr, alphArr, metArr);
=======
            changeTexture(obj.wrapX, obj.wrapY, textureArr, displaceArr, specArr, alphArr);
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039


            let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            htexture.needsUpdate = true;

            let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            stexture.needsUpdate = true;

            let atexture = new THREE.DataTexture(alphArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            atexture.needsUpdate = true;

<<<<<<< HEAD
            let mtexture = new THREE.DataTexture(metArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            mtexture.needsUpdate = true;

            if (obj.geometry instanceof THREE.BoxGeometry || obj.geometry instanceof THREE.CylinderGeometry) {
                obj.material[faceIndexOut].displacementMap = htexture;
                obj.material[faceIndexOut].roughnessMap = stexture;
                obj.material[faceIndexOut].metalnessMap = mtexture;
=======
            if (obj.geometry instanceof THREE.BoxGeometry || obj.geometry instanceof THREE.CylinderGeometry) {
                obj.material[faceIndexOut].displacementMap = htexture;
                obj.material[faceIndexOut].specularMap = stexture;
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
                obj.material[faceIndexOut].alphaMap = atexture;
                obj.material.needsUpdate = true;
            } else {
                obj.material.displacementMap = htexture;
<<<<<<< HEAD
                obj.material.roughnessMap = stexture;
                obj.material.metalnessMap = mtexture;
=======
                obj.material.specularMap = stexture;
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
                obj.material.alphaMap = atexture;
                obj.material.needsUpdate = true;
            }

            active = false;
            setTimeout(() => {
                active = true;
            },globals.tickRate)

        }
    }
}