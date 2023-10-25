import { MidiplexMessage } from "@/midiplex-message";
import { MidiplexNodeInstance } from "@/node-instance";
import { clamp } from "@/util";

type CCClampNodeTypeDef = {
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

const CCClampNodeDef : MidiplexNodeDefinition<CCClampNodeTypeDef> = {
    name: 'CC Range',
    key: 'CC_RANGE_NODE',
    description: 'Clamp CC message values to a min/max range.',
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
            let cc = message.data[1];
            if (map[cc]) {
                let data = new Uint8Array([
                    message.data[0],
                    message.data[1],
                    clamp(message.data[2], map[cc][0], map[cc][1])
                ]);
                
                send(new MidiplexMessage(data), 'out');
                return;
            }

            send(message, 'out');
        })
    }
};

class CCClampNode extends MidiplexNodeInstance<CCClampNodeTypeDef> {
    constructor(key: string, config: NodeConfig<CCClampNodeTypeDef> = {}){
        super(key, CCClampNodeDef, config);
    }
}

export { CCClampNodeTypeDef, CCClampNodeDef, CCClampNode };