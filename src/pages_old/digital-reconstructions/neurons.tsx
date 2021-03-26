import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ServerSideContext from '../../context/server-side-context';
import NeuronsView from '../../views/digitalReconstructions/Neurons';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type NeuronsPageProps = {
  serverSideContext: GetServerSidePropsContext,
}

export default function NeuronsPage({ serverSideContext }: NeuronsPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <NeuronsView />
    </ServerSideContext.Provider>
  );
}
