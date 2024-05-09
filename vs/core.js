import {globals} from "/globals.js";
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import * as build from "./build.js";

var renderer;
var scene;
var camera;
var canvas;
var gui;
export function init(_gui) {
    let width= window.innerWidth;
    let height = window.innerHeight;

    canvas = document.getElementById("vsCanvas");
    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize(width, height*(1-globals.splitRatio));

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    gui = _gui;
    build.init(renderer, scene, camera, gui);
}

export function start() {
    build.start();
}

export function run() {
    build.run();
}

export function onResize() {
    let width= window.innerWidth;
    let height = window.innerHeight;

    renderer.setSize(width, height*globals.splitRatio);
    renderer.render(scene, camera);
}