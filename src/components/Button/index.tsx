import React, { ReactChild, ReactFragment } from 'react';


const classPrefix = 'button__';

type ButtonProps = {
  primary?: boolean;
  active?: boolean;
  large?: boolean;
  discrete?: boolean;
  width?: number;
  notifications?: number;
  onClick?: (e: any) => void;
  children: ReactChild | ReactFragment;
  uppercase?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  primary,
  active,
  discrete,
  width,
  notifications,
  onClick,
  children,
  large,
  uppercase,
}) => {
  return (
    <button
      style={{ width: width }}
      onClick={onClick}
      className={`${classPrefix}basis ${primary ? 'primary' : ''} ${
        discrete ? 'discrete' : ''
      } ${active ? 'active' : ''} ${large ? 'large' : ''} ${
        uppercase ? 'uppercase' : ''
      }`}
    >
      {children}
      {notifications && <span className="notifications">{notifications}</span>}
    </button>
  );
};

export default Button;
