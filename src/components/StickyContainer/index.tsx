import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface StickyContainerProps {
  centered?: boolean;
  children: React.ReactNode;
}

const StickyContainer: React.FC<StickyContainerProps> = ({ centered, children }) => (
  <div className={styles.flexWrapper}>
    <div className={classNames(styles.container, centered ? styles['container--centered'] : '')}>
      {children}
    </div>
  </div >
);

export default StickyContainer;