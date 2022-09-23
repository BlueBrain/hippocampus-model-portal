import React from 'react';
import { Tooltip } from 'antd';

import { TermDescription } from '@/terms';

import style from './styles.module.scss';

type TermProps = {
  term: string;
  description?: string;
  className?: string;
};

type TermFormatter = (term: string) => string;

export const termFactory = (termDescription: TermDescription, termFormatter: TermFormatter) => {
  const Term: React.FC<TermProps> = ({ className, term, description }) => {
    const currentDescription = description || termDescription[term];
    const formattedTerm = termFormatter
      ? termFormatter(term)
      : term;

    console.log(term);
    console.log(formattedTerm);

    if (!currentDescription) {
      return (<span className={className}>{formattedTerm}</span>);
    }

    return (
      <Tooltip title={currentDescription} destroyTooltipOnHide={true}>
        <span className={`${style.container} ${className ?? ''}`}>{formattedTerm}</span>
      </Tooltip>
    );
  };

  return Term;
};
