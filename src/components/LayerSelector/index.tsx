import React, { ReactChild, ReactFragment } from 'react';
import { Layer } from '../../types';

import styles from './styles.module.scss'


type LayerSelectProps = {
  activeLayer?: Layer;
  onLayerSelected?: (layer: Layer) => void;
};

const LAYERS: Layer[] = ['SLM', 'SR', 'SP', 'SO'];

const LayerSelector: React.FC<LayerSelectProps> = ({
  activeLayer,
  onLayerSelected = () => {},
}) => {
  const selectLayer = (l: Layer): void => onLayerSelected(l);

  return (
    <div>
      {LAYERS.map(layer => (
        <div
          key={layer}
          className={`${styles.layer} ${layer === activeLayer ? styles.active : ''}`}
          onClick={() => selectLayer(layer)}
        >
          {layer}
        </div>
      ))}
    </div>
  );
};

export default LayerSelector;
