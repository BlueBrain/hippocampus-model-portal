import React from 'react';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';

import { VolumeSection } from '@/types';
import { defaultSelection, volumeSections } from '@/constants';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import VolumeSectionSelector from '@/components/VolumeSectionSelector';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import CellCompositionTable from './cell-composition/CellCompositionTable';
import MECompositionTable from './cell-composition/MECompositionTable';
import { colorName } from './config';

import selectorStyle from '@/styles/selector.module.scss';


const CellCompositionView: React.FC = () => {
  const router = useRouter();

  const { volume_section: volumeSection } = router.query as { volume_section: VolumeSection };

  const setVolumeSectionQuery = (volumeSection: VolumeSection) => {
    const query = { volume_section: volumeSection };
    router.push({ query }, undefined, { shallow: true });
  };

  return (
    <>
      <Filters hasData={true}>
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
                title="Cell composition"
                subtitle="Reconstruction Data"
              />
              <div role="information">
                <InfoBox>
                  <p className="text-tmp">
                    Vivamus vel semper nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                    per inceptos himenaeos. Vivamus ipsum enim, fermentum quis ipsum nec, euismod convallis leo. <br/>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    Sed vel scelerisque felis, quis condimentum felis. Pellentesque dictum neque vel mauris dignissim,
                    vitae ornare arcu sagittis. <br/>
                    Etiam vestibulum, nisi in scelerisque porta, enim est gravida mi,
                    nec pulvinar enim ligula non lorem. Aliquam ut orci est.
                    Praesent tempus sollicitudin ante varius feugiat.
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
            <div className={selectorStyle.row} style={{ maxWidth: '26rem' }}>
              <div className={`${selectorStyle.column} mt-3`}>
                <div className={selectorStyle.head}>Select a volume section</div>
                <div className={selectorStyle.body}>
                <VolumeSectionSelector
                    value={volumeSection}
                    onSelect={setVolumeSectionQuery}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Filters>

      <DataContainer
        navItems={[
          { id: 'cellCompositionSection', label: 'Cell composition' },
          { id: 'MECompositionSection', label: 'ME-composition' },
        ]}
      >
        <Collapsible
          id="cellCompositionSection"
          title="Cell composition"
        >
          <p className="text-tmp mb-3">
            Et quibusdam sunt et accusamus nihil aut officia alias vel galisum laudantium et consequatur adipisci ut
            sint quaerat? Aut mollitia excepturi id adipisci internos et aliquam repellat aut aperiam odit rem earum
            facere vel sequi consequatur ut soluta obcaecati. Non galisum accusantium ut iusto eius aut doloribus
            omnis eum quasi sint nam omnis aspernatur.
          </p>

          <CellCompositionTable volumeSection={volumeSection} />
        </Collapsible>

        <Collapsible
          className="mt-4"
          id="MECompositionSection"
          title="ME-composition"
        >
          <p className="text-tmp mb-3">
            Et quibusdam sunt et accusamus nihil aut officia alias vel galisum laudantium et consequatur adipisci ut
            sint quaerat? Aut mollitia excepturi id adipisci internos et aliquam repellat aut aperiam odit rem earum
            facere vel sequi consequatur ut soluta obcaecati. Non galisum accusantium ut iusto eius aut doloribus
            omnis eum quasi sint nam omnis aspernatur.
          </p>

          <MECompositionTable />
        </Collapsible>
      </DataContainer>
    </>
  );
};

const CellCompositionViewWithPreselection = withPreselection(
  CellCompositionView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.reconstructionData.volume,
  },
);

const qsEntries = [{
  title: 'Volume section',
  key: 'volume_section',
  values: volumeSections,
}];


export default withQuickSelector(
  CellCompositionViewWithPreselection,
  {
    entries: qsEntries,
    color: colorName,
  },
);
