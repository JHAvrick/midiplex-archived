const fsPromises = require('fs').promises;
const envPaths = require('env-paths');
const MidiPlexErrors = require('config/midiplex-errors');

/**
 * Creates the config directory if it does not already exists. Emits an error event
 * if the directory cannot be created or does not already exist
 */
module.exports =  async function(){
    const paths = envPaths('midiplex-app');
    console.log("Config Dir: " + paths.config);
    try {
        //Create the config directory
        await fsPromises.mkdir(paths.config);
    } catch (err){
        if (err.code !== "EEXIST"){
            this.events.emit("resourceError", MidiPlexErrors.CREATE_CONFIG_ERROR(err));
            return;
        }
    }
}