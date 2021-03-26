import React, { ReactChild, ReactFragment } from 'react';

// import './style.scss';
import { Layer } from '../../types';

const classPrefix = 'microcircuit_svg__';

type MicrocircuitProps = {
  layer: Layer;
  onSelect: (layer: Layer) => void;
  activeLayer?: Layer;
  children: ReactChild | ReactFragment;
};

type MicrocircuitSelectProps = {
  color: string;
  defaultActiveLayer?: Layer;
  disabled?: boolean;
  onLayerSelected?: (layer: Layer) => void;
};

const LayerIcon: React.FC<MicrocircuitProps> = ({
  layer,
  activeLayer,
  onSelect,
  children,
}) => (
  <g
    id={`${classPrefix}${layer}-fill`}
    className={activeLayer === layer ? 'active' : ''}
    onClick={() => onSelect(layer)}
  >
    {children}
  </g>
);

const MicrocircuitSelector: React.FC<MicrocircuitSelectProps> = ({
  color,
  defaultActiveLayer,
  disabled = false,
  onLayerSelected,
}) => {
  const [activeLayer, setActiveLayer] = React.useState<Layer>(
    defaultActiveLayer as Layer,
  );
  const selectLayer = (l: Layer): void => {
    setActiveLayer(l);
    onLayerSelected && onLayerSelected(l);
  };

  return (
    <svg
      id="microcircuit_svg__Layer_1"
      x={0}
      y={0}
      viewBox="0 0 295.3 566.9"
      xmlSpace="preserve"
    >
      <style>
        {`#microcircuit_svg__layers path:hover, #microcircuit_svg__layers g.active path{fill:${color}}`}
      </style>
      <g id="microcircuit_svg__shadow_1_">
        <path
          id="microcircuit_svg__Shadow"
          opacity={0.2}
          fill="#0b0780"
          d="M209.2 494.7H72.3L3.7 528.3 72.3 562h136.9l68.5-33.7z"
        />
      </g>
      <g id="microcircuit_svg__Plain_background">
        <path
          id="microcircuit_svg__Microcircuitback"
          fill="#303354"
          stroke="#fff"
          strokeWidth={2.149}
          strokeMiterlimit={10}
          d="M224.7 4.5H87.5L19.2 38.3l.2.4v73.1h0V325.2h0v73.9h0v73.1l68.1 33.5h137.2l68.1-33.5v-73.1h0v-73.9h0V111.8h0V38.7l.2-.4z"
        />
      </g>
      <g
        id="microcircuit_svg__layers"
        className={disabled ? 'disabled' : 'enabled'}
      >
        <LayerIcon
          layer="L1"
          // @ts-ignore
          onSelect={!disabled && selectLayer}
          activeLayer={activeLayer}
        >
          <path
            className="microcircuit_svg__st2"
            d="M224.7 71.8H87.5L19.2 38.3 87.5 4.5 19.2 38.3l.2.4v73.1l68.1 33.5h137.2l68.1-33.5V38.7l.2-.4z"
          />
        </LayerIcon>
        <LayerIcon
          layer="L23"
          // @ts-ignore
          onSelect={!disabled && selectLayer}
          activeLayer={activeLayer}
        >
          <path
            className="microcircuit_svg__st2"
            d="M224.7 145.3H87.5l-68.1-33.5v139.6l68.1 33.4v.2h137.2v-.2l68.1-33.4V111.8z"
          />
        </LayerIcon>
        <LayerIcon
          layer="L4"
          // @ts-ignore
          onSelect={!disabled && selectLayer}
          activeLayer={activeLayer}
        >
          <path
            className="microcircuit_svg__st2"
            d="M224.7 284.8v.2H87.5v-.2l-68.1-33.4v73.8l68.1 33.5h137.2l68.1-33.5v-73.8z"
          />
        </LayerIcon>
        <LayerIcon
          layer="L5"
          // @ts-ignore
          onSelect={!disabled && selectLayer}
          activeLayer={activeLayer}
        >
          <path
            className="microcircuit_svg__st2"
            d="M224.7 358.7H87.5l-68.1-33.5v73.9l68.1 33.5h137.2l68.1-33.5v-73.9z"
          />
        </LayerIcon>
        <LayerIcon
          layer="L6"
          // @ts-ignore
          onSelect={!disabled && selectLayer}
          activeLayer={activeLayer}
        >
          <path
            className="microcircuit_svg__st2"
            d="M224.7 432.6H87.5l-68.1-33.5v73.1l68.1 33.5h137.2l68.1-33.5v-73.1z"
          />
        </LayerIcon>
      </g>
      <g id="microcircuit_svg__Textandlines">
        <g className="microcircuit_svg__st3">
          <path
            className="microcircuit_svg__st4"
            d="M146.4 101.4v13.1h7.3c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.8c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.5.6 1.1.6 1.7zM163.2 116.1v-11.2c-2.1 1.5-3.4 2.4-4.3 2.4-.4 0-.6-.2-.9-.4s-.4-.6-.4-.9c0-.4.2-.6.4-.9.2-.2.6-.4 1.3-.9 1.1-.4 1.7-.9 2.4-1.5.6-.4 1.1-1.1 1.5-1.7.4-.6.9-1.1.9-1.1.2-.2.4-.2.9-.2.4 0 .9.2 1.1.4.2.4.4.9.4 1.3v14c0 1.7-.6 2.4-1.7 2.4-.4 0-.9-.2-1.3-.4-.1-.3-.3-.7-.3-1.3z"
          />
        </g>
        <g className="microcircuit_svg__st3">
          <path
            className="microcircuit_svg__st4"
            d="M139.1 211.5v13.1h7.3c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1s-.2.9-.4 1.1c-.2.2-.9.4-1.3.4h-8.8c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6.8.6 1.7zM154.4 224.6h6.4c.6 0 1.1.2 1.5.4.4.2.4.6.4 1.1s-.2.6-.4 1.1c-.2.2-.6.4-1.3.4h-9c-.6 0-1.1-.2-1.5-.4-.4-.2-.4-.6-.4-1.3 0-.2.2-.6.4-1.1.2-.4.4-.9.6-1.1l3-3c.9-.9 1.5-1.3 1.9-1.5.6-.4 1.3-.9 1.7-1.5.4-.4.9-1.1 1.1-1.5.2-.4.4-1.1.4-1.5s-.2-1.1-.4-1.5c-.2-.4-.6-.6-1.1-.9-.4-.2-.9-.4-1.5-.4-1.1 0-1.9.4-2.6 1.5 0 .2-.2.4-.4 1.1-.2.6-.4 1.1-.6 1.3-.2.2-.6.4-1.1.4-.4 0-.6-.2-1.1-.4-.4-.2-.4-.6-.4-1.1 0-.6.2-1.1.4-1.7.2-.6.6-1.1 1.1-1.7.4-.6 1.1-.9 1.9-1.3.9-.2 1.7-.4 2.8-.4 1.3 0 2.4.2 3.2.6.6.2 1.1.6 1.5 1.1.4.4.9 1.1 1.1 1.5.2.4.4 1.3.4 1.9 0 1.1-.2 1.9-.9 2.8-.6.9-1.1 1.5-1.5 1.9s-1.5 1.3-2.6 2.1c-1.3 1.1-2.1 1.7-2.6 2.4 0 .3-.2.5-.4.7zM170.5 216.6c.9 0 1.5-.2 1.9-.6.6-.4.9-1.1.9-1.9 0-.6-.2-1.1-.6-1.7-.4-.4-1.1-.6-1.7-.6-.4 0-.9 0-1.3.2s-.6.4-.9.6-.4.4-.4.9c-.2.4-.2.6-.4 1.1 0 .2-.2.2-.4.4-.2 0-.4.2-.6.2-.4 0-.6-.2-.9-.4-.2-.2-.4-.6-.4-1.1s.2-.9.4-1.3.6-.9 1.1-1.3c.4-.4 1.1-.9 1.9-1.1.6-.2 1.5-.4 2.4-.4.9 0 1.5 0 2.1.4.6.2 1.3.4 1.7.9.4.4.9.9 1.1 1.5.2.6.4 1.1.4 1.7 0 .9-.2 1.5-.4 2.1-.2.6-.9 1.1-1.5 1.7.6.4 1.1.6 1.7 1.1.4.4.9.9 1.1 1.5.2.4.4 1.1.4 1.7s-.2 1.5-.4 2.1c-.2.6-.6 1.3-1.3 1.9-.6.6-1.3 1.1-2.1 1.3-.9.2-1.7.4-2.6.4-1.1 0-1.9-.2-2.6-.4-.9-.4-1.5-.9-1.9-1.3-.4-.4-.9-1.1-1.1-1.7-.2-.6-.4-1.1-.4-1.5 0-.4.2-.9.4-1.1.2-.2.6-.4 1.1-.4.2 0 .4 0 .6.2.2.2.4.2.4.4.4 1.1.9 1.9 1.3 2.6.4.6 1.1.9 2.1.9.4 0 1.1-.2 1.5-.4.4-.2.9-.6 1.1-1.1.2-.4.4-1.1.4-1.7 0-.9-.2-1.7-.9-2.1-.4-.6-1.3-.9-2.1-.9h-1.5c-.4 0-.9-.2-1.1-.4-.2-.2-.4-.4-.4-.9s.2-.6.4-.9c.2-.2.6-.4 1.3-.4h.2v-.2z"
          />
        </g>
        <g className="microcircuit_svg__st3">
          <path
            className="microcircuit_svg__st4"
            d="M146.4 315.7v13.1h7.3c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.8c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1.1.6 1.7zM164.9 330.3V328h-6.2c-.9 0-1.3-.2-1.7-.4-.4-.2-.6-.9-.6-1.5v-.4c0-.2.2-.4.2-.4.2-.2.2-.4.4-.4.2-.2.2-.4.4-.6l6.4-8.8c.4-.6.9-1.1 1.1-1.3.2-.2.6-.4 1.1-.4 1.3 0 1.9.6 1.9 2.1v9.5h.4c.6 0 1.1 0 1.5.2s.6.6.6 1.1c0 .4-.2.9-.4 1.1-.2.2-.9.4-1.5.4h-.6v2.4c0 .6-.2 1.1-.4 1.5-.2.2-.6.4-1.1.4s-.9-.2-1.1-.4c-.2-.5-.4-1.1-.4-1.8zm-5.4-4.9h5.4v-7.1l-5.4 7.1z"
          />
        </g>
        <g className="microcircuit_svg__st3">
          <path
            className="microcircuit_svg__st4"
            d="M146.4 388.1v13.1h7.3c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1s-.2.9-.4 1.1c-.2.2-.9.4-1.3.4h-8.8c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1.1.6 1.7zM167.7 389.2h-5.8l-.6 4.1c1.1-.6 2.1-.9 3.2-.9.9 0 1.5.2 2.1.4.6.2 1.3.6 1.7 1.3.4.6.9 1.1 1.3 1.9.2.6.4 1.5.4 2.4 0 1.3-.2 2.4-.9 3.2-.4 1.1-1.3 1.7-2.4 2.4-1.1.6-2.1.9-3.4.9-1.5 0-2.6-.2-3.7-.9-.9-.6-1.5-1.1-1.9-1.9s-.6-1.3-.6-1.9c0-.2.2-.6.4-.9.2-.2.6-.4 1.1-.4.6 0 1.3.4 1.5 1.3.4.6.9 1.3 1.3 1.7.6.4 1.1.6 1.9.6.6 0 1.3-.2 1.7-.4s.9-.9 1.1-1.3c.2-.6.4-1.3.4-1.9 0-.9-.2-1.5-.4-1.9-.2-.6-.6-1.1-1.1-1.3s-1.1-.4-1.5-.4c-.6 0-1.3 0-1.5.2-.2.2-.6.4-1.3.9-.6.4-1.1.6-1.5.6-.4 0-.9-.2-1.1-.4-.2-.2-.4-.6-.4-1.1 0 0 0-.2.2-.9l1.1-5.8c.2-.6.4-1.3.6-1.5.2-.2.9-.4 1.5-.4h6.4c1.3 0 1.9.4 1.9 1.5 0 .4-.2.9-.4 1.1s-.6-.3-1.3-.3z"
          />
        </g>
        <g className="microcircuit_svg__st3">
          <path
            className="microcircuit_svg__st4"
            d="M146.4 460.1v13.1h7.3c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.8c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1.1.6 1.7zM160.6 466.6c.6-.6 1.1-1.1 1.7-1.5.6-.2 1.3-.4 2.1-.4.9 0 1.5.2 2.1.4.6.2 1.3.6 1.7 1.3.4.4.9 1.1 1.1 1.9.2.6.4 1.5.4 2.4 0 1.1-.2 2.1-.9 3.2-.4.9-1.3 1.7-2.1 2.1-.9.4-1.9.9-3.2.9-1.3 0-2.6-.4-3.7-1.1s-1.7-1.7-2.4-3c-.4-1.3-.9-3-.9-4.7 0-1.5.2-3 .4-4.1.2-1.3.9-2.1 1.3-3 .6-.9 1.3-1.5 2.1-1.7.9-.2 1.7-.6 3-.6 1.1 0 1.9.2 2.8.6.9.4 1.5.9 1.7 1.5.4.6.6 1.3.6 1.7 0 .4-.2.6-.4.9-.2.2-.6.4-1.1.4s-.6-.2-.9-.4c-.2-.2-.4-.4-.6-.9-.2-.4-.4-.9-.9-1.3-.4-.2-.9-.4-1.5-.4-.4 0-.9.2-1.3.4s-.9.6-1.1 1.1c.4.4 0 2.1 0 4.3zm3.2 7.7c.9 0 1.5-.4 2.1-1.1s.9-1.5.9-2.6c0-.6-.2-1.3-.4-1.9-.2-.4-.6-.9-1.1-1.3-.4-.2-.9-.4-1.5-.4-.4 0-1.1.2-1.5.4s-.9.6-1.1 1.1c-.2.4-.4 1.1-.4 1.7 0 1.1.2 1.9.9 2.8.6.9 1.3 1.3 2.1 1.3z"
          />
        </g>
        <path
          className="microcircuit_svg__st5"
          d="M293 38.3L224.7 4.5H87.5L19.2 38.3l.2.4v433.5l68.1 33.5h137.2l68.1-33.5V38.7z"
        />
        <path
          className="microcircuit_svg__st5"
          d="M19.4 111.8v138.6l68.1 33.7h137.2l68.1-33.7V111.8l-68.6 33.1H88zM224.7 4.5H87.5L19.2 38.3l68.3 33.5h137.2L293 38.3z"
        />
        <path
          className="microcircuit_svg__st5"
          d="M19.2 111.8l68.3 33.5h137.2l68.3-33.5M87.5 72.2v73.1M224.7 72.2v73.1M292.8 38.7v73.1M19.4 38.7v73.1M292.8 111.8v139.4M224.7 144.4v141.4M19.4 111.8v139.4M87.5 144.4V285M19.2 325.2l68.3 33.5h137.2l68.3-33.5M87.5 285.6v73.1M224.7 285.6v73.1M292.8 253v72.2M224.7 285.6v5.8M19.4 253v72.2M87.5 285.6v5.8M19.2 399.1l68.3 33.5h137.2l68.3-33.5M87.5 359.6v73M224.7 359.6v73M292.8 326.7v72.4M224.7 359.6v5.8M19.4 326.7v72.4M87.5 359.6v5.8M19.2 472.8l68.3 33.8h137.2l68.3-33.8M87.5 433.5v73.1M224.7 433.5v73.1M292.8 400.6v72.2M224.7 433.5v5.8M19.4 400.6v72.2M87.5 433.5v5.8"
        />
      </g>
    </svg>
  );
};

export default MicrocircuitSelector;
