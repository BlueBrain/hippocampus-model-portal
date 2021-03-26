import React from 'react';
import dynamic from 'next/dynamic';

import { ImageViewerProps } from './image-viewer';


const ImageViewerLazy = dynamic(() => import('./image-viewer'), { ssr: false });

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  return (
    <ImageViewerLazy {...props} />
  );
};


export default ImageViewer;
