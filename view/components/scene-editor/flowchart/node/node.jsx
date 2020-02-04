import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Icons from 'components/icons/icons.jsx';
import NodeHooks from './node-hooks';
import './node.scss';

const Node = (props) => {
    let FlowchartState = props.fstate;

    const nameInputEl = useRef(null);
    const dragComponent = useRef(null);
    const outputHandleEl = useRef(null);
    const inputHandleEl = useRef(null);
    const [parentRect, setParentRect] = useState(FlowchartState.gridRect);
    const [nameReadonly, setNameReadonly] = useState(true);

    const getHandlePositions = (inEl, outEl, rect) => {
        let inRect = inEl.current.getBoundingClientRect();
        let outRect = outEl.current.getBoundingClientRect();
        return {
            in: {
                x: (inRect.x + inRect.width / 2) - rect.x,
                y: (inRect.y + inRect.height / 2) - rect.y
            },
            out: {
                x: (outRect.x + outRect.width / 2) - rect.x,
                y: (outRect.y + outRect.height / 2) - rect.y
            }
        }
    }

    //-------------------------------------On Grid Change--------------------------------------------
    const handleGridChange = (rect) => {
        setParentRect(rect);
        FlowchartState.setHandle(props.id, getHandlePositions(inputHandleEl, outputHandleEl, rect));
    }
    useEffect(() => {
        FlowchartState.events.on("gridChange", handleGridChange);
        return () =>  FlowchartState.events.removeListener("gridChange", handleGridChange);
    }, []);

    //-----------------------------------------------------------------------------------------------

    useEffect(() => {
        FlowchartState.setHandle(props.id, getHandlePositions(inputHandleEl, outputHandleEl, parentRect))
    }, [outputHandleEl, inputHandleEl]);

    /**
     * On Component Dismount: Remove handles from the flowchart state object
     */
    useEffect(() => {
        return () => {
          FlowchartState.removeHandle(props.id);
        }
    }, []);

    const handleOnDrag = (event) => {
        FlowchartState.setHandle(props.id, getHandlePositions(inputHandleEl, outputHandleEl, parentRect));
    }

    const selected = NodeHooks.useNodeMeta(props.node, "selected");

    const handleInMouseDown = (event) => {
        FlowchartState.setConnectionStart({
            type: "input",
            nodeId: props.id,
            handle: getHandlePositions(inputHandleEl, outputHandleEl, parentRect)
        });
    }

    const handleOutMouseDown = (event) => {
        FlowchartState.setConnectionStart({
            type: "output",
            nodeId: props.id,
            handle: getHandlePositions(inputHandleEl, outputHandleEl, parentRect)
        });
    }

    const handleDragStop = (event) => {
        props.node.setMeta("x", dragComponent.current.state.x);
        props.node.setMeta("y", dragComponent.current.state.y);
    }


    //--------------------------------- Name Input --------------------------------- 
    //TODO: Replace the name input w/ the DoubleClickInput
    const handleNameInputChange = () => props.onNameChange(nameInputEl.current.value);
    const handleNameInputBlur = () => setNameReadonly(true);
    const handleNameInputKeyDown = (e) => {
        if ([13, 27, 9].includes(e.keyCode)){
            setNameReadonly(true);
        }
    }

    const handleNameDoubleClicked = () => { 
        setNameReadonly(false); 
        nameInputEl.current.setSelectionRange(0, nameInputEl.current.value.length)
    }
    //------------------------------------------------------------------------------- 

    return (
            <Draggable 
                ref={dragComponent}
                data-nodecontext={props.node.id} 
                data-selectorid={props.node.id}
                defaultPosition={{
                    x: props.node.getMeta("x"), 
                    y: props.node.getMeta("y")
                }} 
                onDrag={handleOnDrag} 
                onStop={handleDragStop}
                cancel=".no-drag" 
                bound="parent">
                
                <div data-selectorid={props.node.id} data-nodecontext={props.node.id}  className="drag-wrapper">
                    <div className={"node" + (selected ? " node--selected" : "") }>
                        <svg style={{
                                visibility: props.leftEdge ? 'visible' : 'hidden',
                                fill: props.edgeColor
                            }} 
                            onMouseDown={handleInMouseDown} ref={inputHandleEl} 
                            className="node__handle-in no-drag" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 17.32050807568877 20">

                            <path d="M8.660254037844386 0L17.32050807568877 5L17.32050807568877 15L8.660254037844386 20L0 15L0 5Z"></path>
                        </svg>

                        <svg style={{
                                visibility: props.rightEdge ? 'visible' : 'hidden',
                                fill: props.edgeColor
                            }}  
                            onMouseDown={handleOutMouseDown} ref={outputHandleEl} 
                            className="node__handle-out no-drag" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 17.32050807568877 20">

                            <path d="M8.660254037844386 0L17.32050807568877 5L17.32050807568877 15L8.660254037844386 20L0 15L0 5Z"></path>
                        </svg>

                        <div data-selectorid={props.node.id} data-nodecontext={props.node.id}  className="node__content-wrapper">
                            <div data-selectorid={props.node.id} data-nodecontext={props.node.id}  className={"node__header"} style={{  background: "#696969"  }}> 
                                
                                <input  ref={nameInputEl} 
                                        className={"node__name-input" + (nameReadonly ? "" : " no-drag")}
                                        readOnly={nameReadonly}
                                        value={props.name}
                                        onChange={handleNameInputChange}
                                        onDoubleClick={handleNameDoubleClicked}
                                        onKeyDown={handleNameInputKeyDown}
                                        onBlur={handleNameInputBlur}
                                        style={{
                                            color: nameReadonly ? "#D6D6D6" : "lime",
                                            userSelect: nameReadonly ? "none" : "initial",
                                        }}
                                        />

                                <div className="node__controls no-drag">
                                    <div className="node__btn-wrapper" onClick={props.onBypassToggled}>
                                        { 
                                            React.createElement(Icons.Bypass, 
                                            { 
                                                width: 18, 
                                                color: props.bypassed ? "#FF7400" : "#ffffff"
                                            }) 
                                        }
                                    </div>
                                    <div className="node__btn-wrapper" onClick={props.onMuteToggled} >
                                        { 
                                            React.createElement(Icons.Mute, 
                                            { 
                                                width: 15, 
                                                color: props.muted ? "red" : "#ffffff"
                                            }) 
                                        }
                                    </div>
                                </div>

                            </div>
                            <div data-selectorid={props.node.id} data-nodecontext={props.node.id}  className={"node__content"}>
                                {props.children}
                            </div>
                        </div>

                        <div data-nodecontext={props.node.id}  className="node__overlay" style={{ display: props.highlighted ? "block" : "none" }}></div>
                    </div>
                </div>
            </Draggable>
    )
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

Node.defaultProps = {
    onPositionChange: function(){},
    onSelected: function(){},
    onBypassedToggled: function(){},
    onMuteToggled: function(){},
    onNameChange: function(){},
    bypassed: false,
    muted: false,
    leftEdge: true,
    rightEdge: true,
    edgeColor: "#ffffff",
    x: getRandom(500, 1000),
    y: getRandom(500, 1000)
    //color: "#ABFFC3"
}

export default Node;