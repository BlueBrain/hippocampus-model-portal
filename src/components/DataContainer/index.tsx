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
  navItems = [],
  theme,
  quickSelectorEntries,
}) => {
  const navItemsLength = navItems.length; // No need for optional chaining now

  return (
    <>
      {visible && (
        <div className={styles.data_page}>
          <div id="data" className={styles.dataContainer}>
            <div className={navItemsLength < 2 && !quickSelectorEntries ? styles.navItemsContainer : styles.sidebar}>
              {navItemsLength < 2 && !quickSelectorEntries ? (
                <SectionNav theme={theme} navItems={navItems} />
              ) : (
                <div className={styles.sidebar__sticky}>
                  {quickSelectorEntries && <QuickSelector theme={theme} entries={quickSelectorEntries} />}
                  {navItems && (
                    <div className={styles.navItemsContainer}>
                      <SectionNav theme={theme} navItems={navItems} />
                    </div>
                  )}
                </div>
              )}
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