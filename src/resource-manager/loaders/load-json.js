const fsPromises = require('fs').promises;
const path = require('path');

module.exports = async function(jsonPath){
    try {
        let json = JSON.parse(await fsPromises.readFile(path.resolve(jsonPath)))
        this.events.emit("projectLoaded", json);
        return json;
    } catch (err) {
        console.log(err);
    }
}