import React from 'react';

import { Color } from '../../types';
import styles from './styles.module.scss';


type InfoBoxProps = {
  color?: Color;
};

const InfoBox: React.FC<InfoBoxProps> = ({
  color = 'grey-1',
  children,
}) => {
  return (
    <div className={`${styles.container}`}>
      {children}
    </div>
  );
};


export default InfoBox;
