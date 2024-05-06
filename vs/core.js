import {globals} from "/globals.js";

//vis script
var vsRenderer;
var vsScene;
var vsCamera;
var vsCanvas;

export function start() {
    init(); 
    run();
}

export function run() {
    requestAnimationFrame(run);
    vsRenderer.render(vsScene, vsCamera);
}

function init() {
    let width= window.innerWidth;
    let height = window.innerHeight;

    vsCanvas = document.getElementById("vsCanvas");
    vsRenderer = new THREE.WebGLRenderer({canvas:vsCanvas});
    vsRenderer.setSize(width, height*(1-globals.splitRatio));

    vsScene = new THREE.Scene();
    vsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
}

export function onResize() {
    let width= window.innerWidth;
    let height = window.innerHeight;

    vsRenderer.setSize(width, height*globals.splitRatio);
    vsRenderer.render(vsScene, vsCamera);
}