import React from 'react';

import { Layer } from '../../types';
import { layers } from '../../constants';

import styles from './styles.module.scss'


type LayerSelectProps = {
  value?: Layer;
  onSelect?: (layer: Layer) => void;
};

const LayerSelector: React.FC<LayerSelectProps> = ({
  value: currentLayer,
  onSelect = () => {},
}) => {
  const selectLayer = (l: Layer): void => onSelect(l);

  return (
    <div>
      {layers.map(layer => (
        <div
          key={layer}
          className={`${styles.layer} ${layer === currentLayer ? styles.active : ''}`}
          onClick={() => selectLayer(layer)}
        >
          {layer}
        </div>
      ))}
    </div>
  );
};

export default LayerSelector;
