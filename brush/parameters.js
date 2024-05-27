import * as THREE from 'three';
import * as build from './build.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const parameters = {
    brushSize:5,
    brushAlpha:50,
    brushHeight:0,
    brushKern:30,
    brushColor:new THREE.Color(0,255,0),
    brushShine:0,
}