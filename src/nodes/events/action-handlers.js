const ActionHandlers = {
    /**
     * The setProperty action handler calls setProperty on
     * the target node for each key/value pair included 
     * in the actionConfig objecct
     */
    setProperty: function(node, actionConfig){
        for (let prop in actionConfig){
            node.setProperty(prop, actionConfig[prop])
        }
    },
    /**
     * Sets the state of the "muted" flag for the given node
     * 
     * @param {Node} node 
     * @param {Bool} muted
     */
    setMuted: function(node, muted){
        node.muted = muted;
    },
    /**
     * Sets the state of the "bypassed" flag for the given node
     * 
     * @param {Node} node 
     * @param {Boolean} bypassed 
     */
    setBypassed: function(node, bypassed){
        node.bypassed = bypassed;
    }
}

export default ActionHandlers;