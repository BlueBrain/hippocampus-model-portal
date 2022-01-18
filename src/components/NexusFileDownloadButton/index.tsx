import React from 'react';
import dynamic from 'next/dynamic';

import { NexusFileDownloadButtonProps } from './NexusFileDownloadButton';


const NexusFileDownloadButtonLazy = dynamic(() => import('./NexusFileDownloadButton'), { ssr: false });

const NexusFileDownloadButton: React.FC<NexusFileDownloadButtonProps> = (props) => {
  return (
    <NexusFileDownloadButtonLazy {...props} />
  );
};


export default NexusFileDownloadButton;
