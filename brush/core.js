import { globals } from "/globals.js";
import * as build from "./build.js";

var renderer;
var scene;
var camera;
var canvas;
var controls;
//lights
var cameraLight;
var ambietLight;

var gui;

//Setup the 3 main components: scene, camera, renderer
export function init(_gui) {
    var width=window.innerWidth;
    var height = window.innerHeight;

    canvas = document.getElementById("brushCanvas");
    renderer = new THREE.WebGLRenderer({canvas:brushCanvas});
    renderer.setSize(width, height*globals.splitRatio);
    
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(45, 10, 0);
    controls = new THREE.OrbitControls(camera,renderer.domElement);
    gui = _gui;

    build.init(renderer, scene, camera, gui);
}

export function start() {
    build.start();
}

export function run() {
    build.run();   
}

//Resize the scene and update the camera aspect to the screen ration
export function onResize() {
    var width= window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height*globals.splitRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

