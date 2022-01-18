import React from 'react';
import dynamic from 'next/dynamic';

import { MetadataProps } from './Metadata';


const MetadataLazy = dynamic(() => import('./Metadata'), { ssr: false });

const Metadata: React.FC<MetadataProps> = (props) => {
  return (
    <MetadataLazy {...props} />
  );
};


export default Metadata;
