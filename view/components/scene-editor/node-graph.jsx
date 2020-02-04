import React, { useState, useRef } from 'react';
import Flowchart from './flowchart/flowchart.jsx';
import './node-graph.scss';

//TODO: Remove this component
const NodeGraph = (props) => {
    return (
        <div className="node-graph">
            <Flowchart />
        </div>
    )
}

export default NodeGraph;



