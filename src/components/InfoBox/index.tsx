import React from 'react';

import { Color } from '../../types';
import styles from './styles.module.scss';


type InfoBoxProps = {
  title?: string;
  text: string;
  color?: Color;
};

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  text,
  color = '',
}) => {
  return (
    <div className={`${styles.container} bg-${color}`}>
      {title && <h3>{title}</h3>}
      <p>{text}</p>
    </div>
  );
};

export default InfoBox;
