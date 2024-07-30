import React, { ReactChild, ReactFragment } from 'react';
import { IoIosArrowUp } from 'react-icons/io';


const classPrefix = 'collapsible__';

type CollapsibleColor = 'red'

type CollapsibleProps = {
  collapsed?: boolean;
  title: string;
  children: ReactChild | ReactFragment;
  color?: CollapsibleColor;
  id?: string;
  className?: string;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  collapsed,
  title,
  children,
  color = '',
  className = '',
  id,
}) => {
  const [isCollapsed, setCollapsed] = React.useState(collapsed);

  return (
    <div
      id={id}
      className={`${classPrefix}${isCollapsed ? 'collapsed' : 'expanded'} ${color} ${className}`}
    >
      <div
        className="header text-base"
        title={title}
        onClick={() => setCollapsed(!isCollapsed)}
      >
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
