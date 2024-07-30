import React, { useEffect, useState } from 'react';
import { Color } from '../../types';
import styles from './styles.module.scss';

type InfoBoxProps = {
  color?: Color;
};

const InfoBox: React.FC<InfoBoxProps> = ({
  color = 'grey-1',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`text-lg leading-8 ${styles.container} transition-opacity duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

export default InfoBox;