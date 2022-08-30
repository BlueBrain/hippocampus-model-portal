import React, { useState, useRef, useEffect } from 'react';
import throttle from 'lodash/throttle';

import style from './styles.module.scss';


type NavItem = {
  id: string;
  label: string;
}

type SectionNavProps = {
  navItems: NavItem[];
};

const SectionNav: React.FC<SectionNavProps> = ({ navItems }) => {
  const container = useRef<HTMLDivElement>(null);
  const [currentItemIdx, setCurrentItemIdx] = useState<number>(0);

  const scrollTo = elementId => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    const scrollHandler = () => {
      const inTheViewThreshold =window.innerHeight / 2;

      const currentNavItem = navItems
        // create collection of navItems extended with a reference to corresponding HTML element
        .map(navItem => ({ ...navItem, element: document.getElementById(navItem.id) }))
        // filter navItems where element wasn't found by it's id
        .filter(navItem => navItem.element)
        // extend collection with element's top - y coordinate on the page
        .map(navItem => ({ ...navItem, top: navItem.element.getBoundingClientRect().top }))
        // sort nav items by top (in case they are not ordered properly for some reason)
        .sort((navItemA, navItemB) => navItemA.top - navItemB.top)
        // filter out those elements where top is below the second half of the screen
        .filter(navItem => navItem.top < inTheViewThreshold)
        // take the last element
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
  }, []);

  return (
    <div className={style.container} ref={container}>
      {navItems.map((navItem, idx) => (
        <div
          className={`${style.sectionItem} ${currentItemIdx === idx ? style.sectionItemCurrent : ''}`}
          key={navItem.id}
          onClick={() => scrollTo(navItem.id)}
        >
          <div className={style.circle} title={navItem.label} />
          <span className={style.label}>{navItem.label}</span>
        </div>
      ))}
    </div>
  );
}


export default SectionNav;
