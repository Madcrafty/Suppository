var size = 200;
var textureArr = new Uint8Array( 4 * size * size );

var scale = 100;
for (var x = 0; x < size; x++) {                  
    for (var y = 0; y < size; y++) {
        var nx = x/size-0.5;
        var ny = y/size-0.5;                    
        var value = Math.abs(perlin.get(scale*nx, scale*ny));
        value *= 256;

        var cell = (x + y * size) * 4;
        console.log(value);                    
        textureArr[cell] = textureArr[cell + 1] = textureArr[cell + 2] = Math.pow(1.2, value);                               
        textureArr[cell + 3] = 255; // alpha.                                    
    }
}

function makeSphere(){
    let geometry = new THREE.SphereGeometry(1,20,20);
    
    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;

    let material = new THREE.MeshBasicMaterial({
        map: texture,
        //envMap: uvtexture
    });

    let sphere = new THREE.Mesh(geometry,material);
    return sphere
}

//Add initial shapes to scene
function addShapes() {
    scene.add(makeSphere());
}