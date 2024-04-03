function makeSphere(){
    let geometry = new THREE.SphereGeometry(1,20,20);
    
    let texture = new THREE.TextureLoader().load("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjUpOW6kjkcc2cbPEGFK9joWPQpZlIPSAbfViGpjj8vw&s");
    // let uvtexture = new THREE.TextureLoader().load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b787e3ef-24a0-4f47-9d9c-ccd031d4ad14/d9s4yz3-dcfe213e-8f45-4b81-be21-7ad694db6179.jpg/v1/fill/w_894,h_894,q_70,strp/sand_dunes_height_map__seamless__by_elmininostock_d9s4yz3-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcL2I3ODdlM2VmLTI0YTAtNGY0Ny05ZDljLWNjZDAzMWQ0YWQxNFwvZDlzNHl6My1kY2ZlMjEzZS04ZjQ1LTRiODEtYmUyMS03YWQ2OTRkYjYxNzkuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xu7sioLtOjPeJd5X0lKaxbqo_yA6r6D6PHMFSWS3ZZs");
    console.log(texture);

    let material = new THREE.MeshBasicMaterial({
        map: texture,
        // envMap: uvtexture
    });

    let sphere = new THREE.Mesh(geometry,material);
    return sphere
}

//Add initial shapes to scene
function addShapes() {
    scene.add(makeSphere());
}