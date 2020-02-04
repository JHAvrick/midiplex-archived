import React, { useState, useRef } from 'react';
import './sidebar.scss';

import Devices from 'components/devices/devices.jsx';

const Sidebar = (props) => {
    return (
        <div className="sidebar">
            <Devices />
        </div>
    )
}


export default Sidebar;
