import { GetSchemes } from 'rete';
import * as Nodes from '../nodes';
import {Connection} from './connection';

export type Node = 
  | Nodes.NumberNode
  | Nodes.AddNode 
  | Nodes.OutputNode
  | Nodes.TextureNode
  | Nodes.XNode;
export type Conn = 
  | Connection<Nodes.NumberNode, Nodes.OutputNode>
  | Connection<Nodes.NumberNode, Nodes.AddNode>
  | Connection<Nodes.AddNode, Nodes.OutputNode>
export type Schemes = GetSchemes<Node, Conn>; 