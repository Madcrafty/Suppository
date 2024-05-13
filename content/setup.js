/* global THREE */
//Declare Systen Variables

var scene;
var camera;
var renderer;
var controls;
var cameraLight;
var ambietLight;
var light;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(45, 10, 0);
    camera.lookAt(0, 0, 0);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera,renderer.domElement);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),0.5);
    cameraLight.castShadow = true;
    camera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.5);
}

//Resize the scene and update the camera aspect to the screen ration
var resizeScene = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
};