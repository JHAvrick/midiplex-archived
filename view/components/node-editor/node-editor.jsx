import React from 'react';
import './node-editor.scss';

import VerticalContainer from '../vertical-container/vertical-container.jsx';


const fields = [
    {
        type: "number",
        name: "test",
        label: "Test Number Field",
        min: 0,
        max: 100,
        value: 30
    },
    {
        type: "number",
        name: "test2",
        label: "Test Number Field 2",
        min: 0,
        max: 100,
        value: 30
    },
    /* 
    {
        type: "boolean",
        name: "check",
        label: "Checkmark",
        value: true
    },
    */
    {
        type: "select",
        name: "SelectBox",
        label: "Select Box",
        options: [
            {name: "Option 1", value: 1},
            {name: "Option 2", value: 2}
        ]
    }
]


import FieldGroup from '../fields/field-group.jsx';

const NodeEditor = () => {


    const handleInfoFieldChange = (e) => {
        console.log(e);
    }

    return (
        <div className="node-editor">
            <div className="node-editor__header">Node</div>
            <VerticalContainer height="100px" title="Info" className="vertical-container--bg-info">
                <FieldGroup onFieldChange={handleInfoFieldChange} fields={fields} />
            </VerticalContainer>
            <VerticalContainer height="350px" title="Properties" className="vertical-container--bg-props">
 
            </VerticalContainer>
            <VerticalContainer height="800px" title="Events" className="vertical-container--bg-events">
       
            </VerticalContainer>
        </div>
    )
}

export default NodeEditor;