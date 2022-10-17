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
      <div><ColoredBox cssColor={color.PRE_DEND } /> Pre-synaptic dendrite</div>
      <div><ColoredBox cssColor={color.PRE_AXON} /> Pre-synaptic axon</div>

      <div className={styles.legendDivider}></div>

      <div><ColoredBox cssColor={color.POST_DEND} /> Post-synaptic dendrite</div>
      <div><ColoredBox cssColor={color.POST_AXON} /> Post-synaptic axon</div>

      <div className={styles.legendDivider}></div>

      <div><ColoredBox cssColor={color.SYNAPSE} /> Synapse</div>
      <div><ColoredBox cssColor={color.SOMA} /> Soma</div>
    </div>
  );
};


export default Legend;
