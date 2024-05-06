import * as vs from "./vs/core.js";
import * as brush from "./brush/core.js";

start();

//This runs on program start
function start() {
    vs.start();
    brush.start();
    window.addEventListener('resize', onResize);
    run();
}

//Main Loop
function run() {
    requestAnimationFrame(run);
    brush.run();
}

function onResize() {
    brush.onResize();
    vs.onResize();
}