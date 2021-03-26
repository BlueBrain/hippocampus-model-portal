import { GetServerSideProps } from 'next';

import ServerSideContext, { ServerSideContextType } from '../../context/server-side-context';
import SynapticPathwaysView from '../../views/predictions/SynapticPathways';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type SynapticPathwaysPageProps = {
  serverSideContext: ServerSideContextType,
}

export default function SynapticPathwaysPage({ serverSideContext }: SynapticPathwaysPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <SynapticPathwaysView />
    </ServerSideContext.Provider>
  );
}
