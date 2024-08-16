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

import selectorStyle from '@/styles/selector.module.scss';


const SchafferCollateralsView: React.FC = () => {

  const theme = 3;

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <Row
          className="w-100"
          gutter={[0, 20]}
        >
          <Col
            className="mb-2"
            xs={24}
            lg={12}
          >
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Schaffer collaterals"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Reconstruction of the Schaffer collaterals, the major input to the CA1. This massive innervation accounts for 9,122 M synapses, and most of the synapses considered in the model (92%).
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </Col>
          <Col
            className={`set-accent-color--${'grey'} mb-2`}
            xs={24}
            lg={12}
          >
            <div className={selectorStyle.selector} style={{ maxWidth: '26rem' }}>
              <div className={selectorStyle.selectorColumn}>
                {/* <div className={selectorStyle.selectorHead}></div> */}
                <div className={selectorStyle.selectorBody}>
                  <Image
                    src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=Selector&font=bebas"
                    width="640"
                    height="480"
                    unoptimized
                    alt=""
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer
        theme={theme}
        navItems={[
          { label: 'Anatomy', isTitle: true },
          { id: 'NbSynapsesPerConnectionSection', label: 'Nb of synapses p.connection dist.' },
          { id: 'DivergenceConnectionSection', label: 'Divergence connections dist.' },
          { id: 'DivergenceSynapsesSection', label: 'Divergence synapses dist.' },
          { id: 'LaminarDistributionSynapsesSection', label: 'Laminar dist. of synapses' },
          { id: 'SampleConvergenceByConnectionSection', label: 'Convergence connections dist.' },
          { id: 'SampleConvergenceBySynapsesSection', label: 'Convergence synapses dist.' },
          { id: 'MeanConnectionProbabilitySection', label: 'Mean connection probability' },
          { label: 'Physiology', isTitle: true },
          { id: 'PSPAmplitudeSection', label: 'PSP Amplitude dist.' },
          { id: 'PSPCVSection', label: 'PSP CV dist.' },
          { id: 'SynapseLatencySection', label: 'Synapse latency dist.' },
          { id: 'RiseTimeSection', label: 'Rise time constant dist.' },
          { id: 'DecayTimeConstantSection', label: 'Decay time constant dist.' },
          { id: 'ShortTermPlasticitySection', label: 'Short-term plasticity: average traces' },
          { id: 'NMDAAMPARatioSection', label: 'NMDA/AMPA ratio dist.' },
          { id: 'UParameterSection', label: 'U, D, F, NRRP dist.' },
          { id: 'TracesSection', label: 'Traces' },
        ]}>

        {availablePlots.SynapsesPerConnection && (
          <Collapsible title="Number of synapses per connection distribution + mean and std" id="NbSynapsesPerConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('synapses-per-connection')}
                xAxis='N_syn'
                yAxis='Frequency'
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('synapses-per-connection'), `Synapses-per-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Number of synapses per connection distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.SampleDivergenceByConnection && (
          <Collapsible title="Divergence (connections) distribution + mean and std" id="DivergenceConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-divergence-by-connection')}
                xAxis='Divergence'
                yAxis='Frequency'
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-connection'), `sample-divergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Divergence (connections) distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.SampleDivergenceBySynapse && (
          <Collapsible title="Divergence (synapses) distribution + mean and std" id="DivergenceSynapsesSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-divergence-by-synapse')}
                xAxis='Divergence'
                yAxis='Frequency'
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-synapses'), `sample-divergence-by-synapses-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Divergence (synapses) distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}


        <Collapsible title='Laminar distribution of synapses' id='LaminarDistributionSynapsesSection' properties={["Anatomy"]}>
          <p>Laminar</p>
          <LaminarGraph data={laminarPlots} title={undefined} yAxisLabel={undefined} />
        </Collapsible>

        <Collapsible id="physiologySection" title="Physiology">
          <p>We used available <Link href={"/reconstruction-data/schaffer-collaterals"}>data</Link> to predict the physiology of the SC. The synapses between CA3 and CA1 can be analyzed in terms of PSP, latency, kinetics, NMDA/AMPA ratio, and short-term plasticity.</p>
        </Collapsible>

      </DataContainer >
    </>
  );
};


export default SchafferCollateralsView;
