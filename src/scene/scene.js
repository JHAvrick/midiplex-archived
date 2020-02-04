import EventEmitter from 'util/event-emitter';
import SceneClock from 'scene/clock/scene-clock';
import DeviceBridge from 'scene/device-bridge';
import DefinitionManager from 'scene/definition-manager';
import DeviceBridge from 'scene/device-bridge';
import Nodes from 'nodes/all-nodes';
import shortid from 'shortid';

class MidiPlexScene {
    constructor(WebMidi, config){
        let options = Object.assign({}, MidiPlexScene.defaults, config); //Merge options

        //-----------------------------------------------------------------------------
        //                              Scene Systems                                 |
        //-----------------------------------------------------------------------------
        this.webMidi = WebMidi;
        this.devices = new DeviceBridge(WebMidi, /* TBD */);
        this.clock = new SceneClock(options.scene.clock);
        this.events = new EventEmitter();


        //-----------------------------------------------------------------------------
        //                              Scene Properties                              |
        //-----------------------------------------------------------------------------

        this.name = options.scene.name;
        this.nodes = this._buildNodes(options.nodes);

    }

    on(event, listener){ this.events.on(event, listener) }

    _createNode(id, config, def, BaseClass){

    }

    /**
     * Called when the scene is created to create and connect
     * the initial nodes provided. These nodes should already have id's
     * associated with them, but if they do not ids are created.
     * 
     * @param {Array} nodeConfigs
     */
    _buildNodes(nodeConfigs){
        let nodes = new Map();
        nodeConfigs.forEach((nodeConfig) => {
            let id = nodeConfig.id != null ? nodeConfig.id : shortid.generate();
            let def = this.definitions.get(nodeConfig.definition);
            let BaseClass = null; /* TODO */
            let node = this._createNode(id, nodeConfig, )
            
        })
    }

    _activateNodes(){
        this.nodes.forEach((node) => {
            node.activate();
        })
    }

    _deactivateNodes(){
        this.nodes.forEach((node) => {
            node.deactivate();
        })
    }

    //---------------------------- Public ---------------------------
    addNode(nodeConfig){
        let nodeDef = this.definitions.getDef(definitionId);
        let classBinding = nodeDef.classBinding

        let node = new Nodes[nodeDef.nodeType](this.midiPlex, {
            id: shortid.generate(),
            definition: nodeDef,
            clock: this.clock,
        });
        
        this._nodes.set(node.id, node);
        this.events.emit("sceneChange");
    }

    removeNode(id){

    }

    /**
     * @param {String} id - A node id
     * @returns The node with the given ID if it exists in this scene
     */
    getNode(id){
        return this.nodes.get(id);
    }

    /**
     * @returns This scene's internal map of nodes
     */
    getNodes(){
        return this.nodes;
    }

    freeze(){ this._deactivateNodes() }
    activate(){ this._activateNodes() }
    deactivate(){ this._deactivateNodes() }

    getSerializable(){
        return {
            scene: {
                name: this.name,
                id: this.id,
                clock: {
                    bpm: this.clock.bpm,
                    timeSignature: this.clock.timeSignature
                }
            },
            nodes: Array.from(this.nodes).map((entry) => {
                return entry[1].toSerializable();
            })
        }
    }

}

MidiPlexScene.defaults = {
    scene: {
        name: "Untitled Scene",
        clock: {
            bpm: 120,
            timeSignature: [4,4],
            resolution: 64,
            precision: "millisecond"
        }
    },
    nodes: []
}

//TODO: You can probably remove this
MidiPlexScene.inputEvents = [
    "noteon",
    "noteoff",
    "controlchange"
]

export default MidiPlexScene;
