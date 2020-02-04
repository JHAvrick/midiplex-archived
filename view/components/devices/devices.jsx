import React, {useState, useEffect, useRef} from 'react';
import Modal from 'components/modal/modal.jsx';
import {MidiPlex} from 'src/midiplex';
import hotkeys from 'hotkeys-js';
import './devices.scss';

import DoubleClickInput from 'components/double-click-input/double-click-input.jsx';



const Devices = (props) => {
    const deviceList = useDeviceList();
    const availablePorts = useAvailablePorts();
    const [selectedDevice, setSelectedDevice] = useState(deviceList[0]);
    const [selectedInputId, setSelectedInputId] = useState(deviceList[0].input.id);
    const [selectedOutputId, setSelectedOutputId] = useState(deviceList[0].output.id);

    const handleAddDevice = () => MidiPlex.devices.addDevice();
    const handleRemoveDevice = () => {
        if (selectedDevice.id === "nulldevice") return;
        if (deviceList.length <= 1) return;

        let toRemoveId = selectedDevice.id;
        let newSelection = Array.from(Object.values(MidiPlex.devices.getDevices()))[1];

        MidiPlex.devices.removeDevice(toRemoveId);
        setSelectedDevice(newSelection);
        setSelectedInputId(newSelection.inputId);
        setSelectedOutputId(newSelection.outputId);
    }
    
    const handleDeviceSelected = (device) => {
        setSelectedDevice(device);
        setSelectedInputId(device.input.id);
        setSelectedOutputId(device.output.id);
    }

    const handleInputSelected = (input) => {
        /**
         * If the selected port was already active, deactivate it
         */
        if (input.id === selectedInputId){
            MidiPlex.devices.setDeviceInputPort(selectedDevice.id, "nulldevice");
            return;
        }
        /**
         * Ignore request if the port is already being used
         */
        if (MidiPlex.devices.inputPortInUse(input.id)) return;
        /**
         * Otherwise, set the new device port
         */
        MidiPlex.devices.setDeviceInputPort(selectedDevice.id, input.id);
    }

    const handleOutputSelected = (output) => {
        /**
         * If the selected port was already active, deactivate it
         */
        if (output.id === selectedOutputId){
            MidiPlex.devices.setDeviceOutputPort(selectedDevice.id, "nulldevice");
            return;
        }
        /**
         * Ignore request if the port is already being used
         */
        if (MidiPlex.devices.outputPortInUse(output.id)) return;
        /**
         * Otherwise, set the new device port
         */
        MidiPlex.devices.setDeviceOutputPort(selectedDevice.id, output.id);
    }


    const handleDevicePortChange = () => {
        setSelectedInputId(selectedDevice.input.id);
        setSelectedOutputId(selectedDevice.output.id);
    }
    useEffect(() => {
        MidiPlex.devices.on("devicePortChange", handleDevicePortChange)
        return (() => MidiPlex.devices.events.removeListener("devicePortChange", handleDevicePortChange))
    });


    //--------------------- TODO: REMOVE ME --------------------- 
    const [devicesMenuOpen, setDevicesMenuOpen] = useState(false);
    const handleModalClosed = () => {
        setDevicesMenuOpen(false);
    }
    hotkeys('ctrl+d, cmd+d', function(event, handler){
        setDevicesMenuOpen(!devicesMenuOpen);
    });  
    hotkeys();
    //--------------------- TODO: REMOVE ME --------------------- 


    if (!devicesMenuOpen) return (<div style={{display: "none"}}></div>);
    return (
        <Modal onClose={handleModalClosed} name="Devices" height={400} width={625}>
            <div className="devices">

                <div className="devices__device-list-wrapper">
                    <ul className="devices__device-list">
                        { 
                            deviceList.map((device) => {
                                return (
                                    <li key={device.id} 
                                        onClick={() => handleDeviceSelected(device)} 
                                        className={"devices__device-item" + (device.id === selectedDevice.id ? "--selected" : "")}>
    
                                        <div className="devices__device-name"> 
                                            <DoubleClickInput 
                                                onChange={(value) => MidiPlex.devices.setDeviceProperty(device.id, "name", value)} 
                                                value={device.name} />
                                        </div>
    
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="devices__devices-tray">
                        <div className="devices__tray-option" 
                             onClick={handleRemoveDevice}
                             style={{color: "red"}}> 
                             - Remove 
                        </div>
                        <div className="devices__tray-option" 
                             onClick={handleAddDevice}
                             style={{color: "green"}}> 
                             + Add 
                        </div>
                    </div>
                </div>

                <div className="devices__device-options">

                    <div className="devices__device-info">
                        <label><span style={{fontWeight: "bold"}}>Device Name:</span> {selectedDevice.name} </label>
                        <label>
                            <span>Device Status:</span> 
                            ...
                        </label>
                    </div>

                    <div className="devices__ports-list-wrapper">

                        <div>
                            <label className="devices__ports-list-header">Input Ports</label>
                            <ul className="devices__ports-list">
                                {
                                    availablePorts.inputs.map((input) => {
                                        return (
                                            <li key={input.id} 
                                                onClick={() => handleInputSelected(input)} 
                                                className={(() => {
                                                    if (input.id === selectedInputId) return "devices__port-item--selected";
                                                    if (MidiPlex.devices.inputPortInUse(input.id)) return "devices__port-item--in-use";
                                                    return "devices__port-item";
                                                })()}>
                                                <div className="devices__port-item-left">
                                                    <label className="devices__port-item-label"> {input.name} </label>
                                                    <label className="devices__port-item-sublabel"> {"Manufacturer: " + input.manufacturer} </label>
                                                    <label className="devices__port-item-sublabel"> {"ID: " + input.id} </label>
                                                </div>
                                                <div className="devices__port-item-right"></div>

                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    
                        <div style={{ paddingLeft: "5px" }}>
                            <label className="devices__ports-list-header">Output Ports</label>
                                <ul className="devices__ports-list">
                                {
                                    availablePorts.outputs.map((output) => {
                                        return (
                                            <li key={output.id} 
                                                onClick={() => handleOutputSelected(output)} 
                                                className={(() => {
                                                    if (output.id === selectedOutputId) return "devices__port-item--selected";
                                                    if (MidiPlex.devices.outputPortInUse(output.id)) return "devices__port-item--in-use";
                                                    return "devices__port-item";
                                                })()}>
                                                <div className="devices__port-item-left">
                                                    <label className="devices__port-item-label"> {output.name} </label>
                                                    <label className="devices__port-item-sublabel"> {"Manufacturer: " + output.manufacturer} </label>
                                                    <label className="devices__port-item-sublabel"> {"ID: " + output.id} </label>
                                                </div>
                                                <div className="devices__port-item-right">
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        MidiPlex.devices.pollOutput(output.id)
                                                    }}>
                                                            Poll
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </Modal>
    )
}

function useDeviceList(){
    const [deviceList, setDeviceList] = useState(Array.from(Object.values(MidiPlex.devices.getDevices())));
    const handleSetDeviceList = () => setDeviceList(Array.from(Object.values(MidiPlex.devices.getDevices())));
    useEffect(() => {
        MidiPlex.devices.on("devicePropertyChange", handleSetDeviceList);
        MidiPlex.devices.on("deviceAdded", handleSetDeviceList);
        MidiPlex.devices.on("deviceRemoved", handleSetDeviceList);
        return (() => {
            MidiPlex.devices.events.removeListener("devicePropertyChange", handleSetDeviceList);
            MidiPlex.devices.events.removeListener("deviceAdded", handleSetDeviceList);
            MidiPlex.devices.events.removeListener("deviceRemoved", handleSetDeviceList);
        })
    })
    return deviceList;
}

function useAvailablePorts(){
    const [availablePorts, setAvailablePorts] = useState({
        inputs: MidiPlex.devices.getInputPorts(),
        outputs: MidiPlex.devices.getOutputPorts()
    });
    
    const handleSetAvailablePorts = () => setAvailablePorts({
        inputs: MidiPlex.devices.getInputPorts(),
        outputs: MidiPlex.devices.getOutputPorts()
    });

    useEffect(() => {
        MidiPlex.devices.on("portsAdded", handleSetAvailablePorts);
        MidiPlex.devices.on("portsRemoved", handleSetAvailablePorts);
        MidiPlex.devices.on("deviceAdded", handleSetAvailablePorts);
        MidiPlex.devices.on("deviceRemoved", handleSetAvailablePorts);
        return (() => {
            MidiPlex.devices.events.removeListener("portsAdded", handleSetAvailablePorts);
            MidiPlex.devices.events.removeListener("portsRemoved", handleSetAvailablePorts);
            MidiPlex.devices.events.removeListener("deviceAdded", handleSetAvailablePorts);
            MidiPlex.devices.events.removeListener("deviceRemoved", handleSetAvailablePorts);
        })
    })

    return availablePorts;
}


export default Devices;
