var size = 400;
var textureArr = new Uint8Array( 4 * size * size );
var offset = 0;
var sphere;
var radius = 1;

var brushKern = 8;
var brush = new Uint8Array( 4 * brushKern * brushKern );
var col = new THREE.Color(0,255,0);
var bSize = 2;
var alpha = 50;

function createTexture(){
    for (var x = 0; x < size; x++) {                  
        for (var y = 0; y < size; y++) {
            var cell = (x + y * size) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // alpha.
        }
    }
}


function createBrush(){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var cell = (x + y * brushKern) * 4;
            
            if(((x-Math.ceil(brushKern/2))**2)+((y-Math.ceil(brushKern/2))**2) < bSize){
                brush[cell + 3] = alpha;                        
            } else {
                brush[cell + 3] = 0;
            }
            brush[cell] = col.r;
            brush[cell+1] = col.g;
            brush[cell+2] = col.b;
        }
    }
}

function changeAreaTexture(ofx,ofy){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var texcell = (((ofx + x - Math.ceil(brushKern/2)) + ((ofy + y - Math.ceil(brushKern/2)) * size)) * 4)%(4*size*size);
            var cell = (x + y * brushKern) * 4; 

            textureArr[texcell] = Math.ceil(((brush[cell + 3]*brush[cell])+((255 - brush[cell + 3])*textureArr[texcell]))/255);
            textureArr[texcell+1] = Math.ceil(((brush[cell + 3]*brush[cell+1])+((255 - brush[cell + 3])*textureArr[texcell+1]))/255);
            textureArr[texcell+2] = Math.ceil(((brush[cell + 3]*brush[cell+2])+((255 - brush[cell + 3])*textureArr[texcell+2]))/255);
        }
    }
    textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 0;
}

function makeSphere(){
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;

    let material = new THREE.MeshBasicMaterial({
        map: texture,
        //envMap: uvtexture
    });

    material.needsUpdate = true;

    let sphere = new THREE.Mesh(geometry,material);
    return sphere
}

createTexture();
createBrush();
sphere = makeSphere();
console.log(sphere);

//Add initial shapes to scene
function addShapes() {
    scene.add(sphere);
}


//Raycaster mouse tracking setup
var mousedown = false;

window.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('mousedown', function (event) {
    if(event.button == 0){
        mousedown = true;
    }
}, false);

window.addEventListener('mouseup', function (event) {
    if(event.button == 0){
        mousedown = false;
    }
}, false);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.set((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
  
    // console.log(mouse)
  
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObjects(scene.children, false);


    if(intersects[0] && mousedown){
        var p = intersects[0].point;
        var x = (p.x - sphere.position.x) / (radius);
        var y = (p.y - sphere.position.y) / radius;
        var z = (p.z - sphere.position.z) / radius;

        var u = (Math.atan2(z, x) / (2 * Math.PI) + 0.5);
        var v = ((Math.asin(y) / Math.PI) + 0.5);
        console.log("u,v:", u, v);

        var x = size - Math.floor(u * size);
        var y = Math.floor(v * size);
        console.log(x, y);

        changeAreaTexture(x,y);
    }
}


// Creating a GUI and a subfolder.
var gui = new dat.GUI();

gui.addColor(window,'col').onChange(function(){
    createBrush();
});
gui.add(window,'bSize',0,5).onChange(function(){
    createBrush();
});
gui.add(window,'alpha',0,255).onChange(function(){
    createBrush();
});