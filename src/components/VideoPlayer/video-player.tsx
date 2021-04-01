import React, { useRef, useEffect, useState } from 'react';
import Plyr from 'plyr';

import 'plyr/dist/plyr.css';


type Source = {
  src: string;
  type: string;
  size: number;
}

const Video: React.FC<any> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlayer, setVideoPlayer] = useState<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef?.current) return;

    const player = new Plyr(videoRef?.current, {
      settings: ['quality', 'loop'],
      controls: ['play', 'progress', 'settings', 'pip', 'airplay', 'fullscreen'],
      autoplay: true,
      muted: true,
      loop: {
        active: true,
      },
    });
    player.source = {
      type: 'video',
      sources: props.sources,
    };
    setVideoPlayer(player);

    return () => {
      if (!!videoPlayer) {
        videoPlayer.destroy();
      }
    }
  }, [videoRef]);

  return (
    <video className="js-plyr plyr" ref={videoRef} />
  );
};

export default Video;
