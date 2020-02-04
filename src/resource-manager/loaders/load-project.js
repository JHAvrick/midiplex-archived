const fsPromises = require('fs').promises;
const path = require('path');
const MidiPlexErrors = require('config/midiplex-errors');

module.exports = async function(projectPath){
    let pathArr = projectPath.split(path.sep);
    let projectName = pathArr.pop();
    let projectDirPath = pathArr.join(path.sep);

    try {
        /**
         * Fetch and evaluate any user-defined node definitions
         */
        let defFiles = await fsPromises.readdir(path.resolve(projectDirPath, "definitions"));
        defFiles = defFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
        for(let i = 0; i < defFiles.length; i++){
            let file = defFiles[i];
            try {
                let defFileRaw = await fsPromises.readFile(path.resolve(projectDirPath, "definitions", file));
                /**
                 * This is an UNSAFE eval - users should not use custom definitions that they 
                 * themselves did not write. More work can be done here to sandbox the eval'd code.
                 */
                let window, process, module, global = null; //This doesn't really do anything
                let userDefUnsafe = eval("(" + defFileRaw.toString() + ")");
                this.events.emit("definitionLoaded", userDefUnsafe, defFileRaw);

            } catch (err) {
                console.log(err);
                this.events.emit("resourceError", MidiPlexErrors.DEFAULT_DEFINITION_LOAD_ERROR(err));
            }
        }

        /**
         * Fetch the main configuration
         */
        let projectConfig = await fsPromises.readFile(path.resolve(projectDirPath, projectName));
        this.events.emit("projectLoaded", JSON.parse(projectConfig.toString()));

    } catch (err) {
        console.log(err);
    }
}