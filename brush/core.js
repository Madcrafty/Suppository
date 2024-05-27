import { globals } from "/globals.js";
import * as build from "./build.js";
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


var renderer;
var scene;
var camera;
var canvas;
var controls;
var gui;

//Setup the 3 main components: scene, camera, renderer
export function init(_gui) {
    let width=window.innerWidth;
    let height = window.innerHeight;
    let ratio = (window.innerWidth / window.innerHeight)/globals.splitRatio;

    canvas = document.getElementById("brushCanvas");
    renderer = new THREE.WebGLRenderer({canvas:brushCanvas});
    renderer.setSize(width, height*globals.splitRatio);
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(45, 10, 0);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {MIDDLE: 1, RIGHT: 0};
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
    let width= window.innerWidth;
    let height = window.innerHeight;
    let ratio = (window.innerWidth / window.innerHeight)/globals.splitRatio;

    renderer.setSize(width, height*globals.splitRatio);
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}