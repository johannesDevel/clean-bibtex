import React from "react";

function SvgError(props) {
  return (
    <svg viewBox="0 0 50 50" {...props}>
      <circle cx={25} cy={25} r={25} fill="#d75a4a" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M16 34l9-9 9-9M16 16l9 9 9 9"
      />
    </svg>
  );
}

export default SvgError;
