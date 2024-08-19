import React from 'react';
import { color } from './constants';

import styles from './volume-viewer.module.scss';


const ColoredBox: React.FC<{ cssColor: string }> = ({ cssColor }) => {
  return (
    <div
      className={styles.coloredBox}
      style={{ '--box-color': cssColor } as React.CSSProperties}
    />
  );
};


const Legend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div><ColoredBox cssColor={color.SLM} /> SLM</div>
      <div><ColoredBox cssColor={color.SR} /> SR</div>
      <div><ColoredBox cssColor={color.SP} /> SP</div>
      <div><ColoredBox cssColor={color.SO} /> SO</div>
    </div>
  );
};


export default Legend;
