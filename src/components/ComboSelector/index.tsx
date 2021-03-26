import React from 'react';

// import './style.scss';
import Selector from '../Selector';
import List from '../List';
import { Color } from '../../types';

const cssPrefix = 'combo-selector__';

export type ComboSelectorProps = {
  selector: React.ReactNode;
  list1: React.ReactNode;
  list2: React.ReactNode;
  list3?: React.ReactNode;
  selectorTitle?: string;
  listsTitle?: string;
  list1Open?: boolean;
  list2Open?: boolean;
  list3Open?: boolean;
  withGradient?: boolean;
};

const ComboSelector: React.FC<ComboSelectorProps> = ({
  selector,
  list1,
  list2,
  list3,
  selectorTitle = '',
  listsTitle = '',
  list1Open = true,
  list2Open = true,
  list3Open = true,
  withGradient = false,
}) => {
  return (
    <div className={`${cssPrefix}basis`}>
      <Selector title={selectorTitle} column>
        <>{selector}</>
      </Selector>
      <div>
        {(list1Open || list2Open) && (
          <p className="combo-boxes-header">{listsTitle}</p>
        )}
        <div className={`list-1 ${list1Open ? 'open' : ''}`}>{list1}</div>
        <div
          className={`list-2 ${list2Open ? 'open' : ''} ${withGradient &&
            'with-gradient'}`}
        >
          {list2}
        </div>
        {list3 && (
          <div
            className={`list-3 ${list3Open ? 'open' : ''} ${withGradient &&
              'with-gradient'}`}
          >
            {list3}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboSelector;
