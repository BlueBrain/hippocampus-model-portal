import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ServerSideContext from '../../context/server-side-context';
import NeuronElectrophysiologyView from '../../views/experimental/NeuronElectrophysiology';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type NeuronElectrophysiologyPageProps = {
  serverSideContext: GetServerSidePropsContext,
}

export default function NeuronElectrophysiologyPage({ serverSideContext }: NeuronElectrophysiologyPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <NeuronElectrophysiologyView />
    </ServerSideContext.Provider>
  );
}
