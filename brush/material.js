import * as THREE from 'three';
import * as build from './build.js';
import { globals } from '../globals.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const material = {
    brushTexture: new Uint8ClampedArray(4*globals.textureRes* globals.textureRes),
    heightTexture: new Int16Array(4*globals.textureRes* globals.textureRes),
    shineTexture: new Int16Array(4*globals.textureRes* globals.textureRes),
    normalTexture: new Uint8ClampedArray(4*globals.textureRes* globals.textureRes),
    roughTexture: new Uint8ClampedArray(4*globals.textureRes* globals.textureRes),
    metalTexture: new Uint8ClampedArray(4*globals.textureRes* globals.textureRes)
}