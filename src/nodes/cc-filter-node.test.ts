import { expect, test } from '@jest/globals';
import { CCFilterNode } from './cc-filter-node';
import { DebugNode } from './debug-node';
import { MidiplexMessage } from '../midiplex-message';
import { Util } from '../util';

let debug = new DebugNode('debug');
let node = new CCFilterNode('cc-filter-node', { 
        props: { 
            filter: [74, 75]
        } 
    });
    
    node.connect('out', debug.getInputEdge('in'));

let cc1 = Util.Generate.controlchange(80, 127);
let cc2 = Util.Generate.controlchange(74, 127); //should be filtered out
let cc3 = Util.Generate.controlchange(86, 127);
let cc4 = Util.Generate.controlchange(75, 127); //should be filtered out

describe('CCFilterNode', () => {
    test('CC message for controllers 74 and 75 are filtered out', (done) => {
        let messageCount = 0;
        debug.setProp('callback', (m: MidiplexMessage) => {
            messageCount++;
            expect([74, 75].includes(m.data[1])).toBe(false);
            expect([80, 86].includes(m.data[1])).toBe(true);
            if (messageCount >= 2){
                done();
            }
        });

        node.receive(cc1, 'in');
        node.receive(cc2, 'in');
        node.receive(cc3, 'in');
        node.receive(cc4, 'in');
    });
})