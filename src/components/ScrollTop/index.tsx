import React from 'react';
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp';

import styles from './styles.module.scss';

type ScrollTopProps = {};

const ScrollTop: React.FC<ScrollTopProps> = () => {
  const scrollTop = () => {
    const element = document.getElementById('filters');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.scrollTop} onClick={scrollTop}>
      <IoIosArrowUp size={20} />
    </div>
  );
};

export default ScrollTop;