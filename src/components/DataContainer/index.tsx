import React from 'react';

import ScrollTo from '../../components/ScrollTo';


const classPrefix = 'data-container__';

type DataContainerProps = {
  visible?: boolean;
  children: React.ReactNode
};

const DataContainer: React.FC<DataContainerProps> = ({
  visible = true,
  children,
}) => {
  return (
    <>
      {visible && (
        <div className={`${classPrefix}basis`}>
          <div className="center">{children}</div>
          <div className="scroll-to">
            <ScrollTo anchor="filters" direction="up">
              Return to selectors
            </ScrollTo>
          </div>
        </div>
      )}
    </>
  );
};

export default DataContainer;
