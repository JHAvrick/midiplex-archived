import 'styles/main.scss';
import "./hotkeys";
import { MidiPlex } from './src/midiplex';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loading from 'components/loading/loading.jsx';
import TrayMenu from 'components/tray-menu/tray-menu.jsx';
import Devices from 'components/devices/devices.jsx';
import NodeGraph from 'components/scene-editor/node-graph.jsx';
import {ContextManager} from 'components/context-menu/context-menu.jsx';
import MidiPlexContext from './view/config/midiplex-context.jsx';

import {ToastManager, ToastContainer} from 'components/toast/toast.jsx';


const Main = () => {

    setTimeout(() => {
        ToastManager.addToast()
    }, 2000)

    return (
        <div className="content-wrapper">
            <ToastContainer />
            <ContextManager menus={MidiPlexContext} />
            <Devices />
            <TrayMenu />
            <NodeGraph />
        </div>
    )
}

ReactDOM.render(<Loading />, document.getElementById('app'));
(async function(){
    await MidiPlex.boot(require('electron').remote.process.argv[2]);
    ReactDOM.render(<Main />, document.getElementById('app'));
})();

import sleep from 'util/sleep';
sleep.prevent();

/*
    TODO:

        Stability:
            - What the fuck is going on w/ the debug node fucking shit up?
            - Clean up potential memory leaks in hooks (especially flowchart hooks)

        Core Functions:
            - Add Save As functionality 
            - Undo/Redo Stacks

        Features:
            - Node Groups
            - Collapsable Nodes
            - Visual representaion of message paths

        UI / Usability:
            - Drag to select
            - Multiple Node Drag 
            - Redesign context menu
            - Toast Notifications
            - Draw connections w/ mouse
            - Delete connections by selection
            - Select and Drag multiple nodes

        
*/


// const { getCurrentWebContents, Menu, MenuItem } = require ('electron').remote;
// let webContents = getCurrentWebContents ();
// let rightClickPosition;
// const contextMenu = new Menu ();
// const menuItem = new MenuItem
// (
//     {
//         label: 'Inspect Element',
//         click: () =>
//         {
//             webContents.inspectElement (rightClickPosition.x, rightClickPosition.y);
//         }
//     }
// );
// contextMenu.append (menuItem);
// webContents.on
// (
//     'context-menu',
//     (event, params) =>
//     {
//         rightClickPosition = { x: params.x, y: params.y };
//         contextMenu.popup ();
//     }
// );

