import React from 'react';

import { Color } from '../../types';


const classPrefix = 'title__';

type TitleProps = {
  title?: React.ReactChild;
  subtitle?: string;
  primaryColor?: Color;
  theme?: number;
  hint?: string;
  primary?: boolean;
};

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  hint,
  theme = 1,
  primaryColor = 'yellow' as Color,
  primary,
}) => {
  return (
    <div
      className={`${classPrefix}basis ${primary ? 'primary' : ''
        } ${theme}`}
    >
      {subtitle && !primary && <h4 className={"text-theme-" + theme}>{subtitle}</h4>}
      {title && <h2 role="title" className={"text-white border-theme-" + theme}>{title}</h2>}
      {subtitle && primary && <h4 className="text-white">{subtitle}</h4>}
      {hint && <p dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  );
};

export default Title;
