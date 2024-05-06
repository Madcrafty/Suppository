function changeTexture(){
    setTimeout(function(){requestAnimationFrame(changeTexture)}, 0);

    AddMarker(offx,offy);
    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;
    sphere.material.map = texture;
    sphere.material.needsUpdate = true;
    
    renderer.render(scene, camera);
    RemoveMarker(offx,offy);
}