import React from "react";

function Bypass(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      x="0"
      y="0"
      viewBox="0 0 172 172"
    >
      <g
        fill="none"
        strokeMiterlimit="10"
        fontFamily="none"
        fontSize="none"
        fontWeight="none"
        textAnchor="none"
      >
        <path d="M0 172V0h172v172z"></path>
        <path
          fill={props.color}
          d="M82.56 24.08c-26.356 0-43.769 11.791-54.254 23.509S13.935 71.165 13.935 71.165a3.44 3.44 0 106.53 2.15s3.445-10.502 12.968-21.144C42.955 41.53 58.227 30.96 82.56 30.96c21.596 0 37.775 8.098 49.114 17.28 9.329 7.555 15.182 15.88 17.785 20.56H130.72a3.44 3.44 0 100 6.88h30.96V44.72a3.44 3.44 0 10-6.88 0v19.35c-3.38-5.749-9.516-13.658-18.792-21.17-12.26-9.929-30-18.751-53.206-18.813a3.442 3.442 0 00-.242-.007zM0 96.32v48.16h48.16V96.32zm61.92 0v48.16h48.16V96.32zm61.92 0v48.16H172V96.32zM68.8 103.2h34.4v34.4H68.8z"
        ></path>
      </g>
    </svg>
  );
}

Bypass.defualtProps = {
    width: 24,
    height: 24,
    color: "#ffffff"
}

export default Bypass;