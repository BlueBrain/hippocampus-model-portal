import React, { ReactChild, ReactFragment } from 'react';

// import './style.scss';

const classPrefix = 'full-page__';

type FullPageProps = {
  children?: ReactChild | ReactFragment;
};

const FullPage: React.FC<FullPageProps> = ({ children }) => {
  return <div className={`${classPrefix}basis`}>{children}</div>;
};

export default FullPage;
