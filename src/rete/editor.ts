import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {ConnectionPlugin,Presets as ConnectionPresets,} from 'rete-connection-plugin';
import {ReactPlugin,ReactArea2D,Presets as ReactPresets,} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import {AutoArrangePlugin,Presets as ArrangePresets,} from 'rete-auto-arrange-plugin';
import {ContextMenuPlugin,ContextMenuExtra,Presets as ContextMenuPresets,} from 'rete-context-menu-plugin';

import { Preview } from '../controls/preview.js';
import { PreviewUI } from '../controls/previewui.js';
import { Schemes } from './schemes.ts';
import { Connection } from './connection.js';
import * as Nodes from '../nodes';
import { getConnectionSockets } from './utils.ts';

type AreaExtra = Area2D<Schemes> | ReactArea2D<Schemes> | ContextMenuExtra;

export async function createEditor(container: HTMLElement) {
  //Core
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dataflow = new DataflowEngine<Schemes>();
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Textures", [
        ['X-Coords', () => new Nodes.XNode()],
        ['Y-Coords', () => new Nodes.YNode()],
        ["Circle", ()=> new Nodes.CircleNode(0.2, process)],
        ["Noise", ()=> new Nodes.NoiseNode()],
        ["Layered Noise", ()=> new Nodes.LayeredNoiseNode()],
        ["Color", () => new Nodes.ColorNode(process)]
      ]],
      ["Math", [
        ['Number', () => new Nodes.NumberNode(1, process)],
        ['PI', ()=> new Nodes.PiNode()],
        ["Add", () => new Nodes.AddNode()],
        ["Subtract", () => new Nodes.SubtractNode()],
        ["Distance", () => new Nodes.DistanceNode()],
        ["Divide", () => new Nodes.DivideNode()],
        ["Multiply", () => new Nodes.MultiplyNode()],
        ["Power", () => new Nodes.PowerNode()],
      ]],
      ["Shaper", [
        ['Sin', () => new Nodes.SinNode()],
        ['Cos', () => new Nodes.CosNode()],
        ['Tan', () => new Nodes.TanNode()],
        ['Abs', () => new Nodes.AbsNode()],
        ['Sqrt', () => new Nodes.SqrtNode()],
        ['Neg', () => new Nodes.NegNode()],
      ]],
      ['Output', () => new Nodes.OutputNode()],
    ]),
  });

  //References
  editor.use(area);
  editor.use(dataflow);
  area.use(render);
  area.use(connection);
  area.use(contextMenu);

  connection.addPreset(ConnectionPresets.classic.setup());
  render.addPreset(ReactPresets.classic.setup({
    customize: {
      control(data) {
        if (data.payload instanceof Preview) return PreviewUI
        return ReactPresets.classic.InputControl as any
      },
    }
  }));
  render.addPreset(ReactPresets.contextMenu.setup());

  
  const output = new Nodes.OutputNode();
  const x = new Nodes.XNode();
  const y = new Nodes.YNode();
  const multi1 = new Nodes.MultiplyNode();
  const multi2 = new Nodes.MultiplyNode();
  const pi = new Nodes.PiNode();
  const sin1 = new Nodes.SinNode();
  const sin2 = new Nodes.SinNode();
  const dist = new Nodes.DistanceNode();
  const num = new Nodes.NumberNode(255, process);
  const circle = new Nodes.CircleNode(0.3, process);
  const sub = new Nodes.SubtractNode();

  // #region Add Nodes and Connections to Editor
  //Create Starting Nodes
  //Add Nodes and Connections to Editor

  await editor.addNode(output);
  await editor.addNode(x);
  await editor.addNode(y);
  await editor.addNode(multi1);
  await editor.addNode(multi2);
  await editor.addNode(pi);
  await editor.addNode(sin1);
  await editor.addNode(sin2);
  await editor.addNode(dist);
  await editor.addNode(num);
  await editor.addNode(circle);
  await editor.addNode(sub);

  await editor.addConnection(new Connection(x, 'value', multi1, 'value1'));
  await editor.addConnection(new Connection(pi, 'value', multi1, 'value2'));
  await editor.addConnection(new Connection(y, 'value', multi2, 'value1'));
  await editor.addConnection(new Connection(pi, 'value', multi2, 'value2'));
  await editor.addConnection(new Connection(multi1, 'value', sin1, 'input'));
  await editor.addConnection(new Connection(multi2, 'value', sin2, 'input'));
  await editor.addConnection(new Connection(sin1, 'value', dist, 'value1'));
  await editor.addConnection(new Connection(sin2, 'value', dist, 'value2'));
  await editor.addConnection(new Connection(num, 'value', sub, 'value1'));
  await editor.addConnection(new Connection(dist, 'value', sub, 'value2'));
  await editor.addConnection(new Connection(circle, 'value', sub, 'alpha'));
  await editor.addConnection(new Connection(sub, 'value', output, 'texture'));
  await editor.addConnection(new Connection(sub, 'value', output, 'height'));
  //#endregion
  //Arrange
  const arrange = new AutoArrangePlugin<Schemes>();
  arrange.addPreset(ArrangePresets.classic.setup());
  area.use(arrange);
  await arrange.layout();

  //Position Camera Near Nodes
  AreaExtensions.zoomAt(area, editor.getNodes());
  AreaExtensions.simpleNodesOrder(area);

  //Selecting
  const selector = AreaExtensions.selector();
  const accumulating = AreaExtensions.accumulateOnCtrl();
  AreaExtensions.selectableNodes(area, selector, { accumulating });

  //Dataflow
  async function process() {
    dataflow.reset();
    let nodes = editor.getNodes();
    nodes.filter((node) => node instanceof Nodes.OutputNode);
    nodes.forEach(async (node) => {
      //Retrieve / Update the Data of the node
      await dataflow.fetch(node.id);
      area.update('node',node.id);
    }); 
  }
  
  editor.addPipe((context) => {
    if (context.type === 'connectioncreated' || context.type === 'connectionremoved') {
      process();
    }
    return context;
  });

  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        console.log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  process();

  return {
    destroy: () => area.destroy(),
  };
}
