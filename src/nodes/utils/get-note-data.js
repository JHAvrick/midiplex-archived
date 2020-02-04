
/**
 * This function returns an object w/ data about a given note
 * when provided with either a note number or note strin
 * 
 * @param {Number | String} note - A note string or number
 * @returns {Object} - note data object
 */
function getNoteData(note){

    if (typeof note === "string"){
        return {
            //TODO
        }
    }

    if (typeof note === "number"){
        return {
            //TODO
        }
    }

    //Default return value if the parameters were not of the correct type
    return {
        note: "A",
        octave: "0",
        number: 21
    }

}

export default getNoteData;