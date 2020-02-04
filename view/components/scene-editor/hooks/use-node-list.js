import { useEffect, useState } from 'react';
import { MidiPlex } from 'src/midiplex';
//import shortid from 'shortid';

/**
 * This hook fetches the list of nodes and connections from the give scene 
 * and reduces the data into a graph schema which the Flowchart component can 
 * understand
 */
function useNodeList() {
    let [nodeList, setNodeList] = useState(MidiPlex.nodes.getNodes());

    const handleSetNodeList = () => setNodeList(MidiPlex.nodes.getNodes());
    useEffect(() => {
        MidiPlex.nodes.on("nodeAdded", handleSetNodeList);
        MidiPlex.nodes.on("nodeRemoved", handleSetNodeList);
        return (() => {
            MidiPlex.nodes.events.removeListener("nodeAdded", handleSetNodeList);
            MidiPlex.nodes.events.removeListener("nodeRemoved", handleSetNodeList);
        })
    })


    return nodeList;
}


export default useNodeList;