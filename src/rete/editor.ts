import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {ConnectionPlugin,Presets as ConnectionPresets,} from 'rete-connection-plugin';
import {ReactPlugin,ReactArea2D,Presets as ReactPresets,} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import {AutoArrangePlugin,Presets as ArrangePresets,} from 'rete-auto-arrange-plugin';
import {ContextMenuPlugin,ContextMenuExtra,Presets as ContextMenuPresets,} from 'rete-context-menu-plugin';

import { Schemes } from './schemes.js';
import { Connection } from './connection.js';
import {NumberNode, AddNode, BrushNode} from '../nodes';

type AreaExtra = Area2D<Schemes> | ReactArea2D<Schemes> | ContextMenuExtra;

export async function createEditor(container: HTMLElement) {
  //Core
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dataflow = new DataflowEngine<Schemes>();
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ['Number', () => new NumberNode(1, process)],
      ['Add', () => new AddNode()],
      ['Brush', () => new BrushNode(dataflow)],
    ]),
  });

  
  //References
  editor.use(area);
  editor.use(dataflow);
  area.use(reactRender);
  area.use(connection);
  area.use(contextMenu);

  connection.addPreset(ConnectionPresets.classic.setup());
  reactRender.addPreset(ReactPresets.classic.setup());
  reactRender.addPreset(ReactPresets.contextMenu.setup());

  //Create Starting Nodes
  const a = new NumberNode(5, process);
  const b = new NumberNode(5, process);
  const c = new NumberNode(-10, process);
  const brush = new BrushNode(dataflow);
  const add = new AddNode();
  const add2 = new AddNode();

  //Add Nodes and Connections to Editor
  await editor.addNode(a);
  await editor.addNode(b);
  await editor.addNode(c);
  await editor.addNode(add);
  await editor.addNode(add2);
  await editor.addNode(brush);

  await editor.addConnection(new Connection(a, 'value', add, 'a'));
  await editor.addConnection(new Connection(b, 'value', add, 'b'));
  await editor.addConnection(new Connection(b, 'value', add2, 'a'));
  await editor.addConnection(new Connection(c, 'value', add2, 'b'));

  await editor.addConnection(new Connection(add, 'value', brush, 'a'));
  await editor.addConnection(new Connection(add, 'value', brush, 'b'));
  await editor.addConnection(new Connection(add, 'value', brush, 'c'));
  await editor.addConnection(new Connection(add, 'value', brush, 'g'));
  await editor.addConnection(new Connection(add, 'value', brush, 'h'));
  await editor.addConnection(new Connection(add2, 'value', brush, 'e'));
  await editor.addConnection(new Connection(add2, 'value', brush, 'f'));

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

// This function basically updates each node that connects to a BrushNode.
// Will need an upgrade soon!
  async function process() {
    dataflow.reset();
    let nodes = editor.getNodes();
    nodes.filter((node) => node instanceof AddNode);
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

  process();

  return {
    destroy: () => area.destroy(),
  };
}
