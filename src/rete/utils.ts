import { ClassicPreset } from "rete";
import { BaseSchemes, NodeEditor, NodeId } from "rete";
import { Schemes } from './schemes';
import { NumSocket, TexSocket} from './sockets';

type Sockets = NumSocket | TexSocket;
type Input = ClassicPreset.Input<Sockets>;
type Output = ClassicPreset.Output<Sockets>;

export function getConnectionSockets(editor: NodeEditor<Schemes>, connection: Schemes["Connection"]) {
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output = source && (source.outputs as Record<string, ClassicPreset.Input<Sockets>>)[connection.sourceOutput];
    const input = target && (target.inputs as unknown as Record<string, ClassicPreset.Output<Sockets>>)[connection.targetInput];

    return { source: output?.socket, target: input?.socket};
}