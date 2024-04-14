function runTheClock(){
    requestAnimationFrame(runTheClock);
    renderer.render(scene, camera);
}

function changeTexture(){
    requestAnimationFrame(changeTexture);
    
    offset++;
    createTexture();

    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;
    
    sphere.material.map = texture;
    sphere.material.needsUpdate = true;

    renderer.render(scene, camera);
}