import * as vs from "./vs/core.js";
import * as brush from "./brush/core.js";
import {parameters} from "./brush/parameters.js";

var gui;

init();
start();
run();

function init() {
    gui = new dat.GUI();
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