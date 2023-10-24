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

const CCRangeNodeDef : MidiplexNodeDefinition<CCRangeNodeTypeDef> = {
    name: 'CC Range',
    key: 'CC_RANGE_NODE',
    description: `Rescale CC messages to a smaller range. Useful for mapping a knob to a smaller range while preserving the control's full range of motion.`,
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
            if (map[cc] !== undefined && map[cc] !== null) {
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
    constructor(key: string, config: NodeConfig<CCRangeNodeTypeDef> = {}){
        super(key, CCRangeNodeDef, config);
    }
}

export { CCRangeNodeTypeDef, CCRangeNodeDef, CCRangeNode };