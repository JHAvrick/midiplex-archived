import React, {useState, useRef, useEffect} from 'react';
import FlowchartState from './flowchart-state';
import './grid.scss';

const Grid = React.forwardRef((props, ref) => {
    let FlowchartState = props.fstate;

    const gridEl = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [x, setX] = useState(props.defaultPosition.x);
    const [y, setY] = useState(props.defaultPosition.y);
    const [lastX, setLastX] = useState(props.defaultPosition.x);
    const [lastY, setLastY] = useState(props.defaultPosition.y);
    const [startX, setStartX] = useState(props.defaultPosition.x);
    const [startY, setStartY] = useState(props.defaultPosition.y);

    const handleMouseDown = (e) => {
        if (e.button === 1){
            setDragActive(true);
            setStartX(e.clientX);
            setStartY(e.clientY);
        }
    }

    const handleDragActive = (e) => {
        if (dragActive){
            let newX = lastX + (e.clientX - startX);
            let newY = lastY + (e.clientY - startY);

            setX(newX > 0 ? -1 :
                 newX < (-props.size) ? -(props.size - 1) :
                 newX);
            
            setY(newY > 0 ? -1 :
                 newY < (-props.size) ? -(props.size - 1) :
                 newY);
        }
    }

    const handleDragEnd = (e) => {
        if (e.button === 1){
            setDragActive(false);
            setLastX(x);
            setLastY(y);

            let rect = gridEl.current.getBoundingClientRect();
            FlowchartState.setGridRect({
                x: rect.x,
                y: rect.y
            });

            props.onGridPositionChange({x: x, y: y})
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleDragActive);
        window.addEventListener("mouseup", handleDragEnd);
        return () => {
            window.removeEventListener("mousemove", handleDragActive);
            window.removeEventListener("mouseup", handleDragEnd);
        };
    });

    useEffect(() => {
            let rect = gridEl.current.getBoundingClientRect();
            FlowchartState.setGridRect({
                x: rect.x,
                y: rect.y
            });
    }, []);

    return (
        <div data-deselector="grid" data-gridcontext="grid" style={{ width: props.size, height: props.size, top: y, left: x, cursor: dragActive ? "move" : "default"}} 
             className="grid" 
             onMouseDown={handleMouseDown}
             ref={gridEl}>

            {props.children}

        </div>
        
    )
})

Grid.defaultProps = {
    defaultPosition: {
        x: 5000,
        y: 5000
    },
    size: 20000,
    onDrag: function(){},
    onDragEnd: function(){},
    onGridPositionChange: function(){}
}

export default Grid;