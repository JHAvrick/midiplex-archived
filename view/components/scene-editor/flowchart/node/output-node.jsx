import React, { useEffect, useState, useRef } from 'react';
import {MidiPlex} from 'src/midiplex';
import FieldGroup from 'components/fields/field-group.jsx';

import Node from './node.jsx'
import DeviceHooks from 'hooks/device-hooks';
import NodeHooks from './node-hooks';

const OutputNode = (props) => {

    const nodeDeviceId = NodeHooks.useNodeDeviceId(props.node);
    const nodeDeviceStatus = NodeHooks.useNodeDeviceStatus(props.node)
    const bypassed = NodeHooks.useBypassedState(props.node);
    const muted = NodeHooks.useMutedState(props.node);
    const name = NodeHooks.useNodeMeta(props.node, "name");
    const highlighted = NodeHooks.useNodeMeta(props.node, "highlighted");

    const deviceList = DeviceHooks.useDeviceList();

    const handleNameChange = (name) => props.node.setMeta("name", name);
    const handleFieldChange = (data) => props.node.setDevice(data.value);
    const handleBypassToggled = () => props.node.toggleBypassed();
    const handleMuteToggled = () => props.node.toggleMuted();

    return (
        <div data-outputnodecontext={props.node.id} style={{ position: "absolute", top: 0, left: 0, width: "0px", height: "0px" }}>
            {/* {<NodeContextMenu node={props.node} />} */}
            <Node name={name} 
                onNameChange={handleNameChange}
                edgeColor="#7101FF"
                highlighted={highlighted}
                rightEdge={false}
                fstate={props.fstate}
                bypassed={bypassed}
                muted={muted}
                onBypassToggled={handleBypassToggled}
                onMuteToggled={handleMuteToggled}
                node={props.node}
                id={props.node.id}>

                <FieldGroup fields={[
                    {
                        name: "output-device-id",
                        label: "Output Device",
                        type: "select",
                        value: nodeDeviceId,
                        //status: MidiPlex.devices.getOutputStatus(nodeDeviceId),
                        options: deviceList.map((device) => {
                            return { name: device.name, value: device.id }
                        }).concat([{ name: "No Device", value: "nulldevice" }]).reverse()
                    }
                ]} 
                onFieldChange={handleFieldChange}/>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15px",
                    width: "100%", 
                    height: "25px", 
                    background: nodeDeviceStatus.output ? "limegreen" : "red"
                }}>

                    { nodeDeviceStatus.output ? "STATUS: CONNECTED" : "STATUS: NOT CONNECTED" }

                </div>

            </Node>
        </div>
    )
}

export default OutputNode;


