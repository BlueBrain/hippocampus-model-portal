import React from 'react';
import { ElasticSearchViewQueryResponse } from '@bbp/nexus-sdk';

export type DataFilterProps<T = {}> = {
  type: string;
  data: ElasticSearchViewQueryResponse<T>['hits']['hits'];
  children: (data: T[]) => void;
};

/**
 * Give an ES result:
 * - it filters out the results that don't match the given @type
 * - returns an array of sources matching the given @type
 */
const DataFilter: <T>(
  props: DataFilterProps<T>,
) => React.ReactElement<DataFilterProps<T>> = ({ data, type, children }) => {
  const [state, setState] = React.useState({
    data: [],
    error: false,
  });

  React.useEffect(() => {
    try {
      const matchingTypes = data
        // @ts-ignore
        .filter(hit => hit._source['@type'].includes(type))
        .map(hit => hit._source);
      // @ts-ignore
      setState({ error: false, data: matchingTypes });
    } catch (error) {
      setState({ error: true, data: [] });
    }
  }, [data, type]);

  return <>{children(state.data)}</>;
};

export default DataFilter;
