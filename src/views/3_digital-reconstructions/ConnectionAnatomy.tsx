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
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';

import { cellGroup, defaultSelection, volumeSections } from '@/constants';
import { Layer, QuickSelectorEntry, VolumeSection } from '@/types';
import { dataPath } from '@/config';

import { downloadAsJson } from '@/utils';

const ConnectionsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, VolumeSection | Layer>>({
    volume_section: '' as VolumeSection,
    prelayer: '' as Layer,
    postlayer: '' as Layer
  });
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>({});

  const theme = 3;

  useEffect(() => {
    if (!router.isReady) return;

    if (!volume_section && !prelayer && !postlayer) {
      const defaultParams = defaultSelection.digitalReconstruction.synapticPathways;
      setQuickSelection({
        volume_section: defaultParams.volume_section as VolumeSection,
        prelayer: defaultParams.prelayer as Layer,
        postlayer: defaultParams.postlayer as Layer
      });
      router.replace({ query: defaultParams }, undefined, { shallow: true });
    } else {
      setQuickSelection({
        volume_section: volume_section as VolumeSection,
        prelayer: prelayer as Layer,
        postlayer: postlayer as Layer
      });
    }
  }, [router.isReady, volume_section, prelayer, postlayer]);

  useEffect(() => {
    if (quickSelection.volume_section && quickSelection.prelayer && quickSelection.postlayer) {
      fetchFactsheetData();
    }
  }, [quickSelection]);

  const fetchFactsheetData = async () => {
    try {
      const { volume_section, prelayer, postlayer } = quickSelection;
      const filePath = `${basePath}/resources/data/3_digital-reconstruction/connection-anatomy/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      const response = await fetch(filePath);
      const data = await response.json();

      if (data && Array.isArray(data.values)) {
        setFactsheetData(data.values);
        updateAvailablePlots(data.values);
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error fetching factsheet:', error);
    }
  };

  const updateAvailablePlots = (plots: any[]) => {
    const plotIds = [
      'bouton-density',
      'sample-convergence-by-connection',
      'sample-divergence-by-connection',
      'sample-divergence-by-synapse',
      'laminar-distribution-synapses',
      'connection-probability-vs-inter-somatic-distance',
    ];

    const availablePlots = plotIds.reduce((acc, id) => {
      acc[id] = plots.some(plot => plot.id === id);
      return acc;
    }, {} as Record<string, boolean>);

    setAvailablePlots(availablePlots);
  };

  const setParams = (params: Partial<Record<string, VolumeSection | Layer>>) => {
    const newSelection = { ...quickSelection, ...params };
    //setQuickSelection(newSelection);
    const query = { ...router.query, ...newSelection };
    router.push({ query }, undefined, { shallow: true });
  };

  const updateQuickSelection = (key: string, value: VolumeSection | Layer) => {
    setParams({ [key]: value });
  };

  const qsEntries: QuickSelectorEntry[] = [
    { title: 'Volume section', key: 'volume_section', values: volumeSections, setFn: (value) => updateQuickSelection('volume_section', value as VolumeSection) },
    { title: 'Pre-synaptic cell group', key: 'prelayer', values: cellGroup, setFn: (value) => updateQuickSelection('prelayer', value as Layer) },
    { title: 'Post-synaptic cell group', key: 'postlayer', values: cellGroup, setFn: (value) => updateQuickSelection('postlayer', value as Layer) },
  ];

  const getPlotDataById = (id: string) => factsheetData?.find((plot: any) => plot.id === id);

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

    const plotData = getPlotDataById(id);
    return (
      <Collapsible title={title} id={id} className="mt-4">
        <div className="graph">
          <DistibutionPlot plotData={plotData} />
        </div>
        <div className="mt-4">
          <DownloadButton
            theme={theme}
            onClick={() => downloadAsJson(plotData, `${id}-${quickSelection.volume_section}-${quickSelection.prelayer}-${quickSelection.postlayer}.json`)}>
            <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{quickSelection.volume_section}</span>
            {title}
            <span className='!mr-0 collapsible-property small '>{quickSelection.prelayer}</span> - <span className='!ml-0 collapsible-property small '>{quickSelection.postlayer}</span>
          </DownloadButton>
        </div>
      </Collapsible>
    );
  };

  return (
    <>
      <Filters theme={theme} hasData={!!quickSelection.prelayer && !!quickSelection.postlayer}>
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
                  <p>
                    We combined <Link href="/experimental-data/connection-anatomy/" className={`link theme-${theme}`}>literature data</Link> and predictions on <Link href="/reconstruction-data/connections/" className={`link theme-${theme}`}>uncharacterized pathways</Link> to reconstruct the CA1 internal connection anatomy. The resulting connectome consists of 821 M synapses. For each circuit, each pathway is analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.
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
                  value={quickSelection.volume_section}
                  onSelect={(value) => updateQuickSelection('volume_section', value)}
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
                    value={quickSelection.prelayer}
                    title="m-type"
                    onSelect={(value) => updateQuickSelection('prelayer', value as Layer)}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>3. Select a post-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={quickSelection.postlayer}
                    title="m-type"
                    onSelect={(value) => updateQuickSelection('postlayer', value as Layer)}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        visible={!!quickSelection.volume_section && !!quickSelection.prelayer && !!quickSelection.postlayer}
        navItems={[
          { id: 'bouton-density', label: 'Bouton density of the presynaptic cells' },
          { id: 'sample-convergence-by-connection', label: 'Number of synapses per connection' },
          { id: 'sample-divergence-by-connection', label: 'Divergence (connections) distribution + mean and std' },
          { id: 'sample-divergence-by-synapse', label: 'Divergence (synapses) distribution + mean and std' },
          { id: 'laminar-distribution-synapses', label: 'Laminar distribution of synapses' },
          { id: 'connection-probability-vs-inter-somatic-distance', label: 'Connection probability distribution vs inter-somatic distance + mean and std' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        {renderPlot('bouton-density', 'Bouton density of the presynaptic cells')}
        {renderPlot('sample-convergence-by-connection', 'Number of synapses per connection')}
        {renderPlot('sample-divergence-by-connection', 'Divergence (connections) distribution + mean and std')}
        {renderPlot('sample-divergence-by-synapse', 'Divergence (synapses) distribution + mean and std')}
        {renderPlot('laminar-distribution-synapses', 'Laminar distribution of synapses')}
        {renderPlot('connection-probability-vs-inter-somatic-distance', 'Connection probability distribution vs inter-somatic distance + mean and std')}
      </DataContainer>
    </>
  );
};

export default ConnectionsView;