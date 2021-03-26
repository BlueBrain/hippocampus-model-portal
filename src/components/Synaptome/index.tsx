import React from 'react';

import ImageViewer from '../ImageViewer';
import Video from '../VideoPlayer';

// import './style.less';


const classPrefix = 'synaptome__';


const Synaptome: React.FC<{ mtype: string, label: string }> = ({ mtype, label }) => {
  return (
    <div className={`${classPrefix}basis`}>
      <h3>{label}</h3>
      <div className="row">
        <div className="col-xs-12 col-sm-3">
          <div className="synaptome-img-container">
            <ImageViewer src="https://bbp.epfl.ch/nmc-portal/documents/10184/742704/input_synaptome.png" />
            <span>Input synaptome</span>
          </div>
          <div className="synaptome-img-container">
            <ImageViewer src="https://bbp.epfl.ch/nmc-portal/documents/10184/742704/input_synaptome.png" />
            <span>Output synaptome</span>
          </div>
        </div>
        <div className="col-xs-12 col-sm-9">
          <Video
            controls
            muted
            loop
            autoplay
            sources={[
              { src: 'https://bbp.epfl.ch/project/media/nmc-portal/Synaptome/mp4/L1_NGC-DA.mp4', type: 'video/mp4', size: '720' },
              { src: 'https://bbp.epfl.ch/project/media/nmc-portal/Synaptome/mp4/L1_NGC-DA.mp4', type: 'video/mp4', size: '1080' },
            ]}
          />
          <span>Map of afferent intrinsic synapses</span>
        </div>
      </div>
    </div>
  );
};

export default Synaptome;
