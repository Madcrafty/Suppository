import * as brush from "./brush/core.js";
import { GUI } from 'dat.gui';
import * as THREE from 'three';

var gui;

init();
start();
run();

function init() {
    gui = new GUI();
    window.addEventListener('resize', onResize);
    brush.init(gui);
}

//This runs on program start
function start() {
    brush.start();
}

//Main Loop
function run() {
    requestAnimationFrame(run);
    brush.run();
}


function onResize() {
    brush.onResize();
}