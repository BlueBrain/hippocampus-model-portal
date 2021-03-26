import React from 'react';
import dynamic from 'next/dynamic';

import { NexusPluginClassProps } from './nexus-plugin';


const NexusPluginLazy = dynamic(() => import('./nexus-plugin'), { ssr: false });

const ImageViewer: React.FC<NexusPluginClassProps<any>> = (props) => {
  return (
    <NexusPluginLazy {...props} />
  );
};


export default ImageViewer;
