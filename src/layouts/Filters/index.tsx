import React, { ReactChild, ReactFragment } from 'react';

import ScrollTo from '../../components/ScrollTo';
import { Color } from '../../types';
// import './style.scss';

const classPrefix = 'filters__';

type FiltersProps = {
  color: Color;
  children: ReactChild | ReactFragment;
  hasData?: boolean;
  backgroundAlt?: boolean;
  id?: string;
};

const Filters: React.FC<FiltersProps> = ({
  color,
  children,
  hasData,
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

      {!!hasData && (
        <div className="scroll-to">
          <ScrollTo anchor="data" color={color} direction="down">
            View data
          </ScrollTo>
        </div>
      )}
    </div>
  );
};

export default Filters;
