import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import CustomPlot from './acetylcholine/CustomPlot';
import TraceGraph from '@/components/TraceGraph/TraceGraph';
import List from '@/components/List';
import DownloadButton from '@/components/DownloadButton';

import { cellGroup, defaultSelection, achConcentrations } from '@/constants';
import { Layer, QuickSelectorEntry, AchConcentration } from '@/types';
import { dataPath } from '@/config';
import { downloadAsJson } from '@/utils';

const AcetylcholineEffectOnSynapsesView: React.FC = () => {
  const router = useRouter();
  const { ach_concentration, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState({ ach_concentration, prelayer, postlayer });
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [traceData, setTraceData] = useState<any>(null);
  const [availablePlots, setAvailablePlots] = useState({
    PSPDistribution: false,
    CVDistribution: false,
    USYNDistribution: false,
  });

  const theme = 3;
  const filteredCellGroup = cellGroup.filter(cell => cell !== 'All');

  useEffect(() => {
    if (!router.isReady) return;

    if (!ach_concentration && !prelayer && !postlayer) {
      const { ach_concentration, prelayer, postlayer } = defaultSelection.digitalReconstruction.acetylcholine;
      setQuickSelection({ ach_concentration, prelayer, postlayer });
      router.replace({ query: { ach_concentration, prelayer, postlayer } }, undefined, { shallow: true });
    } else {
      setQuickSelection({ ach_concentration, prelayer, postlayer });
    }
  }, [router.isReady, ach_concentration, prelayer, postlayer]);

  useEffect(() => {
    if (ach_concentration && prelayer && postlayer) {
      fetchFactsheetData();
      fetchTraceData();
    }
  }, [ach_concentration, prelayer, postlayer]);

  const fetchFactsheetData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/acetylcholine-effect-on-synapses/${ach_concentration}/${prelayer}-${postlayer}/Ach_effect_on_synapse.json`);
      const data = await response.json();
      if (data && Array.isArray(data.values)) {
        setFactsheetData(data.values);
        setAvailablePlots({
          PSPDistribution: data.values.some((plot: any) => plot.id === 'psp-amp-distribution'),
          CVDistribution: data.values.some((plot: any) => plot.id === 'cv-distribution'),
          USYNDistribution: data.values.some((plot: any) => plot.id === 'u_syn-distribution'),
        });
      }
    } catch (error) {
      console.error('Error fetching factsheet:', error);
    }
  };

  const fetchTraceData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/acetylcholine-effect-on-synapses/${ach_concentration}/${prelayer}-${postlayer}/trace.json`);
      const data = await response.json();
      setTraceData(data);
    } catch (error) {
      console.error('Error fetching trace data:', error);
    }
  };

  const setParams = (params: Partial<typeof quickSelection>) => {
    const updatedSelection = { ...quickSelection, ...params };
    setQuickSelection(updatedSelection);
    router.push({ query: updatedSelection }, undefined, { shallow: true });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Acetylcholine concentration',
      key: 'ach_concentration',
      values: achConcentrations,
      setFn: (value: AchConcentration) => setParams({ ach_concentration: value }),
    },
    {
      title: 'Pre-synaptic cell group',
      key: 'prelayer',
      values: filteredCellGroup,
      setFn: (value: Layer) => setParams({ prelayer: value }),
    },
    {
      title: 'Post-synaptic cell group',
      key: 'postlayer',
      values: filteredCellGroup,
      setFn: (value: Layer) => setParams({ postlayer: value }),
    },
  ];

  const getPlotDataById = (id: string) => factsheetData?.find((plot: any) => plot.id === id);

  return (
    <>
      <Filters theme={theme} hasData={!!prelayer && !!postlayer}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Acetylcholine - Effects on Synapses"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <InfoBox>
                <p>
                  We applied the <Link className={`link theme-${theme}`} href="/reconstruction-data/acetylcholine-effects-on-synapses/">dose-effect curves</Link> to predict the effect of acetylcholine on synapse short-term plasticity.
                </p>
              </InfoBox>
            </StickyContainer>
          </div>

          <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
            <div className={`selector__column selector__column--lg mt-3 theme-${theme}`}>
              <div className={`selector__head theme-${theme}`}>1. Select a concentration</div>
              <div className="selector__body">
                <List
                  block
                  list={achConcentrations}
                  value={quickSelection.ach_concentration}
                  title="concentrations"
                  onSelect={(value) => setParams({ ach_concentration: value })}
                  theme={theme}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
              <div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={filteredCellGroup}
                    value={quickSelection.prelayer}
                    title="m-type"
                    onSelect={(value) => setParams({ prelayer: value })}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>3. Select a post-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={filteredCellGroup}
                    value={quickSelection.postlayer}
                    title="m-type"
                    onSelect={(value) => setParams({ postlayer: value })}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        navItems={[
          { label: 'Distribution', isTitle: true },
          { id: 'PSPDistributionSection', label: 'PSP amp distribution' },
          { id: 'CVDistributionSection', label: 'CV distribution' },
          { id: 'USYNDistributionSection', label: 'u_syn distribution' },
          { label: 'Trace', isTitle: true },
          { id: 'traceSection', label: 'Mean & Indivudial trace' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        {availablePlots.PSPDistribution && (
          <Collapsible title="PSP amp distribution" id="PSPDistributionSection" className="mt-4">
            <div className="graph">
              <CustomPlot plotData={getPlotDataById('psp-amp-distribution')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('psp-amp-distribution'), `psp-amp-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}
              >
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                PSP amp distribution
                <span className='!mr-0 collapsible-property small'>{prelayer}</span> - <span className='!ml-0 collapsible-property small'>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.CVDistribution && (
          <Collapsible title="CV distribution" id="CVDistributionSection" className="mt-4">
            <div className="graph">
              <CustomPlot plotData={getPlotDataById('cv-distribution')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('cv-distribution'), `cv-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}
              >
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                CV distribution
                <span className='!mr-0 collapsible-property small'>{prelayer}</span> - <span className='!ml-0 collapsible-property small'>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.USYNDistribution && (
          <Collapsible title="u_syn distribution" id="USYNDistributionSection" className="mt-4">
            <div className="graph">
              <CustomPlot plotData={getPlotDataById('u_syn-distribution')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('u_syn-distribution'), `u_syn-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}
              >
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                u_syn distribution
                <span className='!mr-0 collapsible-property small'>{prelayer}</span> - <span className='!ml-0 collapsible-property small'>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        <Collapsible title="Trace" id="traceSection" className="mt-4">
          {traceData && traceData.individual_trace && traceData.mean_trace && (
            <TraceGraph
              individualTrace={traceData.individual_trace}
              meanTrace={traceData.mean_trace}
              title="Individual and Mean Traces"
            />
          )}
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default AcetylcholineEffectOnSynapsesView;