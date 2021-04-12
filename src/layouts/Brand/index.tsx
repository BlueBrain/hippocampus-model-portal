import React from 'react';

import { basePath } from '../../config';



const classPrefix = 'brand__';

const Brand: React.FC = () => {
  return (
    <div className={`${classPrefix}basis`}>
      <a href="/">
        <img
          className="logo"
          src={`${basePath}/assets/images/epfl-logo.svg`}
          alt="EPFL logo"
        />
        <div className="divider"></div>
        <span className="text-grey">Blue Brain Project</span>
        <div className="divider second-divider"></div>
        <span className="hub">The Hippocampus Hub</span>
      </a>
    </div>
  );
};

export default Brand;
