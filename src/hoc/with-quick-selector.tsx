import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuickSelector from '@/components/QuickSelector';
import { Color } from '@/types';


type QuickSelectionProps = {
  entries: Array<{
    title: string;
    key: string;
    values: Array<string>;
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

    const setQs = (query) => {
      setQuickSelection(query);
      router.push({ query }, undefined, { shallow: true });
    };

    useEffect(() => {
      if (!router.isReady) return;

      const stateObj = getStateObj(router);
      setQuickSelection(stateObj);
    }, [router.query]);

    const entries = qsParams.entries.map(entry => ({
      ...entry,
      currentValue: quickSelection[entry.key] || '',
      onChange: (param) => {
        setQs({ [entry.key]: param });
      },
    }));

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
