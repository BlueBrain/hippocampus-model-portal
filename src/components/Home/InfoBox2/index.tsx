import React, { ReactChild, ReactFragment } from 'react';
import { FaCircle, FaCaretDown } from 'react-icons/fa';

import { Color } from '../../../types';
import { basePath } from '../../../config';

// import './style.scss';


const classPrefix = 'info-box-2__';

const getSlug = (name: string): string =>
  name.toLowerCase().replace(/ |<br\/>/g, '-');

type InfoBox2Props = {
  title: string;
  color: Color;
  children: ReactChild | ReactFragment;
  arrow?: boolean;
  subsections: {
    name: string;
    icon: 'region' | 'neuron' | 'circuit' | 'synapse';
  }[];
};

const InfoBox2: React.FC<InfoBox2Props> = ({
  title,
  color,
  children,
  arrow,
  subsections,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const icons = {
    region: (
      <img
        src={`${basePath}/assets/images/icons/regions.svg`}
        alt="brain regions"
      />
    ),
    neuron: (
      <img
        src={`${basePath}/assets/images/icons/neuron.svg`}
        alt="neuron"
      />
    ),
    circuit: (
      <img
        src={`${basePath}/assets/images/icons/microcircuit.svg`}
        alt="microcircuit"
      />
    ),
    synapse: (
      <img
        src={`${basePath}/assets/images/icons/synapse.svg`}
        alt="synapse"
      />
    ),
  };

  return (
    <div className={`${classPrefix}basis ${color} ${expanded ? 'open' : ''}`}>
      <div className="dataset-container">
        <div className="dataset">
          <h3 className="text-white" dangerouslySetInnerHTML={{ __html: title }} />
          <span onClick={() => setExpanded(!expanded)}>
            Read {expanded ? 'less' : 'more'}
            <FaCircle />
          </span>
          {arrow && (
            <div className="caret-1">
              <FaCaretDown />
            </div>
          )}
        </div>
        <ul className="links">
          {subsections.map((section, i) => (
            <li key={i} style={{ width: `${100 - 5 * i}%` }}>
              <a href={`${getSlug(title)}/${getSlug(section.name)}`}>
                {icons[section.icon]}
                {section.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="more">
        <div className="more-content">{children}</div>
        <div className="more-shadow" />
      </div>
      {arrow && (
        <div className="caret-2">
          <FaCaretDown />
        </div>
      )}
      {arrow && (
        <div className="caret-3">
          <FaCaretDown />
        </div>
      )}
    </div>
  );
};

export default InfoBox2;
