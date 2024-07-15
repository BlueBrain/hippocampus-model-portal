import React from 'react';

import { basePath } from '../../config';



const classPrefix = 'brand__';

const Brand: React.FC = () => {
  return (
    <div className={`${classPrefix}basis`} style={{ zIndex: "9999" }}>
      <a href="/">
        <img
          className="logo"
          src={`${basePath}/data/epfl-logo-red.svg`}
          alt="EPFL logo"
        />
        <div className="divider"></div>
        <span className="text-bbp">Blue Brain Project</span>
        <div className="divider second-divider"></div>
        <span className="hub">The Hippocampus Hub</span>
      </a>
    </div>
  );
};

export default Brand;
