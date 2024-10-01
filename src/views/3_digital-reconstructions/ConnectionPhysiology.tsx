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
      const distributionPlotFile = `${dataPath}/3_digital-reconstruction/connection-physiology/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;

      fetch(distributionPlotFile)
        .then(response => response.json())
        .then(distributionData => {
          if (distributionData && Array.isArray(distributionData.values)) {
            const plots = distributionData.values;

            const availablePlots = {
              PSPAmplitude: plots.some(plot => plot.id === 'psp-amplitude'),
              PSPCV: plots.some(plot => plot.id === 'psp-cv'),
              SynapsesLatency: plots.some(plot => plot.id === 'synapse-latency'),
              SynapsesLatencyFromSimulation: plots.some(plot => plot.id === 'synapse-latency-from-simulation'),
              RiseTimeCOnstant: plots.some(plot => plot.id === 'rise-time-constant'),
              DecayTimeConstant: plots.some(plot => plot.id === 'decay-time-constant'),
              DecayTimeConstantFromSimulation: plots.some(plot => plot.id === 'decay-time-constant-from-sumluation'),
              NMDAAMPARatio: plots.some(plot => plot.id === 'nmda-ampa-ratio'),
              UParameter: plots.some(plot => plot.id === 'u-parameter'),
              DParameter: plots.some(plot => plot.id === 'd-parameter'),
              FParameter: plots.some(plot => plot.id === 'f-parameter'),
              NRRPParameter: plots.some(plot => plot.id === 'nrrp-parameter'),
              GSYNX: plots.some(plot => plot.id === 'g-synx'),
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
          { id: 'PSPAmplitudeSection', label: 'PSP Amplitude' },
          { id: 'PSPCVSection', label: 'PSP CV' },
          { id: 'SynapsesLatencySection', label: 'Synapses Latency' },
          { id: 'RiseTimeCOnstantSection', label: 'Rise Time Constant' },
          { id: 'DecayTimeConstantSection', label: 'Decay Time Constant' },
          { id: 'NMDAAMPARatioSection', label: 'NMAA/AMPA Ratio' },
          { id: 'UDFNRRPSection', label: 'U, D, F, NRRP Parameters and G-SYNX ' },
        ]}
        quickSelectorEntries={qsEntries}
      >


        {availablePlots.PSPAmplitude && (
          <Collapsible title="PSP Amplitude" id="PSPAmplitudeSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot xAxisTickStep={1} plotData={getPlotDataById('psp-amplitude')} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('psp-amplitude'), `psp-amplitude-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                PSP Amplitude
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {availablePlots.PSPCV && (
          <Collapsible title="PSP CV" id="PSPCVSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot
                plotData={getPlotDataById('psp-cv')}
                xAxisTickStep={.2} />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('psp-cv'), `psp-cv-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                PSP CV
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {(availablePlots.SynapsesLatency || availablePlots.SynapseLatencyFromSimulation) && (
          <Collapsible
            title="Synapse latency"
            id="SynapsesLatencySection"
          >
            <div className="flex flex-col gap-12">

              {availablePlots.SynapsesLatency && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Synapse Latency</div>
                    <div className="graph">
                      <DistibutionPlot
                        plotData={getPlotDataById('synapse-latency')}
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

              {availablePlots.SynapsesLatencyFromSimulation && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Synapse Latency for simulation</div>
                    <div className="graph">
                      <DistibutionPlot
                        plotData={getPlotDataById('synapse-latency-from-simulation')}
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
                            getPlotDataById('synapses-latency-for-simulation'),
                            `synapses-latency-for-simulation-${volume_section}-${prelayer}-${postlayer}.json`
                          )
                        }
                      >
                        <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                          {volume_section}
                        </span>
                        Synapse latency from simulation
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

        {availablePlots.RiseTimeCOnstant && (
          <Collapsible title="Rise Time Constant" id="RiseTimeCOnstantSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot xAxisTickStep={1} plotData={getPlotDataById('rise-time-constant')}
              />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('rise-time-constant'), `rise-time-constant-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                Rise Time Constant
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        {(availablePlots.DecayTimeConstant || availablePlots.DecayTimeConstantFromSimulation) && (
          <Collapsible
            title="Decay Time Constant"
            id="DecayTimeConstantSection"
          >
            <div className="flex flex-col gap-12">

              {availablePlots.DecayTimeConstant && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Decay time constant</div>
                    <div className="graph">
                      <DistibutionPlot
                        plotData={getPlotDataById('decay-time-constant')}
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
                            getPlotDataById('decay-time-constant'),
                            `decay-time-constant-${volume_section}-${prelayer}-${postlayer}.json`
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

              {availablePlots.DecayTimeConstantFromSimulation && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className="text-lg mb-2">Decay time constant from simulation</div>
                    <div className="graph">
                      <DistibutionPlot
                        plotData={getPlotDataById('decay-time-constant-from-sumluation')}
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
                            getPlotDataById('decay-time-constant-from-simulation'),
                            `decay-time-constant-from-simulation-${volume_section}-${prelayer}-${postlayer}.json`
                          )
                        }
                      >
                        <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                          {volume_section}
                        </span>
                        Synapse latency from simulation
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

        {availablePlots.RiseTimeCOnstant && (
          <Collapsible title="NMAA/AMPA Ratio" id="NMDAAMPARatioSection" className="mt-4">
            <div className="graph">
              <DistibutionPlot xAxisTickStep={.5} plotData={getPlotDataById('nmda-ampa-ratio')}
              />
            </div>
            <div className="mt-4">
              <DownloadButton theme={theme} onClick={() => downloadAsJson(getPlotDataById('nmda-ampa-ratio'), `nmda-ampa-ratio-${volume_section}-${prelayer}-${postlayer}.json`)}>
                <span style={{ textTransform: "capitalize" }} className='collapsible-property small'>{volume_section}</span>
                NMAA/AMPA Ratio
                <span className='!mr-0 collapsible-property small '>{prelayer}</span> - <span className='!ml-0 collapsible-property small '>{postlayer}</span>
              </DownloadButton>
            </div>
          </Collapsible>
        )}

        <Collapsible
          title="U, D, F, NRRP Parameters and G-SYNX "
          id="UDFNRRPSection"
          properties={["Physiology"]}
        >
          <div className="flex flex-col gap-12">
            {availablePlots.UParameter && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">U Parameter</div>
                <div className="graph">
                  <DistibutionPlot
                    plotData={getPlotDataById('u-parameter')}
                    xAxis='u_syn'
                    yAxis='Frequency'
                    xAxisTickStep={.1}
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
                  <DistibutionPlot
                    plotData={getPlotDataById('d-parameter')}
                    xAxis='d_syn'
                    yAxis='Frequency'
                    xAxisTickStep={500}
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

            {availablePlots.FParameter && (
              <div className='flex flex-col gap-2'>
                <div className="text-lg mb-2">F Parameter</div>
                <div className="graph">
                  <DistibutionPlot
                    plotData={getPlotDataById('f-parameter')}
                    xAxis='f_syn'
                    yAxis='Frequency'
                    xAxisTickStep={500}
                  />
                </div>
                <div className="mt-2">
                  <DownloadButton
                    theme={theme}
                    onClick={() =>
                      downloadAsJson(
                        getPlotDataById('f-parameter'),
                        `f-parameter-${volume_section}-${prelayer}-${postlayer}.json`
                      )
                    }
                  >
                    <span style={{ textTransform: "capitalize" }} className="collapsible-property small">
                      {volume_section}
                    </span>
                    F Parameter
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
                  <DistibutionPlot
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
                  <DistibutionPlot
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
  );
};


export default SynapsesView;
