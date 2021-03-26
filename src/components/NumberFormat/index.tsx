import React from 'react';

import isNumber from 'lodash/isNumber';


type NumberFormatProps = {
  value?: any;
  decimals?: number;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
};

const NumberFormat: React.FC<NumberFormatProps> = ({
  value,
  decimals = 2,
  thousandSeparator = true,
  prefix = '',
  suffix = '',
}) => {
  if (!isNumber(value)) return value;

  const fixed = parseFloat(value.toFixed(decimals));

  const formatted = thousandSeparator
    ? fixed.toLocaleString('en')
    : fixed;

  return `${prefix}${formatted}${suffix}`;
}


export default NumberFormat;
