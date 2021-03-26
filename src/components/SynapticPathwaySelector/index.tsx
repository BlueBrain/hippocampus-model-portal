import React, { ReactChild, ReactFragment } from 'react';

// import './style.scss';
import { Layer } from '../../types';
import { accentColors } from '../../config';

const prePrefix = 'pre_pathway_svg__';
const postPrefix = 'post_pathway_svg__';

type PathwayPointProps = {
  layer: Layer;
  onSelect: (layer: Layer) => void;
  activeLayer?: Layer;
  children: ReactChild | ReactFragment;
  cssPrefix: string;
};

export type SynapticPathwaySelectProps = {
  color: string;
  defaultActivePreLayer?: Layer;
  onPreLayerSelected?: (layer: Layer) => void;
  defaultActivePostLayer?: Layer;
  onPostLayerSelected?: (layer: Layer) => void;
};

const PathwayPoint: React.FC<PathwayPointProps> = ({
  layer,
  activeLayer,
  onSelect,
  children,
  cssPrefix,
}) => (
  <g
    id={`${cssPrefix}${layer}-fill`}
    className={activeLayer === layer ? 'active' : ''}
    onClick={() => onSelect(layer)}
  >
    {children}
  </g>
);

const SynapticPathwaySelector: React.FC<SynapticPathwaySelectProps> = ({
  color,
  defaultActivePreLayer,
  onPreLayerSelected,
  defaultActivePostLayer,
  onPostLayerSelected,
}) => {
  const [activePreLayer, setActivePreLayer] = React.useState<Layer>(
    defaultActivePreLayer as Layer,
  );
  const [activePostLayer, setActivePostLayer] = React.useState<Layer>(
    defaultActivePostLayer as Layer,
  );
  const selectPreLayer = (l: Layer): void => {
    setActivePreLayer(l);
    onPreLayerSelected && onPreLayerSelected(l);
  };
  const selectPostLayer = (l: Layer): void => {
    setActivePostLayer(l);
    onPostLayerSelected && onPostLayerSelected(l);
  };

  return (
    <div>
      <svg
        id="synaptic_pathways_svg__Layer_1"
        x={0}
        y={0}
        viewBox="0 0 302.3 566.9"
        xmlSpace="preserve"
      >
        <style>
          {`#pre_pathway_svg__layers path:hover, #pre_pathway_svg__layers g.active path{fill:${color}} #post_pathway_svg__layers path:hover, #post_pathway_svg__layers g.active path{fill:${accentColors.orange}}`}
        </style>
        <g id="synaptic_pathways_svg__shadow">
          <path
            id="synaptic_pathways_svg__Shadow"
            opacity={0.2}
            fill="#0b0780"
            d="M212.2 495.3H74.4l-69 34 69 33.7h137.8l69-33.7z"
          />
        </g>
        <g id="synaptic_pathways_svg__Plain_background">
          <path
            id="synaptic_pathways_svg__Synpaticback"
            fill="#303354"
            stroke="#fff"
            strokeWidth={2.163}
            strokeMiterlimit={10}
            d="M230.8 3.9h-138L24 37.9l.3.4v73.5h0v214.8h0V401h0v73.5l68.5 33.8h138l68.6-33.8V401h0v-74.4h0V111.8h0V38.3l.2-.4z"
          />
        </g>
        <g id="pre_pathway_svg__layers">
          <PathwayPoint
            layer="L1"
            onSelect={selectPreLayer}
            cssPrefix={prePrefix}
            activeLayer={activePreLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M92.8 71.6L24 37.9l68.8-34-68.8 34 .3.4v73.5l68.5 33.8z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L23"
            onSelect={selectPreLayer}
            cssPrefix={prePrefix}
            activeLayer={activePreLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M92.8 145.6l-68.5-33.8v140.6l68.5 33.5z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L4"
            onSelect={selectPreLayer}
            cssPrefix={prePrefix}
            activeLayer={activePreLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M92.8 285.9l-68.5-33.5v74.2l68.5 33.7z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L5"
            onSelect={selectPreLayer}
            cssPrefix={prePrefix}
            activeLayer={activePreLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M92.8 360.3l-68.5-33.7V401l68.5 33.7z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L6"
            onSelect={selectPreLayer}
            cssPrefix={prePrefix}
            activeLayer={activePreLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M24.3 401v73.5l68.5 33.8v-73.6z"
            />
          </PathwayPoint>
        </g>
        <g id="post_pathway_svg__layers">
          <PathwayPoint
            layer="L1"
            onSelect={selectPostLayer}
            cssPrefix={postPrefix}
            activeLayer={activePostLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M230.8 145.6l68.6-33.8V38.3l.2-.4-68.8 33.7z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L23"
            onSelect={selectPostLayer}
            cssPrefix={postPrefix}
            activeLayer={activePostLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M299.4 111.8l-68.6 33.8v140.3l68.6-33.5v-.2z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L4"
            onSelect={selectPostLayer}
            cssPrefix={postPrefix}
            activeLayer={activePostLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M230.8 360.3l68.6-33.7v-74.2l-68.6 33.5z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L5"
            onSelect={selectPostLayer}
            cssPrefix={postPrefix}
            activeLayer={activePostLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M230.8 434.7l68.6-33.7v-74.4l-68.6 33.7z"
            />
          </PathwayPoint>
          <PathwayPoint
            layer="L6"
            onSelect={selectPostLayer}
            cssPrefix={postPrefix}
            activeLayer={activePostLayer}
          >
            <path
              className="synaptic_pathways_svg__st2"
              d="M230.8 508.3l68.6-33.8V401l-68.6 33.7z"
            />
          </PathwayPoint>
        </g>
        <g id="synaptic_pathways_svg__Lines__x2B__text">
          <g id="synaptic_pathways_svg__Synapticlines">
            <g className="synaptic_pathways_svg__st3">
              <path
                className="synaptic_pathways_svg__st4"
                d="M154 101.4v13.2h7.4c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1s-.2.9-.4 1.1c-.2.2-.9.4-1.3.4h-8.9c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14.1c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1.1.6 1.7zM170.9 116.2V105c-2.2 1.5-3.5 2.4-4.3 2.4-.4 0-.6-.2-.9-.4-.2-.2-.4-.6-.4-.9 0-.4.2-.6.4-.9.2-.2.6-.4 1.3-.9 1.1-.4 1.7-.9 2.4-1.5.6-.4 1.1-1.1 1.5-1.7.4-.6.9-1.1.9-1.1.2-.2.4-.2.9-.2.4 0 .9.2 1.1.4.2.4.4.9.4 1.3v14.1c0 1.7-.6 2.4-1.7 2.4-.4 0-.9-.2-1.3-.4-.5-.4-.3-.8-.3-1.4z"
              />
            </g>
            <g className="synaptic_pathways_svg__st3">
              <path
                className="synaptic_pathways_svg__st4"
                d="M144.7 212.2v13.2h7.4c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.9c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14.1c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.6.4.6.8.6 1.7zM160.1 225.4h6.5c.6 0 1.1.2 1.5.4.4.2.4.6.4 1.1 0 .4-.2.6-.4 1.1-.2.2-.6.4-1.3.4h-9.1c-.6 0-1.1-.2-1.5-.4-.4-.2-.4-.6-.4-1.3 0-.2.2-.6.4-1.1.2-.4.4-.9.6-1.1l3-3c.9-.9 1.5-1.3 1.9-1.5.6-.4 1.3-.9 1.7-1.5.4-.4.9-1.1 1.1-1.5s.4-1.1.4-1.5c0-.4-.2-1.1-.4-1.5-.2-.4-.6-.6-1.1-.9-.4-.2-.9-.4-1.5-.4-1.1 0-1.9.4-2.6 1.5 0 .2-.2.4-.4 1.1-.2.6-.4 1.1-.6 1.3-.2.2-.6.4-1.1.4-.4 0-.6-.2-1.1-.4-.4-.2-.4-.6-.4-1.1 0-.6.2-1.1.4-1.7.2-.6.6-1.1 1.1-1.7.4-.6 1.1-.9 1.9-1.3.9-.2 1.7-.4 2.8-.4 1.3 0 2.4.2 3.2.6.6.2 1.1.6 1.5 1.1.4.4.9 1.1 1.1 1.5.2.4.4 1.3.4 1.9 0 1.1-.2 1.9-.9 2.8-.6.9-1.1 1.5-1.5 1.9s-1.5 1.3-2.6 2.2c-1.3 1.1-2.2 1.7-2.6 2.4 0 .1-.2.4-.4.6zM176.5 217.4c.9 0 1.5-.2 1.9-.6.6-.4.9-1.1.9-1.9 0-.6-.2-1.1-.6-1.7-.4-.4-1.1-.6-1.7-.6-.4 0-.9 0-1.3.2s-.6.4-.9.6c-.2.2-.4.4-.4.9-.2.4-.2.6-.4 1.1 0 .2-.2.2-.4.4-.2 0-.4.2-.6.2-.4 0-.6-.2-.9-.4-.2-.2-.4-.6-.4-1.1s.2-.9.4-1.3.6-.9 1.1-1.3c.4-.4 1.1-.9 1.9-1.1.6-.2 1.5-.4 2.4-.4.9 0 1.5 0 2.2.4.6.2 1.3.4 1.7.9.4.4.9.9 1.1 1.5.2.6.4 1.1.4 1.7 0 .9-.2 1.5-.4 2.2-.2.6-.9 1.1-1.5 1.7.6.4 1.1.6 1.7 1.1.4.4.9.9 1.1 1.5.2.4.4 1.1.4 1.7s-.2 1.5-.4 2.2c-.2.6-.6 1.3-1.3 1.9-.6.6-1.3 1.1-2.2 1.3-.9.2-1.7.4-2.6.4-1.1 0-1.9-.2-2.6-.4-.9-.4-1.5-.9-1.9-1.3-.4-.4-.9-1.1-1.1-1.7-.2-.6-.4-1.1-.4-1.5 0-.4.2-.9.4-1.1.2-.2.6-.4 1.1-.4.2 0 .4 0 .6.2.2.2.4.2.4.4.4 1.1.9 1.9 1.3 2.6.4.6 1.1.9 2.2.9.4 0 1.1-.2 1.5-.4.4-.2.9-.6 1.1-1.1.2-.4.4-1.1.4-1.7 0-.9-.2-1.7-.9-2.2-.4-.6-1.3-.9-2.2-.9h-1.5c-.4 0-.9-.2-1.1-.4-.2-.2-.4-.4-.4-.9s.2-.6.4-.9c.2-.2.6-.4 1.3-.4h.2v-.3z"
              />
            </g>
            <g className="synaptic_pathways_svg__st3">
              <path
                className="synaptic_pathways_svg__st4"
                d="M151.9 317.1v13.2h7.4c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.9c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14.1c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.6.4.6 1 .6 1.7zM170.5 331.8v-2.4h-6.3c-.9 0-1.3-.2-1.7-.4-.4-.2-.6-.9-.6-1.5v-.4c0-.2.2-.4.2-.4.2-.2.2-.4.4-.4.2-.2.2-.4.4-.6l6.5-8.9c.4-.6.9-1.1 1.1-1.3.2-.2.6-.4 1.1-.4 1.3 0 1.9.6 1.9 2.2v9.5h.4c.6 0 1.1 0 1.5.2.4.2.6.6.6 1.1s-.2.9-.4 1.1c-.2.2-.9.4-1.5.4h-.6v2.4c0 .6-.2 1.1-.4 1.5-.2.2-.6.4-1.1.4-.4 0-.9-.2-1.1-.4-.2-.4-.4-1.1-.4-1.7zm-5.2-5h5.4v-7.1l-5.4 7.1z"
              />
            </g>
            <g className="synaptic_pathways_svg__st3">
              <path
                className="synaptic_pathways_svg__st4"
                d="M152.3 390v13.2h7.4c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.9c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7V390c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1 .6 1.7zM173.7 391.1h-5.8l-.6 4.1c1.1-.6 2.2-.9 3.2-.9.9 0 1.5.2 2.2.4.6.2 1.3.6 1.7 1.3.4.4.9 1.1 1.3 1.9.2.6.4 1.5.4 2.4 0 1.3-.2 2.4-.9 3.2-.4 1.1-1.3 1.7-2.4 2.4-1.1.6-2.2.9-3.5.9-1.5 0-2.6-.2-3.7-.9-1.1-.6-1.5-1.1-1.9-1.9-.4-.9-.6-1.3-.6-1.9 0-.2.2-.6.4-.9.2-.2.6-.4 1.1-.4.6 0 1.3.4 1.5 1.3.4.6.9 1.3 1.3 1.7.6.4 1.1.6 1.9.6.6 0 1.3-.2 1.7-.4.4-.4.9-.9 1.1-1.3.2-.4.4-1.3.4-1.9 0-.9-.2-1.5-.4-1.9-.2-.6-.6-1.1-1.1-1.3-.4-.2-1.1-.4-1.5-.4-.6 0-1.3 0-1.5.2-.2.2-.6.4-1.3.9-.6.4-1.1.6-1.5.6s-.9-.2-1.1-.4c-.2-.2-.4-.6-.4-1.1 0 0 0-.2.2-.9l1.1-5.8c.2-.6.4-1.3.6-1.5.2-.2.9-.4 1.5-.4h6.5c1.3 0 1.9.4 1.9 1.5 0 .4-.2.9-.4 1.1-.1.1-.7-.3-1.4-.3z"
              />
            </g>
            <g className="synaptic_pathways_svg__st3">
              <path
                className="synaptic_pathways_svg__st4"
                d="M152.3 462.4v13.2h7.4c.6 0 1.1.2 1.3.4.2.2.4.6.4 1.1 0 .4-.2.9-.4 1.1-.2.2-.9.4-1.3.4h-8.9c-.9 0-1.3-.2-1.7-.4-.4-.4-.4-.9-.4-1.7v-14.1c0-.6.2-1.3.4-1.7.4-.4.9-.6 1.3-.6.6 0 1.1.2 1.3.6.4.4.6 1.1.6 1.7zM166.6 468.9c.6-.6 1.1-1.1 1.7-1.5.6-.4 1.3-.4 2.2-.4s1.5.2 2.2.4c.6.2 1.3.6 1.7 1.3.4.4.9 1.1 1.1 1.9.2.6.4 1.5.4 2.4 0 1.1-.2 2.2-.9 3.2s-1.3 1.7-2.2 2.2c-.9.4-1.9.9-3.2.9s-2.6-.4-3.7-1.1-1.7-1.7-2.4-3c-.4-1.3-.9-3-.9-4.8 0-1.5.2-3 .4-4.1.2-1.3.9-2.2 1.3-3 .6-.9 1.3-1.5 2.2-1.7.9-.2 1.7-.6 3-.6 1.1 0 1.9.2 2.8.6.9.4 1.5.9 1.7 1.5.4.6.6 1.3.6 1.7 0 .4-.2.6-.4.9-.2.2-.6.4-1.1.4-.4 0-.6-.2-.9-.4-.2-.2-.4-.4-.6-.9-.2-.4-.4-.9-.9-1.3-.4-.2-.9-.4-1.5-.4-.4 0-.9.2-1.3.4s-.9.6-1.1 1.1c.2.4-.2 2.2-.2 4.3zm3.2 7.8c.9 0 1.5-.4 2.2-1.1.6-.6.9-1.5.9-2.6 0-.6-.2-1.3-.4-1.9-.2-.4-.6-.9-1.1-1.3-.4-.4-.9-.4-1.5-.4-.4 0-1.1.2-1.5.4-.4.2-.9.6-1.1 1.1-.2.4-.4 1.1-.4 1.7 0 1.1.2 1.9.9 2.8.5.9 1.2 1.3 2 1.3z"
              />
            </g>
            <path
              className="synaptic_pathways_svg__st5"
              d="M299.8 37.9l-69-34h-138L24 37.9l.3.4v436.2l68.5 33.8h138l68.6-33.8V38.3z"
            />
            <path
              className="synaptic_pathways_svg__st5"
              d="M24.3 111.8v139.5l68.5 34h138l68.6-34V111.8l-69 33.3H93.3zM230.8 3.9h-138L24 37.9l68.8 33.7h138l69-33.7z"
            />
            <path
              className="synaptic_pathways_svg__st5"
              d="M24 111.8l68.8 33.8h138l69-33.8M92.8 72v73.6M230.8 72v73.6M299.4 38.3v73.5M24.3 38.3v73.5M299.4 111.8v140.4M230.8 144.7V287M24.3 111.8v140.4M92.8 144.7v141.5M24 326.6l68.8 33.7h138l69-33.7M92.8 286.8v73.5M230.8 286.8v73.5M299.4 253.9v72.7M230.8 286.8v5.8M24.3 253.9v72.7M92.8 286.8v5.8M24 401l68.8 33.7h138l69-33.7M92.8 361.2v73.5M230.8 361.2v73.5M299.4 328.1V401M230.8 361.2v5.8M24.3 328.1V401M92.8 361.2v5.8M24 475.2l68.8 33.9h138l69-33.9M92.8 435.6v73.5M230.8 435.6v73.5M299.4 402.5v72.7M230.8 435.6v5.8M24.3 402.5v72.7M92.8 435.6v5.8"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SynapticPathwaySelector;
