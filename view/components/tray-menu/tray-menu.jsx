import React, {useState} from 'react';
import Icons from 'components/icons/icons.jsx';
import './tray-menu.scss';

const TrayMenu = () => {

    const [devicesMenuOpen, setDevicesMenuOpen] = useState(false);
    return (
        <div className="tray-menu">
            <div className="tray-menu__option">
                {React.createElement(Icons.Keyboard, {width: 25, height: 25})}
            </div>
        </div>
    )
}

export default TrayMenu;
