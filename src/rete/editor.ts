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
import {NumberNode, OutputNode, TextureNode, XNode, AddNode, SubtractNode, MultiplyNode, DivideNode, DistanceNode} from '../nodes';
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
      ['Brush', () => new OutputNode()],
      ['Texture', () => new TextureNode("Texture")],
      ['X-Coords', () => new XNode()],
      ["Math", [
        ['Number', () => new NumberNode(1, process)],
        ["Add", () => new AddNode()],
        ["Subtract", () => new SubtractNode()],
        ["Distance", () => new DistanceNode()],
        ["Divide", () => new DivideNode()],
        ["Multiply", () => new MultiplyNode()],
      ]],
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

  // #region Add Nodes and Connections to Editor
  const a = new NumberNode(5);
  const b = new NumberNode(5);
  const c = new NumberNode(-10);
  const brush = new OutputNode();

  await editor.addNode(a);
  await editor.addNode(b);
  await editor.addNode(c);
  await editor.addNode(brush);
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
    nodes.filter((node) => node instanceof OutputNode);
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
