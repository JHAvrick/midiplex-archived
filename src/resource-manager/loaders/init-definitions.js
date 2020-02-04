const fsPromises = require('fs').promises;
const path = require('path');
const MidiPlexErrors = require('config/midiplex-errors');

module.exports = async function(){
    let defFiles = await fsPromises.readdir(path.resolve(__dirname, "..", "..", "..", "definitions"));
    defFiles = defFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    defFiles.forEach((file) => {
        try {
            this.events.emit("definitionLoaded", require("../../../definitions/".concat(file)).default);
        } catch (err){
            this.events.emit("resourceError", MidiPlexErrors.DEFAULT_DEFINITION_LOAD_ERROR(err));
        }
    });
}