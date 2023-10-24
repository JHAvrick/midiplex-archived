import { expect, test } from '@jest/globals';
import { CCRangeNode } from './cc-range-node';
import { DebugNode } from './debug-node';
import { MidiplexMessage } from '../midiplex-mesasge';
import { Generate } from '../util';

let debug = new DebugNode('debug');
let node = new CCRangeNode('cc-map-node', { 
        props: {
            mapping: {
                0: [64, 100],
                74: [64, 100]
            }
        }
    });
    
    node.connect('out', debug.getInputEdge('in'));

let ccFalsey = Generate.controlchange(0, 0); //CC 0 is falsey - is this even a valid CC message?
let ccMin = Generate.controlchange(74, 0); //Too low
let ccInRange = Generate.controlchange(74, 75); //In range, will be rescaled
let ccMax = Generate.controlchange(74, 127); //Too high

describe('CCRangeNode', () => {
    test('Falsey CC message is processed correctly', (done) => {
        debug.setProp('callback', (m: MidiplexMessage) => {
            expect(m.message.data[2] >= 64).toBe(true);
            done();
        });

        node.receive(ccFalsey, 'in');
    });

    test('CC value is scaled to min value specified by range', (done) => {
        debug.setProp('callback', (m: MidiplexMessage) => {
            expect(m.message.data[2] >= 64).toBe(true);
            done();
        });

        node.receive(ccMin, 'in');
    });

    test('CC value is scaled within the given range', (done) => {
        debug.setProp('callback', (m: MidiplexMessage) => {
            expect(m.message.data[2] >= 64 && m.message.data[2] <= 100).toBe(true);
            done();
        });

        node.receive(ccInRange, 'in');
    });

    test('CC value is scaled to max value specified by range', (done) => {
        debug.setProp('callback', (m: MidiplexMessage) => {
            expect(m.message.data[2] === 100).toBe(true);
            done();
        });

        node.receive(ccMax, 'in');
    });
})