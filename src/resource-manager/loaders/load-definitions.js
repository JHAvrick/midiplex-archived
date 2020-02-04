const fsPromises = require('fs').promises;
const path = require('path');
const MidiPlexErrors = require('config/midiplex-errors');

/**
 * Loads all the definitions in a given folder
 */
module.exports = async function(defPath){
    try {
        /**
         * Fetch and evaluate any user-defined node definitions
         */
        let defs = []; //Populated in loop
        let defFiles = await fsPromises.readdir(defPath);
        defFiles = defFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
        for(let i = 0; i < defFiles.length; i++){
            let file = defFiles[i];
            try {
                console.log("Loading Definition: " + defFiles[i]);
                let defFileRaw = await fsPromises.readFile(path.resolve(defPath, file));
                let defString = defFileRaw.toString()
                                .replace("module.exports =", "")
                                .replace("export default", "");


                let evaledDef = eval("(" + defString + ")");

                /**
                 * Emit event and also add the evaled definition into our defs array to return later
                 */
                this.events.emit("definitionLoaded", evaledDef);
                defs.push(evaledDef);

            } catch (err) {
                console.log(file);
                console.log(err);
                this.events.emit("resourceError", MidiPlexErrors.DEFAULT_DEFINITION_LOAD_ERROR(err));
            }
        }

        return defs;

    } catch (err) {
        console.log(err);
    }
}