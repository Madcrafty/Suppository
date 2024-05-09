var size = 200;
var textureArr = new Uint8Array( 4 * size * size );
var displaceArr = new Uint8Array( 3 * size * size );
var specArr = new Uint8Array( 3 * size * size );
var sphere;
var radius = 1;

//The mouse position
var offx = 0;
var offy = 0;

//Brush information
var brushKern = 30;
//Brush is for color, hbrush is for height stuff, the distinction is cause one needs to be an Int array, cause I want to reduce the height aswell
var brush = new Uint8Array( 4 * brushKern * brushKern );
var hbrush = new Int8Array( 2 * brushKern * brushKern );
var col = new THREE.Color(0,255,0);
var bSize = 5;
var alpha = 50;
var heightDelta = 0;
var shine = 0;

function createTexture(){
    for (var x = 0; x < size; x++) {                  
        for (var y = 0; y < size; y++) {
            var cell = (x + y * size) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = 255;                               
            textureArr[cell + 3] = 255; // alpha.
        }
    }

    for (var x = 0; x < size; x++) {                  
        for (var y = 0; y < size; y++) {
            var cell = (x + y * size) * 3;                  
            displaceArr[cell] = displaceArr[cell + 1] = displaceArr[cell + 2] = 100;                               
        }
    }

    for (var x = 0; x < size; x++) {                  
        for (var y = 0; y < size; y++) {
            var cell = (x + y * size) * 3;                  
            specArr[cell] = specArr[cell + 1] = specArr[cell + 2] = 10;                               
        }
    }
}


function createBrush(){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var cell = (x + y * brushKern) * 4;
            var hcell = (x + y * brushKern) * 2;
            
            if(Math.sqrt(((x-Math.ceil(brushKern/2))**2)+((y-Math.ceil(brushKern/2))**2)) < bSize){
                brush[cell + 3] = alpha;
                hbrush[hcell] = heightDelta;
                hbrush[hcell + 1] = shine;                        
            } else {
                brush[cell + 3] = 0;
                hbrush[hcell] = 0;
                hbrush[hcell + 1] = 0;
            }
            brush[cell] = col.r;
            brush[cell+1] = col.g;
            brush[cell+2] = col.b;
        }
    }
}

function AddMarker(ofx,ofy){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var texcell = (((ofx + x - Math.ceil(brushKern/2)) + ((ofy + y - Math.ceil(brushKern/2)) * size)) * 4)%(4*size*size);
            var cell = (x + y * brushKern) * 4;
            var hcell = (x + y * brushKern) * 2; 

            if(brush[cell + 3] > 0 || hbrush[hcell] != 0 || hbrush[hcell+1] != 0){
                textureArr[texcell+1] = textureArr[texcell+1] + 25;
            }
        }
    }
}

function RemoveMarker(ofx,ofy){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var texcell = (((ofx + x - Math.ceil(brushKern/2)) + ((ofy + y - Math.ceil(brushKern/2)) * size)) * 4)%(4*size*size);
            var cell = (x + y * brushKern) * 4;
            var hcell = (x + y * brushKern) * 2;  
            
            if(brush[cell + 3] > 0 || hbrush[hcell] != 0 || hbrush[hcell+1] != 0){
                textureArr[texcell+1] = textureArr[texcell+1] - 25;
            }
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
}

function changeHeightTexture(ofx,ofy){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var hcell = (((ofx + x - Math.ceil(brushKern/2)) + ((ofy + y - Math.ceil(brushKern/2)) * size)) * 3)%(3*size*size);
            var cell = (x + y * brushKern) * 2; 

            var newH = Math.min(255,Math.max(0,displaceArr[hcell] + hbrush[cell]));

            displaceArr[hcell] = displaceArr[hcell+1] = displaceArr[hcell+2] = newH;
        }
    }
}

function changeShineTexture(ofx,ofy){
    for (var x = 0; x < brushKern; x++) {                  
        for (var y = 0; y < brushKern; y++) {
            var hcell = (((ofx + x - Math.ceil(brushKern/2)) + ((ofy + y - Math.ceil(brushKern/2)) * size)) * 3)%(3*size*size);
            var cell = (x + y * brushKern) * 2; 

            var newSH = Math.min(100,Math.max(0,specArr[hcell] + hbrush[cell+1]));

            specArr[hcell] = specArr[hcell+1] = specArr[hcell+2] = newSH;
        }
    }
}

function makeSphere(){
    let geometry = new THREE.SphereGeometry(radius,100,100);
    
    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    let htexture = new THREE.DataTexture(displaceArr, size, size, THREE.RGBFormat);
    let stexture = new THREE.DataTexture(specArr, size, size, THREE.RGBFormat);
    
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;

    htexture.type = THREE.UnsignedByteType;
    htexture.needsUpdate = true;

    stexture.type = THREE.UnsignedByteType;
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
    return sphere
}

createTexture();
createBrush();
sphere = makeSphere();

//Add initial shapes to scene
function addShapes() {
    scene.add(sphere);
    scene.add(camera);
    scene.add(ambietLight);
}


//Raycaster mouse tracking setup
var mousedown = false;

window.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('mousedown', function (event) {
    if(event.button == 0){
        mousedown = true;
        onMouseMove(event);
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
  
    const intersects = raycaster.intersectObjects(scene.children, true);


    if(intersects[0]){
        var p = intersects[0].point;
        var obj = intersects[0].object;
        var eradius = obj.position.distanceTo(p);
        var x = (p.x - obj.position.x) / (eradius);
        var y = (p.y - obj.position.y) / eradius;
        var z = (p.z - obj.position.z) / eradius;

        var u = (Math.atan2(z, x) / (2 * Math.PI) + 0.5);
        var v = ((Math.asin(y) / Math.PI) + 0.5);

        offx = size - Math.floor(u * size);
        offy = Math.floor(v * size);

        if(mousedown){
            changeAreaTexture(offx,offy);
            changeHeightTexture(offx,offy);
            changeShineTexture(offx,offy);

            let htexture = new THREE.DataTexture(displaceArr, size, size, THREE.RGBFormat);
            htexture.type = THREE.UnsignedByteType;
            htexture.needsUpdate = true;

            let stexture = new THREE.DataTexture(specArr, size, size, THREE.RGBFormat);
            stexture.type = THREE.UnsignedByteType;
            stexture.needsUpdate = true;

            sphere.material.displacementMap = htexture;
            sphere.material.specularMap = stexture;
        }
    }
}


// Creating a GUI and a subfolder.
var gui = new dat.GUI();

gui.addColor(window,'col').onChange(function(){
    createBrush();
});
gui.add(window,'bSize',0,brushKern,1).onChange(function(){
    createBrush();
});
gui.add(window,'alpha',0,255).onChange(function(){
    createBrush();
});
gui.add(window,'heightDelta',-4,4,2).onChange(function(){
    createBrush();
});

gui.add(window,'shine',-4,4,2).onChange(function(){
    createBrush();
});