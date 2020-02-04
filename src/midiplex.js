import ResourceManager from './resource-manager/resource-manager';
import DefinitionManager from './scene/definition-manager';
import DeviceBridge from './scene/device-bridge';
import EventEmitter from 'util/event-emitter';
import NodeManager from './scene/node-manager';
import SceneClock from './scene/clock/scene-clock';

/**
 * 
 * @param {Object} Devices - The device configuration object
 * @param {Object} Definitions - The defintions configuration object
 * @param {Object} Scenes - The scenes configuration object
 */
function MidiPlexInit(){
    this.boot = async function(projectPath){
        let sceneConfig = projectPath ? await ResourceManager.loadJSON(projectPath) : DefaultProjectConfig;
        let definitions = await ResourceManager.loadDefinitions(require("path").resolve(__dirname, 'definitions'));
        let devices = await ResourceManager.loadDevices();

        console.log(devices);

        let WebMidi = await ResourceManager.enableWebMidi();

        // WebMidi.getInputById("799348445").addListener("controlchange", "all", function(){
        //     console.log("GDFSOIDJFOIJSDF");
        // })
        
        // setInterval(() => {
        //     WebMidi.getOutputById("-714189645").playNote([50, 57, 54]);
        // }, 1500)

        


        this.meta = new Map();
        this.events = new EventEmitter();
        this.devices = new DeviceBridge(WebMidi, devices);
        this.definitions = new DefinitionManager(definitions);
        this.clock = new SceneClock(sceneConfig.scene.clock);
        this.nodes = new NodeManager(this, sceneConfig.nodes);

        //Assign some properties and meta
        this.name = sceneConfig.scene.name;
        this.meta.set("projectPath", projectPath);
        //this.meta.set("initConfig", sceneConfig)
        this.meta.set("viewportX", sceneConfig.scene.meta.viewportX || 0);
        this.meta.set("viewportY", sceneConfig.scene.meta.viewportY || 0);
    }

    this.on = function(event, listener){
        this.events.on(event, listener);
    }

    this.writeProject = function(writePath){           
        console.log("Saving...")
        this.meta.set("projectPath", writePath);

        ResourceManager.writeDevices(this.devices.toSerializable());
        ResourceManager.writeProject(writePath,
            {
                nodes: this.nodes.toSerializable(),
                scene: {
                    meta: Object.fromEntries(this.meta)
                },
            }
        )
        
    }

    this.setMeta = (name, value) => this.meta.set(name, value);
    this.getMeta = (name) => this.meta.get(name);

}

const DefaultProjectConfig = {
    scene: {
        name: "Untitled Scene",
        clock: {
            bpm: 120,
            timeSignature: [4,4],
            resolution: 64,
            precision: "millisecond"
        },
        meta: {
            viewportX: -5000,
            viewportY: -5000
        }
    },
    nodes: []
}

export const MidiPlex = new MidiPlexInit();
