import { WebMidi } from 'webmidi';
import * as Nodes from './nodes/nodes';
import { Generate } from './util';

const Util = <const> {
    Generate
}

export {
    WebMidi,
    Nodes,
    Util
}

// import { WebMidi } from 'webmidi';
// import { InputNode } from './nodes/input-node';
// import { OutputNode } from './nodes/output-node';
// import { DebugNode } from './nodes/debug-node';
// import { MessageTypeFilterNode } from './nodes/filter-node';
// import { MessageTypeSplitNode } from './nodes/message-type-split-node';
// import { TransposeNode } from './nodes/transpose-node';
// import { CCRangeNode } from './nodes/cc-range-node';
// import { CCMapNode } from './nodes/cc-map-node';
// import { TogglePathNode } from './nodes/toggle-path';
// import { CustomFilterNode } from './nodes/custom-filter-node';
// import { ProgramChangeNode } from './nodes/program-change-node';
// import { CCPassNode } from './nodes/cc-pass-node';
// import { NoteMapNode } from './nodes/note-map-node';
// import { MidiplexDevice } from './device';

// const DefaultNodes = {
//     OUTPUT_NODE: OutputNode,
//     INPUT_NODE: InputNode,
//     DEBUG_NODE: DebugNode,
//     MESSAGE_TYPE_FILTER_NODE: MessageTypeFilterNode,
//     MESSAGE_TYPE_SPLIT_NODE: MessageTypeSplitNode,
//     TRANSPOSE_NODE: TransposeNode,
//     CC_RANGE_NODE: CCRangeNode,
//     CC_MAP_NODE: CCMapNode,
//     TOGGLE_PATH_NODE: TogglePathNode,
//     CUSTOM_FILTER_NODE: CustomFilterNode,
//     PROGRAM_CHANGE_NODE: ProgramChangeNode,
//     CC_PASS_NODE: CCPassNode,
//     NOTE_MAP_NODE: NoteMapNode

// } as const;

// type DefaultNodeInstance<T extends keyof typeof DefaultNodes> = InstanceType<typeof DefaultNodes[T]>;

// class Midiplex {

//     private readonly devices: Record<string, MidiplexDevice> = {};
//     private readonly nodes: Record<string, DefaultNodeInstance<MidiplexNodeType>> = {};

//     constructor(){

//     }

//     async enable(){
//         await WebMidi.enable();
//     }

//     addNode<T extends MidiplexNodeType>(key: T, nodeKey: string, config: NodeConfig<any> = {}) : DefaultNodeInstance<T> {
//         let nodeClass = DefaultNodes[key];
//         if (nodeClass){
//             let node = new nodeClass(nodeKey, config);
//             this.nodes[nodeKey] = node;
//             return node as InstanceType<typeof DefaultNodes[T]>;
//         }
//         throw new Error(`Node type "${key.toString()}" not found`);
//     }

//     getNode<T extends MidiplexNodeType>(nodeKey: keyof typeof this.nodes) : DefaultNodeInstance<T> {
//         let node = this.nodes[nodeKey];
//         if (node){
//             return node as DefaultNodeInstance<T>
//         }
//         throw new Error(`Node "${nodeKey}" not found`);
//     }

//     private resolveEdgeString(edgeString: MidiplexEdgeString) : [string, string] {
//         let [nodeKey, edgeKey] = edgeString.split(':');
//         return [nodeKey, edgeKey];
//     }

//     private resolveEdgeStringPath(edgeStringArray: [MidiplexEdgeString, MidiplexEdgeString]) : { fromNode: string, toNode: string, fromEdge: string, toEdge: string } {
//         let [fromNode, fromEdge] = this.resolveEdgeString(edgeStringArray[0]);
//         let [toNode, toEdge] = this.resolveEdgeString(edgeStringArray[1]);
//         return {
//             fromNode,
//             fromEdge,
//             toNode,
//             toEdge
//         }
//     }

//     build(graph: MidiplexGraph){
//         for (let key in graph.nodes) {
//             let config = graph.nodes[key];
//             let nodeClass = graph.nodes[key];
//             if (nodeClass){
//                 let nodeType = config.type;
//                 this.addNode(nodeType, key, { props: graph.nodes[key].props });
//             }
//         }

//         graph.links.forEach(link => {
//             let { fromNode, fromEdge, toNode, toEdge } = Array.isArray(link) ? this.resolveEdgeStringPath(link) : link;

//             //Need to generalize the connect function here to accept strings as edge keys to avoid type error
//             let connect = <(edgeKey: string, to: MidiplexEdgeInstance<any>) => void> this.getNode(fromNode).connect;
//             let getInputEdge = <(edgeKey: string) => MidiplexEdgeInstance<any>> this.getNode(toNode).getInputEdge;

//             connect(fromEdge, getInputEdge(toEdge));
//         })
//     }


// }

// // let m = new Midiplex();
// //     m.addNode(MPNode.INPUT_NODE, 'test');

// // let input = m.getNode<MPNode.INPUT_NODE>('test');
// // let tra = m.getNode<MPNode.TRANSPOSE_NODE>('test');

// // input.connect('out', tra.getInputEdge('in'));


// // m.build({
// //     nodes: {
// //         input: {
// //             type: MPNode.INPUT_NODE,
// //             props: {
// //                 deviceId: '45'
// //             }
// //         },
// //         transpose: {
// //             type: MPNode.TRANSPOSE_NODE,
// //             props: {
// //                 transpose: 12
// //             }
// //         }
// //     },
// //     links: [
// //         ['input:out', 'transpose:in']
// //     ]
// // });

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

// export { Midiplex };