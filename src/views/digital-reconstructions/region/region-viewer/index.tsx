import React from 'react';
import dynamic from 'next/dynamic';

import { RegionViewerProps } from './RegionViewer';
import styles from './volume-viewer.module.scss';


const RegionViewerLazy = dynamic(() => import('./RegionViewer'), { ssr: false });

const RegionViewer: React.FC<RegionViewerProps> = (props) => {
  return (
    <div className={styles.fixedAspectRation}>
      <RegionViewerLazy {...props} />
    </div>
  );
};

export default RegionViewer;
