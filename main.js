import * as vs from "./vs/core.js";
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
    vs.init();
}

//This runs on program start
function start() {
    vs.start();
    brush.start();
}

//Main Loop
function run() {
    requestAnimationFrame(run);
    brush.run();
    vs.run();
}


function onResize() {
    brush.onResize();
    vs.onResize();
}