import NodeHooks from 'hooks/node-hooks';
import Nodes from "nodes/all-nodes";
import React from 'react';
import { ContextMenu, ContextOption } from 'components/context-menu/context-menu.jsx';
import { MidiPlex } from 'src/midiplex.js';

function NodeContext(props) {
    let node = MidiPlex.nodes.getNode(props.attribute);
    if (!node) props.onRequestCloseMenu();

    const linkableToList = NodeHooks.useLinkableToList(node);
    const linkableFromList = NodeHooks.useLinkableFromList(node);
    const nodeConnections = NodeHooks.useNodeConnections(node);

    const handleRemoveNode = () => MidiPlex.nodes.removeNode(node.id);
    const handleConnectTo = (toNodeId) => MidiPlex.nodes.connectNodes(node.id, toNodeId);
    const handleConnectFrom = (fromNodeId) => MidiPlex.nodes.connectNodes(fromNodeId, node.id);
    const handleDisconnect = (nodeId) => MidiPlex.nodes.disconnectNodes(node.id, nodeId);
    const handleOptionHovered = (node, hovered) => node.setMeta("highlighted", hovered);

    let Menu;
    if (node instanceof Nodes.FilterNode){

        Menu = 
        <ContextMenu {...props}>
            <span style={{fontSize: "13px", color: "lime"}}>  Node Options </span>
            <div style={{padding: "5px 0 5px 10px"}}>
                <ContextOption closesMenu={true} name="Remove Node" onClick={handleRemoveNode} />
            </div>
            
            <span style={{fontSize: "13px", color: "lime"}}> Connections </span>
            <div style={{padding: "5px 0 5px 10px"}}>
                <ContextOption name="Send To">
                    {linkableToList.map((node) => 
                        <ContextOption 
                            key={"to-" + node.id} 
                            name={node.getMeta("name")} 
                            onHover={() => handleOptionHovered(node, true)}  
                            onHoverEnd={() => handleOptionHovered(node, false)}  
                            onClick={() => handleConnectTo(node.id)} />
                    )}
                </ContextOption>
                <ContextOption name="Recieve From">
                    {linkableFromList.map((node) => 
                        <ContextOption 
                            key={"from-" + node.id}
                            name={node.getMeta("name")} 
                            onHover={() => handleOptionHovered(node, true)}  
                            onHoverEnd={() => handleOptionHovered(node, false)}  
                            onClick={() => handleConnectFrom(node.id)} />
                    )}
                </ContextOption>
                <ContextOption name="Disconnect">
                    <span style={{fontSize: "13px", color: "lime"}}> Inputs </span>
                    <div style={{padding: "5px 0 5px 10px"}}>
                        {nodeConnections.inputs.map((node) => 
                                <ContextOption
                                    key={"dinput-" + node.id} 
                                    name={node.getMeta("name")} 
                                    onHover={() => handleOptionHovered(node, true)}  
                                    onHoverEnd={() => handleOptionHovered(node, false)}  
                                    onClick={() => handleDisconnect(node.id)} />
                        )}
                    </div>
                    <span style={{fontSize: "13px", color: "lime"}}> Outputs </span>
                    <div style={{padding: "5px 0 5px 10px"}}>
                        {nodeConnections.outputs.map((node) => 
                            <ContextOption 
                                key={"doutput-" + node.id} 
                                name={node.getMeta("name")} 
                                onHover={() => handleOptionHovered(node, true)}  
                                onHoverEnd={() => handleOptionHovered(node, false)}  
                                onClick={() => handleDisconnect(node.id)} />
                        )}
                    </div>
                </ContextOption>
            </div>

        </ContextMenu>

    } else if (node instanceof Nodes.InputDeviceNode) {

        Menu = 
        <ContextMenu {...props}>
            <ContextOption closesMenu={true} name="Remove Node" onClick={handleRemoveNode} />
            <ContextOption name="To">
                {linkableToList.map((node) => 
                    <ContextOption 
                        key={node.id}
                        name={node.getMeta("name")} 
                        onHover={() => handleOptionHovered(node, true)}  
                        onHoverEnd={() => handleOptionHovered(node, false)}  
                        onClick={() => handleConnectTo(node.id)} />
                )}
            </ContextOption>
            <ContextOption name="Disconnect">
                    <span style={{fontSize: "13px", color: "lime"}}> Outputs </span>
                    <div style={{padding: "5px 0 5px 10px"}}>
                        {nodeConnections.outputs.map((node) => 
                            <ContextOption 
                                key={"doutput-" + node.id} 
                                name={node.getMeta("name")} 
                                onHover={() => handleOptionHovered(node, true)}  
                                onHoverEnd={() => handleOptionHovered(node, false)}  
                                onClick={() => handleDisconnect(node.id)} />
                        )}
                    </div>
                </ContextOption>
        </ContextMenu>

    } else if (node instanceof Nodes.OutputDeviceNode){

        Menu =
        <ContextMenu {...props}>
            <ContextOption closesMenu={true} name="Remove Node" onClick={handleRemoveNode} />
            <ContextOption name="From">
                {linkableFromList.map((node) => 
                    <ContextOption 
                        key={node.id} 
                        name={node.getMeta("name")} 
                        onHover={() => handleOptionHovered(node, true)}  
                        onHoverEnd={() => handleOptionHovered(node, false)}  
                        onClick={() => handleConnectFrom(node.id)} />
                )}
            </ContextOption>
            <ContextOption name="Disconnect">
                    <span style={{fontSize: "13px", color: "lime"}}> Inputs </span>
                    <div style={{padding: "5px 0 5px 10px"}}>
                        {nodeConnections.inputs.map((node) => 
                                <ContextOption
                                    key={"dinput-" + node.id} 
                                    name={node.getMeta("name")} 
                                    onHover={() => handleOptionHovered(node, true)}  
                                    onHoverEnd={() => handleOptionHovered(node, false)}  
                                    onClick={() => handleDisconnect(node.id)} />
                        )}
                    </div>
                </ContextOption>
        </ContextMenu>
    }
    
    return Menu;
}



export default NodeContext;