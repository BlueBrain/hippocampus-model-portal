import React, { ReactChild, ReactFragment } from 'react';
import { FaCircle } from 'react-icons/fa';

import { basePath } from '../../../config';

// import './style.scss';

const classPrefix = 'info-box-1__';

type InfoBox1Props = {
  icon: 'checkmark' | 'mail' | 'search' | 'download';
  title: string;
  teaser: string;
  children: ReactChild | ReactFragment;
};

const InfoBox1: React.FC<InfoBox1Props> = ({
  icon,
  title,
  teaser,
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={`${classPrefix}basis`}>
      {icon === 'checkmark' && (
        <img
          src={`${basePath}/assets/images/icons/checkmark.svg`}
          alt="checkmark"
        />
      )}
      {icon === 'mail' && (
        <img
          src={`${basePath}/assets/images/icons/mail.svg`}
          alt="mail"
        />
      )}
      {icon === 'search' && (
        <img
          src={`${basePath}/assets/images/icons/search.svg`}
          alt="search"
        />
      )}
      {icon === 'download' && (
        <img
          src={`${basePath}/assets/images/icons/download.svg`}
          alt="download"
        />
      )}
      <h3>{title}</h3>
      <p>{teaser}</p>
      <span onClick={() => setExpanded(!expanded)}>
        <FaCircle /> Read {expanded ? 'less' : 'more'}
      </span>
      <div className={`more ${expanded ? 'open' : ''}`}>{children}</div>
    </div>
  );
};

export default InfoBox1;
