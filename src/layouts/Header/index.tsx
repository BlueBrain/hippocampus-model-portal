import React, { useState, useEffect } from 'react';

import Brand from '../Brand';
import MainNav from '../MainNav';

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
        '/hippocampus-portal-dev/terms-of-use/',
        '/hippocampus-portal-dev/privacy-policy/',
        '/hippocampus-portal-dev/cookies-policy/',
        '/hippocampus-portal-dev/glossary/',
        '/hippocampus-portal-dev/resources/'
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