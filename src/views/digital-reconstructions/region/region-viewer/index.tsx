import React from 'react';
import dynamic from 'next/dynamic';

import { RegionViewerProps } from './RegionViewer';
import styles from './volume-viewer.module.scss';


const VolumeViewerLazy = dynamic(() => import('./RegionViewer'), { ssr: false });

const VolumeViewer: React.FC<RegionViewerProps> = (props) => {
  return (
    <div className={styles.fixedAspectRation}>
      <VolumeViewerLazy {...props} />
    </div>
  );
};

export default VolumeViewer;
