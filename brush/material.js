import * as THREE from 'three';
import * as build from './build.js';
import { globals } from '../globals.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const material = {
    brushTexture: new Uint8Array(globals.textureSize),
    heightTexture: new Int16Array(globals.textureSize),
    shineTexture: new Int16Array(globals.textureSize),
    alphTexture: new Int16Array(globals.textureSize),
    metTexture: new Int16Array(globals.textureSize),
}