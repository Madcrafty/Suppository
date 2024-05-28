import { GUI } from 'dat.gui';
import * as THREE from 'three';
import {material} from './material.js'
import { globals } from "../globals.js";
import { uv } from 'three/examples/jsm/nodes/Nodes.js';

//Core Variables
var renderer;
var scene;
var camera;
var gui;

//Sphere Texture and Displacement Arrays
var textureArr;
var displaceArr;
var specArr;

//Sphere variables
var resolution=1000;
var offset = 0;
var sphere;
var radius = 1;

//The mouse position
var mouseX;
var mouseY;
var mouseDown;
var raycaster;
var mouse;

var active = true;

//Lighting
var cameraLight;
var ambietLight;
var light_dir

//init is used to initialise any core variables.
export function init(_renderer, _scene, _camera, _gui) {
    renderer=_renderer;
    scene=_scene;
    camera=_camera;
    gui = _gui;

    textureArr = new Uint8Array( 4 * resolution * resolution );
    displaceArr = new Uint8Array( 4 * resolution * resolution );
    specArr = new Uint8Array( 4 * resolution * resolution );
}

//called on start
export function start() {
    setupMouse();
    setLight();
    
    createTexture();

    sphere = makeSphere();
    addShapes();
}

export function run() {
    render();
}

function render() {
    AddMarker(false,true);

    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
    texture.needsUpdate = true;

    sphere.material.map = texture;
    sphere.material.needsUpdate = true;

    renderer.render(scene, camera);
    RemoveMarker(false,true);
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

function createTexture(){
    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // parameters.brushAlpha.
        }
    }

    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = 100;   
            displaceArr[cell + 3]=0;                            
        }
    }
    for (var y = 0; y < resolution; y++) {                  
        for (var x = 0; x < resolution; x++) {
            var cell = (x + y * resolution) * 4;                  
            specArr[cell] = specArr[cell + 1] = specArr[cell + 2] = 0;                               
        }
    }
}

function AddMarker(wrapX, wrapY){
    if(!material.brushTexture) return;
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
                textureArr[texcell+1] = textureArr[texcell+1] + 50;
            }
        }
    }
}

function RemoveMarker(wrapX,wrapY){
    if(!material.brushTexture) return;
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
                textureArr[texcell+1] = textureArr[texcell+1] - 50;
            }
        }
    }
}


function changeAreaTexture(wrapX, wrapY){
    if(!material.brushTexture) return; 
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
        }
    }
}

function changeHeightTexture(wrapX, wrapY){
    if(!material.heightTexture) return;
    for (var y = 0; y < globals.textureRes; y++) {
        for (var x = 0; x < globals.textureRes; x++){
            //here, yhcell has parameters flipped to align the axes of the brush texture and the sphere texture!
            var xhcell = (mouseX + x - Math.ceil(globals.textureRes/2))
            var yhcell = (mouseY - y + Math.ceil(globals.textureRes/2))

            if(wrapY && (yhcell >= resolution || yhcell < 0)){
                continue;
            }
            if(wrapX && (xhcell >= resolution || xhcell < 0)){
                continue;
            }

            var hcell = ((xhcell + (yhcell* resolution)) * 4) % (4*resolution*resolution);
            var cell = (x + y * globals.textureRes) * 4; 
            var brushHeight = ((material.heightTexture[cell] + material.heightTexture[cell+1] + material.heightTexture[cell+2])/3);
            var finalBrushHeight = brushHeight * (material.heightTexture[cell+3]/255);
            var newH = Math.min(255,Math.max(0,displaceArr[hcell] + finalBrushHeight));
            displaceArr[hcell] = displaceArr[hcell+1] = displaceArr[hcell+2] = newH;
        }
    }
}

function changeShineTexture(wrapX,wrapY){
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
            var brushShine = ((material.shineTexture[cell] + material.shineTexture[cell+1] + material.shineTexture[cell+2])/3);
            var finalBrushShine = brushShine * (material.shineTexture[cell+3]/255);
            var newSH = Math.min(100,Math.max(0,specArr[scell] + finalBrushShine));

            specArr[scell] = specArr[scell+1] = specArr[scell+2] = newSH;
        }
    }
}



function makeSphere(){
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);
    let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat,THREE.UnsignedByteType);

    texture.needsUpdate = true;
    htexture.needsUpdate = true;
    stexture.needsUpdate = true;

    var specCol = new THREE.Color(10,10,10);

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
    return sphere
}

//Add initial shapes to scene
function addShapes() {
    scene.add(sphere);
    scene.add(ambietLight);
    scene.add(light_dir);
    scene.add(camera);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),1.0);
    camera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.2);
    light_dir = new THREE.DirectionalLight(0xffffff, 0.0);
    light_dir.position.set(-50, 40, 50);
    light_dir.castShadow=true;
}

function onMouseMove(event) {
    
    mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        let u = intersects[0].uv.x;
        let v = intersects[0].uv.y;

        mouseX = Math.floor(u * resolution);
        mouseY = Math.floor(v * resolution);

        if(mouseDown && active){
            changeAreaTexture(false,true);
            changeHeightTexture(false,true);
            changeShineTexture(false,true);
            let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            htexture.needsUpdate = true;

            let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            stexture.needsUpdate = true;

            sphere.material.displacementMap = htexture;
            sphere.material.specularMap = stexture;

            active = false;
            setTimeout(() => {
                active = true;
            },globals.tickRate)
        }
    }
}