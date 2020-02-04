import React, {useState, useEffect} from 'react';
import './three-column-layout.scss';

/**
 * Props:
 */
const ThreeColumnLayout = function(props){

    const [dragActive, setDragActive] = useState(false);
    const [activeEdge, setActiveEdge] = useState(null);
    const [dragStartX, setDragStartX] = useState(null);
    const [lastLeftWidth, setLastLeftWidth] = useState(300);
    const [lastRightWidth, setLastRightWidth] = useState(300);
    const [leftWidth, setLeftWidth] = useState(300);
    const [rightWidth, setRightWidth] = useState(300);

    const handleMouseDownRight = (e) => {
        setDragStartX(e.pageX);
        setDragActive(true);
        setActiveEdge("right");
    }

    const handleMouseDownLeft = (e) => {
        setDragStartX(e.pageX);
        setActiveEdge("left");
        setDragActive(true);
    };

    const handleDragActive = (e) => {
        if (dragActive) {
            if (activeEdge === "left"){
                let newWidth = lastLeftWidth + (e.pageX - dragStartX);
                setLeftWidth(newWidth > props.maxLeft ? props.maxLeft - 1 :
                             newWidth < props.minLeft ? props.minLeft + 1 :
                             newWidth);

            } else {
                let newWidth = lastRightWidth + (dragStartX - e.pageX);
                setRightWidth(newWidth > props.maxRight ? props.maxRight - 1 :
                              newWidth < props.minRight ? props.minRight + 1 :
                              newWidth);
            }
        }
    }

    const handleDragEnd = () => {
        setDragActive(false);
        setLastLeftWidth(leftWidth);
        setLastRightWidth(rightWidth);
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleDragActive);
        window.addEventListener("mouseup", handleDragEnd);
        return () => {
            window.removeEventListener("mousemove", handleDragActive);
            window.removeEventListener("mouseup", handleDragEnd);
        };
    });
    
    return (
        <div className="three-col-layout">
            <div className="three-col-layout__left" style={{
                width: leftWidth
            }}>
                <div className="three-col-layout__edge-right" onMouseDown={handleMouseDownLeft}></div>
                <div className="three-col-layout__left-container">
                    { props.left }
                </div>
            </div>
            <div className="three-col-layout__center">
                <div className="three-col-layout__center-container">
                    { props.center }
                </div>
            </div>
            <div className="three-col-layout__right" style={{
                width: rightWidth
            }}>
                <div className="three-col-layout__edge-left" onMouseDown={handleMouseDownRight}></div>
                <div className="three-col-layout__right-container">
                    { props.right }
                </div>
            </div>
        </div>
    )
}

ThreeColumnLayout.defaultProps = {
    minLeft: 15,
    maxLeft: 9999,
    minRight: 15,
    maxRight: 9999
}

export default ThreeColumnLayout;
