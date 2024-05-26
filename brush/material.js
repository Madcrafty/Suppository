import * as THREE from 'three';
import * as build from './build.js';
import { globals } from '../globals.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const material = {
    brushTexture: new Uint8ClampedArray(4*globals.textureRes),
    heightTexture: new Uint8ClampedArray(4*globals.textureRes),
    shineTexture: new Uint8ClampedArray(4*globals.textureRes),
    normalTexture: new Uint8ClampedArray(4*globals.textureRes),
    roughTexture: new Uint8ClampedArray(4*globals.textureRes),
    metalTexture: new Uint8ClampedArray(4*globals.textureRes)
}