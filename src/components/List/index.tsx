import React from 'react';

import { Color } from '../../types';


const classPrefixList = 'list__';
const classPrefixListElement = 'list-element__';

type ListProps = {
  title?: string;
  list: string[];
  value?: string;
  onSelect?: (s: string) => void;
  color?: Color;
  anchor?: string;
  block?: boolean;
  className?: string;
  theme?: number;
};

const List: React.FC<ListProps> = ({
  title,
  list,
  value,
  onSelect = () => { },
  color,
  theme = 1,
  className = '',
  block = false,
}) => {
  const handleSelectedElement = (element: string) => onSelect(element);

  return (
    <div
      className={`${classPrefixList}basis set-accent-color--${color} selected theme-${theme} ${className} ${block ? 'block' : ''}`}
      role="radiogroup"
    >
      {title && <p className={`theme-${theme}`}>{title}</p>}
      <div className="elements">
        {list.map(element => (
          <div
            key={element}
            role="radio"
            aria-checked={value === element}
            tabIndex={0}
            className={`${classPrefixListElement}basis theme-${theme} ${value === element ? 'selected ' : ''}`}
            onClick={() => handleSelectedElement(element)}
            title={element}
          >
            {element}
          </div>

        ))}
      </div>
    </div>
  );
};

export default List;
