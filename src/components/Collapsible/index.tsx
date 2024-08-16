import React, { ReactChild, ReactFragment } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const classPrefix = 'collapsible__';

type CollapsibleColor = 'red';

type CollapsibleProps = {
  collapsed?: boolean;
  title: string;
  properties?: any[];
  children: ReactChild | ReactFragment;
  color?: CollapsibleColor;
  id?: string;
  className?: string;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  collapsed,
  title,
  properties = [],
  children,
  color = '',
  className = '',
  id,
}) => {
  const [isCollapsed, setCollapsed] = React.useState(collapsed);

  return (
    <div
      id={id}
      className={`collapsabe  ${classPrefix}${isCollapsed ? 'collapsed' : 'expanded'} ${color}`}
    >
      <div
        className="header text-sm lg:text-lg"
        title={title}
        onClick={() => setCollapsed(!isCollapsed)}
      >
        {properties.length > 0 && (
          <div className="properties" style={{ display: 'inline' }}>
            {properties.map((property, index) => (
              <div key={index} className="collapsible-property" style={{ display: 'inline' }}>
                {property}
                {index < properties.length - 1 && ''}
              </div>
            ))}
          </div>
        )}
        <span>{title}</span>

        <span className="arrow">
          <IoIosArrowUp />
        </span>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Collapsible;