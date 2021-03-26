import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import MainLayout from '../../layouts/MainLayout';
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
      <MainLayout>
        <Head>
          <script defer src="https://www.unpkg.com/systemjs@6.1.7/dist/system.js"></script>
          <script defer src="https://www.unpkg.com/systemjs@6.1.7/dist/extras/named-exports.js"></script>
          <script type="systemjs-importmap" src="/model/systemjs-importmap.json"></script>
        </Head>
        <NeuronMorphologyView />
      </MainLayout>
    </ServerSideContext.Provider>
  );
}