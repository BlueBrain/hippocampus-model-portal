import * as React from 'react';

function SvgSynapse(props: any) {
  return (
    <svg viewBox="0 0 14.98 15.23" {...props}>
      <g data-name="Layer 2">
        <path
          d="M7.49 0A7.55 7.55 0 000 7.61a7.55 7.55 0 007.49 7.62A7.55 7.55 0 0015 7.61 7.55 7.55 0 007.49 0zM3.7 11.89a1 1 0 111-1 1 1 0 01-1 1zm0-3.59a1 1 0 111-1 1 1 0 01-1 1zm7.59 3.78a1 1 0 01-.9-.67 6 6 0 01-3.25-3.75c-.42-1.27-2-2.46-3-3.08a1 1 0 01-.47.13 1 1 0 111-1v.09c1.05.68 2.81 2 3.32 3.54a5.36 5.36 0 002.57 3.15 1 1 0 11.76 1.55zm0-3.59a1 1 0 111-1 1 1 0 01-1 1zm0-3.59a1 1 0 111-1 1 1 0 01-1 1z"
          fill={props.fill}
          data-name="Layer 1"
        />
      </g>
    </svg>
  );
}

export default SvgSynapse;
