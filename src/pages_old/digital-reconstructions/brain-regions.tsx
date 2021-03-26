import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ServerSideContext from '../../context/server-side-context';
import BrainRegionsView from '../../views/digitalReconstructions/BrainRegions';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type BrainRegionsPageProps = {
  serverSideContext: GetServerSidePropsContext,
}

export default function BrainRegionsPage({ serverSideContext }: BrainRegionsPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <BrainRegionsView />
    </ServerSideContext.Provider>
  );
}
