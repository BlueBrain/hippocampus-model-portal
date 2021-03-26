import React, { useState, useEffect } from 'react';

import { Color } from '../../types';

// import './style.scss';

const classPrefixList = 'list__';
const classPrefixListElement = 'list-element__';

type ListProps = {
  title?: string;
  list: string[];
  value?: string;
  onSelect?: (s: string) => void;
  color?: Color;
  block?: boolean;
};

type ListElementProps = {
  element: string;
  selected?: boolean;
  onSelect?: (s: string) => void;
};

const ListElement: React.FC<ListElementProps> = ({
  element,
  selected,
  onSelect,
}) => {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      className={`${classPrefixListElement}basis ${selected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(element)}
    >
      {element}
    </div>
  );
};

const List: React.FC<ListProps> = ({
  title,
  list,
  value,
  onSelect = () => {},
  color,
}) => {
  const handleSelectedElement = (element: string) => onSelect(element);

  const id = title ? title.replace(/\s/g, '') : 'no_title';

  return (
    <div
      className={`${classPrefixList}basis bg-${color}`}
      role="radiogroup"
      aria-labelledby={`${classPrefixList}${id}`}
    >
      {title && <p>{title}</p>}
      <div className="elements">
        {list.map(el => (
          <ListElement
            key={`${el}`}
            element={el}
            selected={value === el}
            onSelect={handleSelectedElement}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
