import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {ConnectionPlugin,Presets as ConnectionPresets,} from 'rete-connection-plugin';
import {ReactPlugin,ReactArea2D,Presets as ReactPresets,} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import {AutoArrangePlugin,Presets as ArrangePresets,} from 'rete-auto-arrange-plugin';
import {ContextMenuPlugin,ContextMenuExtra,Presets as ContextMenuPresets,} from 'rete-context-menu-plugin';

import {parameters} from '../../brush/parameters.js';
import * as THREE from 'three';

type Node = NumberNode | BrushNode;
type Conn =
  | Connection<NumberNode, BrushNode>
  | Connection<BrushNode, NumberNode>
  | Connection<NumberNode, AddNode>
  | Connection<AddNode, AddNode>
  | Connection<AddNode, BrushNode>;
type Schemes = GetSchemes<Node, Conn>;

class Connection<A extends Node, B extends Node> extends Classic.Connection<A, B> {}

class NumberNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 120;

  constructor(initial: number, change?: (value: number) => void) {
    super('Number');

    this.addOutput('value', new Classic.Output(socket, 'Number'));
    this.addControl(
      'value',
      new Classic.InputControl('number', { initial, change })
    );
  }
  data() {
    const value = (this.controls['value'] as Classic.InputControl<'number'>)
      .value;

    return {
      value,
    };
  }
}

class BrushNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 400;

  constructor() {
    super('Brush');

    this.addInput('a', new Classic.Input(socket, 'Size'));
    this.addInput('b', new Classic.Input(socket, 'Alpha'));
    this.addInput('c', new Classic.Input(socket, 'Height'));
    this.addInput('d', new Classic.Input(socket, 'Kern'));
    this.addInput('e', new Classic.Input(socket, 'Shine'));
    // color
    this.addInput('f', new Classic.Input(socket, 'Red'));
    this.addInput('g', new Classic.Input(socket, 'Green'));
    this.addInput('h', new Classic.Input(socket, 'Blue'));
  }
  data(inputs: { a?: number[]; b?: number[]; c?: number[]; d?: number[]; e?: number[]; f?: number[]; g?: number[]; h?: number[];}) {
    const { a = [], b = [], c = [],d = [],e = [],f = [],g = [],h = [],} = inputs;
    parameters.brushSize = (a[0]!=undefined) ? a[0] : parameters.brushSize;
    parameters.brushAlpha = (b[0]!=undefined) ? b[0] : parameters.brushAlpha;
    parameters.brushHeight = (c[0]!=undefined) ? c[0] : parameters.brushHeight;
    parameters.brushKern = (d[0]!=undefined) ? d[0] : parameters.brushKern;
    parameters.brushShine = (e[0]!=undefined) ? e[0] : parameters.brushShine;
    // color
    parameters.brushColor = (f[0]!=undefined && g[0]!=undefined && h[0]!=undefined) ? new THREE.Color(f[0],g[0],h[0]) : parameters.brushColor;
    parameters.update();

    return {
      value: 1,
    };
  }
}

class AddNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 195;

  constructor() {
    super('Add');

    this.addInput('a', new Classic.Input(socket, 'A'));
    this.addInput('b', new Classic.Input(socket, 'B'));
    this.addOutput('value', new Classic.Output(socket, 'Number'));
    this.addControl(
      'result',
      new Classic.InputControl('number', { initial: 0, readonly: true })
    );
  }
  data(inputs: { a?: number[]; b?: number[] }) {
    const { a = [], b = [] } = inputs;
    const sum = (a[0] || 0) + (b[0] || 0);

    (this.controls['result'] as Classic.InputControl<'number'>).setValue(sum);

    return {
      value: sum,
    };
  }
}

type AreaExtra = Area2D<Schemes> | ReactArea2D<Schemes> | ContextMenuExtra;

const socket = new Classic.Socket('socket');

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
      ['Brush', () => new BrushNode()],
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
  const brush = new BrushNode();
  const add = new AddNode();

  //Add Nodes and Connections to Editor
  await editor.addNode(a);
  await editor.addNode(b);
  await editor.addNode(add);
  await editor.addNode(brush);
  await editor.addConnection(new Connection(a, 'value', add, 'a'));
  await editor.addConnection(new Connection(b, 'value', add, 'b'));
  await editor.addConnection(new Connection(add, 'value', brush, 'a'));

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

    editor
      .getNodes()
      .filter((node) => node instanceof Classic.Node)
      .forEach(async (node) => {
        //Retrieve / Update the Data of the node
        await dataflow.fetch(node.id);
        area.update(
          'control',
          (node.controls['result'] as Classic.InputControl<'number'>).id
        );
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
