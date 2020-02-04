import React, { useEffect, useState, useRef } from 'react';
import { MidiPlex } from 'src/midiplex.js';
import Node from './node.jsx'
import NodeHooks from './node-hooks';
import FieldGroup from 'components/fields/field-group.jsx';

const FilterNode = (props) => {
    const fieldList = NodeHooks.useFieldList(props.node);
    const bypassed = NodeHooks.useBypassedState(props.node);
    const muted = NodeHooks.useMutedState(props.node);
    const name = NodeHooks.useNodeMeta(props.node, "name");
    const highlighted = NodeHooks.useNodeMeta(props.node, "highlighted");
    
    const handleNameChange = (name) => props.node.setMeta("name", name);
    const handleFieldChange = (data) => props.node.setProperty(data.key, data.value);
    const handleBypassToggled = () => props.node.toggleBypassed();
    const handleMuteToggled = () => props.node.toggleMuted();

    return (
        <div data-filternodecontext={props.node.id} style={{ position: "absolute", top: 0, left: 0, width: "0px", height: "0px" }}> 
           {/* { <NodeContextMenu node={props.node} />} */}
            <Node name={name} 
              onNameChange={handleNameChange}
              highlighted={highlighted}
              edgeColor="#00FFF0"
              fstate={props.fstate}
              bypassed={bypassed}
              muted={muted}
              onBypassToggled={handleBypassToggled}
              onMuteToggled={handleMuteToggled}
              node={props.node}
              id={props.node.id}>

                <FieldGroup fields={fieldList} onFieldChange={handleFieldChange}/>
            </Node>
        </div>

    )
}


export default FilterNode;