import React from 'react';

import isNumber from 'lodash/isNumber';


type NumberFormatProps = {
  value?: any;
  significantFigures?: number;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
};

export function formatNumber(value, significantFigures = 5, thousandSeparator = true, prefix = '', suffix = '') {
  if (!isNumber(value)) return value;

  const formatted = thousandSeparator
    ? value.toLocaleString('en', { maximumSignificantDigits: significantFigures })
    : value.toPrecision(significantFigures);

  return `${prefix}${formatted}${suffix}`;
}

const NumberFormat: React.FC<NumberFormatProps> = ({
  value,
  significantFigures = 5,
  thousandSeparator = true,
  prefix = '',
  suffix = '',
}) => {
  return formatNumber(value, significantFigures, thousandSeparator, prefix, suffix);
}


export default NumberFormat;
