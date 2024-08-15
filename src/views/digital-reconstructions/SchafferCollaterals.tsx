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
      const filePath = `${basePath}/data/digital-reconstruction/connections/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      fetch(filePath)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.values)) {
            const plots = data.values;
            const availablePlots = {
              boutonDensitySection: plots.some(plot => plot.id === 'bouton-density'),
              // More plots can be added here
            };
            setAvailablePlots(availablePlots);
            setFactsheetData(plots);
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
                title="Schaffer Collaterals"
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
          { id: 'anatomySection', label: 'Anatomy' },
          { id: 'physiologySection', label: 'Physiology' }
        ]}
      >
        <Collapsible id="anatomySection" title="Anatomy" >
          <p className='mb-4'>We used available <Link href={"/reconstruction-data/schaffer-collaterals"}>data</Link> to predict the anatomy of the SC. The connections between CA3 and CA1 can be analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.</p>

        </Collapsible>

        <Collapsible id="physiologySection" title="Physiology">
          <p className='mb-4'>We used available <Link href={"/reconstruction-data/schaffer-collaterals"}>data</Link> to predict the physiology of the SC. The synapses between CA3 and CA1 can be analyzed in terms of PSP, latency, kinetics, NMDA/AMPA ratio, and short-term plasticity.</p>
        </Collapsible>

      </DataContainer >
    </>
  )
}


export default SchafferCollateralsView;
