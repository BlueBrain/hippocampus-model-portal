import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import ServerSideContext from '../../context/server-side-context';
import MicrocircuitView from '../../views/predictions/Microcircuit';


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serverSideContext: {
        query: context.query,
      },
    },
  }
}

type MicrocircuitPageProps = {
  serverSideContext: GetServerSidePropsContext,
}

export default function MicrocircuitPage({ serverSideContext }: MicrocircuitPageProps) {
  return (
    <ServerSideContext.Provider value={serverSideContext}>
      <MicrocircuitView />
    </ServerSideContext.Provider>
  );
}
