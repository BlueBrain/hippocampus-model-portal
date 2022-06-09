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


const Legend: React.FC<{ colorSwapped: boolean }> = ({ colorSwapped }) => {
  return (
    <div className={styles.legend}>
      <div><ColoredBox cssColor={!colorSwapped ? color.PRE_DEND : color.PRE_AXON } /> Pre dend</div>
      <div><ColoredBox cssColor={!colorSwapped ? color.PRE_AXON: color.PRE_DEND} /> Pre axon</div>

      <div className={styles.legendDivider}></div>

      <div><ColoredBox cssColor={!colorSwapped ? color.POST_DEND : color.POST_AXON} /> Post dend</div>
      <div><ColoredBox cssColor={!colorSwapped ? color.POST_AXON : color.POST_DEND} /> Post axon</div>

      <div className={styles.legendDivider}></div>

      <div><ColoredBox cssColor={color.SYNAPSE} /> Synapse</div>
      <div><ColoredBox cssColor={color.SOMA} /> Soma</div>
    </div>
  );
};


export default Legend;
