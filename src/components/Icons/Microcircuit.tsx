import * as React from 'react';

function SvgMicrocircuit(props: any) {
  return (
    <svg viewBox="0 0 14.98 15.23" {...props}>
      <g data-name="Layer 2">
        <path
          d="M7.49 0A7.55 7.55 0 000 7.61a7.55 7.55 0 007.49 7.62A7.55 7.55 0 0015 7.61 7.55 7.55 0 007.49 0zM5.34 12.75L4 12.08V3.14l1.34.67zm3.77.16H5.87v-9h3.24zM5.67 3.37L4.33 2.7 5.67 2h3.65l1.34.67-1.34.67zM11 12.08l-1.34.67V3.81L11 3.14z"
          fill={props.fill}
          data-name="Layer 1"
        />
      </g>
    </svg>
  );
}

export default SvgMicrocircuit;
