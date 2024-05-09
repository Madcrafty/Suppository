import {globals} from "/globals.js";
import { GUI } from 'dat.gui';
import * as THREE from 'three';

//vis script
var vsRenderer;
var vsScene;
var vsCamera;
var vsCanvas;

export function start() {

}

export function run() {
    vsRenderer.render(vsScene, vsCamera);
}

export function init() {
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