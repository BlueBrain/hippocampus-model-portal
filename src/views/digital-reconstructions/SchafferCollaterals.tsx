import React, { useState, useEffect } from 'react';
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

import Filters from '@/layouts/Filters';

import { cellGroup, defaultSelection } from '@/constants';

import { Layer, VolumeSection } from '@/types';

import { basePath } from '../../config';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { downloadAsJson } from '@/utils';

const SchafferCollateralsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ volume_section, prelayer, postlayer });
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

  useEffect(() => {
    if (volume_section && prelayer && postlayer) {
      const distributionPlotFile = `${basePath}/data/digital-reconstruction/schaffer-collaterals/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      const sCFile = `${basePath}/data/digital-reconstruction/schaffer-collaterals/${volume_section}/${prelayer}-${postlayer}/schaffer-collaterals.json`;

      // Fetch data from both distributionPlotFile and sCFile
      Promise.all([
        fetch(distributionPlotFile).then(response => response.json()),
        fetch(sCFile).then(response => response.json())
      ])
        .then(([distributionData, scData]) => {
          if (distributionData && Array.isArray(distributionData.values) && scData) {
            const plots = distributionData.values;
            const availablePlots = {

              // -- Anatomy

              //number of synapses per connection distribution + mean and std
              SynapsesPerConnection: plots.some(plot => plot.id === 'synapses-per-connection'),

              //Divergence (connections) distribution + mean and std
              SampleDivergenceByConnection: plots.some(plot => plot.id === 'sample-divergence-by-connection'),

              //Divergence (synapses) distribution + mean and std
              SampleDivergenceBySynapse: plots.some(plot => plot.id === 'sample-divergence-by-synapse'),

              // Laminar distribution of synapses
              LaminarDistribution: scData.laminar_distribution !== undefined,

              //Convergence (connections) distribution + mean and std
              SampleConvergenceByConnection: plots.some(plot => plot.id === 'sample-convergence-by-connection'),

              //Convergence (synapses) distribution + mean and std
              SampleConvergenceBySynapse: plots.some(plot => plot.id === 'sample-convergence-by-synapse'),

              // -- Physiology

              //PSP distribution + mean and std
              PSPAmplitude: plots.some(plot => plot.id === 'psp-amplitude'),

              //CV distribution + mean and std
              PSPCV: plots.some(plot => plot.id === 'psp-cv'),

              //Synapse latency distribution + mean and std
              SynapseLatency: plots.some(plot => plot.id === 'synapse-latency'),
              SynapseLatencyFromSimulation: plots.some(plot => plot.id === 'synapse-latency-for-simulation'),

              //Rise time constant distribution + mean and std
              RiseTimeFromSimulation: plots.some(plot => plot.id === 'rise-time-constant-for-simulation'),

              //Decay time constant distribution + mean and std
              DecayTimeConstant: plots.some(plot => plot.id === 'decay-time-constant'),
              DecayTimeConstantFromSimulation: plots.some(plot => plot.id === 'decay-time-constant-for-simulation'),

              //NMDA/AMPA ratio distribution + mean and std
              NMDAAMPARatio: plots.some(plot => plot.id === 'nmda-ampa-ratio'),

              //Distribution + mean and std of U, D, F, NRRP
              UParameter: plots.some(plot => plot.id === 'u-parameter'),
              DParameter: plots.some(plot => plot.id === 'd-parameter'),
              GSYNX: plots.some(plot => plot.id === 'g-synx'),
              NRRPParameter: plots.some(plot => plot.id === 'nrrp-parameter'),



            };
            setAvailablePlots(availablePlots);
            setFactsheetData([...plots, scData.laminar_distribution]);
          } else {
            console.error('Unexpected data format:', distributionData, scData);
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
                    list={["All"]}
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

      <DataContainer theme={theme}
        navItems={[
          { id: 'NbSynapsesPerConnectionSection', label: 'Nb of synapses p.connection dist.' },
          { id: 'DivergenceConnectionSection', label: 'Divergence connections dist.' },
          { id: 'DivergenceSynapsesSection', label: 'Divergence synapses dist.' },
          { id: 'LaminarDistributionSynapsesSection', label: 'Laminar dist. of synapses' },
          { id: 'SampleConvergenceByConnectionSection', label: 'Convergence connections dist.' },
          { id: 'SampleConvergenceBySynapsesSection', label: 'Convergence synapses dist.' },
          { id: 'MeanConnectionProbabilitySection', label: 'Mean connection probability' },
          { id: 'PSPAmplitudeSection', label: 'PSP Amplitude dist.' },
          { id: 'PSPCVSection', label: 'PSP CV dist.' },
          { id: 'SynapseLatencySection', label: 'Synapse latency dist.' },
          { id: 'RiseTimeSection', label: 'Rise time constant dist.' },
          { id: 'DecayTimeConstantSection', label: 'Decay time constant dist.' },
          { id: 'NMDAAMPARatioSection', label: 'NMDA/AMPA ratio dist.' },
          { id: 'UParameterSection', label: 'U, D, F, NRRP dist.' },
        ]}
      >

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
        </Collapsible>

        {availablePlots.SampleConvergenceByConnection && (
          <Collapsible title="Convergence (connections) distribution + mean and std" id="SampleConvergenceByConnectionSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-convergence-by-connection')}
                xAxis='Convergence'
                yAxis='Frequency'
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
          <Collapsible title="Convergence (synapses) distribution + mean and std" id="SampleConvergenceBySynapsesSection" properties={["Anatomy"]}>
            <div className="graph">
              <DistrbutionPlot
                plotData={getPlotDataById('sample-convergence-by-synapse')}
                xAxis='Convergence'
                yAxis='Frequency'
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

        <Collapsible title='Mean connection probability + std' id='MeanConnectionProbabilitySection' properties={["Anatomy"]}>
          <p>Mean connection</p>
        </Collapsible>

        {availablePlots.PSPAmplitude && (
          <Collapsible title="PSP Amplitude" id="PSPAmplitudeSection" properties={["Physiology"]}>
            <div className="graph">

              <DistrbutionPlot
                plotData={getPlotDataById('psp-amplitude')}
                xAxis='PSP Amplitude'
                yAxis='Frequency'
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
            title="Synapse latency distribution + mean and std"
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
            <Collapsible title="Rise time constant distribution + mean and std" id="RiseTimeSection" properties={["Physiology"]}>
              <div className="graph">
                <DistrbutionPlot
                  plotData={getPlotDataById('rise-time-constant-for-simulation')}
                  xAxis='Rise Time'
                  yAxis='Frequency'
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

        {(availablePlots.DecayTimeConstant || availablePlots.DecayTimeConstantFromSimulation) && (
          <Collapsible
            title="Decay time constant distribution + mean and std"
            id="DecayTimeConstantSection"
            properties={["Physiology"]}
          >
            <div className="flex flex-col gap-12">

              {availablePlots.DecayTimeConstant && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Decay time constant distribution</div>
                    <div className="graph">
                      <DistrbutionPlot
                        plotData={getPlotDataById('decay-time-constant')}
                        xAxis='Decay Time'
                        yAxis='Frequency'
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
                        Decay time constant distribution
                        <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                        <span className="!ml-0 collapsible-property small">{postlayer}</span>
                      </DownloadButton>
                    </div>
                  </div>
                </>
              )}

              {availablePlots.DecayTimeConstantFromSimulation && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Decay time constant distribution for simulation</div>
                    <div className="graph">
                      <DistrbutionPlot
                        plotData={getPlotDataById('decay-time-constant-for-simulation')}
                        xAxis='Decay Time'
                        yAxis='Frequency'
                      />
                    </div>
                    <div className="mt-2">
                      <DownloadButton
                        theme={theme}
                        onClick={() =>
                          downloadAsJson(
                            getPlotDataById('decay-time-constant-for-simulation'),
                            `decay-time-constant-for-simulation-${volume_section}-${prelayer}-${postlayer}.json`
                          )
                        }
                      >
                        <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                          {volume_section}
                        </span>
                        Decay time constant distribution for simulation
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
          availablePlots.NMDAAMPARatio && (
            <Collapsible title="NMDA/AMPA ratio distribution + mean and std" id="NMDAAMPARatioSection" properties={["Physiology"]}>
              <div className="graph">
                <DistrbutionPlot
                  plotData={getPlotDataById('nmda-ampa-ratio')} />
              </div>
              <div className="mt-4">
                <DownloadButton
                  theme={theme}
                  onClick={() => downloadAsJson(getPlotDataById('nmda-ampa-ratio'), `nmda-ampa-ratio-${volume_section}-${prelayer}-${postlayer}.json`)}>
                  <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                  NMDA/AMPA ratio distribution
                  <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>

                </DownloadButton>
              </div>
            </Collapsible>
          )
        }

        <Collapsible
          title="Distribution + mean and std of U, D, F, NRRP"
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
                    U Parameter
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
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
                    D Parameter
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
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
                    G-SYNX Parameter
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
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
                    NRRP Parameter
                    <span className="!mr-0 collapsible-property small">{prelayer}</span> -{" "}
                    <span className="!ml-0 collapsible-property small">{postlayer}</span>
                  </DownloadButton>
                </div>
              </div>
            )}
          </div>
        </Collapsible>
      </DataContainer >
    </>
  )
}

export default SchafferCollateralsView;