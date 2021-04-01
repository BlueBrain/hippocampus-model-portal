import React from 'react';

import { IoIosArrowUp } from 'react-icons/io';


const classPrefix = 'scroll-top__';

type ScrollTopProps = {
  anchor: string;
};

const ScrollTop: React.FC<ScrollTopProps> = ({ anchor }) => {
  return (
    <a href={`#${anchor}`} className={`${classPrefix}base`}>
      <IoIosArrowUp />
    </a>
  );
};

export default ScrollTop;
