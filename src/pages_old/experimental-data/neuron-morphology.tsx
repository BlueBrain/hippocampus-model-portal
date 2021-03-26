import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ServerSideContext from '../../context/server-side-context';
import NeuronMorphologyView from '../../views/experimental/NeuronMorphology';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type AboutPageProps = {
  serverSideContext: GetServerSidePropsContext,
}

export default function About({ serverSideContext }: AboutPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <NeuronMorphologyView />
    </ServerSideContext.Provider>
  );
}
