import { expect, test } from '@jest/globals';
import { CCPassNode } from './cc-pass-node';
import { DebugNode } from './debug-node';
import { MidiplexMessage } from '../midiplex-message';
import { Util } from '../util';

let debug = new DebugNode('debug');
let node = new CCPassNode('cc-pass-node', { 
        props: { 
            pass: [74, 75]
        } 
    });
    
    node.connect('out', debug.getInputEdge('in'));

let cc1 = Util.Generate.controlchange(80, 127);
let cc2 = Util.Generate.controlchange(74, 127); //should pass
let cc3 = Util.Generate.controlchange(86, 127);
let cc4 = Util.Generate.controlchange(75, 127); //should pass

describe('CCPassNode', () => {
    test('All CC messages are filtered out accept for those specified', (done) => {
        let messageCount = 0;
        debug.setProp('callback', (m: MidiplexMessage) => {
            messageCount++;
            expect([74, 75].includes(m.data[1]) && m.data[2] === 127).toBe(true);
            expect(![80, 86].includes(m.data[1])).toBe(true);
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