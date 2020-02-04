import React, { useEffect, useState, useRef } from 'react';
//import FlowchartState from './flowchart-state';
import './node-connector.scss';

const NodeConnector = (props) => {
    let FlowchartState = props.fstate;
    let outHandle = FlowchartState.getHandle(props.outId).out;
    let inHandle =FlowchartState.getHandle(props.inId).in;
    const [linePos, setLinePos] = useState({
        x1: outHandle.x,
        y1: outHandle.y,
        x2: inHandle.x,
        y2: inHandle.y
    });

    const handleNodePositionChange = (handles) => {
        let outHandle = handles[props.outId].out;
        let inHandle = handles[props.inId].in;
        setLinePos({
            x1: outHandle.x,
            y1: outHandle.y,
            x2: inHandle.x,
            y2: inHandle.y
        });
    }

    useEffect(() => {
        FlowchartState.events.on("handleChange", handleNodePositionChange);
        return(() => {
            FlowchartState.events.removeListener("handleChange", handleNodePositionChange);
        })
    }, [])



    return (
        <div>
            <svg className="node-connector"
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                width="100%"
                height="100%"
                draggable={false}>

                <line className="node-connector__line" draggable={false} x1={linePos.x1} y1={linePos.y1} x2={linePos.x2} y2={linePos.y2} strokeWidth="2px" />
            </svg>
        </div>
    )
}

NodeConnector.defaultProps = {
    linePos: { x1: 0, y1: 0, x2: 0, y2: 0 }
}

export default NodeConnector;