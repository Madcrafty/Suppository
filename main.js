import * as brush from "./brush/core.js";
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import {globals} from './globals.js';
var gui;

init();
start();
run();

function init() {
    gui = new GUI();
    gui.add(globals, "tickRate", 0, 1000);
    gui.add(globals, "programTickRate", 0, 1000);

    window.addEventListener('resize', onResize);
    brush.init(gui);
}

//This runs on program start
function start() {
    brush.start();
}

//Main Loop
function run() {
    setTimeout(()=> {requestAnimationFrame(run)}, globals.programTickRate);
    brush.run();
}


function onResize() {
    brush.onResize();
}