import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

type PreselectionProps = {
  key: string,
  defaultQuery: any,
};

const withPreselection = (WrappedComponent, options: PreselectionProps) => {

  const WithPreselectionComponent: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
      if (!router.isReady) return;

      if (!router.query[options.key]) {
        const query = options.defaultQuery;
        router.replace({ query }, undefined, { shallow: true });
      }
    }, [router.query]);

    return (<WrappedComponent />);
  };

  return WithPreselectionComponent;
}

export default withPreselection;
