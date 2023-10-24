// const convertRange = (oldVal: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
//     return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
// }

// console.log(
//     convertRange(0, 0, 127, 64, 100),
// )


const { CCRangeNode } = require('./nodes/cc-range-node');
const { DebugNode } = require('./nodes/debug-node');
const { MidiplexMessage } = require('./midiplex-mesasge');
const { Generate } = require('./util');



let debug = new DebugNode('debug');
let node = new CCRangeNode('cc-map-node', { 
        props: {
            mapping: {
                74: {
                    min: 64,
                    max: 100
                } //Should constrain CC 74 to a value range of 64-100
            }
        }
    });
    
    node.connect('out', debug.getInputEdge('in'));

let ccMin = Generate.controlchange(74, 0); //Too low
let ccInRange = Generate.controlchange(74, 75); //In range, will be rescaled
let ccMax = Generate.controlchange(74, 127); //Too high

debug.setProp('callback', (m: MidiplexMessage) => {
    console.log(m.message.data[2]);
    expect(m.message.data[2] >= 64).toBe(true);
});

node.receive(ccMin, 'in');