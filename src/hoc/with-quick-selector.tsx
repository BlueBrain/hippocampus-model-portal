import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuickSelector from '@/components/QuickSelector';
import { Color } from '@/types';

type Entry = {
  title: string;
  key: string;
  values?: Array<string>;
  getValuesFn?: Function;
  getValuesParam?: string | Array<string>;
  paramsToKeepOnChange?: Array<string>;
};

type QuickSelectionProps = {
  entries: Array<Entry>;
  color: Color;
};

const withQuickSelector = (WrappedComponent, qsProps: QuickSelectionProps) => {

  const getStateObj = (router) => qsProps.entries.reduce(
    (state, entry) => {
      state[entry.key] = router.query[entry.key] || null;
      return state;
    },
    {},
  );

  const WithQuickSelectorComponent: React.FC = () => {
    const router = useRouter();

    const initialStateObj = getStateObj(router);

    const [quickSelection, setQuickSelection] = useState(initialStateObj);

    const allEntriesAreSet = (qsQuery) => qsProps.entries.every(entry => (
      !!qsQuery[entry.key]
    ));

    const setQs = (qsQuery) => {
      setQuickSelection(qsQuery);

      if (allEntriesAreSet(qsQuery)) {
        router.push({ query: qsQuery }, undefined, { shallow: true });
      }
    };

    useEffect(() => {
      if (!router.isReady) return;

      const stateObj = getStateObj(router);
      setQuickSelection(stateObj);
    }, [router.query]);

    const getValues = (entry: Entry) => {
      if (!entry?.values && !entry?.getValuesParam) return [];

      if (entry.values?.length) return entry.values;

      if (Array.isArray(entry.getValuesParam)) {
        const args = entry.getValuesParam.map(param => (
          quickSelection[param]
        ));
        return entry.getValuesFn(...args);
      }

      if (typeof(entry.getValuesParam) === 'string') {
        return entry.getValuesFn(quickSelection[entry.getValuesParam]);
      }
    };

    const getQsQuery = (changedParam: string, entry: Entry) => {
      // using this that sets the nulls because the quickSelection is async
      return Object.entries(quickSelection).reduce((acc, [key, value]) => {
        if (key === entry.key) {
          acc[key] = changedParam;
        }
        else if (entry.paramsToKeepOnChange?.includes(key)) {
          acc[key] = value;
        } else {
          acc[key] = '';
        }
        return acc;
      }, {});
    };

    const entries = qsProps.entries.map(entry => ({
      title: entry.title,
      values: getValues(entry),
      currentValue: quickSelection[entry.key] || null,
      onChange: (param) => {
        setQs(getQsQuery(param, entry));
      },
    }));

    return (<>
      <QuickSelector
        color={qsProps.color}
        entries={entries}
      />
      <WrappedComponent />
    </>);
  };

  return WithQuickSelectorComponent;
}

export default withQuickSelector;
