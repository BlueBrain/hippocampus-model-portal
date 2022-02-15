import React from 'react';
import { captureException } from '@sentry/nextjs';


type HttpDataProps = {
  path: string;
  label?: string;
  children: (
    data: any,
    loading: boolean,
    error: any,
  ) => React.ReactNode;
};

const HttpData: React.FC<HttpDataProps> = ({ path, children, label = '' }) => {
  const [state, setState] = React.useState<{
    data: any;
    loading: boolean;
    error: any;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    if (!path) return;

    setState({ ...state, loading: true });
    fetch(path)
      .then(async res => {
        // TODO: remove when factesheets don't longer contain NaN values
        if (res.ok) {
          const resBody = await res.text();
          return JSON.parse(resBody.replace(/NaN/g, 'null'));
        }

        const err = new Error(`Can't fetch ${path}`);
        captureException(err);
        return Promise.reject(err);
      })
      .then(data => setState({ ...state, data, error: null, loading: false }))
      .catch(error => setState({ ...state, error, data: null, loading: false }));
  }, [path]);

  if (!path) {
    return null;
  }

  if (state.loading || !state.data) {
    return <p>loading...</p>;
  }
  if (state.error) {
    return (
      <p>
        Fetching {label || 'data'} failed. The issue has been reported to developers.
      </p>
    );
  }

  return (
    <>
      {children(state.data, state.loading, state.error)}
    </>
  );
};

export default HttpData;
