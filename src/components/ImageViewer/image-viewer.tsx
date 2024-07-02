import React, { useState, useEffect } from 'react';
//import Lightbox from 'react-image-lightbox';
import noop from 'lodash/noop';

//import 'react-image-lightbox/style.css';

const classPrefix = 'image-viewer__';

export type ImageViewerProps = {
  className?: string;
  src: string;
  loading?: 'eager' | 'lazy';
  thumbnailSrc?: string;
  alt?: string;
  color?: string;
  canDownload?: boolean;
  canExpand?: boolean;
  border?: boolean;
  aspectRatio?: string;
  onThumbnailLoad?: () => void;
  onThumbnailError?: () => void;
};

const ImageViewer: React.FC<ImageViewerProps> = ({
  className = '',
  src,
  thumbnailSrc,
  alt,
  canExpand = true,
  border = false,
  loading = 'eager',
  aspectRatio,
  onThumbnailLoad = noop,
  onThumbnailError = noop,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [thumbnailLoadError, setThumbnailLoadError] = useState(false);

  const onThumbnailLoadError = () => {
    setThumbnailLoadError(true);
    onThumbnailError();
  };

  const onThumbnailClick = (e: React.MouseEvent) => {
    if (!canExpand) return;

    setExpanded(true);
    e.stopPropagation();
  };

  useEffect(() => {
    setThumbnailLoadError(false);
  }, [src]);

  return (
    <div
      className={`${classPrefix}basis ${className}`}
      style={{ aspectRatio: aspectRatio || undefined }}
    >
      <img
        key={src}
        src={thumbnailSrc || src}
        loading={loading}
        alt={alt}
        onClick={(e: React.MouseEvent) => onThumbnailClick(e)}
        style={{
          aspectRatio: aspectRatio || undefined,
          border: border ? '1px solid grey' : 'none',
          display: thumbnailLoadError ? 'none' : 'block',
        }}
        onLoad={onThumbnailLoad}
        onError={onThumbnailLoadError}
      />
      { /* expanded && (
        <Lightbox
          mainSrc={src}
          onCloseRequest={() => setExpanded(false)}
        />
      ) */}
    </div>
  );
};

export default ImageViewer;