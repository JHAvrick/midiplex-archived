import { useState } from 'react';
import { MidiPlex } from 'engine/midiplex-engine';

function useBootStatuses() {
    const [bootStatuses, setBootStatuses] = useState([]);

    MidiPlex.on("bootEvent", (message) => {
        //bootStatuses.push(message);
        //setBootStatuses(bootStatuses.concat([message]));
    });

    return bootStatuses;
}

export default useBootStatuses;