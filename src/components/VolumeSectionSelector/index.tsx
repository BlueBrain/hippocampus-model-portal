import React from 'react';

import { VolumeSection } from '@/types';
import { volumeSections } from '@/constants';

import styles from './styles.module.scss'


type VolumeSectionSelectProps = {
  value?: VolumeSection;
  onSelect?: (volumeSection: VolumeSection) => void;
};

const VolumeSectionSelector: React.FC<VolumeSectionSelectProps> = ({
  value: currentVolumeSection,
  onSelect = () => {},
}) => {
  const selectVolumeSection = (volumeSection: VolumeSection): void => onSelect(volumeSection);

  const getClassName = (volumeSection) => {
    return `text-capitalize ${styles.volumeSection} ${volumeSection === currentVolumeSection ? styles.active : ''}`;
  };

  return (
    <div>
      {volumeSections.map(volumeSection => (
        <div
          key={volumeSection}
          className={getClassName(volumeSection)}
          onClick={() => selectVolumeSection(volumeSection)}
        >
          {volumeSection}
        </div>
      ))}
    </div>
  );
};


export default VolumeSectionSelector;
