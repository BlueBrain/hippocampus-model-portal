import React from 'react';

import ScrollTo from '../../components/ScrollTo';
import { Color } from '../../types';

import { dataPath } from '../../config';

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
    <><div className={styles.wrapper}>
      <div
        className={styles.solidBackground}
        style={{
          backgroundColor: '#050A30', // Solid background color
        }} />
      <div
        className={`${styles.background} ${styles[`background--${theme}`]}`}
        style={{
          backgroundImage: `url(${dataPath}/ui/backgrounds/theme-bg-${theme}.svg)`,
        }} />
      <div
        id={id}
        className={styles.container}
      >
        {children}
      </div>
      {!!hasData && (
        <div className="scroll-to">

        </div>
      )}
    </div><ScrollTo
      anchor="data"
      color={primaryColor}
      direction="down"
      animated
    >
        Click to view data
      </ScrollTo></>
  );
};

export default Filters;
