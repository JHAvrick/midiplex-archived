import React, {useState, useEffect} from 'react';
import {MidiPlex} from 'src/midiplex'

const DeviceHooks = {
    /**
     * Provides the DeviceBridge's list of devices as an array
     */
    useDeviceList: function(){
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
    },
    /**
     * Provides the input device status for a device 
     */
    useDevicePortsStatus: function (deviceId){
        const [devicePortsStatus, setDevicePortsStatus] = useState(
            {
                input: MidiPlex.devices.getInputStatus(deviceId),
                output: MidiPlex.devices.getOutputStatus(deviceId)
            }
        )

        const handleSetDevicePortsStatus = (device) => {
            if (device.id === deviceId){
                console.log("!!!!!");
                setDevicePortsStatus(
                    {
                        input: MidiPlex.devices.getInputStatus(deviceId),
                        output: MidiPlex.devices.getOutputStatus(deviceId)
                    }
                )
            }
        }

        useEffect(() => {
            MidiPlex.devices.on("deviceStatusChange", handleSetDevicePortsStatus);
            return () => MidiPlex.devices.events.removeListener("deviceStatusChange", handleSetDevicePortsStatus);
        })
    
        return devicePortsStatus;
    }
    
}

export default DeviceHooks;
