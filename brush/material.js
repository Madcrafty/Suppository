import * as THREE from 'three';
import * as build from './build.js';
//These are the brush parameters
//Just use import { parameters } from "/brush/parameters.js"
//use parameters.variable to access a particular variable.

export const material = {
    brushTexture: new Uint8ClampedArray(),
    heightTexture: new Uint8ClampedArray(),
    shineTexture: new Uint8ClampedArray(),
    normalTexture: new Uint8ClampedArray(),
    roughTexture: new Uint8ClampedArray(),
    metalTexture: new Uint8ClampedArray()
}