import React from 'react';

import SectionNav from '@/layouts/SectionNav';
import ScrollTo from '@/components/ScrollTo';
import ScrollTop from '@/components/ScrollTop';

import styles from './styles.module.scss';

type NavItem = {
  id: string;
  label: string;
}

type DataContainerProps = {
  visible?: boolean;
  children: React.ReactNode;
  navItems?: NavItem[];
};

const DataContainer: React.FC<DataContainerProps> = ({
  visible = true,
  children,
  navItems,
}) => {
  return (
    <>
      {visible && (
        <div id="data" className={styles.dataContainer}>
          {navItems && (
            <SectionNav navItems={navItems} />
          )}
          <div className={styles.scrollTop}>
            <ScrollTop />
          </div>
          <div className={styles.center}>{children}</div>
          <div className={styles.scrollTo}>
            <ScrollTo anchor="filters" direction="up">
              Return to selectors
            </ScrollTo>
          </div>
        </div>
      )}
    </>
  );
};

export default DataContainer;
