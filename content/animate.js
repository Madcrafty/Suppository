function runTheClock(){
    requestAnimationFrame(runTheClock);
    renderer.render(scene, camera);
}