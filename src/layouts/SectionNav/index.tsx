import React, { useState, useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import style from './styles.module.scss';

type NavItem = {
  id?: string;
  label: string;
  isTitle?: boolean;
};

type SectionNavProps = {
  navItems: NavItem[];
  theme?: number;
};

const SectionNav: React.FC<SectionNavProps> = ({ navItems, theme = 1 }) => {
  const container = useRef<HTMLDivElement>(null);
  const [currentItemIdx, setCurrentItemIdx] = useState<number>(0);

  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollHandler = () => {
      const inTheViewThreshold = 64;

      const currentNavItem = navItems
        .filter(item => !item.isTitle && item.id)
        .map(navItem => ({ ...navItem, element: document.getElementById(navItem.id!) }))
        .filter(navItem => navItem.element)
        .map(navItem => ({ ...navItem, top: navItem.element!.getBoundingClientRect().top }))
        .sort((navItemA, navItemB) => navItemA.top - navItemB.top)
        .filter(navItem => navItem.top < inTheViewThreshold)
        .reverse()[0];

      const itemIdx = currentNavItem
        ? navItems.findIndex(navItem => navItem.id === currentNavItem.id)
        : 0;

      setCurrentItemIdx(itemIdx);
    };

    const scrollHandlerThrottled = throttle(scrollHandler, 0);

    document.addEventListener('scroll', scrollHandlerThrottled, { passive: true });

    return () => {
      document.removeEventListener('scroll', scrollHandlerThrottled);
    };
  }, [navItems]);

  // Only render if there is more than one non-title item in navItems
  if (navItems.filter(item => !item.isTitle).length <= 1) {
    return null;
  }

  return (
    <div className={style.container} ref={container}>
      {navItems.map((navItem, idx) => (
        navItem.isTitle ? (
          <div key={idx} className={`${style.sectionTitle} `}>
            {navItem.label}
          </div>
        ) : (
          <div
            className={`${style.sectionItem} ${currentItemIdx === idx ? `${style.sectionItemCurrent} ${theme ? style[`theme-${theme}`] : ''}` : ''}`}
            key={navItem.id || idx}
            onClick={() => navItem.id && scrollTo(navItem.id)}
          >
            <span className={style.label}>{navItem.label}</span>
          </div>
        )
      ))}
    </div>
  );
};

export default SectionNav;