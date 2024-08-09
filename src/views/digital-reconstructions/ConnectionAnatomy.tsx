import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { basePath } from '../../config';
import { colorName } from './config';

import { Layer, VolumeSection } from '@/types';
import { layers, cellGroup, defaultSelection } from '@/constants';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import List from '@/components/List';
import QuickSelector from '@/components/QuickSelector';
import DistibutionPlot from './connections/DistibutionPlot'; // Import the new component

import selectorStyle from '../../styles/selector.module.scss';

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

  useEffect(() => {
    setConnViewerReady(false);
  }, [prelayer, postlayer]);

  useEffect(() => {
    if (volume_section && prelayer && postlayer) {
      const filePath = `${basePath}/data/digital-reconstruction/connections/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
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
        <div className="w-full flex flex-wrap">
          <div className="w-full lg:w-1/2 mb-2">
            <StickyContainer centered={true}>
              <Title
                primaryColor={colorName}
                title="Connection Anatomy"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined <Link href={"/experimental-data/connection-anatomy/"} className={`link theme-${theme}`}>literature data</Link> and predictions on <Link href={"/reconstruction-data/connections/"} className={`link theme-${theme}`}>uncharacterized pathways</Link> to reconstruct the CA1 internal connection anatomy. The resulting connectome consists of 821 M synapses. For each circuit, each pathway is analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
          <div className="w-full lg:w-1/2 mb-2 flex flex-col">
            <div className="w-full">
              <div className={selectorStyle.row}>
                <div className={`selector__column mt-3 theme-${theme}`}>
                  <div className={`selector__head theme-${theme}`}>1. Select a volume section</div>
                  <div className="selector__body">
                    <VolumeSectionSelector3D
                      value={volume_section}
                      onSelect={setVolumeSectionQuery}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <div className={selectorStyle.row}>
                  <div className={`selector__column mt-3 theme-${theme}`}>
                    <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                    <div className="selector__body">
                      <List
                        block
                        list={cellGroup}
                        value={prelayer}
                        title="m-type"
                        color={colorName}
                        onSelect={setPreLayerQuery}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-2">
                <div className={selectorStyle.row}>
                  <div className={`selector__column mt-3 theme-${theme}`}>
                    <div className={`selector__head theme-${theme}`}>3. Select a post-synaptic cell group</div>
                    <div className="selector__body">
                      <List
                        block
                        list={cellGroup}
                        value={postlayer}
                        title="m-type"
                        color={colorName}
                        onSelect={setPostLayerQuery}
                        theme={theme}
                      />
                    </div>
                  </div>
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
      >
        {availablePlots.boutonDensitySection && (
          <Collapsible title="Bouton density of the presynaptic cells" id="boutonDensitySection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('bouton-density')} />
          </Collapsible>
        )}
        {availablePlots.nbSynapsesPerConnectionSection && (
          <Collapsible title="Number of synapses per connection" id="nbSynapsesPerConnectionSection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-connection')} />
          </Collapsible>
        )}
        {availablePlots.diversionConnectionsDistributionSection && (
          <Collapsible title="Divergence (connections) distribution + mean and std" id="diversionConnectionsDistributionSection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-connection')} />
          </Collapsible>
        )}
        {availablePlots.diversionSynapsesDistributionSection && (
          <Collapsible title="Divergence (synapses) distribution + mean and std" id="diversionSynapsesDistributionSection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('sample-divergence-by-synapse')} />
          </Collapsible>
        )}
        {availablePlots.LaminarDistributionSynapsesSection && (
          <Collapsible title="Laminar distribution of synapses" id="LaminarDistributionSynapsesSection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('laminar-distribution-synapses')} />
          </Collapsible>
        )}
        {availablePlots.convergenceConnectionsDistribution && (
          <Collapsible title="Convergence (connections) distribution + mean and std" id="convergenceConnectionsDistribution" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-connection')} />
          </Collapsible>
        )}
        {availablePlots.convergenceSynapsesDistribution && (
          <Collapsible title="Convergence (synapses) distribution + mean and std" id="convergenceSynapsesDistribution" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('sample-convergence-by-synapse')} />
          </Collapsible>
        )}
        {availablePlots.connectionProbabilityDistributionSection && (
          <Collapsible title="Connection probability distribution vs inter-somatic distance + mean and std" id="connectionProbabilityDistributionSection" className="mt-4">
            <DistibutionPlot plotData={getPlotDataById('connection-probability-vs-inter-somatic-distance')} />
          </Collapsible>
        )}
      </DataContainer>

      <QuickSelector
        color={colorName}
        entries={[
          {
            title: 'Volume section',
            currentValue: quickSelection.volume_section,
            values: layers,
            onChange: setVolumeSectionQuery,
            width: '120px',
          },
          {
            title: 'Pre-syn layer',
            currentValue: quickSelection.prelayer,
            values: layers,
            onChange: setPreLayerQuery,
            width: '80px',
          },
          {
            title: 'Post-syn layer',
            currentValue: quickSelection.postlayer,
            values: layers,
            onChange: setPostLayerQuery,
            width: '80px',
          },
        ]}
      />
    </>
  );
};

export default ConnectionsView;
