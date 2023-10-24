//This node lets you define which CC controls are not allowed to pass through.

import { MidiplexNodeInstance } from "@/node-instance";

type CCFilterNodeTypeDef = {
    inputs: {
        in: 'controlchange'
    },
    outputs: {
        out: 'controlchange'
    },
    props: {
        filter: number[]
    },
    state: {}
}

const CCFilterNodeDef : MidiplexNodeDefinition<CCFilterNodeTypeDef> = {
    name: 'CC Pass',
    key: 'CC_PASS_NODE',
    description: 'Specify which CC messages are allowed to pass through.',
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
        filter: {
            name: 'Filter',
            value: []
        }
    },
    node({ prop, send, receive }){
        receive((message) => {
            let filter = prop('filter');
            if (!filter.includes(message.message.data[1])){
                send(message, 'out');
            }
        })
    }
};

class CCFilterNode extends MidiplexNodeInstance<CCFilterNodeTypeDef> {
    constructor(key: string, config: NodeConfig<CCFilterNodeTypeDef> = {}){
        super(key, CCFilterNodeDef);
    }
}

export { CCFilterNodeTypeDef, CCFilterNodeDef, CCFilterNode };