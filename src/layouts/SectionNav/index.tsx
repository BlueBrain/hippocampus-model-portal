import React, { useState, useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';
import style from './styles.module.scss';

type NavItem = {
  id: string;
  label: string;
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
      const inTheViewThreshold = window.innerHeight / 2;

      const currentNavItem = navItems
        .map(navItem => ({ ...navItem, element: document.getElementById(navItem.id) }))
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

    const scrollHandlerThrottled = throttle(scrollHandler, 500);

    document.addEventListener('scroll', scrollHandlerThrottled, { passive: true });

    return () => {
      document.removeEventListener('scroll', scrollHandlerThrottled);
    };
  }, [navItems]);

  return (
    <div className={style.container} ref={container}>
      {navItems.map((navItem, idx) => (
        <div
          className={`${style.sectionItem} ${currentItemIdx === idx ? `${style.sectionItemCurrent} ${theme ? style[`theme-${theme}`] : ''}` : ''}`}
          key={navItem.id}
          onClick={() => scrollTo(navItem.id)}
        >
          <div
            className={`${style.circle}`}
            title={navItem.label}
          />
          <span className={style.label}>{navItem.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SectionNav;