import { GetSchemes } from 'rete';
import * as Nodes from '../nodes';
import {Connection} from './connection';

export type Node = 
  | Nodes.NumberNode
  | Nodes.OutputNode
  | Nodes.TextureNode
  | Nodes.XNode
  | Nodes.YNode
  | Nodes.NoiseNode
  | Nodes.CircleNode
  | Nodes.ColorNode
  | Nodes.AddNode
  | Nodes.SubtractNode
  | Nodes.MultiplyNode
  | Nodes.DivideNode
  | Nodes.DistanceNode
  | Nodes.PowerNode;
export type Conn = 
  | Connection<Nodes.NumberNode, Nodes.OutputNode>
  | Connection<Nodes.NumberNode, Nodes.AddNode>
  | Connection<Nodes.AddNode, Nodes.OutputNode>
export type Schemes = GetSchemes<Node, Conn>; 