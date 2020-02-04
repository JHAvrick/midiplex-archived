import { useState } from 'react';
import { MidiPlex } from 'engine/midiplex-engine';

/**
 * This hook fetches the current schema from the SceneModel
 * with the given id
 */
function useDefinitionList() {
    let [definitionList, setDefinitionList] = useState(MidiPlex.definitions.getManifest());

    const handleSetDefinitionList = () => setDefinitionList(MidiPlex.definitions.getManifest());
    useEffect(() => {
        MidiPlex.definitions.on("definitionAdded", handleSetDefinitionList);
        MidiPlex.definitions.on("definitionRemoved", handleSetDefinitionList);
        return () => {
            MidiPlex.definitions.events.removeListener("definitionAdded", handleSetDefinitionList);
            MidiPlex.definitions.events.removeListener("definitionRemoved", handleSetDefinitionList);
        }   
    })

    return definitionList;
}

export default useDefinitionList;