import React, {useEffect, useState} from 'react';
import './context-menu.scss';

const ContextMenu = (props) => {
    return (
        <ul data-contextmenu="contextmenu" className="context-menu" style={{ top: props.top, left: props.left }}>
            {
                React.Children.toArray(props.children).map((child) => {
                    return  child.type.name === "ContextOption" 
                            ? React.cloneElement(child, {onRequestCloseMenu: props.onRequestCloseMenu})
                            : React.cloneElement(child)
                })
            }
        </ul>
    )
}

ContextMenu.defaultProps = {
    onRequestCloseMenu: function(){}
}

const ContextOption = (props) => {

    const handleOptionClicked = (e) => {
        props.onClick(e); 
        props.onHoverEnd(e);
        if (props.closesMenu)
            props.onRequestCloseMenu()
    }

    const OptionComponent = !props.children

    ? <li   data-contextoption="contextoption" 
            className={"context-menu__option"}
            onMouseOver={props.onHover} 
            onMouseOut={props.onHoverEnd} 
            onClick={handleOptionClicked}>
            {props.name}
      </li>

    : <li data-contextid="contextoption" className="context-menu__option">{props.name + "    ›"}
        <ul className="context-menu__sub-menu">
            {props.children}
        </ul>
      </li>

    return OptionComponent;
}

ContextOption.defaultProps = {
    onHover: function(){},
    onHoverEnd: function(){},
    onClick: function(){},
    onRequestCloseMenu: function(){},
    closesMenu: false
}

const ContextManager = (props) => {

    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);
    const [attrValue, setAttrValue] = useState(null);
    const [menuDisplayState, setMenuDisplayState] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const handleCloseMenu = (e) => {
        setMenuDisplayState(false);
        setActiveMenu(null);
    }

    const handleOnDocumentClick = (e) => {
        if (e.target.getAttribute("data-contextoption")) return;
        if (e.target.getAttribute("data-contextmenu")) return;
        if (menuDisplayState & e.button !== 2){
                setMenuDisplayState(false);
                setActiveMenu(null);
                return;
        }

        if (e.button !== 2) return;

        /**
         * Check if the click target has any of our menu attributes.
         * If not, do nothing.
         */
        let contextMenu = null;
        props.menus.forEach((menuOption) => {
            let attr = e.target.getAttribute(menuOption.attribute);
            if (attr){
                contextMenu = menuOption;
                setAttrValue(attr);
            }
        })
        if (contextMenu == null) return;
        /**
         * If we got here, 
         */
        setActiveMenu(contextMenu);
        setMenuTop(e.clientY - 20);
        setMenuLeft(e.clientX),
        setMenuDisplayState(true);
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleOnDocumentClick);
        return () => document.removeEventListener("mousedown", handleOnDocumentClick);
    })

    return (
        menuDisplayState 
        ? React.cloneElement(activeMenu.menu, {top: menuTop, left: menuLeft, attribute: attrValue, onRequestCloseMenu: handleCloseMenu })
        : <div style={{display:"none"}}></div>
    );
}

ContextManager.defaultProps = {
    menus: []
}


export { ContextManager, ContextMenu, ContextOption };
