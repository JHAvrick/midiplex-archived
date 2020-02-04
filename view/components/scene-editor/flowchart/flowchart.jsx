import React, { useState, useRef, useEffect } from 'react';
import Grid from './grid.jsx';
import Nodes from './node/nodes';
import NodeConnector from './connectors/node-connector.jsx';
import Selector from 'components/selector/selector.jsx';
import {MidiPlex} from 'src/midiplex';
import cloneDeep from 'lodash.clonedeep';
import FlowchartState from './flowchart-state';
import useConnectionsList from '../hooks/use-connections-list.js';
import useNodeList from '../hooks/use-node-list.js';
import './flowchart.scss';

const Flowchart = (props) => {
    /**
     * TODO: Add an effect to update definitions list in context menu & add node type on click
     */
    const [flowchartState, setFlowchartState] = useState(cloneDeep(FlowchartState));
    const connectionsList = useConnectionsList();
    const nodeList = useNodeList();

    const handleGridPositionChange = (pos) => {
        MidiPlex.setMeta("viewportX", pos.x);
        MidiPlex.setMeta("viewportY", pos.y);
    }

    const handleSelectionChange = (selections) => {
        let nodes = MidiPlex.nodes.getNodes();
            nodes.forEach((node) => 
                node.setMeta("selected", selections.includes(node.id))
            )
    }

    const handleSelectionDeleted = (selections) => {
        MidiPlex.nodes.removeAll(selections);
    }

    //let nodes = props.nodes;
    //let connections = props.connections;
    flowchartState.setDummyHandles(nodeList);
    return (
        <div className="flowchart">

            <Selector
                dataTarget="data-selectorid"
                deselectDataTarget="data-deselector"
                onSelectionChange={handleSelectionChange}
                onSelectionDeleted={handleSelectionDeleted}
            />

            <Grid defaultPosition={{x: MidiPlex.getMeta("viewportX"), y: MidiPlex.getMeta("viewportY")}} 
                  onGridPositionChange={handleGridPositionChange}  
                  fstate={flowchartState}>

                {
                    connectionsList.map((conn) => {
                       return <NodeConnector   fstate={flowchartState}
                                               key={conn[0] + conn[1]}
                                               outId={conn[0]}
                                               inId={conn[1]} />
                        
                    })
                }

                {
                    nodeList.map((node) =>
                        React.createElement(
                            Nodes[node.baseNodeClass],
                            { 
                                fstate: flowchartState,
                                node: node, 
                                key: node.id
                            }
                        )
                    )
                }

            </Grid>
        </div>
    )

}

Flowchart.defaultProps = {
    nodes: [],
    connections: []
}


export default Flowchart;



