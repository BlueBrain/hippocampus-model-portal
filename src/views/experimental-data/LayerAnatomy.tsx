import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Row, Col } from 'antd';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import LayerSelector3D from '@/components/LayerSelector3D';
import { layerAnatomyDataQuery } from '@/queries/es';
import ESData from '@/components/ESData';
import LayerThickness from '@/components/LayerThickness';
import LayerAnatomySummary from '@/components/LayerAnatomySummary';
import { Layer } from '@/types';
import { defaultSelection, layers } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import LayerThicknessTable from "./layer-anatomy/thickness";

import { colorName } from './config';


const LayerAnatomyView: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const theme = 1;


  const { layer } = router.query as { layer: Layer };

  const setLayerQuery = (layer: Layer) => {
    const query = { layer };
    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <>
      <Filters theme={theme} hasData={!!layer}>
        <Row
          className="w-100"
          gutter={[0, 20]}
        >
          <Col
            className="mb-2"
            xs={24}
            lg={12}
          >
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
          </Col>
          <Col
            className={`set-accent-color--${'grey'} mb-2`}
            xs={24}
            lg={12}
          >
            <div style={{ maxWidth: '26rem' }}>
              <div className={"selector__column theme-" + theme}>
                <div className={"selector__head theme-" + theme}>Choose a layer</div>
                <div className={"selector__body"}>
                  <LayerSelector3D
                    value={layer as Layer}
                    onSelect={setLayerQuery}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters >

      <DataContainer
        visible={!!layer}
        navItems={[
          { id: 'layerSection', label: 'Layer' },
          { id: 'summarySection', label: 'Summary' },
        ]}
      >
        <ESData query={layerAnatomyDataQuery}>
          {data => (
            <>{data && (
              <>
                <Collapsible
                  id="layerSection"
                  title={`Layer ${layer}`}
                >
                  <div>
                    <h3>Layer thickness for CA1</h3>
                    <p>
                      The data consist of the reconstruction of the layers (and morphologies) superimposed onto slice images. From the images, we estimated the layer thicknesses, and we summarized the results in the table below.

                    </p>
                  </div>

                  <LayerThicknessTable layer={layer as Layer} />

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
      </DataContainer>
    </>
  );
};

const hocPreselection = withPreselection(
  LayerAnatomyView,
  {
    key: 'layer',
    defaultQuery: defaultSelection.experimentalData.layerAnatomy,
  },
);

const qsEntries = [{
  title: 'Layer',
  key: 'layer',
  values: layers,
}];

export default withQuickSelector(
  hocPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
