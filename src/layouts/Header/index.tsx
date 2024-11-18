import React, { useState, useEffect } from 'react';

import Brand from '../Brand';
import MainNav from '../MainNav';
import { basePath } from '@/config';

const classPrefix = 'nav__';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const updateScrolledStateForPath = () => {
      const currentPath = window.location.pathname;
      const specialPages = [
        `${basePath}/terms-of-use/`,
        `${basePath}/privacy-policy/`,
        `${basePath}/cookies-policy/`,
        `${basePath}/glossary/`,
        `${basePath}/resources`
      ];

      if (specialPages.includes(currentPath)) {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Check the paath on component mount
    updateScrolledStateForPath();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div role="navigation" className={`${classPrefix}basis ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav__basis__container">
        <Brand />
        <MainNav />
      </div>
    </div>
  );
};

export default Header;
