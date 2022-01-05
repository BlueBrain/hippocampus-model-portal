import React from 'react';
import styles from './styles.module.scss';


const StickyContainer: React.FC = ({ children }) => (
  <div className={styles.flexWrapper}>
    <div className={styles.container}>
      {children}
    </div>
  </div>
);


export default StickyContainer;
