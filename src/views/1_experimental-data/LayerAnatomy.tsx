import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';

// Layout and Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import LayerSelector3D from '@/components/LayerSelector3D';
import ESData from '@/components/ESData';
import LayerThickness from '@/components/LayerThickness';
import LayerAnatomySummary from '@/components/LayerAnatomySummary';

// Query Imports
import { layerAnatomyDataQuery } from '@/queries/es';

// Type Imports
import { Layer, QuickSelectorEntry } from '@/types';

// Constant Imports
import { defaultSelection, layers } from '@/constants';

// HOC Imports
import withPreselection from '@/hoc/with-preselection';

// Local Component Imports
import LayerThicknessTable from './layer-anatomy/thickness';

// Config Imports
import { colorName } from './config';

const LayerAnatomyView: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const theme = 1;
  const currentLayer = router.query.layer as Layer;

  const setLayer = (layer: Layer) => {
    router.push({ query: { layer } }, undefined, { shallow: true });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Layer',
      key: 'layer',
      values: layers,
      setFn: setLayer,
    },
  ];

  return (
    <>
      <Filters theme={theme} hasData={!!currentLayer}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Layer Anatomy"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    The rat hippocampus CA1 is organized into four layers: stratum lacunoso-moleculare (SLM), stratum radiatum (SR), stratum pyramidal (SP), stratum oriens (SO). This section shows the data used to estimate the layer thicknesses.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none justify-center">
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Choose a layer</div>
              <div className="selector__body">
                <LayerSelector3D
                  value={currentLayer}
                  onSelect={setLayer}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        visible={!!currentLayer}
        navItems={[
          { id: 'layerSection', label: 'Layer' },
          { id: 'summarySection', label: 'Summary' },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <ESData query={layerAnatomyDataQuery}>
          {(data) => (
            <>
              {data && (
                <>
                  <Collapsible
                    id="layerSection"
                    title="Layer"
                    properties={[currentLayer]}
                  >
                    <div>
                      <h3 className="text-xl">Layer thickness for CA1</h3>
                      <p className="text-base mt-2 mb-8">
                        The data consist of the reconstruction of the layers (and morphologies) superimposed onto slice images. From the images, we estimated the layer thicknesses, and we summarized the results in the table below.
                      </p>
                    </div>
                    <LayerThicknessTable layer={currentLayer} theme={theme} />
                  </Collapsible>

                  <Collapsible
                    id="summarySection"
                    title="Summary"
                    className="mt-4"
                  >
                    <LayerAnatomySummary data={data} highlightLayer={currentLayer} theme={theme} />
                  </Collapsible>
                </>
              )}
            </>
          )}
        </ESData>
      </DataContainer>
    </>
  );
};

export default withPreselection(LayerAnatomyView, {
  key: 'layer',
  defaultQuery: defaultSelection.experimentalData.layerAnatomy,
});