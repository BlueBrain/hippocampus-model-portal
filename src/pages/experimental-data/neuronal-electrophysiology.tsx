import Head from 'next/head';

import MainLayout from '../../layouts/MainLayout';
import NeuronEphysView from '../../views/experimental/NeuronElectrophysiology';


export default function About() {
  return (
    <MainLayout>
      <Head>
        <script key="sysjs" src="https://www.unpkg.com/systemjs@6.1.7/dist/system.js" />
        <script key="sysjs-named-exports" src="https://www.unpkg.com/systemjs@6.1.7/dist/extras/named-exports.js" />
        <script key="sysjs-importmap" type="systemjs-importmap" src="/model/systemjs-importmap.json" />
      </Head>

      <NeuronEphysView />
    </MainLayout>
  );
};
