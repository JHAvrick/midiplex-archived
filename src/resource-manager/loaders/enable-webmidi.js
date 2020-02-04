const WebMidi = require("webmidi");
/**
 * Creates the config directory if it does not already exists. Emits an error event
 * if the directory cannot be created or does not already exist
 */
module.exports = async function(){
    return new Promise((resolve, reject) => {
        WebMidi.enable((err) => {
            if (err){ reject(err); }

            this.events.emit("webMidiEnabled", WebMidi);
            resolve(WebMidi);
            
        }, true);
    })
}