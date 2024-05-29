import * as THREE from 'three';
import * as build from './build.js';
import { globals } from '../globals.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const material = {
    brushTexture: new Uint8Array(globals.textureSize),
    heightTexture: new Int16Array(globals.textureSize),
<<<<<<< HEAD
    roughTexture: new Int16Array(globals.textureSize),
    metalTexture: new Int16Array(globals.textureSize),
=======
    shineTexture: new Int16Array(globals.textureSize),
>>>>>>> f52f9f730dbbad8e6b1f92061893a6e330563039
    alphTexture: new Int16Array(globals.textureSize),
}