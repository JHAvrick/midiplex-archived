import { expect, test } from '@jest/globals';
import { SetChannelNode } from './set-channel-node';
import { DebugNode } from './debug-node';
import { MidiplexMessage } from '../midiplex-message';
import { Util } from '../util';

let debug = new DebugNode('debug');
let node = new SetChannelNode('cc-map-node', { 
        props: {
            channel: 5
        }
    });
    
    node.connect('out', debug.getInputEdge('in'));

let channel1 = Util.Generate.controlchange(43, 127, 1); //CC 0 is falsey - is this even a valid CC message?

describe('SetChannelNode', () => {
    test('Message channel is set to specified new channel', (done) => {
        debug.setProp('callback', (m: MidiplexMessage) => {
            expect(m.channel === 5).toBe(true);
            done();
        });

        node.receive(channel1, 'in');
    });
})