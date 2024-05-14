import { GetSchemes } from 'rete';
import {AddNode, BrushNode, NumberNode} from '../nodes';
import {Connection} from './connection';

export type Node = 
  | NumberNode
  | AddNode 
  | BrushNode;
export type Conn =
  | Connection<NumberNode, BrushNode>
  | Connection<BrushNode, NumberNode>
  | Connection<NumberNode, AddNode>
  | Connection<AddNode, AddNode>
  | Connection<AddNode, BrushNode>;
export type Schemes = GetSchemes<Node, Conn>;