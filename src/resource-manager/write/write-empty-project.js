const fsPromises = require('fs').promises;
const path = require('path');
const envPaths = require('env-paths');
const MidiPlexErrors = require('config/midiplex-errors');
const shortid = require('shortid');

/**
 * Creates the config directory if it does not already exists. Emits an error event
 * if the directory cannot be created or does not already exist
 */
module.exports =  async function(projectPath){
    try {
        let pathArr = projectPath.split(path.sep);
        let projectName = pathArr.pop();
        let projectDirPath = pathArr.join(path.sep);

        //Create the project directory
        //await fsPromises.mkdir(path.resolve(projectDirPath));
        await fsPromises.mkdir(path.resolve(projectDirPath, "definitions"));
        await fsPromises.mkdir(path.resolve(projectDirPath, "assets"));
        await fsPromises.writeFile(path.resolve(projectDirPath, projectName.concat(".json")), JSON.stringify({
            name: projectName,
            scenes: [
                {
                    scene: {
                        id: shortid.generate(),
                        name: "Untitled Scene",
                        clock: {
                            bpm: 120,
                            timeSignature: [4,4]
                        }
                    },
                    nodes: []
                }
            ]
        }));

    } catch (err){
        console.warn(err);
        this.events.emit("resourceError", MidiPlexErrors.WRITE_PROJECT_ERROR(err));
    }
}