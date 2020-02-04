const fsPromises = require('fs').promises;
const path = require('path');
const envPaths = require('env-paths');
const MidiPlexErrors = require('config/midiplex-errors');

/**
 * Creates the config directory if it does not already exists. Emits an error event
 * if the directory cannot be created or does not already exist
 */
module.exports =  async function(devices){
    const paths = envPaths('midiplex-app');
    try {
        await fsPromises.writeFile(path.join(paths.config, "devices.json"), JSON.stringify(devices));
    } catch (err) {
        console.log(err);
        this.events.emit("resourceError", MidiPlexErrors.CREATE_DEVICES_CONFIG_ERROR(err));
    }
}