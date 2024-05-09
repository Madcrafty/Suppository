import { globals } from "/globals.js";
import * as THREE from 'three';

//Core Variables
var renderer;
var scene;
var camera;
var gui;
export function init(_renderer, _scene, _camera, _gui) {
    renderer=_renderer;
    scene=_scene;
    camera=_camera;
    gui = _gui;
}

export function start() {

}

export function run() {
    renderer.render(scene, camera);
}

