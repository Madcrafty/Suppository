import { ClassicPreset } from "rete";
import { BaseSchemes, NodeEditor, NodeId } from "rete";
import { Schemes } from './schemes';
import {Socket} from './sockets';

type Input = ClassicPreset.Input<Socket>;
type Output = ClassicPreset.Output<Socket>;

export function getConnectionSockets(editor: NodeEditor<Schemes>, connection: Schemes["Connection"]) {
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output = source && (source.outputs as Record<string, Input>)[connection.sourceOutput];
    const input = target && (target.inputs as unknown as Record<string, Output>)[connection.targetInput];

    return { source: output?.socket, target: input?.socket};
}