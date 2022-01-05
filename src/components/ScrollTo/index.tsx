import React, { ReactChild, ReactFragment } from 'react';
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown';
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp';

import { Direction, Color } from '../../types';


const classPrefix = 'scroll-to__';

type ScrollToProps = {
  anchor: string;
  direction: Direction;
  children: ReactChild | ReactFragment;
  color?: Color;
  animated?: boolean;
};

const ScrollTo: React.FC<ScrollToProps> = ({
  anchor,
  direction,
  children,
  color = '',
  animated = false,
}) => {
  const scroll = () => {
    const target = document.querySelector(`#${anchor}`);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div onClick={scroll} className={`${classPrefix}basis ${color} ${animated ? 'animated' : ''}`}>
      {children}
      <span className={`${classPrefix}direction`}>
        {direction === 'up' && <IoIosArrowUp />}
        {direction === 'down' && <IoIosArrowDown />}
      </span>
    </div>
  );
};

export default ScrollTo;
