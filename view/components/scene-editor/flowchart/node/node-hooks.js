import {useState, useEffect} from 'react';
import {MidiPlex} from 'src/midiplex'

const NodeHooks = {
    /**
     * Fetches and notifies about updates to the property fields of a given node
     */
    useFieldList: function(node) {
        const [fieldList, setFieldList] = useState(node.getProperties());
        const handleSetFieldList = (props) => setFieldList(props);
        useEffect(() => {
            node.on("propertyModified", handleSetFieldList);
            return () => node.events.removeListener("propertyModified", handleSetFieldList);
        });
        return fieldList;
    },

    /**
     * Fetches and notifies about updates to a node's `bypassed` state flag
     */
    useBypassedState: function(node) {
        const [bypassed, setBypassed] = useState(node.bypassed);
        const handleSetBypassed = () => setBypassed(node.bypassed);
        useEffect(() => {
            node.on("bypassToggled", handleSetBypassed);
            return () => node.events.removeListener("bypassToggled", handleSetBypassed);
        });
        return bypassed;
    },

    /**
     * Fetches and notifies about updates to a node's `muted` state flag
     */
    useMutedState:function (node) {
        const [muted, setMuted] = useState(node.muted);
        const handleSetMuted = () => setMuted(node.muted);
        useEffect(() => {
            node.on("muteToggled", handleSetMuted);
            return () => node.events.removeListener("muteToggled", handleSetMuted);
        });
        return muted;
    },

    /**
     * Fetches and notifies about updates to a node's available potential downstream connections
     */
    useLinkableToList: function(node){
        const [linkableToList, setLinkableToList] = useState(
            MidiPlex.nodes.getLinkableToNodes(node.id)
        )
        
        const handleGetLinkableFromList = () => { setLinkableToList(MidiPlex.nodes.getLinkableToNodes(node.id))}
        useEffect(() => {
            MidiPlex.nodes.on("nodeAdded", handleGetLinkableFromList);
            MidiPlex.nodes.on("nodeRemoved", handleGetLinkableFromList);
            MidiPlex.nodes.on("connectionAdded", handleGetLinkableFromList);
            MidiPlex.nodes.on("connectionRemoved", handleGetLinkableFromList);
            return () => {
                MidiPlex.nodes.events.removeListener("nodeAdded", handleGetLinkableFromList);
                MidiPlex.nodes.events.removeListener("nodeRemoved", handleGetLinkableFromList);
                MidiPlex.nodes.events.removeListener("connectionAdded", handleGetLinkableFromList);
                MidiPlex.nodes.events.removeListener("connectionRemoved", handleGetLinkableFromList);
            }
        });
        
        return linkableToList;
    },

    /**
     * Fetches and notifies about updates to a node's available potential upstream connections
     */
    useLinkableFromList: function(node){
        const [linkableFromList, setLinkableFromList] = useState(
            MidiPlex.nodes.getLinkableFromNodes(node.id)
        )

        const handleGetLinkableToList = () => { setLinkableFromList(MidiPlex.nodes.getLinkableFromNodes(node.id)) }
        useEffect(() => {
            MidiPlex.nodes.on("nodeAdded", handleGetLinkableToList);
            MidiPlex.nodes.on("nodeRemoved", handleGetLinkableToList);
            MidiPlex.nodes.on("connectionAdded", handleGetLinkableToList);
            MidiPlex.nodes.on("connectionRemoved", handleGetLinkableToList);
            return () => {
                MidiPlex.nodes.events.removeListener("nodeAdded", handleGetLinkableToList);
                MidiPlex.nodes.events.removeListener("nodeRemoved", handleGetLinkableToList);
                MidiPlex.nodes.events.removeListener("connectionAdded", handleGetLinkableToList);
                MidiPlex.nodes.events.removeListener("connectionRemoved", handleGetLinkableToList);
            }
        });
    
        return linkableFromList;
    },

    /**
     * Fetches and notifies about updates to a node's current input and output connections
     */
    useNodeConnections: function(node){
        const [nodeConnections, setNodeConnections] = useState(
            { inputs: node.getInputs(), outputs: node.getOutputs() }
        )
        const handleGetNodeConnections = () => setNodeConnections({ inputs: node.getInputs(), outputs: node.getOutputs() })
        useEffect(() => {
            MidiPlex.nodes.on("connectionAdded", handleGetNodeConnections);
            MidiPlex.nodes.on("connectionRemoved", handleGetNodeConnections);
            return () => {
                MidiPlex.nodes.events.removeListener("connectionAdded", handleGetNodeConnections);
                MidiPlex.nodes.events.removeListener("connectionRemoved", handleGetNodeConnections);
            }
        });
    
        return nodeConnections;
    },

    /**
     * Fetches and notifies about updates to any meta field
     */
    useNodeMeta: function(node, metaName){
        const [nodeMeta, setNodeMeta] = useState(node.getMeta(metaName))
        const handleGetNodeMeta = () => setNodeMeta(node.getMeta(metaName));
        useEffect(() => {
            node.on("metaChanged", handleGetNodeMeta);
            return () => {
                node.events.removeListener("metaChanged", handleGetNodeMeta);
            }
        });

        return nodeMeta;
    },

    /**
     * Fetches and notifies about updates to the property fields of a given node
     */
    useNodeDeviceId: function(node) {
        const [nodeDeviceId, setNodeDeviceId] = useState(node.deviceId);
        const handleSetNodeDeviceId = () => setNodeDeviceId(node.deviceId);
        useEffect(() => {
            node.on("deviceChanged", handleSetNodeDeviceId);
            return () => node.events.removeListener("deviceChanged", handleSetNodeDeviceId);
        });
        return nodeDeviceId;
    },

    /**
     * Fetches and notifies about updates to the property fields of a given node
     */
    useNodeDeviceStatus: function(node) {
        const [nodeDeviceStatus, setNodeDeviceStatus] = useState({
                input: MidiPlex.devices.getInputStatus(node.deviceId),
                output: MidiPlex.devices.getOutputStatus(node.deviceId)
        })

        const handleSetNodeDeviceStatus = (device) => {
            if (device.id === node.deviceId){
                setNodeDeviceStatus(
                    {
                        input: MidiPlex.devices.getInputStatus(node.deviceId),
                        output: MidiPlex.devices.getOutputStatus(node.deviceId)
                    }
                )
            }
        }

        const handleNodeDeviceChange = () => {
                setNodeDeviceStatus({
                        input: MidiPlex.devices.getInputStatus(node.deviceId),
                        output: MidiPlex.devices.getOutputStatus(node.deviceId)
                })
        }

        useEffect(() => {
            MidiPlex.devices.on("deviceStatusChange", handleSetNodeDeviceStatus);
            node.on("deviceChanged", handleNodeDeviceChange);
            return () => {
                MidiPlex.devices.events.removeListener("deviceStatusChange", handleSetNodeDeviceStatus);
                node.events.removeListener("deviceChanged", handleNodeDeviceChange);
            }
        })
    
        return nodeDeviceStatus;
    },
}

export default NodeHooks;
