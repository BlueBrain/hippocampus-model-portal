
import React from 'react';
import { useNexusContext } from '@bbp/react-nexus';

import { sscx } from '../../config';


type NexusFileProps = {
  hasData: boolean;
  contentUrl: string;
  children: (data: any) => React.ReactNode;
  id?: string;
};

const NexusFile: React.FC<NexusFileProps> = ({
  hasData,
  contentUrl,
  children,
}) => {
  const [state, setState] = React.useState<{
    data: any;
    loading: boolean;
    error: any;
  }>({
    data: [],
    loading: false,
    error: null,
  });
  const nexus = useNexusContext();

  React.useEffect(() => {
    if (hasData) {
      setState({ ...state, loading: true });
      nexus.File.get(
        sscx.org,
        sscx.project,
        contentUrl.split('/').reverse()[0],
        { as: 'blob' }
      )
        .then(data =>
          setState({ ...state, loading: false, data }),
        )
        .catch(error => setState({ ...state, loading: false, error }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData, contentUrl]);

  if (!hasData) {
    return null;
  }

  if (state.loading) {
    return <p>loading...</p>;
  }
  if (state.error) {
    return <p>An error happened loading the data... Please try again later.</p>;
  }

  return (
    <>
      {children(state.data)}
    </>
  );
};

export default NexusFile;
