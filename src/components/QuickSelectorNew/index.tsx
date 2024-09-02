import React from 'react';
import { useRouter } from 'next/router';

import { QuickSelectorEntry } from '@/types';
import style from './styles.module.scss';
import withPreselection from '@/hoc/with-preselection';
import NeuronElectrophysiologyPage from '@/pages/experimental-data/neuronal-electrophysiology';

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
        <div key={entry.key} className="flex flex-col mb-2">
          <label className={style.label}>{entry.title}</label>
          {entry.sliderRange ?
            <input
              id="xAxisSlider"
              type="range"
              min={0}
              max={10}
              step={1}
              value={5}
              onChange={(e) => { console.log("change") }}
              className={`${style.slider}`}
            />
            :

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
          }

        </div>
      ))}
    </div>
  );
};

export default QuickSelector;