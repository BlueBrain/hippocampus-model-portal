import React from 'react';
import dynamic from 'next/dynamic';

import { VolumeViewerProps } from './VolumeViewer';
import styles from './volume-viewer.module.scss';


const VolumeViewerLazy = dynamic(() => import('./VolumeViewer'), { ssr: false });

const VolumeViewer: React.FC<VolumeViewerProps> = (props) => {
  return (
    <div className={styles.fixedAspectRation}>
      <VolumeViewerLazy {...props} />
    </div>
  );
};

export default VolumeViewer;
