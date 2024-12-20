import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import List from '@/components/List';
import DistrbutionPlot from '@/components/DistributionPlot';
import LaminarGraph from '@/components/LaminarGraph';
import TraceGraph from './components/Trace';

import Filters from '@/layouts/Filters';

import { cellGroup, defaultSelection, graphTheme, themeColors, volumeSections } from '@/constants';

import { Layer, QuickSelectorEntry, VolumeSection } from '@/types';

import { dataPath } from '@/config';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';
import Factsheet from '@/components/Factsheet';
import withPreselection from '@/hoc/with-preselection';
import AuthorBox from '@/components/AuthorBox/AuthorBox';

const SchafferCollateralsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [traceData, setTraceData] = useState<any>(null);
  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ volume_section, prelayer, postlayer });
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [laminarPlots, setLaminarPlots] = useState<any>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>({});
  const [availableMeanSTD, setAvailableMeanSTD] = useState<Record<string, boolean>>({});
  const [meanStdData, setMeanStdData] = useState<any>(null);

  const theme = 3;

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.prelayer && !router.query.volume_section && !router.query.postlayer) {
      const query = defaultSelection.digitalReconstruction.schafferCollateral;
      const { volume_section, prelayer, postlayer } = query;
      setQuickSelection({ volume_section, prelayer: prelayer || 'SC', postlayer });
      router.replace({ query: { ...query, prelayer: prelayer || 'SC' } }, undefined, { shallow: true });
    } else {
      setQuickSelection({ volume_section, prelayer: prelayer || 'All', postlayer });
    }
  }, [router.query]);

  useEffect(() => {
    if (volume_section && prelayer && postlayer) {
      fetchFactsheetData();
      fetchTraceData();
      fetchLaminarData();
      fetchMeanSTDData();
    }
  }, [volume_section, prelayer, postlayer]);

  const fetchFactsheetData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/schaffer-collaterals/${volume_section}/All-${postlayer}/distribution-plots.json`);
      const data = await response.json();
      if (data && Array.isArray(data.values)) {
        setFactsheetData(data.values);
        setAvailablePlots({
          SynapsesPerConnection: data.values.some(plot => plot.id === 'synapses-per-connection'),
          SampleDivergenceByConnection: data.values.some(plot => plot.id === 'sample-divergence-by-connection'),
          SampleDivergenceBySynapse: data.values.some(plot => plot.id === 'sample-divergence-by-synapse'),
          SampleConvergenceByConnection: data.values.some(plot => plot.id === 'sample-convergence-by-connection'),
          SampleConvergenceBySynapse: data.values.some(plot => plot.id === 'sample-convergence-by-synapse'),
          PSPAmplitude: data.values.some(plot => plot.id === 'psp-amplitude'),
          PSPCV: data.values.some(plot => plot.id === 'psp-cv'),
          SynapseLatency: data.values.some(plot => plot.id === 'synapse-latency'),
          SynapseLatencyFromSimulation: data.values.some(plot => plot.id === 'synapse-latency-for-simulation'),
          RiseTimeFromSimulation: data.values.some(plot => plot.id === 'rise-time-constant-for-simulation'),
          DecayTimeConstant: data.values.some(plot => plot.id === 'decay-time-constant'),
          NMDAAMPARatio: data.values.some(plot => plot.id === 'nmda-ampa-ratio'),
          UParameter: data.values.some(plot => plot.id === 'u-parameter'),
          DParameter: data.values.some(plot => plot.id === 'd-parameter'),
          GSYNX: data.values.some(plot => plot.id === 'g-synx'),
          NRRPParameter: data.values.some(plot => plot.id === 'nrrp-parameter'),
        });
      }
    } catch (error) {
      console.error('Error fetching factsheet:', error);
    }
  };

  const fetchTraceData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/schaffer-collaterals/${volume_section}/All-${postlayer}/trace.json`);
      const data = await response.json();
      setTraceData(data);
    } catch (error) {
      console.error('Error fetching trace data:', error);
    }
  };

  const fetchLaminarData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/schaffer-collaterals/${volume_section}/All-${postlayer}/schaffer-collaterals.json`);
      const data = await response.json();
      const laminarData = data.values.find(plot => plot.id === 'laminar-distribution');
      setLaminarPlots(laminarData);
    } catch (error) {
      console.error('Error fetching laminar data:', error);
    }
  };

  const fetchMeanSTDData = async () => {
    try {
      const response = await fetch(`${dataPath}/3_digital-reconstruction/schaffer-collaterals/${volume_section}/All-${postlayer}/schaffer-collaterals.json`);
      const data = await response.json();
      setMeanStdData(data.values);

      setAvailableMeanSTD({
        SynapsesPerConnection: data.values.some(item => item.id === 'synapses-per-connection' && item.values?.length === 2),
        SampleDivergenceByConnection: data.values.some(item => item.id === 'sample-divergence-by-connection' && item.values?.length === 2),
        SampleDivergenceBySynapse: data.values.some(item => item.id === 'sample-divergence-by-synapse' && item.values?.length === 2),
        SampleConvergenceByConnection: data.values.some(item => item.id === 'sample-convergence-by-connection' && item.values?.length === 2),
        SampleConvergenceBySynapse: data.values.some(item => item.id === 'sample-convergence-by-synapse' && item.values?.length === 2),
        PSPAmplitude: data.values.some(item => item.id === 'psp-amplitude' && item.values?.length === 2),
        PSPCV: data.values.some(item => item.id === 'psp-cv' && item.values?.length === 2),
        SynapseLatency: data.values.some(item => item.id === 'synapse-latency' && item.values?.length === 2),
        SynapseLatencyFromSimulation: data.values.some(item => item.id === 'synapse-latency-for-simulation' && item.values?.length === 2),
        RiseTimeFromSimulation: data.values.some(item => item.id === 'rise-time-constant-for-simulation' && item.values?.length === 2),
        DecayTimeConstant: data.values.some(item => item.id === 'decay-time-constant' && item.values?.length === 2),
        NMDAAMPARatio: data.values.some(item => item.id === 'nmda-ampa-ratio' && item.values?.length === 2),
        UParameter: data.values.some(item => item.id === 'u-parameter' && item.values?.length === 2),
        DParameter: data.values.some(item => item.id === 'd-parameter' && item.values?.length === 2),
        GSYNX: data.values.some(item => item.id === 'g-synx' && item.values?.length === 2),
        NRRPParameter: data.values.some(item => item.id === 'nrrp-parameter' && item.values?.length === 2),
      });
    } catch (error) {
      console.error('Error fetching mean/std data:', error);
    }
  };

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  const setVolumeSectionQuery = (volume_section: VolumeSection) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, volume_section };
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
      title: 'Volume section',
      key: 'volume_section',
      values: volumeSections,
      setFn: setVolumeSectionQuery,
    },
    {
      title: 'Pre-synaptic cell group',
      key: 'prelayer',
      values: ["SC"],
      setFn: setPreLayerQuery,
    },
    {
      title: 'Post-synaptic cell group',
      key: 'postlayer',
      values: cellGroup,
      setFn: setPostLayerQuery,
    },
  ];

  const getPlotDataById = (id: string) => {
    return factsheetData?.find((plot: any) => plot.id === id);
  };

  const getMeanStdDataById = (id: string) => {
    const data = meanStdData?.find((item: any) => item.id === id);
    return data ? { mean: data.values[0], std: data.values[1] } : null;
  };

  return (
    <>
      <Filters theme={theme} hasData={!!prelayer && !!postlayer}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Schaffer Collaterals"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Reconstruction of the Schaffer collaterals, the major input to the CA1. This massive innervation accounts for 9,122 M synapses, and most of the synapses considered in the model (92%).
                  </p>
                  <ul>
                    <li>Using <Link className={`link theme-${theme}`} href={"/reconstruction-data/schaffer-collaterals"}>data</Link> on Schaffer collaterals, we predicted their anatomy, analyzing CA3-CA1 connections by synapse count, divergence, convergence, and connection probability.</li>
                    <li>We also predicted the physiology of these connections using <Link className={`link theme-${theme}`} href={"/reconstruction-data/schaffer-collaterals"}>data</Link>, focusing on PSP, latency, kinetics, NMDA/AMPA ratio, and short-term plasticity.</li>
                  </ul>
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
                    list={['SC']}
                    value={prelayer || 'All'}
                    title="m-type"
                    onSelect={setPreLayerQuery}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme} flex-1`}>
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
        theme={theme}
        navItems={[
          { label: 'Anatomy', isTitle: true },
          { id: 'NbSynapsesPerConnectionSection', label: 'Nb of synapses p.connection dist.' },
          { id: 'DivergenceConnectionSection', label: 'Divergence connections dist.' },
          { id: 'DivergenceSynapsesSection', label: 'Divergence synapses dist.' },
          { id: 'LaminarDistributionSynapsesSection', label: 'Laminar dist. of synapses' },
          { id: 'SampleConvergenceByConnectionSection', label: 'Convergence connections dist.' },
          { id: 'SampleConvergenceBySynapsesSection', label: 'Convergence synapses dist.' },
          { label: 'Physiology', isTitle: true },
          { id: 'PSPAmplitudeSection', label: 'PSP Amplitude dist.' },
          { id: 'PSPCVSection', label: 'PSP CV dist.' },
          { id: 'SynapseLatencySection', label: 'Synapse latency dist.' },
          { id: 'RiseTimeSection', label: 'Rise time constant dist.' },
          { id: 'DecayTimeConstantSection', label: 'Decay time constant dist.' },
          { id: 'NMDAAMPARatioSection', label: 'NMDA/AMPA ratio dist.' },
          { id: 'UParameterSection', label: 'U, D, F, NRRP dist.' },
          { id: 'TracesSection', label: 'Traces' },
        ]}
        quickSelectorEntries={qsEntries}
      >

        <div className='pb-4'>
          <AuthorBox hasIcon={false}>
            <span className='text-base'>Mean connection probability: <span className='font-semibold'>0.0715758</span></span>
          </AuthorBox>
        </div>

        {availablePlots.SynapsesPerConnection && (
          <Collapsible title="Number of synapses per connection distribution" id="NbSynapsesPerConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('synapses-per-connection')}
                xAxis='N_syn'
                yAxis='Frequency'
                xAxisTickStep={1}
                MeanStd={{
                  mean: getMeanStdDataById('synapses-per-connection')?.mean,
                  std: getMeanStdDataById('synapses-per-connection')?.std
                }}
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
          <Collapsible title="Divergence (connections) distribution" id="DivergenceConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-divergence-by-connection')}
                xAxis='Divergence'
                yAxis='Frequency'
                xAxisTickStep={50}
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
          <Collapsible title="Divergence (synapses) distribution" id="DivergenceSynapsesSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-divergence-by-synapse')}
                xAxis='Divergence'
                yAxis='Frequency'
                xAxisTickStep={50}
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

        {availablePlots.SampleConvergenceByConnection && (
          <Collapsible title="Convergence (connections) distribution" id="SampleConvergenceByConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-convergence-by-connection')}
                xAxis='Convergence'
                yAxis='Frequency'
                xAxisTickStep={5000}
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-connection'), `sample-convergence-by-connection-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Convergence (connections) distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.SampleConvergenceBySynapse && (
          <Collapsible title="Convergence (synapses) distribution" id="SampleConvergenceBySynapsesSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-convergence-by-synapse')}
                xAxis='Convergence'
                yAxis='Frequency'
                xAxisTickStep={4000}
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('sample-convergence-by-synapse'), `sample-convergence-by-synapse-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Convergence (synapses) distribution
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.PSPAmplitude && (
          <Collapsible title="PSP Amplitude" id="PSPAmplitudeSection" properties={["Physiology"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('psp-amplitude')}
                xAxis='PSP Amplitude'
                yAxis='Frequency'
                xAxisTickStep={1}
              />
            </div>

            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('psp-amplitude'), `psp-amplitude-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                PSP Amplitude
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.PSPCV && (
          <Collapsible title="PSP CV" id="PSPCVSection" properties={["Physiology"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('psp-cv')}
                xAxis='PSP CV'
                yAxis='Frequency'
                xAxisTickStep={1}
              />
            </div>
            <div className="mt-4">
              <DownloadButton
                theme={theme}
                onClick={() => downloadAsJson(getPlotDataById('psp-cv'), `psp-cv-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                PSP CV
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {(availablePlots.SynapseLatency || availablePlots.SynapseLatencyFromSimulation) && (
          <Collapsible
            title="Synapse latency distribution"
            id="SynapseLatencySection"
            properties={["Physiology"]}
          >
            <div className="flex flex-col gap-12">

              {availablePlots.SynapseLatency && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Synapse Latency</div>
                    <div className="graph">
                      <DistrbutionPlot
                        plotData={getPlotDataById('synapse-latency')}
                        xAxis='Latency'
                        yAxis='Frequency'
                      />
                    </div>
                    <div className="mt-2">
                      <DownloadButton
                        theme={theme}
                        onClick={() =>
                          downloadAsJson(
                            getPlotDataById('synapse-latency'),
                            `synapse-latency-${volume_section}-${prelayer}-${postlayer}.json`
                          )
                        }
                      >
                        <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                          {volume_section}
                        </span>
                        Synapse latency distribution
                        <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                        <span className="!ml-0 collapsible-property small">{postlayer}</span>
                      </DownloadButton>
                    </div>
                  </div>
                </>
              )}

              {availablePlots.SynapseLatencyFromSimulation && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Synapse Latency for simulation</div>
                    <div className="graph">
                      <DistrbutionPlot
                        plotData={getPlotDataById('synapse-latency-for-simulation')}
                        xAxis='Latency'
                        yAxis='Frequency'
                        xAxisTickStep={1}
                      />
                    </div>
                    <div className="mt-2">
                      <DownloadButton
                        theme={theme}
                        onClick={() =>
                          downloadAsJson(
                            getPlotDataById('synapse-latency-for-simulation'),
                            `synapse-latency-for-simulation-${volume_section}-${prelayer}-${postlayer}.json`
                          )
                        }
                      >
                        <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                          {volume_section}
                        </span>
                        Synapse latency for simulation
                        <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                        <span className="!ml-0 collapsible-property small">{postlayer}</span>
                      </DownloadButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Collapsible >
        )}

        {
          availablePlots.RiseTimeFromSimulation && (
            <Collapsible title="Rise time constant distribution" id="RiseTimeSection" properties={["Physiology"]}>
              <div className="graph">
                <DistrbutionPlot
                  plotData={getPlotDataById('rise-time-constant-for-simulation')}
                  xAxis='Rise Time'
                  yAxis='Frequency'
                  xAxisTickStep={1}
                />
              </div>
              <div className="mt-4">
                <DownloadButton
                  theme={theme}
                  onClick={() => downloadAsJson(getPlotDataById('rise-time-constant-for-simulation'), `rise-time-constant-for-simulation-${volume_section}-${prelayer}-${postlayer}.json`)}>
                  <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                  Rise time constant distribution
                  <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

                </DownloadButton>
              </div>
            </Collapsible>
          )
        }

        {availablePlots.DecayTimeConstant && (
          <Collapsible
            title="Decay time constant distribution"
            id="DecayTimeConstantSection"
            properties={["Physiology"]}
          >
            <div className='flex flex-col gap-2'>
              <div className="graph">
                <DistrbutionPlot
                  plotData={getPlotDataById('decay-time-constant')}
                  xAxis='Decay Time'
                  yAxis='Frequency'
                  xAxisTickStep={1}
                />
              </div>
              <div className="mt-2">
                <DownloadButton
                  theme={theme}
                  onClick={() =>
                    downloadAsJson(
                      getPlotDataById('decay-time-constant'),
                      `decay-time-constant-${volume_section}-${prelayer}-${postlayer}.json`
                    )
                  }
                >
                  <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                    {volume_section}
                  </span>
                  <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                  <span className="!ml-0 collapsible-property small">{postlayer}</span>
                  Decay time constant distribution
                </DownloadButton>
              </div>
            </div>
          </Collapsible>
        )}

        {
          availablePlots.NMDAAMPARatio && (
            <Collapsible title="NMDA/AMPA ratio distribution" id="NMDAAMPARatioSection" properties={["Physiology"]}>
              <div className="graph">
                <DistrbutionPlot
                  xAxisTickStep={1}
                  plotData={getPlotDataById('nmda-ampa-ratio')} />
              </div>
              <div className="mt-4">
                <DownloadButton
                  theme={theme}
                  onClick={() => downloadAsJson(getPlotDataById('nmda-ampa-ratio'), `nmda-ampa-ratio-${volume_section}-${prelayer}-${postlayer}.json`)}>
                  <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                  <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
                  NMDA/AMPA ratio distribution

                </DownloadButton>
              </div>
            </Collapsible>
          )
        }

        { /*
        <Collapsible title='Short-term plasticity: average traces + mean traces' id='ShortTermPlasticitySection' properties={["Physiology"]}>
          <p>Short-term plasticity: average traces + mean traces</p>
        </Collapsible>
        */ }

        <Collapsible
          title="Distribution of U, D, F, NRRP"
          id="UParameterSection"
          properties={["Physiology"]}
        >
          <div className="flex flex-col gap-12">
            {availablePlots.UParameter && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">U Parameter</div>
                <div className="graph">
                  <DistrbutionPlot
                    plotData={getPlotDataById('u-parameter')}
                    xAxis='u_syn'
                    yAxis='Frequency'
                    xAxisTickStep={1}
                  />
                </div>
                <div className="mt-2">
                  <DownloadButton
                    theme={theme}
                    onClick={() =>
                      downloadAsJson(
                        getPlotDataById('u-parameter'),
                        `u-parameter-${volume_section}-${prelayer}-${postlayer}.json`
                      )
                    }
                  >
                    <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                      {volume_section}
                    </span>
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
                    U Parameter
                  </DownloadButton>
                </div>
              </div>
            )}

            {availablePlots.DParameter && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">D Parameter</div>
                <div className="graph">
                  <DistrbutionPlot
                    plotData={getPlotDataById('d-parameter')}
                    xAxis='d_syn'
                    yAxis='Frequency'
                    xAxisTickStep={100}
                  />
                </div>
                <div className="mt-2">
                  <DownloadButton
                    theme={theme}
                    onClick={() =>
                      downloadAsJson(
                        getPlotDataById('d-parameter'),
                        `d-parameter-${volume_section}-${prelayer}-${postlayer}.json`
                      )
                    }
                  >
                    <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                      {volume_section}
                    </span>
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
                    D Parameter

                  </DownloadButton>
                </div>
              </div>
            )}

            {availablePlots.GSYNX && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">G-SYNX</div>
                <div className="graph">
                  <DistrbutionPlot
                    plotData={getPlotDataById('g-synx')}
                    xAxis='g_syn'
                    yAxis='Frequency'
                    xAxisTickStep={1}
                  />
                </div>
                <div className="mt-2">
                  <DownloadButton
                    theme={theme}
                    onClick={() =>
                      downloadAsJson(
                        getPlotDataById('g-synx'),
                        `g-synx-${volume_section}-${prelayer}-${postlayer}.json`
                      )
                    }
                  >
                    <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                      {volume_section}
                    </span>
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
                    G-SYNX Parameter

                  </DownloadButton>
                </div>
              </div>
            )}

            {availablePlots.NRRPParameter && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">NRRP Parameter</div>
                <div className="graph">
                  <DistrbutionPlot
                    plotData={getPlotDataById('nrrp-parameter')}
                    xAxis='NRRP'
                    yAxis='Frequency'
                    xAxisTickStep={1}
                  />
                </div>
                <div className="mt-2">
                  <DownloadButton
                    theme={theme}
                    onClick={() =>
                      downloadAsJson(
                        getPlotDataById('nrrp-parameter'),
                        `nrrp-parameter-${volume_section}-${prelayer}-${postlayer}.json`
                      )
                    }
                  >
                    <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                      {volume_section}
                    </span>
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
                    NRRP Parameter

                  </DownloadButton>
                </div>
              </div>
            )}
          </div>
        </Collapsible>

        <Collapsible title="Trace" id="TracesSection" className="mt-4">
          {traceData && traceData.individual_traces && traceData.mean_trace && (
            <>
              <div className="graph">
                <TraceGraph plotData={traceData} />
              </div>
              <DownloadButton
                theme={theme}
                onClick={() =>
                  downloadAsJson(
                    getPlotDataById('nrrp-parameter'),
                    `nrrp-parameter-${volume_section}-${prelayer}-${postlayer}.json`
                  )
                }
              >
                <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                  {volume_section}
                </span>
                <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                <span className="!ml-0 collapsible-property small">{postlayer}</span>
                trace

              </DownloadButton>
            </>
          )}
        </Collapsible>

      </DataContainer >
    </>
  )
}

export default withPreselection(
  SchafferCollateralsView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.digitalReconstruction.schafferCollateral,
  },
);