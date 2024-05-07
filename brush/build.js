import {parameters} from "./parameters.js";

//Core Variables
var renderer;
var scene;
var camera;
var gui;

//Sphere Texture and Displacement Arrays
var textureArr;
var displaceArr;

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

//Lighting
var cameraLight;
var ambietLight;

//init is used to initialise any core variables.
export function init(_renderer, _scene, _camera, _gui) {
    renderer=_renderer;
    scene=_scene;
    camera=_camera;
    gui = _gui;

    brush = new Uint8Array( 4 * parameters.brushKern * parameters.brushKern );
    hbrush = new Int8Array( parameters.brushKern * parameters.brushKern );
    textureArr = new Uint8Array( 4 * resolution * resolution );
    displaceArr = new Uint8Array( 3 * resolution * resolution );

    gui.addColor(parameters,'brushColor').onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushSize',0,parameters.brushKern,1).onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushAlpha',0,255).onChange(function(){
        createBrush();
    });
    gui.add(parameters,'brushHeight',-2,2).onChange(function(){
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

    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat);
    texture.type = THREE.UnsignedByteType;
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
            var cell = (x + y * resolution) * 3;                  
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = 100;                               
        }
    }
}


function createBrush(){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var cell = (x + y * parameters.brushKern) * 4;
            var hcell = (x + y * parameters.brushKern);
            
            if(Math.sqrt(((x-Math.ceil(parameters.brushKern/2))**2)+((y-Math.ceil(parameters.brushKern/2))**2)) < parameters.brushSize){
                brush[cell + 3] = parameters.brushAlpha;
                hbrush[hcell] = parameters.brushHeight;                        
            } else {
                brush[cell + 3] = 0;
                hbrush[hcell] = 0;
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

            if(brush[cell + 3] > 0){
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
            
            if(brush[cell + 3] > 0){
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

function changeHeightTexture(offx,offy){
    for (var x = 0; x < parameters.brushKern; x++) {                  
        for (var y = 0; y < parameters.brushKern; y++) {
            var hcell = (((mouseX + x - Math.ceil(parameters.brushKern/2)) + ((mouseY + y - Math.ceil(parameters.brushKern/2)) * resolution)) * 3)%(3*resolution*resolution);
            var cell = (x + y * parameters.brushKern); 

            var newH = Math.min(255,Math.max(0,displaceArr[hcell] + hbrush[cell]));

            displaceArr[hcell] = displaceArr[hcell+1] = displaceArr[hcell+2] = newH;
        }
    }
}

function makeSphere(){
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let texture = new THREE.DataTexture(textureArr, resolution, resolution, THREE.RGBAFormat);
    let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBFormat);
    
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;

    htexture.type = THREE.UnsignedByteType;
    htexture.needsUpdate = true;

    let material = new THREE.MeshPhongMaterial({
        map: texture,
        displacementMap:htexture,
        displacementScale: 1
    });

    material.needsUpdate = true;

    let sphere = new THREE.Mesh(geometry,material);
    return sphere
}

//Add initial shapes to scene
function addShapes() {
    scene.add(sphere);
    scene.add(ambietLight);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),0.5);
    camera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.5);
}

function onMouseMove(event) {
    mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        let p = intersects[0].point;
        let x = (p.x - sphere.position.x) / (radius);
        let y = (p.y - sphere.position.y) / radius;
        let z = (p.z - sphere.position.z) / radius;

        let u = (Math.atan2(z, x) / (2 * Math.PI) + 0.5);
        let v = ((Math.asin(y) / Math.PI) + 0.5);

        mouseX = resolution - Math.floor(u * resolution);
        mouseY = Math.floor(v * resolution);

        if(mouseDown){
            changeAreaTexture();
            changeHeightTexture();
            let htexture = new THREE.DataTexture(displaceArr, resolution, resolution, THREE.RGBFormat);
            htexture.type = THREE.UnsignedByteType;
            htexture.needsUpdate = true;
            sphere.material.displacementMap = htexture;
        }
    }
}