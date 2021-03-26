import React from 'react';
import { useNexusContext } from '@bbp/react-nexus';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

import { hippocampus } from '../../config';


type ESDataProps = {
  query: Record<string, unknown> | null;
  children: (
    data: ElasticSearchViewQueryResponse<any>['hits']['hits'] | null,
    loading: boolean,
    error: any,
  ) => React.ReactNode;
};

const ESData: React.FC<ESDataProps> = ({
  query,
  children,
}) => {
  const [state, setState] = React.useState<{
    data: ElasticSearchViewQueryResponse<any>['hits']['hits'] | null;
    loading: boolean;
    error: any;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  const nexus = useNexusContext();

  React.useEffect(() => {
    if (query) {
      setState({ ...state, loading: true, data: null });
      nexus.View.elasticSearchQuery(
        hippocampus.org,
        hippocampus.project,
        hippocampus.datasetViewId,
        query,
      )
        .then(data =>
          setState({ ...state, loading: false, data: data.hits.hits }),
        )
        .catch(error => setState({ ...state, loading: false, error }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      {children(state.data, state.loading, state.error)}
    </>
  );
};

export default ESData;
