import React from 'react';

// import './style.less';

const classPrefix = 'loading';

export enum SIZE {
  big = 'big',
  small = 'small',
}

const Loading: React.FC<{
  size?: string;
}> = ({ size = SIZE.small, children }) => {
  return (
    <div className={`${classPrefix} ${size}`}>
      <div className="body">{children}</div>
    </div>
  );
};

export default Loading;
