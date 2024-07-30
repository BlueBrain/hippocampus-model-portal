import React, { useEffect, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`${classPrefix}basis ${primary ? 'primary' : ''} ${theme}`}
    >
      {subtitle && !primary && (
        <h4 className={`text-xl text-theme-${theme} m duration-1000 delay-200 transition-opacity transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} >
          {subtitle}
        </h4>
      )}
      {title && (
        <h2 role="title" className={`text-white text-3xl border-theme-${theme} transition-transform duration-1000  ${isVisible ? 'translate-y-0' : 'translate-y-20'}`} >
          {title}
        </h2>
      )}
    </div>
  );
};

export default Title;