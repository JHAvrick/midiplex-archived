import React from "react";

function Keyboard(props) {
  let width = props.width || 30;
  let height = props.height || 30;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{width: width, height: height }}
      fill="none"
      viewBox="0 0 50 50"
    >
      <rect
        width="48.5"
        height="48.5"
        x="0.75"
        y="0.75"
        fill="#fff"
        stroke="#000"
        strokeWidth="1.5"
        rx="2.25"
      ></rect>
      <path
        fill="#000"
        d="M8 1h8v31a1 1 0 01-1 1H9a1 1 0 01-1-1V1zM21 1h8v31a1 1 0 01-1 1h-6a1 1 0 01-1-1V1zM34 1h8v31a1 1 0 01-1 1h-6a1 1 0 01-1-1V1z"
      ></path>
      <path fill="#000" d="M11 33H13V49H11z"></path>
      <path fill="#000" d="M24 33H26V49H24z"></path>
      <path fill="#000" d="M37 33H39V49H37z"></path>
    </svg>
  );
}

Keyboard.defualtProps = {
    width: 50,
    height: 50,
    color: "#ffffff"
}

export default Keyboard;