import React from 'react';
import dynamic from 'next/dynamic';

export * from './plot';


export default dynamic(() => import('./plot'), { ssr: false });
