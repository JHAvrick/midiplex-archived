import React, {useState} from 'react';
import {ContextMenu, ContextOption} from 'components/context-menu/context-menu.jsx';
import {MidiPlex} from 'src/midiplex';

function useDefinitionList(){
    const [definitionList, setDefinitionList] = useState(
        Array.from(MidiPlex.definitions.defs.keys())
    )
    console.log("TODO: Clean Up / Complete Hook")
    return definitionList;
}

function FlowchartContext(props) {
    const definitionList = useDefinitionList();
    const handleAddNodeClicked = (event, definitionName) => {
        MidiPlex.nodes.addNode(definitionName, event.pageX, event.pageY);
    }

    return (        
        <ContextMenu top={props.top} left={props.left}>
            <ContextOption name="Add Node">
                {definitionList.map((defName) => 
                    <ContextOption key={defName} name={defName} onClick={(event) => handleAddNodeClicked(event, defName)} />
                )}
            </ContextOption>
        </ContextMenu>
    )
}

export default FlowchartContext;