import React from 'react';
import dynamic from 'next/dynamic'


const MorphoViewerContainer = dynamic(() => import('./MorphoViewerContainer'), { ssr: false });

type NeuronMorphologyProps = {
  path: string;
};

const NeuronMorphology: React.FC<NeuronMorphologyProps> = ({ path }) => {
  return (
    <MorphoViewerContainer path={path} />
  );
};


export default NeuronMorphology;
