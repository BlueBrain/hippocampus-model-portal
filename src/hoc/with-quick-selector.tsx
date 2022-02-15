import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuickSelector from '@/components/QuickSelector';
import { Color } from '@/types';

type QuickSelectionProps = {
  entries: Array<{
    title: string;
    key: string;
    values?: Array<string>;
    getValuesFn?: Function;
    getValuesParam?: string;
    paramsToKeepOnChange?: Array<string>;
  }>;
  color: Color;
};

const withQuickSelector = (WrappedComponent, qsParams: QuickSelectionProps) => {

  const getStateObj = (router) => qsParams.entries.reduce(
    (state, entry) => {
      state[entry.key] = router.query[entry.key] || '';
      return state;
    },
    {},
  );

  const withQuickSelectorComponent: React.FC = () => {
    const router = useRouter();

    const initialStateObj = getStateObj(router);

    const [quickSelection, setQuickSelection] = useState(initialStateObj);

    const allEntriesAreSet = (qsQuery) => qsParams.entries.every(entry => (
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

    const entries = qsParams.entries.map(entry => {
      const currentValue = quickSelection[entry.key] || '';

      const values = entry.values
        ? entry.values
        : entry.getValuesFn(quickSelection[entry.getValuesParam]);

      // using this that sets the nulls because the quickSelection is async
      const getQsQuery = (changedParam) => {
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

      return {
        title: entry.title,
        values: values || [],
        currentValue,
        onChange: (param) => {
          setQs(getQsQuery(param));
        },
      };
    });

    return (<>
      <QuickSelector
        color={qsParams.color}
        entries={entries}
      />
      <WrappedComponent />
    </>);
  };

  return withQuickSelectorComponent;
}

export default withQuickSelector;
