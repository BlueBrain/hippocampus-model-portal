import React, { useEffect, useState } from 'react';
import { Color } from '../../types';

const classPrefix = 'title__';

type TitleProps = {
  title?: React.ReactChild;
  subtitle?: string;
  primaryColor?: Color;
  theme?: number | null;
  hint?: string;
  primary?: boolean;
  isDark?: boolean;
};

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  theme = 1,
  primary,
  isDark = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('isDark:', isDark); // Debugging statement
    setIsVisible(true);
  }, [isDark]);

  return (
    <div
      className={`${classPrefix}basis ${primary ? 'primary' : ''} theme-${theme}`}
    >
      {subtitle && !primary && (
        <h4
          className={`text-xl text-theme-${theme} m duration-1000 delay-200 transition-opacity transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {subtitle}
        </h4>
      )}
      {title && (
        <h2
          role="title"
          className={`text-3xl border-theme-${theme} transition-transform duration-1000 ${isVisible ? 'translate-y-0' : 'translate-y-20'} ${isDark ? 'text-black' : 'text-white'}`}
        >
          {title}
        </h2>
      )}
    </div>
  );
};

export default Title;