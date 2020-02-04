const fsPromises = require('fs').promises;
const path = require('path');
const envPaths = require('env-paths');
const MidiPlexErrors = require('config/midiplex-errors');

/**
 * Creates the config directory if it does not already exists. Emits an error event
 * if the directory cannot be created or does not already exist
 */
module.exports =  async function(projectPath, project){
    try {
        //let pathArr = projectPath.split(path.sep);
        //let projectName = pathArr.pop();
        //let projectDirPath = pathArr.join(path.sep);

        await fsPromises.writeFile(path.resolve(projectPath), JSON.stringify(project));
    } catch (err){
        console.warn(err);
        this.events.emit("resourceError", MidiPlexErrors.WRITE_PROJECT_ERROR(err));
    }
}