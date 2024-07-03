import React from 'react';

import ScrollTo from '../../components/ScrollTo';
import { Color } from '../../types';

import { basePath } from '../../config';

import styles from './styles.module.scss';


type FiltersProps = {
  hasData?: boolean;
  primaryColor?: Color;
  id?: string;
  theme?: number;
};

const Filters: React.FC<FiltersProps> = ({
  primaryColor,
  children,
  hasData,
  theme,
  id = 'filters',
}) => {
  return (
    <div>
      <div id={id} className={styles.container} style={{ backgroundImage: `url(${basePath}/data/backgrounds/theme-bg-${theme}.png)` }}>
        {children}
      </div>
      {!!hasData && (
        <div className="scroll-to">
          <ScrollTo
            anchor="data"
            color={primaryColor}
            direction="down"
            animated
          >
            Click to view data
          </ScrollTo>
        </div>
      )}
    </div>
  );
};

export default Filters;
