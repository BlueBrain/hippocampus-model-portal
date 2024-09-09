import React from 'react';
import { useRouter } from 'next/router';

import { QuickSelectorEntry } from '@/types';
import style from './styles.module.scss';

type QuickSelectorProps = {
  entries: QuickSelectorEntry[]
  theme?: number;
};

const QuickSelector: React.FC<QuickSelectorProps> = ({ entries, theme }) => {
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
        <div className={style.container}>
          <div key={entry.key} className="flex flex-col mb-4">
            {entry.sliderRange ? (
              <>
                <div className="flex justify-between items-center">
                  <label className={style.label}>{entry.title}</label>
                  <span className={style.label}>
                    {router.query[entry.key] || entry.sliderRange[0]}
                  </span>
                </div>
                <div className="w-full">
                  <input
                    type="range"
                    min={0}
                    max={entry.sliderRange.length - 1}
                    step={1}
                    value={entry.sliderRange.indexOf(Number(router.query[entry.key]))}
                    onChange={(e) => {
                      const index = Number(e.target.value);
                      handleChange(entry, entry.sliderRange[index].toString());
                    }}
                    className={`${style.slider} w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer`}
                  />
                </div>
              </>

            ) : (
              <>
                <label className={style.label}>{entry.title}</label>
                <select
                  className={`${style.select} ${theme ? style[`theme-${theme}`] : ''}`}
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
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickSelector;