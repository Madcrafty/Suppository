var size = 200;
var textureArr = new Uint8Array( 4 * size * size );
var offset = 0;
var sphere;

function createTexture(){
    var scale = 100;
    for (var x = 0; x < size; x++) {                  
        for (var y = 0; y < size; y++) {
            var nx = (x+offset)/size-0.5;
            var ny = (y+offset)/size-0.5;                    
            var value = Math.abs(perlin.get(scale*nx, scale*ny));
            value *= 256;
            
            let finalV = Math.pow(1.2, value);
            if (finalV > 100){
                finalV = 255;
            }

            var cell = (x + y * size) * 4;                  
            textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = finalV;                               
            textureArr[cell + 3] = 255; // alpha.                                    
        }
    }
}


function makeSphere(){
    let geometry = new THREE.SphereGeometry(1,100,100);
    
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
sphere = makeSphere();

//Add initial shapes to scene
function addShapes() {
    scene.add(sphere);
}