import React from 'react';


type NumberFormatProps = {
  value?: any;
  significantFigures?: number;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
};

export function formatNumber(value, significantFigures = 5, thousandSeparator = true, prefix = '', suffix = '') {
  const num = parseFloat(value);

  if (!Number.isFinite(num)) return value;

  const formatted = thousandSeparator
    ? num.toLocaleString('en', { maximumSignificantDigits: significantFigures })
    : num.toPrecision(significantFigures);

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
