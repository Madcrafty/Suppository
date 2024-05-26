import { GetSchemes } from 'rete';
import * as Nodes from '../nodes';
import {Connection} from './connection';

export type Node = 
  | Nodes.NumberNode
  | Nodes.OutputNode
  | Nodes.TextureNode
  | Nodes.XNode
  | Nodes.AddNode
  | Nodes.SubtractNode
  | Nodes.MultiplyNode
  | Nodes.DivideNode
  | Nodes.DistanceNode;
export type Conn = 
  | Connection<Nodes.NumberNode, Nodes.OutputNode>
export type Schemes = GetSchemes<Node, Conn>; 