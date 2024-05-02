function animate(){
    requestAnimationFrame(animate);
    vsRenderer.render(vsScene, vsCamera);
    renderBrush();
}

function renderBrush(){
    AddMarker(offx,offy);

    let texture = new THREE.DataTexture(textureArr, size, size, THREE.RGBAFormat);
    texture.type = THREE.UnsignedByteType;
    texture.needsUpdate = true;

    let htexture = new THREE.DataTexture(displaceArr, size, size, THREE.RGBFormat);
    htexture.type = THREE.UnsignedByteType;
    htexture.needsUpdate = true;

    sphere.material.map = texture;
    sphere.material.displacementMap = htexture;
    sphere.material.needsUpdate = true;

    brushRenderer.render(brushScene, brushCamera);
    RemoveMarker(offx,offy);
}