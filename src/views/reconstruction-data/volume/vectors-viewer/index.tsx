import React from 'react';
import dynamic from 'next/dynamic';

import VectorsViewerProps from './VectorViewer';

const VectorsViewerLazy = dynamic(() => import('./VectorViewer'), { ssr: false });

const VolumeViewer: React.FC<VectorsViewerProps> = (props) => {
    return (
        <div className={styles.fixedAspectRation}>
            <VectorsViewerLazy {...props} />
        </div>
    );
};

export default VolumeViewer;
