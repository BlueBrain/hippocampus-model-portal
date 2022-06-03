import React from 'react';
import { color } from './constants';

import styles from './connection-viewer.module.scss';


const ColoredBox: React.FC<{cssColor: string}> = ({ cssColor }) => {
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
      <p><ColoredBox cssColor={color.PRE_DEND} /> Pre dend</p>
      <p><ColoredBox cssColor={color.PRE_AXON} /> Pre axon</p>

      <div className={styles.legendDivider}></div>

      <p><ColoredBox cssColor={color.POST_DEND} /> Post dend</p>
      <p><ColoredBox cssColor={color.POST_AXON} /> Post axon</p>

      <div className={styles.legendDivider}></div>

      <p><ColoredBox cssColor={color.SYNAPSE} /> Synapse</p>
      <p><ColoredBox cssColor={color.SOMA} /> Soma</p>
    </div>
  );
};


export default Legend;
