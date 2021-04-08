import React from 'react';

import MorphoWrapper from './MorphoWrapper';
import { MorphoViewerOptions } from './MorphologyViewer';


const MorphoViewerContainer: React.FC<{
  path: string;
}> = ({ path }) => {
  const [{ loading, error, data }, setData] = React.useState<{
    loading: boolean;
    error: Error | null;
    data: any;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  const [options, setOptions] = React.useState<MorphoViewerOptions>({
    asPolyline: true,
    focusOn: true,
    somaMode: 'fromOrphanSections',
  });

  React.useEffect(() => {
    fetch(path)
      .then(res => res.text())
      .then(data => setData({ data, error: null, loading: false }))
      .catch(error => setData({ error, data: null, loading: false }));
  }, [path]);

  const handleAsPolyline = () => {
    setOptions({
      ...options,
      asPolyline: !options.asPolyline,
    });
  };

  return (
    <MorphoWrapper
      {...{
        loading,
        error,
        data,
        options,
        onPolylineClick: handleAsPolyline,
      }}
    />
  );
};

export default MorphoViewerContainer;
