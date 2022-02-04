import React from 'react';
import { useRouter } from 'next/router';
import { useNexusContext } from '@bbp/react-nexus';
import { Row, Col } from 'antd';

import Filters from '../../layouts/Filters';
import StickyContainer from '../../components/StickyContainer';
import Title from '../../components/Title';
import InfoBox from '../../components/InfoBox';
import DataContainer from '../../components/DataContainer';
import Collapsible from '../../components/Collapsible';
import LayerSelector from '../../components/LayerSelector';
import { colorName } from './config';
import { layerAnatomyDataQuery } from '../../queries/es';
import ESData from '../../components/ESData';
import LayerThickness from '../../components/LayerThickness';
import LayerAnatomySummary from '../../components/LayerAnatomySummary';
import { Layer } from '../../types';

import styles from '../../styles/experimental-data/neuron-morphology.module.scss';


const LayerAnatomyView: React.FC = () => {
  const router = useRouter();
  const nexus = useNexusContext();

  const { layer } = router.query as { layer: Layer};

  const setLayerQuery = (layer: Layer) => {
    const query = { layer };
    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <>
      <Filters hasData={!!layer}>
        <Row
          className="w-100"
          gutter={[0,20]}
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
              />
              <div role="information">
                <InfoBox>
                  <p className="text-tmp">
                    The rat primary somatosensory cortex (SSCx) is responsible for the processing of sensory information
                    such as touch from the entire body. <br/>
                    It has a laminar structure where neurons are organized across six distinct layers - with layer 1
                    at the surface and layer 6 at the bottom. <br/>
                    This section showcases the data we have acquired and organized on the anatomy of SSCx
                    from cortical slices in developing rats.
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
            <div className={styles.selector} style={{ maxWidth: '26rem' }}>
              <div className={styles.selectorColumn}>
                <div className={styles.selectorHead}>Choose a layer</div>
                <div className={styles.selectorBody}>
                  <LayerSelector
                    value={layer as Layer}
                    onSelect={setLayerQuery}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer visible={!!layer}>
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
                    <p className="text-tmp">
                      Data are provided in the form of raw microscopy images of NeuN
                      (neuron-specific nuclear protein) stained coronal slices with annotations of individual layer extents,
                      and spreadsheets summarizing measurements of layer thicknesses.
                    </p>
                  </div>

                  <LayerThickness layer={layer as Layer} data={data} />
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


export default LayerAnatomyView;
