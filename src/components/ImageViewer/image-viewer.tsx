import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';

import 'react-image-lightbox/style.css';

// import './style.scss';


const classPrefix = 'image-viewer__';

export type ImageViewerProps = {
  src: string;
  loading?: 'eager' | 'lazy';
  thumbnailSrc?: string;
  alt?: string;
  color?: string;
  canDownload?: boolean;
  canExpand?: boolean;
  border?: boolean;
};

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  thumbnailSrc,
  alt,
  // color,
  // canDownload = true,
  canExpand = true,
  border = false,
  loading = 'eager',
}) => {
  const [expanded, setExpanded] = useState(false);

  const onThumbnailClick = (e: React.MouseEvent) => {
    if (!canExpand) return;

    setExpanded(true);
    e.stopPropagation();
  };

  return (
    <div className={`${classPrefix}basis`}>
      <img
        src={thumbnailSrc || src}
        loading={loading}
        alt={alt}
        onClick={(e: React.MouseEvent) => onThumbnailClick(e)}
        style={{ border: border ? '1px solid grey' : 'none' }}
      />
      {/* <FaExpandArrowsAlt /> */}
      {expanded && (
        <Lightbox
          mainSrc={src}
          onCloseRequest={() => setExpanded(false)}
        />
      )}
      {/* {canDownload && (
        <button
          className="icon-button__download"
          style={{ backgroundColor: color }}
        >
          <IoMdDownload />
        </button>
      )} */}
    </div>
  );
};

export default ImageViewer;
