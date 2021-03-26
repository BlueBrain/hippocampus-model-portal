import React from 'react';

type UnitProps = {
  value?: string;
}

const replacement = {
  MOhm: 'MΩ',
};

const Unit: React.FC<UnitProps> = ({ value = '' }) => {
  return (
    <>
      {replacement[value] ?? value}
    </>
  );
};


export default Unit;
