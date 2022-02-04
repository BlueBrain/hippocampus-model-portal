import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import Lightbox from 'react-image-lightbox';

import { nexusAuthProxyUrl, nexusImgLoaderUrl, basePath } from '../../config';

import style from './styles.module.scss';

import 'react-image-lightbox/style.css';


export interface NexusImageProps extends ImageProps {
  src: string; // Nexus selfUrl
  alt: string;
  border?: boolean;
  className?: string;
}

type ImgLoaderProps = {
  src: string;
  width: 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840;
  quality: number;
}

const imgLoader: (ImgLoaderProps) => string = ({ src, width = 1080, quality = 80}) => {
  return `${nexusImgLoaderUrl}${basePath}/_next/image/?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

const authProxyUrl = new URL(nexusAuthProxyUrl);

export const NexusImage = (props: NexusImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const proxiedImgUrl = new URL(props.src);
  proxiedImgUrl.host = authProxyUrl.host;
  proxiedImgUrl.protocol = authProxyUrl.protocol;
  const proxiedImgSrc = proxiedImgUrl.toString();

  const handleClick = (e: React.MouseEvent) => {
    setIsOpen(true);
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={style.container}
        style={{ border: props.border ? '1px solid grey' : 'none' }}
        onClick={handleClick}
      >
        <Image
          {...props}
          loader={imgLoader}
          src={proxiedImgSrc}
          alt={props.alt}
        />
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={imgLoader({ src: proxiedImgSrc, width: 3840, quality: 100 })}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </>
  );
};


export default NexusImage;
