import { Midiplex } from '../index';
import { describe, expect, test, beforeAll } from '@jest/globals';

// let mp = new Midiplex();
// beforeEach(() => {
//     return new Promise((resolve) => {
//         mp = new Midiplex();
//         mp.enable().then(() => resolve(true))
//     })
// });

test('cc-filter-node', () => {
    expect(true).toBe(true);
});


// (async () => {

//     //let message = new Uint8Array([0x90, 0x40, 0x7f]);


//     let m = new Midiplex();
//     await m.enable();

//     WebMidi.inputs.forEach(input => {
//         console.log(input.id, input.id === 'VI49 Out');
//     });

//     WebMidi.outputs.forEach(input => {
//         console.log(input.id);
//     });

//     let vi49In = m.addNode('INPUT_NODE', 'input');
//         vi49In.setProp('inputId', 'VI49 Out');

//     let debug = m.addNode('DEBUG_NODE', 'debug');

//     // let transpose = m.addNode('TRANSPOSE_NODE', 'transpose');
//     //     transpose.setProp('transpose', 7);

//     // let transpose12 = m.addNode('TRANSPOSE_NODE', 'transpose12');
//     //     transpose12.setProp('transpose', 12);

//     let programChangeNode = m.addNode('PROGRAM_CHANGE_NODE', 'programChangeNode');
//         programChangeNode.setThruMode('thru');
//         programChangeNode.setProp('triggers', [
//             {
//                 program: 1,
//                 trigger: {
//                     type: 'controlchange',
//                     cc: 64,
//                     value: 127
//                 }
//             },
//             {
//                 program: 2,
//                 trigger: {
//                     type: 'controlchange',
//                     cc: 80,
//                     value: 127
//                 }
//             },
//             // {
//             //     program: 3,
//             //     trigger: {
//             //         type: 'controlchange',
//             //         cc: 20,
//             //         value: 3
//             //     }
//             // }
//         ]);
    
//     let refaceOut = m.addNode('OUTPUT_NODE', 'output');
//         refaceOut.setProp('outputId', 'MIDI 8x8 Port 4');

//     let monologueOut = m.addNode('OUTPUT_NODE', 'monologueOut');
//         monologueOut.setProp('outputId', 'MIDI 8x8 Port 3');

//     let volcaBassOut = m.addNode('OUTPUT_NODE', 'volcaBassOut');
//         volcaBassOut.setProp('outputId', 'MIDI 8x8 Port 2');

//     let volcaBassSwitch = m.addNode('TOGGLE_PATH_NODE', 'volcaBassSwitch');
//         volcaBassSwitch.setProp('cc', 50);
//         volcaBassSwitch.setProp('open', false);

//     let monologueSwitch = m.addNode('TOGGLE_PATH_NODE', 'monologueSwitch');
//         monologueSwitch.setProp('cc', 48);
//         monologueSwitch.setProp('open', false);

//     let refaceCCPass = m.addNode('CC_PASS_NODE', 'refaceCCPass');
//         refaceCCPass.setProp('pass', [49]);

//     let refaceFilter = m.addNode('MESSAGE_TYPE_FILTER_NODE', 'refaceFilter');
//         refaceFilter.setProp('messageTypes', ['noteon', 'noteoff']);

//     let refaceSwitch = m.addNode('TOGGLE_PATH_NODE', 'refaceSwitch');
//         refaceSwitch.setProp('cc', 49);
//         refaceSwitch.setProp('open', false);


//     vi49In.connect('out', debug.getInputEdge('in'));
    
//     debug.connect('out', volcaBassSwitch.getInputEdge('in'));
//     debug.connect('out', monologueSwitch.getInputEdge('in'));
//     debug.connect('out', refaceSwitch.getInputEdge('in'));


//     volcaBassSwitch.connect('out', volcaBassOut.getInputEdge('in'));

    
//     //programChangeNode.connect('out', monologueOut.getInputEdge('in'));

//     vi49In.connect('out', programChangeNode.getInputEdge('in'));
//     programChangeNode.connect('out', monologueOut.getInputEdge('in'));
//     monologueSwitch.connect('out', monologueOut.getInputEdge('in'));


//     refaceSwitch.connect('out', refaceCCPass.getInputEdge('in'));
//     refaceSwitch.connect('out', refaceFilter.getInputEdge('in'));
//     refaceCCPass.connect('out', refaceOut.getInputEdge('in'));
//     refaceFilter.connect('out', refaceOut.getInputEdge('in'));



//     // let ccMap = m.addNode('CC_MAP_NODE', 'ccMap');
//     //     ccMap.setProp('mapping', { 20: [43, 74] });

//     // let ccRange = m.addNode('CC_RANGE_NODE', 'ccRange');
//     //     ccRange.setProp('mapping', { 20: [50, 127] });
        
//     // vi49In.connect('out', debug.getInputEdge('in'));
    
//     // debug.connect('out', transpose.getInputEdge('in'));
//     // debug.connect('out', transpose12.getInputEdge('in'));
//     // debug.connect('out', ccRange.getInputEdge('in'));
//     // ccRange.connect('out', ccMap.getInputEdge('in'));

//     // ccMap.connect('out', refaceOut.getInputEdge('in'));
//     // ccMap.connect('out', monologueOut.getInputEdge('in'));
//     // transpose.connect('out', refaceOut.getInputEdge('in'));
//     // transpose12.connect('out', monologueOut.getInputEdge('in'));

// })()