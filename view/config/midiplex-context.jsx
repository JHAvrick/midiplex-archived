import React from 'react';
import FlowchartContext from 'components/scene-editor/flowchart/flowchart-context.jsx';
import NodeContext from 'components/scene-editor/flowchart/node/node-context.jsx';

export default [
    {
        attribute: "data-gridcontext",
        menu: <FlowchartContext />
    },
    {
        attribute: "data-nodecontext",
        menu: <NodeContext />
    },
    // {
    //     attribute: "data-outputnodecontext",
    //     menu: <FlowchartContext />
    // },
    // {
    //     attribute: "data-filternodecontext",
    //     menu: <FlowchartContext />
    // },
]