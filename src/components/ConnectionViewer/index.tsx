import React from 'react';
import dynamic from 'next/dynamic';

import { ConnectionViewerProps } from './ConnectionViewer';


const ConnectionViewerLazy = dynamic(() => import('./ConnectionViewer'), { ssr: false });

const NexusImage: React.FC<ConnectionViewerProps> = (props) => {
  return (
    <ConnectionViewerLazy {...props} />
  );
};

export default ConnectionViewerLazy;
