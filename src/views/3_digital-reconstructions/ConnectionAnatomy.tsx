import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import DistibutionPlot from '@/components/DistributionPlot';
import DownloadButton from '@/components/DownloadButton';
import List from '@/components/List';
import QuickSelector from '@/components/QuickSelector';

import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';

import { cellGroup, defaultSelection, volumeSections } from '@/constants';
import { Layer, QuickSelectorEntry, VolumeSection } from '@/types';
import { dataPath } from '@/config';

import { downloadAsJson } from '@/utils';


const ConnectionsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ volume_section, prelayer, postlayer });
  const [connViewerReady, setConnViewerReady] = useState<boolean>(false);
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>({});

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



  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Volume section',
      key: 'volume_section',
      values: volumeSections,
      setFn: setVolumeSectionQuery,
    },
    {
      title: 'Pre-synaptic cell group',
      key: 'prelayer',
      values: cellGroup,
      setFn: setPreLayerQuery,
    },
    {
      title: 'Post-synaptic cell group',
      key: 'postlayer',
      values: cellGroup,
      setFn: setPostLayerQuery,
    },
  ];

  useEffect(() => {
    setConnViewerReady(false);
  }, [prelayer, postlayer]);

  useEffect(() => {
    if (volume_section && prelayer && postlayer) {
      const filePath = `${dataPath}/3_digital-reconstruction/connection-anatomy/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      fetch(filePath)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.values)) {
            const plots = data.values;
            const availablePlots = {
              boutonDensitySection: plots.some(plot => plot.id === 'bouton-density'),
              nbSynapsesPerConnectionSection: plots.some(plot => plot.id === 'sample-convergence-by-connection'),
              diversionConnectionsDistributionSection: plots.some(plot => plot.id === 'sample-divergence-by-connection'),
              diversionSynapsesDistributionSection: plots.some(plot => plot.id === 'sample-divergence-by-synapse'),
              LaminarDistributionSynapsesSection: plots.some(plot => plot.id === 'laminar-distribution-synapses'),
              convergenceConnectionsDistribution: plots.some(plot => plot.id === 'sample-convergence-by-connection'),
              convergenceSynapsesDistribution: plots.some(plot => plot.id === 'sample-convergence-by-synapse'),
              connectionProbabilityDistributionSection: plots.some(plot => plot.id === 'connection-probability-vs-inter-somatic-distance'),
            };
            setAvailablePlots(availablePlots);
            setFactsheetData(plots); // Store the actual plots data
          } else {
            console.error('Unexpected data format:', data);
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
                title="Connection Anatomy"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p >
                    We combined <Link href={"/experimental-data/connection-anatomy/"} className={`link theme-${theme}`}>literature data</Link> and predictions on <Link href={"/reconstruction-data/connections/"} className={`link theme-${theme}`}>uncharacterized pathways</Link> to reconstruct the CA1 internal connection anatomy. The resulting connectome consists of 821 M synapses. For each circuit, each pathway is analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.
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
                    onSelect={setPostLayerQuery}
                    theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        visible={!!volume_section && !!prelayer && !!postlayer}
        navItems={[
          { id: 'boutonDensitySection', label: 'Bouton density of the presynaptic cells' },
          { id: 'nbSynapsesPerConnectionSection', label: 'Number of synapses per connection' },
          { id: 'diversionConnectionsDistributionSection', label: 'Divergence (connections) distribution + mean and std' },
          { id: 'diversionSynapsesDistributionSection', label: 'Divergence (synapses) distribution + mean and std' },
          { id: 'LaminarDistributionSynapsesSection', label: 'Laminar distribution of synapses' },
          { id: 'convergenceConnectionsDistribution', label: 'Convergence (connections) distribution + mean and std' },
          { id: 'convergenceSynapsesDistribution', label: 'Convergence (synapses) distribution + mean and std' },
          { id: 'connectionProbabilityDistributionSection', label: 'Connection probability distribution vs inter-somatic distance + mean and std' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        {availablePlots.boutonDensitySection && (
          <Collapsible title="Bouton density of the presynaptic cells" id="boutonDensitySection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('bouton-density')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('bouton-density'), `Bouton-Density-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Bouton Density
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.nbSynapsesPerConnectionSection && (
          <Collapsible title="Number of synapses per connection" id="nbSynapsesPerConnectionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-connection')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-connection'), `sample-convergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                sample convergence by connection
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.diversionConnectionsDistributionSection && (
          <Collapsible title="Divergence (connections) distribution + mean and std" id="diversionConnectionsDistributionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-connection')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-connection'), `sample-divergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                sample divergence by connection
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.diversionSynapsesDistributionSection && (
          <Collapsible title="Divergence (synapses) distribution + mean and std" id="diversionSynapsesDistributionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-synapse')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-divergence-by-synapse'), `sample-divergence-by-synapse-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                sample divergence by synapse
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.LaminarDistributionSynapsesSection && (
          <Collapsible title="Laminar distribution of synapses" id="LaminarDistributionSynapsesSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('laminar-distribution-synapses')} />
            </div>

          </Collapsible>
        )}
        {availablePlots.convergenceConnectionsDistribution && (
          <Collapsible title="Convergence (connections) distribution + mean and std" id="convergenceConnectionsDistribution" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-connection')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-connection'), `sample-convergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                sample convergence by connection
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.convergenceSynapsesDistribution && (
          <Collapsible title="Convergence (synapses) distribution + mean and std" id="convergenceSynapsesDistribution" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-synapse')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-synapse'), `sample-convergence-by-synapse-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                sample convergence by synapse
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
        {availablePlots.connectionProbabilityDistributionSection && (
          <Collapsible title="Connection probability distribution vs inter-somatic distance + mean and std" id="connectionProbabilityDistributionSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot plotData={getPlotDataById('connection-probability-vs-inter-somatic-distance')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('connection-probability-vs-inter-somatic-distance'), `connection-probability-vs-inter-somatic-distance-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                conn. probability v inter somatic distance
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}
      </DataContainer >
    </>
  );
};

export default ConnectionsView;
