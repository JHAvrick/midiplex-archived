import MidiPlexErrors from 'config/midiplex-errors';
import EventEmitter from 'util/event-emitter';

const regeneratorRuntime = require("regenerator-runtime");
const fsPromises = require('fs').promises;
const path = require("path");
const envPaths = require('env-paths');

const ResourceManager = {
    events: new EventEmitter(),
    on: function(event, listener){ this.events.on(event, listener) },

    /**
     * TODO
     */
    enableWebMidi: require('./loaders/enable-webmidi'),

    /**
     * TODO
     */
    loadJSON: require("./loaders/load-json"),

    /**
     * Creates the config directory if it does not already exists. Emits an error event
     * if the directory cannot be created or does not already exist
     */
    initConfig: require("./loaders/init-config"),

    /**
     * Creates or loads the device config
     */
    loadDevices: require("./loaders/load-devices"),

    /**
     * Reads the default definitions directory and requires each file in it and
     */
    initDefinitions: require('./loaders/init-definitions'),

    /**
     * Loads and EVALS a definition file
     */
    loadDefinitions: require("./loaders/load-definitions"),

    /**
     * Reads the default definitions directory and requires each file in it and
     */
    writeEmptyProject: require('./write/write-empty-project'),

    /**
     * Writes to an existing project location
     */
    writeProject: require('./write/write-project'),//require('./write/write-empty-project'),

    /**
     * Loads the project at the given path
     */
    loadProject: require('./loaders/load-project'),

    /**
     * Writes to an existing project location
     */
    writeDevices: require('./write/write-devices'),//require('./write/write-empty-project'),


}

export default ResourceManager;