const fsPromises = require('fs').promises;
const envPaths = require('env-paths');
const path = require("path");
const MidiPlexErrors = require('config/midiplex-errors');

module.exports = async function(){
    const paths = envPaths('midiplex-app');
    try {
        let devices = JSON.parse(await fsPromises.readFile(path.join(paths.config, "devices.json")));

        /**
         * The devicesLoaded event can be listened for as an alternate way to receive the
         * device config when loaded
         */
        this.events.emit("devicesLoaded", devices);
        return devices;

    } catch (err) {
        //Unexpected error has occurred
        if (err.code !== "ENOENT"){
            this.events.emit("resourceError", MidiPlexErrors.LOAD_DEVICES_CONFIG_ERROR(err));
            return;
        }

        //File doesn't exist, create a new one
        try {
            await fsPromises.mkdir(paths.config, { recursive: true });
            await fsPromises.writeFile(path.join(paths.config, "devices.json"), JSON.stringify([]));
        } catch (err) {
            console.log(err);
            this.events.emit("resourceError", MidiPlexErrors.CREATE_DEVICES_CONFIG_ERROR(err));
        }
        
        //Either way, create the device bridge w/ an empty config
        this.events.emit("devicesLoaded", []);
        return [];
    }
}