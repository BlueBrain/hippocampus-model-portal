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
};

const List: React.FC<ListProps> = ({
  title,
  list,
  value,
  onSelect = () => { },
  color,
  anchor = '',
  className = '',
}) => {
  const handleSelectedElement = (element: string) => {
    const target = anchor && document.querySelector(`#${anchor}`);
    if (target) {
      window.setTimeout(() => target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' }), 0);
    }
    onSelect(element);
  }

  const id = title ? title.replace(/\s/g, '') : 'no_title';

  return (
    <div
      className={`${classPrefixList}basis bg-${color} ${className}`}
      role="radiogroup"
      aria-labelledby={`${classPrefixList}${id}`}
    >
      {title && <p>{title}</p>}
      <div className="elements">
        {list.map(element => (
          <div
            key={element}
            role="radio"
            aria-checked={value === element}
            tabIndex={0}
            className={`${classPrefixListElement}basis ${value === element ? 'selected' : ''}`}
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
