import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import CustomPlot from './acetylcholine/CustomPlot';
import List from '@/components/List';
import DownloadButton from '@/components/DownloadButton/DownloadButton';

import { cellGroup, defaultSelection, achConcentrations } from '@/constants';
import { Layer, QuickSelectorEntry, AchConcentration } from '@/types';
import { dataPath } from '@/config';

import { downloadAsJson } from '@/utils';

const AcetylcholineEffectOnSynapsesView: React.FC = () => {
  const router = useRouter();
  const { ach_concentration, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ ach_concentration, prelayer, postlayer });
  const [connViewerReady, setConnViewerReady] = useState<boolean>(false);
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>({});

  const theme = 3;

  // Filter out 'All' from cellGroup
  const filteredCellGroup = cellGroup.filter(cell => cell !== 'All');

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.prelayer && !router.query.achConcentration && !router.query.postlayer) {
      const query = defaultSelection.digitalReconstruction.acetylcholine;
      const { ach_concentration, prelayer, postlayer } = query;
      setQuickSelection({ ach_concentration, prelayer, postlayer });
      router.replace({ query }, undefined, { shallow: true });
    } else {
      setQuickSelection({ ach_concentration, prelayer, postlayer });
    }
  }, [router.query]);

  const setAchConcentrationQuery = (ach_concentration: AchConcentration) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, ach_concentration };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPreLayerQuery = (prelayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, prelayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPostLayerQuery = (postlayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, postlayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Acetylcholine concentration',
      key: 'ach_concentration',
      values: achConcentrations,
      setFn: setAchConcentrationQuery,
    },
    {
      title: 'Pre-synaptic cell group',
      key: 'prelayer',
      values: filteredCellGroup,
      setFn: setPreLayerQuery,
    },
    {
      title: 'Post-synaptic cell group',
      key: 'postlayer',
      values: filteredCellGroup,
      setFn: setPostLayerQuery,
    },
  ];

  useEffect(() => {
    setConnViewerReady(false);
  }, [ach_concentration, prelayer, postlayer]);

  useEffect(() => {
    if (ach_concentration && prelayer && postlayer) {
      const filePath = `${dataPath}/3_digital-reconstruction/acetylcholine-effect-on-synapses/${ach_concentration}/${prelayer}-${postlayer}/Ach_effect_on_synapse.json`;
      fetch(filePath)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.values)) {
            const plots = data.values;
            const availablePlots = {
              PSPDistribution: plots.some(plot => plot.id === 'psp-amp-distribution'),
              CVDistribution: plots.some(plot => plot.id === 'cv-distribution'),
              USYNDistribution: plots.some(plot => plot.id === 'u_syn-distribution'),
            };
            setAvailablePlots(availablePlots);
            console.log(availablePlots);
            setFactsheetData(plots);
          } else {
            console.error('Unexpected data format:', data);
          }
        })
        .catch(error => console.error('Error fetching factsheet:', error));
    }
  }, [ach_concentration, prelayer, postlayer]);

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
                title="Acetylcholine - Effects on Synapses"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We applied the <Link className={`link theme-${theme}`} href={'/reconstruction-data/acetylcholine-effects-on-synapses/'}> dose - effect curves</Link> to predict the effect of acetylcholine on synapse short-term plasticity.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
            <div className={`selector__column selector__column--lg mt-3 theme-${theme}`} style={{ maxWidth: "auto" }}>
              <div className={`selector__head theme-${theme}`}>1.Select a concentration</div>
              <div className="selector__body">
                <List
                  block
                  list={achConcentrations}
                  value={ach_concentration}
                  title="concentrations"
                  onSelect={setAchConcentrationQuery}
                  theme={theme} />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
              <div className={`selector__column theme-${theme} flex-1`} style={{ maxWidth: "auto" }}>
                <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={filteredCellGroup}
                    value={prelayer}
                    title="m-type"
                    onSelect={setPreLayerQuery}
                    theme={theme} />
                </div>
              </div>
              <div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>3. Select a post-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={filteredCellGroup}
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

      <DataContainer theme={theme}
        navItems={[
          { id: 'PSPDistributionSection', label: 'PSP amp distribution' },
          { id: 'CVDistributionSection', label: 'CV distribution' },
          { id: 'USYNDistribution', label: 'u_syn distribution' },
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
                onClick={() => downloadAsJson(getPlotDataById('psp-amp-distribution'), `psp-amp-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                PSP amp distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

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
                onClick={() => downloadAsJson(getPlotDataById('cv-distribution'), `cv-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                cv distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.USYNDistribution && (
          <Collapsible title="u_syn distribution" id="USYNistributionSection" className="mt-4">
            <div className="graph">
              <CustomPlot plotData={getPlotDataById('u_syn-distribution')} />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('u_syn-distribution'), `u_syn-distribution-${ach_concentration}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{ach_concentration}</span>
                u_syn distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        <Collapsible title="Trace" id="traceSection" className="mt-4">
          <p></p>
        </Collapsible>


      </DataContainer>
    </>
  );
};

export default AcetylcholineEffectOnSynapsesView;