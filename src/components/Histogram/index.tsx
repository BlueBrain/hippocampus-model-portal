import React from 'react';
import dynamic from 'next/dynamic';

import { HistogramProps } from './histogram';


const HistogramLazy = dynamic(() => import('./histogram'), { ssr: false });

const Histogram: React.FC<HistogramProps> = (props) => {
  return (
    <HistogramLazy {...props} />
  );
};


export default Histogram;
