import { GetSchemes } from 'rete';
import * as Nodes from '../nodes';
import {Connection} from './connection';

export type Node = 
  | Nodes.NumberNode
  | Nodes.OutputNode
  | Nodes.XNode
  | Nodes.YNode
  | Nodes.NoiseNode
  | Nodes.LayeredNoiseNode
  | Nodes.CircleNode
  | Nodes.ColorNode
  | Nodes.AddNode
  | Nodes.SubtractNode
  | Nodes.MultiplyNode
  | Nodes.DivideNode
  | Nodes.DistanceNode
  | Nodes.PowerNode
  | Nodes.SinNode
  | Nodes.CosNode
  | Nodes.TanNode
  | Nodes.AbsNode
  | Nodes.SqrtNode;
export type Conn = 
  | Connection<Nodes.NumberNode, Nodes.OutputNode>
  | Connection<Nodes.NumberNode, Nodes.AddNode>
  | Connection<Nodes.NumberNode, Nodes.SubtractNode>
  | Connection<Nodes.NumberNode, Nodes.MultiplyNode>
  | Connection<Nodes.NumberNode, Nodes.DistanceNode>
  | Connection<Nodes.NumberNode, Nodes.DivideNode>
  | Connection<Nodes.AddNode, Nodes.SinNode>
  | Connection<Nodes.AddNode, Nodes.CosNode>
  | Connection<Nodes.CircleNode, Nodes.OutputNode>
  | Connection<Nodes.ColorNode, Nodes.OutputNode>
  | Connection<Nodes.ColorNode, Nodes.CircleNode>
  | Connection<Nodes.ColorNode, Nodes.SinNode>
  | Connection<Nodes.PiNode, Nodes.SinNode>
  | Connection<Nodes.PiNode, Nodes.MultiplyNode>
  | Connection<Nodes.CircleNode, Nodes.SubtractNode>
export type Schemes = GetSchemes<Node, Conn>; 