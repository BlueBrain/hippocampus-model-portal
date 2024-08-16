import React from 'react';
import { useRouter } from 'next/router';

import { QuickSelectorEntry } from '@/types';

type QuickSelectorProps = {
  entries: QuickSelectorEntry[];
};

const QuickSelector: React.FC<QuickSelectorProps> = ({ entries }) => {
  const router = useRouter();

  const handleChange = (entry: QuickSelectorEntry, value: string) => {
    if (entry.setFn) {
      entry.setFn(value);
    } else {
      const query = { ...router.query };
      if (entry.paramsToKeepOnChange) {
        for (const key in query) {
          if (!entry.paramsToKeepOnChange.includes(key)) {
            delete query[key];
          }
        }
      }
      query[entry.key] = value;
      router.push({ query }, undefined, { shallow: true });
    }
  };

  const getValues = (entry: QuickSelectorEntry): string[] => {
    if (entry.values) {
      return entry.values;
    }
    if (entry.getValuesFn && entry.getValuesParam) {
      const param = router.query[entry.getValuesParam] as string;
      return entry.getValuesFn(param);
    }
    return [];
  };

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.key}>
          <label>{entry.title}</label>
          <select
            value={router.query[entry.key] as string}
            onChange={(e) => handleChange(entry, e.target.value)}
          >
            <option value="">Select {entry.title}</option>
            {getValues(entry).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default QuickSelector;