import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './index.module.scss';


const IMAGE_INTERVAL = 9000;
const IMAGE_TRANSITION = 1600;

type ImageProp = {
  src: string;
  alt: string;
};

type ImageSliderProps = {
  images: ImageProp[],
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [domImages, setDomImages] = useState<ImageProp[]>(images.slice(0, 1));
  const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);

  useEffect(() => {
    let preloadNextTimer;
    let transitionTimer;

    const initTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        const nextIdx = currentImgIdx + 1 === images.length
          ? 0
          : currentImgIdx + 1;

        preloadNextTimer = setTimeout(() => {
          if (domImages[nextIdx]) return;

          setDomImages(images.slice(0, nextIdx + 1));
        }, IMAGE_INTERVAL - IMAGE_TRANSITION - 1000);

        transitionTimer = setTimeout(() => {
          setCurrentImgIdx(nextIdx);
        }, IMAGE_INTERVAL - IMAGE_TRANSITION);
      });
    }, 1000);

    return () => {
      clearTimeout(initTimer);
      preloadNextTimer && clearTimeout(preloadNextTimer);
      transitionTimer && clearTimeout(transitionTimer);
    };
  }, [currentImgIdx]);

  return (
    <div className={styles.container}>
      {domImages.map((domImage, idx) => (
        <div
          className={styles.image}
          style={{
            opacity: idx === currentImgIdx ? 1 : 0,
            transition: `opacity ${IMAGE_TRANSITION / 1000}s ease`,
          }}
          key={domImage.src}
        >
          <Image
            src={domImage.src}
            alt={domImage.alt}
            objectFit="cover"
            layout="fill"
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
