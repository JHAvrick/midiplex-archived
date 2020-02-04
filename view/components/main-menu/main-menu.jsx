import React, { useRef, useState } from 'react';
const { dialog } = require('electron').remote;
import './main-menu.scss';

const MainMenu = function(props){
    const fileInputEl = useRef(null);
    //const [newProjectPath, setNewProjectPath] = useState("");

    const handleNewProjectClicked = () => {
        let newPath = dialog.showSaveDialogSync();
        if (newPath)
            props.onNewProject(newPath);
    }

    //Open the file chooser
    const handleOpenExistingClicked = () => {
        let openPath = dialog.showOpenDialogSync();
        if (openPath && openPath[0])
            props.onOpenProject(openPath[0]);
    }

    return (
        <div className="main-menu">
            <div className="main-menu__content">
                <div className="main-menu__options">
                    <div onClick={handleNewProjectClicked} className="main-menu__option">
                        <div className="main-menu__option-icon"> + </div>
                        <div className="main-menu__option-label">
                            <div className="main-menu__option-title">
                                New Project
                            </div>
                            <div className="main-menu__option-description">
                                Create a blank project
                            </div>
                        </div>
                    </div>
                    <div onClick={handleOpenExistingClicked} className="main-menu__option">
                        <div className="main-menu__option-icon"> + </div>
                        <div className="main-menu__option-label">
                            <div className="main-menu__option-title">
                                Open Project
                            </div>
                            <div className="main-menu__option-description">
                                Open an existing project
                            </div>
                        </div>
                    </div>
                    <div className="main-menu__option">
                        <div className="main-menu__option-icon"> + </div>
                        <div className="main-menu__option-label">
                            <div className="main-menu__option-title">
                                GitHub
                            </div>
                            <div className="main-menu__option-description">
                                Check out the source
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-menu__recent">
                    <div className="main-menu__recent-header">
                        Recent Projects
                    </div>
                </div>
            </div>
        </div>
    )
}

MainMenu.defaultProps = {
    onNewProject: function(){},
    onOpenProject: function(){},
}

export default MainMenu;
