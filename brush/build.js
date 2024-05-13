import {parameters} from "./parameters.js";
import { GUI } from 'dat.gui';
import * as THREE from 'three';

//Core Variables
var renderer;
var scene;
var camera;
var gui;

//Sphere Texture and Displacement Arrays
var textureArr;
var displaceArr;
var specArr;

//Brush and Height Brush Arrays
var brush;
var hbrush;

//Sphere variables
var resolution=200;
var offset = 0;
var sphere;
var radius = 1;

//The mouse position
var mouseX;
var mouseY;
var mouseDown;
var raycaster;
var mouse;

var active;

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

    brush = new Uint8Array( 4 * parameters.brushKern * parameters.brushKern );
    hbrush = new Int8Array( 2 * parameters.brushKern * parameters.brushKern );
    textureArr = new Uint8Array( 4 * resolution * resolution );
    displaceArr = new Uint8Array( 4 * resolution * resolution );
    specArr = new Uint8Array( 4 * resolution * resolution );

    gui.addColor(parameters,'brushColor').onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushSize',0,parameters.brushKern,1).onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushAlpha',0,255).onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushHeight',-4,4,2).onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushShine',-4,4,2).onChange(function(){
        createBrush();
    });
}

//called on start
export function start() {
    setupMouse();
    setLight();
    
    createTexture();
    createBrush();


    sphere = makeSphere();
    addShapes();
}

export function run() {
    render();
}

function render() {
    AddMarker();

    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
    texture.needsUpdate = true;

    sphere.material.map = texture;
    sphere.material.needsUpdate = true;

    renderer.render(scene, camera);
    RemoveMarker();
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
    for (var x = 0; x < resolution; x++) {                  
        for (var y = 0; y < resolution; y++) {
            var cell = (x + y * resolution) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // parameters.brushAlpha.
        }
    }

    for (var x = 0; x < resolution; x++) {                  
        for (var y = 0; y < resolution; y++) {
            var cell = (x + y * resolution) * 4;                  
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = 100;   
            displaceArr[cell + 3]=0;                            
        }
    }
    for (var x = 0; x < resolution; x++) {                  
        for (var y = 0; y < resolution; y++) {
            var cell = (x + y * resolution) * 4;                  
            specArr[cell] = specArr[cell + 1] = specArr[cell + 2] = 10;                               
        }
    }
}


function createBrush(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var cell = (x + y * parameters.brushKern) * 4;
            var hcell = (x + y * parameters.brushKern) * 2;
            
            if(Math.sqrt(((x-Math.ceil(parameters.brushKern/2))**2)+((y-Math.ceil(parameters.brushKern/2))**2)) < parameters.brushSize){
                brush[cell + 3] = parameters.brushAlpha;
                hbrush[hcell] = parameters.brushHeight;   
                hbrush[hcell+1] = parameters.brushShine;                     
            } else {
                brush[cell + 3] = 0;
                hbrush[hcell] = 0;
                hbrush[hcell + 1] = 0;
            }
            brush[cell] = parameters.brushColor.r;
            brush[cell+1] = parameters.brushColor.g;
            brush[cell+2] = parameters.brushColor.b;
        }
    }
}

function AddMarker(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var texcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 4)%(4*resolution*resolution);
            var cell = (x + y * parameters.brushKern) * 4; 
            var hcell = (x + y * parameters.brushKern) * 2;

            if(brush[cell + 3] > 0 || hbrush[hcell] != 0 || hbrush[hcell+1] != 0){
                textureArr[texcell+1] = textureArr[texcell+1] + 25;
            }
        }
    }
}

function RemoveMarker(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var texcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 4)%(4*resolution*resolution);
            var cell = (x + y * parameters.brushKern) * 4;
            var hcell = (x + y * parameters.brushKern) * 2;
            
            if(brush[cell + 3] > 0 || hbrush[hcell] != 0 || hbrush[hcell+1] != 0){
                textureArr[texcell+1] = textureArr[texcell+1] - 25;
            }
        }
    }
}


function changeAreaTexture(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var texcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 4)%(4*resolution*resolution);
            var cell = (x + y * parameters.brushKern) * 4; 

            textureArr[texcell] = Math.ceil(((brush[cell + 3]*brush[cell])+((255 - brush[cell + 3])*textureArr[texcell]))/255);
            textureArr[texcell+1] = Math.ceil(((brush[cell + 3]*brush[cell+1])+((255 - brush[cell + 3])*textureArr[texcell+1]))/255);
            textureArr[texcell+2] = Math.ceil(((brush[cell + 3]*brush[cell+2])+((255 - brush[cell + 3])*textureArr[texcell+2]))/255);
        }
    }
}

function changeHeightTexture(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var hcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 4)%(4*resolution*resolution);
            var cell = (x + y * parameters.brushKern) * 2; 

            var newH = Math.min(255,Math.max(0,displaceArr[hcell] + hbrush[cell]));

            displaceArr[hcell] = displaceArr[hcell+1] = displaceArr[hcell+2] = newH;
        }
    }
}

function changeShineTexture(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var hcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 4)%(4*resolution*resolution);
            var cell = (x + y * parameters.brushKern) * 2; 

            var newSH = Math.min(100,Math.max(0,specArr[hcell] + hbrush[cell+1]));

            specArr[hcell] = specArr[hcell+1] = specArr[hcell+2] = newSH;
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
    scene.add(cameraLight);
    scene.add(light_dir);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),1);
    camera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.2);
    light_dir = new THREE.DirectionalLight(0xffffff, 1);
    light_dir.position.set(-50, 40, 50);
    light_dir.castShadow=true;
}

function onMouseMove(event) {
    
    mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        let p = intersects[0].point;
        let obj = intersects[0].object;
        let eradius = obj.position.distanceTo(p);
        let x = (p.x - obj.position.x) / (eradius);
        let y = (p.y - obj.position.y) / eradius;
        let z = (p.z - obj.position.z) / eradius;

        let u = (Math.atan2(z, x) / (2 * Math.PI) + 0.5);
        let v = ((Math.asin(y) / Math.PI) + 0.5);

        mouseX = resolution - Math.floor(u * resolution);
        mouseY = Math.floor(v * resolution);

        if(mouseDown){
            changeAreaTexture();
            changeHeightTexture();
            changeShineTexture();
            let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            htexture.needsUpdate = true;

            let stexture = new THREE.DataTexture(specArr, resolution, resolution, THREE.RGBAFormat, THREE.UnsignedByteType);
            stexture.needsUpdate = true;

            sphere.material.displacementMap = htexture;
            sphere.material.specularMap = stexture;
        }
    }
}