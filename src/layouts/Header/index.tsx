import React from 'react';

import Brand from '../Brand';
import MainNav from '../MainNav';


const classPrefix = 'nav__';

const Header: React.FC = () => {
  return (
    <div role="navigation" className={`${classPrefix}basis`}>
      <Brand />
      <MainNav />
    </div>
  );
};

export default Header;
