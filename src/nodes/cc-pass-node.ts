import { MidiplexNodeInstance } from "@/node-instance";

type CCPassNodeTypeDef = {
    inputs: {
        in: 'controlchange'
    },
    outputs: {
        out: 'controlchange'
    },
    props: {
        pass: number[]
    },
    state: {}
}

const CCPassNodeDef : MidiplexNodeDefinition<CCPassNodeTypeDef> = {
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
        pass: {
            name: 'Pass',
            value: []
        }
    },
    node({ prop, send, receive }){
        receive((message) => {
            let pass = prop('pass');
            if (pass.includes(message.message.data[1])){
                send(message, 'out');
            }
        })
    }
};

class CCPassNode extends MidiplexNodeInstance<CCPassNodeTypeDef> {
    constructor(key: string, config: NodeConfig<CCPassNodeTypeDef> = {}){
        super(key, CCPassNodeDef, config);
    }
}

export { CCPassNodeTypeDef, CCPassNodeDef, CCPassNode };