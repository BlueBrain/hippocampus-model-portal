import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import DistibutionPlot from '@/components/DistributionPlot';

import selectorStyle from '@/styles/selector.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { basePath } from '@/config';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import List from '@/components/List';
import { cellGroup, defaultSelection } from '@/constants';
import { Layer, VolumeSection } from '@/types';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { downloadAsJson } from '@/utils';
import LaminarGraph from '@/components/LaminarGraph';


const SynapsesView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ volume_section, prelayer, postlayer });
  const [connViewerReady, setConnViewerReady] = useState<boolean>(false);
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>({});
  const [laminarPlots, setLaminarPlots] = useState<Record<string, boolean>>({});

  const theme = 3;

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.prelayer && !router.query.volume_section && !router.query.postlayer) {
      const query = defaultSelection.digitalReconstruction.synapticPathways;
      const { volume_section, prelayer, postlayer } = query;
      setQuickSelection({ volume_section, prelayer, postlayer });
      router.replace({ query }, undefined, { shallow: true });
    } else {
      setQuickSelection({ volume_section, prelayer, postlayer });
    }
  }, [router.query]);

  const setVolumeSectionQuery = (volume_section: VolumeSection) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, volume_section };
      setParams(updatedSelection);
      setSelectedPlot(null);
      return updatedSelection;
    });
  };

  const setPreLayerQuery = (prelayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, prelayer };
      setParams(updatedSelection);
      setSelectedPlot(null);
      return updatedSelection;
    });
  };

  const setPostLayerQuery = (postlayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, postlayer };
      setParams(updatedSelection);
      setSelectedPlot(null);
      return updatedSelection;
    });
  };

  useEffect(() => {
    setConnViewerReady(false);
  }, [prelayer, postlayer]);

  useEffect(() => {
    if (volume_section && prelayer && postlayer) {
      const distributionPlotFile = `${basePath}/data/digital-reconstruction/connection-physiology/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      const ConnectionsFile = `${basePath}/data/digital-reconstruction/connection-physiology/${volume_section}/${prelayer}-${postlayer}/Connections.json`;

      // Fetch data from Connections.json for laminar distribution
      fetch(ConnectionsFile)
        .then(response => response.json())
        .then(scData => {
          const laminarData = scData.values.find(plot => plot.id === 'laminar-distribution');
          laminarData && setLaminarPlots(laminarData);
        })
        .catch(error => console.error('Error fetching schaffer-collaterals data:', error));

      // Fetch data from distributionPlotFile only
      fetch(distributionPlotFile)
        .then(response => response.json())
        .then(distributionData => {
          if (distributionData && Array.isArray(distributionData.values)) {
            const plots = distributionData.values;

            const availablePlots = {
              boutonDenstiy: plots.some(plot => plot.id === 'bouton-density'),
              sampleConvergenceByConnection: plots.some(plot => plot.id === 'sample-convergence-by-connection'),
              sampleConvergenceBySynapses: plots.some(plot => plot.id === 'sample-convergence-by-synapse'),
              sampleDivergenceConnections: plots.some(plot => plot.id === 'sample-divergence-by-connection'),
              sampleDivergenceBySynapses: plots.some(plot => plot.id === 'sample-divergence-by-synapse'),
            };

            setAvailablePlots(availablePlots);
            setFactsheetData([...plots]);
          } else {
            console.error('Unexpected data format:', distributionData);
          }
        })
        .catch(error => console.error('Error fetching factsheet:', error));
    }
  }, [volume_section, prelayer, postlayer]);

  const getPlotDataById = (id: string) => {
    return factsheetData?.find((plot: any) => plot.id === id);
  };

  return (
    <>
      <Filters theme={theme} hasData={!!prelayer && !!postlayer}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Connection Physiology"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We assigned <Link href={"/experimental-data/connection-physiology/"} className={`link theme-${theme}`}>synapse properties</Link> to the <Link href={"/digital-reconstructions/connection-anatomy/"} className={`link theme-${theme}`}>established connections</Link>. For each circuit, each pathway is analyzed in terms of PSP, latency, kinetics, NMDA/AMPA ratio, and short-term plasticity.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
            <div className={`selector__column selector__column--lg mt-3 theme-${theme}`} style={{ maxWidth: "auto" }}>
              <div className={`selector__head theme-${theme}`}>1. Select a volume section</div>
              <div className="selector__body">
                <VolumeSectionSelector3D
                  value={volume_section}
                  onSelect={setVolumeSectionQuery}
                  theme={theme}
                />
              </div>

            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
              <div className={`selector__column theme-${theme} flex-1`} style={{ maxWidth: "auto" }}>
                <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={prelayer}
                    title="m-type"
                    color={colorName}
                    onSelect={setPreLayerQuery}
                    theme={theme} />
                </div>
              </div><div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>2. Select a post-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={postlayer}
                    title="m-type"
                    color={colorName}
                    onSelect={setPostLayerQuery}
                    theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer theme={theme}
        navItems={[
          { id: 'BoutonDenstiySection', label: 'Bouton density' },
          { id: 'SampleConvergenceByConnectionSection', label: 'Sample convergence by connection' },
          { id: 'SampleConvergenceBySynapsesSection', label: 'Sample convergence by synapses' },
          { id: 'LaminarDistributionSection', label: 'Laminar distribution' },
          { id: 'SampleDivergenceConnectionsSection', label: 'Sample divergence by connection' },
          { id: 'SampleDivergenceBySynapsesSection', label: 'Sample divergence by synapses' },
        ]}
      >

        {availablePlots.boutonDenstiy && (
          <Collapsible title="Bouton Desnity" id="BoutonDenstiySection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('bouton-density')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('bouton-density'), `bouton-density-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Bouton density
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.sampleConvergenceByConnection && (
          <Collapsible title="Sample convergence by connection" id="SampleConvergenceByConnectionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-connection')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-connection'), `sample-convergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Sample convergence by connection
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.sampleConvergenceBySynapses && (
          <Collapsible title="Sample convergence by synapses" id="SampleConvergenceBySynapsesSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-synapse')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-synapses'), `sample-convergence-by-synapses-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Sample convergence by synapses
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {laminarPlots && (
          <Collapsible title='Laminar distribution of synapses' id='LaminarDistributionSection'>
            <LaminarGraph data={laminarPlots} title={undefined} yAxisLabel={undefined} />
          </Collapsible>
        )}

        {availablePlots.sampleDivergenceConnections && (
          <Collapsible title="Sample divergence by connection" id="SampleDivergenceByConnectionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-connection')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-connection'), `sample-divergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Sample divergence by connection
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.sampleDivergenceBySynapses && (
          <Collapsible title="Sample divergence by synapses" id="SampleDivergenceBySynapsesSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-synapse')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-synapses'), `sample-divergence-by-synapses-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Sample divergence by synapses
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}


      </DataContainer >
    </>
  );
};


export default SynapsesView;
