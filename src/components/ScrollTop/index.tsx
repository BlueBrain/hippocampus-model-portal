import React from 'react';

import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp';

import styles from './styles.module.scss';


type ScrollTopProps = {
};

const ScrollTop: React.FC<ScrollTopProps> = () => {
  const scrollTop = () => document.getElementById('filters').scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={styles.scrollTtop} onClick={scrollTop}>
      <IoIosArrowUp size={20} />
    </div>
  );
};

export default ScrollTop;
