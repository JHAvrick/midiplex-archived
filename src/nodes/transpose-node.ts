import { MidiplexMessage } from "@/midiplex-message";
import { MidiplexNodeInstance } from "@/node-instance";
import { clamp } from "@/util";

type TransposeNodeTypeDef = {
    inputs: {
        in: 'noteon' | 'noteoff'
    },
    outputs: {
        out: 'noteon' | 'noteoff',
    },
    props: {
        transpose: number 
    },
    state: {}
}

const TransposeNodeDef = {
    name: 'Transpose',
    key: 'TRANSPOSE_NODE',
    description: '',
    inputs: {
        in: {
            name: 'In',
            messageTypes: ['noteon', 'noteoff']
        }
    },
    outputs: {
        out: {
            name: 'Out',
            messageTypes: ['noteon', 'noteoff']
        }
    },
    props: {
        transpose: {
            name: 'Transpose',
            value: 0
        }
    },
    node({ send, receive, prop }){
        receive((message, edge) => {
            let transpose = prop('transpose');
            let transposed = clamp(message.data[1] + transpose, 0, 127);
            let data = new Uint8Array([message.data[0], transposed, message.data[2]]);
            send(new MidiplexMessage(data), 'out');
        });
    }
} satisfies MidiplexNodeDefinition<TransposeNodeTypeDef>;


class TransposeNode extends MidiplexNodeInstance<TransposeNodeTypeDef> {
    constructor(key: string, config: NodeConfig<TransposeNodeTypeDef> = {}){
        super(key, TransposeNodeDef, config);
    }
}

export { TransposeNodeTypeDef, TransposeNodeDef, TransposeNode };