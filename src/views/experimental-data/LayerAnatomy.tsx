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
import { Layer } from '@/types';

// Constant Imports
import { defaultSelection, layers } from '@/constants';

// HOC Imports
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

// Local Component Imports
import LayerThicknessTable from './layer-anatomy/thickness';

// Config Imports
import { colorName } from './config';

const LayerAnatomyView: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const theme = 1;
  const { layer } = router.query as { layer: Layer };

  // Function to update the layer query parameter
  const setLayerQuery = (layer: Layer) => {
    const query = { layer };
    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <>
      <Filters theme={theme} hasData={!!layer}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">

          <div className="w-full lg:w-1/2 mb-12 md:mb-0">
            <StickyContainer>
              <Title
                primaryColor={colorName}
                title="Layer Anatomy"
                subtitle="Experimental Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p >
                    The rat hippocampus CA1 is organized into four layers: stratum lacunoso-moleculare (SLM), stratum radiatum (SR), stratum pyramidal (SP), stratum oriens (SO). This section shows the data used to estimate the layer thicknesses.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
          <div className="w-full lg:w-1/2 set-accent-color--grey flex justify-center mb-12 md:mb-0">
            <div style={{ maxWidth: '26rem' }}>
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>Choose a layer</div>
                <div className="selector__body">
                  <LayerSelector3D
                    value={layer}
                    onSelect={setLayerQuery}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters >

      <DataContainer theme={theme}
        visible={!!layer}
        navItems={[
          { id: 'layerSection', label: 'Layer' },
          { id: 'summarySection', label: 'Summary' },
        ]}
      >
        <ESData query={layerAnatomyDataQuery}>
          {data => (
            <>
              {data && (
                <>
                  <Collapsible
                    id="layerSection"
                    title="Layer"
                    properties={[layer]} // Assuming 'layer' is a string
                  >

                    <div>
                      <h3 className='text-xl mt-2'>Layer thickness for CA1</h3>
                      <p className='text-base mt-2 mb-5'>
                        The data consist of the reconstruction of the layers (and morphologies) superimposed onto slice images. From the images, we estimated the layer thicknesses, and we summarized the results in the table below.
                      </p>
                    </div>
                    <LayerThicknessTable layer={layer} />
                  </Collapsible>

                  <Collapsible
                    id="summarySection"
                    title="Summary"
                    className="mt-4"
                  >
                    <LayerAnatomySummary data={data} highlightLayer={layer} />
                  </Collapsible>
                </>
              )}
            </>
          )}
        </ESData>
      </DataContainer >
    </>
  );
};

const hocPreselection = withPreselection(LayerAnatomyView, {
  key: 'layer',
  defaultQuery: defaultSelection.experimentalData.layerAnatomy,
});

const qsEntries = [{
  title: 'Layer',
  key: 'layer',
  values: layers,
}];

export default withQuickSelector(hocPreselection, {
  entries: qsEntries,
  color: colorName,
});
