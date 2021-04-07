import React, { ReactChild, ReactFragment } from 'react';

import ScrollTo from '../../components/ScrollTo';
import { Color } from '../../types';
// import './style.scss';

const classPrefix = 'filters__';

type FiltersProps = {
  children: ReactChild | ReactFragment;
  backgroundAlt?: boolean;
  id?: string;
};

const Filters: React.FC<FiltersProps> = ({
  children,
  backgroundAlt,
  id = 'filters',
}) => {
  return (
    <div>
      <div
        id={id}
        className={`${classPrefix}basis ${backgroundAlt ? 'background-alt' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Filters;
