import { ClassicPreset as Classic } from 'rete';
import { Node } from './schemes';

export class Connection<A extends Node, B extends Node> extends Classic.Connection<A, B> {}