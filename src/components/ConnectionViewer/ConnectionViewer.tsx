import React, { useRef, useEffect } from 'react';

import ConnectionViewer from './connection-viewer';

import style from './connection-viewer.module.scss';

export type ConnectionViewerProps = {
  data: any;
};

const ConnectionViewerComponent: React.FC<ConnectionViewerProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;

    const connectionViewer = new ConnectionViewer(containerRef.current);
    connectionViewer.init(data);

    return () => {
      if (connectionViewer) connectionViewer.destroy();
    };
  }, [containerRef]);

  return (
    <div className={style.container} ref={containerRef} />
  );
};


export default ConnectionViewerComponent;
