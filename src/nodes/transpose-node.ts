import { MidiplexMessage } from "@/midiplex-mesasge";
import { MidiplexNodeInstance } from "@/node-instance";
import { clamp, omitMessageTypes } from "@/util";

type TransposeNodeTypeDef = {
    inputs: {
        in: 'noteon' | 'noteoff'
    },
    outputs: {
        out: 'noteon' | 'noteoff',
        //thru: 'polykeypressure' | 'controlchange' | 'programchange' | 'monokeypressure' | 'pitchbend' | 'channelaftertouch' | 'system'
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
        },
        // thru: {
        //     name: 'Thru',
        //     messageTypes: [
        //         'polykeypressure',
        //         'controlchange',
        //         'programchange',
        //         'monokeypressure',
        //         'pitchbend',
        //         'channelaftertouch',
        //         'system'
        //     ]
        // }
    },
    props: {
        transpose: {
            name: 'Transpose',
            value: 0
        }
    },
    node({ send, receive, prop }){
        receive((message, edge) => {
            console.log(edge);
            let transpose = prop('transpose');
            let transposed = clamp(message.message.data[1] + transpose, 0, 127);
            let data = new Uint8Array([message.message.data[0], transposed, message.message.data[2]]);
            send(new MidiplexMessage(data), 'out');
        });
    }
} satisfies MidiplexNodeDefinition<TransposeNodeTypeDef>;


class TransposeNode extends MidiplexNodeInstance<TransposeNodeTypeDef> {
    constructor(key: string, config: NodeConfig = {}){
        super(key, TransposeNodeDef);
    }
}

export { TransposeNodeTypeDef, TransposeNodeDef, TransposeNode };