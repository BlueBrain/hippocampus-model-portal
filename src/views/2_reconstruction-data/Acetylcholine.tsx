import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';

import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import NeuronsGraph from './acetylcholine/NeuronsGraph';
import SynapsesGraph from './acetylcholine/SynapsesGraph';

import selectorStyle from '@/styles/selector.module.scss';

const AcetylcholineView: React.FC = () => {

  const theme = 2;

  return (
    <>
      <Filters theme={theme}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
          {/* Title and Info */}
          <div className="w-full mb-12 md:mb-0">
            <StickyContainer>
              <Title
                title="Acetylcholine"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Using data from <Link className={"link theme-" + theme} href={"/experimental-data/acetylcholine/"}>literature</Link>, we derive a dose-effect behavior of a tonic application of ACh on neurons and synapses.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
        </div>
      </Filters>

      <DataContainer theme={theme} navItems={[
        { id: 'neuronsSection', label: 'Neurons' },
        { id: 'synapsesSection', label: 'Synapses' },
      ]}>

        <Collapsible id="neuronsSection" title="Neurons" className="mt-4">
          <p className='text-lg mb-4'>The net effect of ACh on CA1 neurons results in a depolarising current. The dose-effect relationship can be described with a Hill function.</p>
          <NeuronsGraph theme={theme} />
        </Collapsible>

        <Collapsible id="synapsesSection" title="Synapses" className="mt-4">
          <p className='text-lg mb-4'>The net effect of ACh on CA1 synapses results in an increase of the initial release probability (i.e. U parameter of TM synapse model). The dose-effect relationship can be described with a Hill function.</p>
          <SynapsesGraph theme={theme} />
        </Collapsible>

      </DataContainer >
    </>
  );
};

export default AcetylcholineView;