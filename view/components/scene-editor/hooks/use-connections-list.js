import { useState, useEffect } from 'react';
import { MidiPlex } from 'src/midiplex';

/**
 * This hook fetches the list of nodes and connections from the give scene 
 * and reduces the data into a graph schema which the Flowchart component can 
 * understand
 */
function useConnectionsList() {
    let [connectionsList, setConnectionsList] = useState(MidiPlex.nodes.getConnections());

    const handleSetConnectionList = () => setConnectionsList(MidiPlex.nodes.getConnections())
    useEffect(() => {
        MidiPlex.nodes.on("connectionAdded", handleSetConnectionList);
        MidiPlex.nodes.on("connectionRemoved", handleSetConnectionList);
        return () => {
            MidiPlex.nodes.events.removeListener("connectionAdded", handleSetConnectionList);
            MidiPlex.nodes.events.removeListener("connectionRemoved", handleSetConnectionList);
        }
    });
    
    return connectionsList;
}


export default useConnectionsList;