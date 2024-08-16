import React from 'react';
import SectionNav from '@/layouts/SectionNav';
import ScrollTo from '@/components/ScrollTo';
import ScrollTop from '@/components/ScrollTop';
import styles from './styles.module.scss';
import { QuickSelectorEntry } from '@/types';
import QuickSelector from '@/components/QuickSelectorNew';

type NavItem = {
  id?: string;
  label: string;
  isTitle?: boolean;
}

type DataContainerProps = {
  visible?: boolean;
  children: React.ReactNode;
  navItems?: NavItem[];
  theme?: number;
  quickSelectorEntries?: QuickSelectorEntry[];
};

const DataContainer: React.FC<DataContainerProps> = ({
  visible = true,
  children,
  navItems,
  theme,
  quickSelectorEntries,
}) => {
  return (
    <>
      {visible && (
        <div className={styles.data_page}>
          <div id="data" className={styles.dataContainer}>
            <div className={styles.sidebar}>
              <div className={styles.sidebar__sticky}>
                {quickSelectorEntries && (
                  <QuickSelector theme={theme} entries={quickSelectorEntries} />
                )}
                {navItems && (
                  <div className={styles.navItemsContainer}>
                    <SectionNav theme={theme} navItems={navItems} />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.content}>
              <div>{children}</div>
            </div>
          </div>
        </div>

      )}

    </>
  );
};

export default DataContainer;


{/*<div className={styles.data}>
          <div id="data" className={styles.dataContainer}>
           

            {quickSelectorEntries && (
              <QuickSelector entries={quickSelectorEntries} />
            )}

            <div className={styles.scrollTop}>
              <ScrollTop />
            </div>

            <div className={styles.center}>{children}</div>

            <div className={styles.navItemsContainer} />
          </div>
          <div className={styles.scrollTo}>
            <ScrollTo anchor="filters" direction="up">
              Return to selectors
            </ScrollTo>
          </div>
        </div>
         */}