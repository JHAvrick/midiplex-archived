const MidiPlexErrors = {
    WEBMIDI_ERROR: (err) => {
        return {
            code: 1,
            message: "There was an error starting WebMidiJS.",
            error: err
        }
    },
    DEFINITION_LOAD_ERROR: (err) => {
        return {
            code: 2,
            message: "There was an error loading a node definition.",
            error: err
        }
    },
    CREATE_CONFIG_ERROR: (err) => {
        return {
            code: 3,
            message: "Error creating main config file.",
            error: err
        }
    },
    LOAD_DEVICES_CONFIG_ERROR: (err) => {
        return {
            code: 4,
            message: "Error loading the devices config file.",
            error: err
        }
    },
    CREATE_DEVICES_CONFIG_ERROR: (err) => {
        return {
            code: 5,
            message: "Error creating the devices config file.",
            error: err
        }
    },
    WRITE_PROJECT_ERROR: (err) => {
        return {
            code: 6,
            message: "Error writing a new project space.",
            error: err
        }
    }
}

module.exports =  MidiPlexErrors;