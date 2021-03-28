import Head from 'next/head';

import MainLayout from '../../layouts/MainLayout';
import NeuronMorphologyView from '../../views/experimental/NeuronMorphology';


export default function About() {
  return (
    <MainLayout>
      <Head>
        <script defer src="https://www.unpkg.com/systemjs@6.1.7/dist/system.js"></script>
        <script defer src="https://www.unpkg.com/systemjs@6.1.7/dist/extras/named-exports.js"></script>
        <script type="systemjs-importmap" src="/model/systemjs-importmap.json"></script>
      </Head>
      <NeuronMorphologyView />
    </MainLayout>
  );
};
