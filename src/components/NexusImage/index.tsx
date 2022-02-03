import React from 'react';
import dynamic from 'next/dynamic';

import { NexusImageProps } from './NexusImage';


const NexusImageLazy = dynamic(() => import('./NexusImage'), { ssr: false });

const NexusImage: React.FC<NexusImageProps> = (props) => {
  return (
    <NexusImageLazy {...props} />
  );
};

export default NexusImage;
