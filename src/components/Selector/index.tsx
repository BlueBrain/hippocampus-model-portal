import React, { ReactChild, ReactFragment } from 'react';

// import './style.scss';

const classPrefix = 'selector__';

type SelectorProps = {
  title?: string;
  children: ReactChild | ReactFragment;
  column?: boolean;
};

const Selector: React.FC<SelectorProps> = ({ title, children, column }) => (
  <div className={`${classPrefix}basis ${column ? 'column' : ''}`}>
    {title && <p>{title}</p>}
    {children}
  </div>
);

export default Selector;
