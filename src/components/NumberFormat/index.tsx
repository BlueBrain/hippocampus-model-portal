import React from 'react';

import isNumber from 'lodash/isNumber';


type NumberFormatProps = {
  value?: any;
  decimals?: number;
  significantFigures?: number;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
};

const NumberFormat: React.FC<NumberFormatProps> = ({
  value,
  significantFigures = 5,
  thousandSeparator = true,
  prefix = '',
  suffix = '',
}) => {
  if (!isNumber(value)) return value;

  const fixed = parseFloat(value.toPrecision(significantFigures));

  const formatted = thousandSeparator
    ? fixed.toLocaleString('en')
    : fixed;

  return `${prefix}${formatted}${suffix}`;
}


export default NumberFormat;
