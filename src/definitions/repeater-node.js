export default {
    name: "RepeatNoteNode",
    baseNodeClass: "filter",
    receives: ["noteon", "noteoff", "controlchange"],
    quantize: "1/8",
    props: {
        quantize: {
            label: "Quantize",
            type: 'select',
            value: "1/4",
            options: [
                { name: "1/4", value: "1/4" },
                { name: "1/8", value: "1/8" },
                { name: "1/16", value: "1/16" },
                { name: "1/32", value: "1/32" }
            ]
        },
        polyphony: {
            label: "Polyphony",
            type: 'select',
            value: "16",
            options: [
                { name: "4", value: 4 },
                { name: "8", value: 8 },
                { name: "16", value: 16 },
                { name: "32", value: 32 }
            ]
        }
    },
    state: {
        sustaining: false,
        heldNotes: [],
    },
    tick: function(params){
        let send = params.send;
        let state = params.state;
        let heldNotes = params.utils.cloneDeep(params.state.heldNotes);

        let notesToRemove = []; //So that we're not altering the array in place
        heldNotes.forEach((note) => {
            //If the not is still being held, send a noteoff and then the next noteon
            if (note.held || state.sustaining){
                send(Object.assign({}, note.message, { type: "noteoff" }));
                send(note.message);
                return;
            }

            //If the note is no longer being held, remove it from the array
            if (!state.sustaining) {
                send(Object.assign({}, note.message, { type: "noteoff" }));
                notesToRemove.push(note);
            } 
        })

        params.state.heldNotes = heldNotes.filter(note => !notesToRemove.includes(note));
    },
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let state = params.state;

        /**
         * Catch the sustain control change message. If sustain is released after
         * all the notes have been released, we need to send their respective 
         * "noteoff" events
         */
        if (message.type === "controlchange" && message.controller.number === 64){
            state.sustaining = !state.sustaining;
            // if (!state.sustaining){
            //     state.heldNotes.forEach((note) => {
            //         if (!note. held){
            //             send(Object.assign({}, note.message, { type: "noteoff" }));
            //         }
            //     })
            // }
            return;
        }

        if (message.type === "noteon") {
            state.heldNotes.push({
                held: true,
                message: message
            })
            //send(message);
            return;
        }
        
        //If a note is released that isn't the one currently playing
        if (message.type === "noteoff"){

            //Queue the notes for removal - delayed if a sustain pedal is held
            state.heldNotes.forEach((note) => {
                if (note.message.note.number === message.note.number) note.held = false;
            })

            if (!state.sustaining) send(message);
            return;
        }

    }
}