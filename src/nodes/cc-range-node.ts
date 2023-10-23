import { MidiplexMessage } from "@/midiplex-mesasge";
import { MidiplexNodeInstance } from "@/node-instance";
import { convertRange } from "@/util";

type CCRangeNodeTypeDef = {
    inputs: {
        in: 'controlchange'
    },
    outputs: {
        out: 'controlchange'
    },
    props: {
        mapping: CCRangeMap
    },
    state: {}
}

interface CCRangeMap {
    [key: number]: [IntRange<0, 128>, IntRange<0, 128>]
}

const CCRangeNodeDef : MidiplexNodeDefinition<CCRangeNodeTypeDef> = {
    name: 'CC Range',
    key: 'CC_RANGE_NODE',
    description: 'Restrict control change messages to a min/max range. Useful when mapping a knob to allow full motion of the knob, but only a portion of the range of the control change message.',
    inputs: {
        in: {
            name: 'In',
            messageTypes: ['controlchange']
        }
    },
    outputs: {
        out: {
            name: 'Out',
            messageTypes: ['controlchange']
        }
    },
    props: {
        mapping: {
            name: 'Range Mapping',
            value: {}
        }
    },
    node({ prop, send, receive }){
        receive((message) => {
            /**
             * Check the CC map to see if a range mapping was provided for the give CC value.
             * If no mapping is provided, CC messages are passed through unmodified.
             */
            let map = prop('mapping');
            let cc = message.message.data[1];
            if (map[cc]) {
                let data = new Uint8Array([
                    message.message.data[0], 
                    message.message.data[1], 
                    convertRange(message.message.data[2], 0, 127, map[cc][0], map[cc][1])
                ]);
                
                send(new MidiplexMessage(data), 'out');
                return;
            }

            send(message, 'out');
        })
    }
};

class CCRangeNode extends MidiplexNodeInstance<CCRangeNodeTypeDef> {
    constructor(key: string, config: NodeConfig = {}){
        super(key, CCRangeNodeDef);
    }
}

export { CCRangeNodeTypeDef, CCRangeNodeDef, CCRangeNode };