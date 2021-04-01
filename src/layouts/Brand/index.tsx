import React from 'react';
import Link from 'next/link';

import { basePath } from '../../config';



const classPrefix = 'brand__';

const Brand: React.FC = () => {
  return (
    <div className={`${classPrefix}basis`}>
      <Link href="/">
        <a>
          <img
            className="logo"
            src={`${basePath}/assets/images/epfl-logo.svg`}
            alt="EPFL logo"
          />
          <div className="divider"></div>
          <span className="text-grey">Blue Brain Project</span>
          <div className="divider second-divider"></div>
          <span className="hub-explore">The Hippocampus Hub Explore</span>
        </a>
      </Link>
    </div>
  );
};

export default Brand;
