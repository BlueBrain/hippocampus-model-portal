import { GetServerSideProps } from 'next';

import ServerSideContext, { ServerSideContextType } from '../../context/server-side-context';
import LayerAnatomyView from '../../views/experimental/LayerAnatomy';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type LayerAnatomyPageProps = {
  serverSideContext: ServerSideContextType,
}

export default function About({ serverSideContext }: LayerAnatomyPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <LayerAnatomyView />
    </ServerSideContext.Provider>
  );
}
