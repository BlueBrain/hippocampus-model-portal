import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Row, Col, Spin } from 'antd';

import { Layer, VolumeSection } from '@/types';
import { layers, cellGroup, defaultSelection } from '@/constants';
import { colorName } from './config';
import { connectionViewerDataPath } from '@/queries/http';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import ConnectionViewer from '@/components/ConnectionViewer';
import HttpData from '@/components/HttpData';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import List from '@/components/List';
import QuickSelector from '@/components/QuickSelector';

import selectorStyle from '../../styles/selector.module.scss';

const ConnectionsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ volume_section, prelayer, postlayer });
  const [connViewerReady, setConnViewerReady] = useState<boolean>(false);

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
    setParams({ volume_section, prelayer, postlayer });
    setQuickSelection(prev => ({ ...prev, volume_section }));
  };

  const setPreLayerQuery = (prelayer: Layer) => {
    setParams({ volume_section, prelayer, postlayer });
    setQuickSelection(prev => ({ ...prev, prelayer }));
  };

  const setPostLayerQuery = (postlayer: Layer) => {
    setParams({ volume_section, prelayer, postlayer });
    setQuickSelection(prev => ({ ...prev, postlayer }));
  };

  useEffect(() => {
    setConnViewerReady(false);
  }, [prelayer, postlayer]);

  return (
    <>
      <Filters theme={theme} hasData={!!prelayer && !!postlayer}>
        <div className="w-full flex flex-wrap">
          <div className="w-full lg:w-1/2 mb-2">
            <StickyContainer centered={true}>
              <Title
                primaryColor={colorName}
                title="Connections"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined <Link href={"/experimental-data/connection-anatomy/"} className={`link theme-${theme}`}>literature data</Link> and predictions on <Link href={"/reconstruction-data/connections/"} className={`link theme-${theme}`}>uncharacterized pathways</Link> to reconstruct the CA1 internal connection anatomy. The resulting connectome consists of 821 M synapses. For each circuit, each pathway is analyzed in terms of number of synapses per connection, divergence, convergence, and connection probability.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
          <div className="w-full lg:w-1/2 mb-2 flex flex-col">
            <div className="w-full">
              <div className={selectorStyle.row}>
                <div className={`selector__column mt-3 theme-${theme}`}>
                  <div className={`selector__head theme-${theme}`}>1. Select a volume section</div>
                  <div className="selector__body">
                    <VolumeSectionSelector3D
                      value={volume_section}
                      onSelect={setVolumeSectionQuery}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/2 px-2 mb-2">
                <div className={selectorStyle.row}>
                  <div className={`selector__column mt-3 theme-${theme}`}>
                    <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                    <div className="selector__body">
                      <List
                        block
                        list={cellGroup}
                        value={prelayer}
                        title="m-type"
                        color={colorName}
                        onSelect={setPreLayerQuery}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-2 mb-2">
                <div className={selectorStyle.row}>
                  <div className={`selector__column mt-3 theme-${theme}`}>
                    <div className={`selector__head theme-${theme}`}>3. Select a post-synaptic cell group</div>
                    <div className="selector__body">
                      <List
                        block
                        list={cellGroup}
                        value={postlayer}
                        title="m-type"
                        color={colorName}
                        onSelect={setPostLayerQuery}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <QuickSelector
        color={colorName}
        entries={[
          {
            title: 'Volume section',
            currentValue: quickSelection.volume_section,
            values: layers,
            onChange: setVolumeSectionQuery,
            width: '120px',
          },
          {
            title: 'Pre-syn layer',
            currentValue: quickSelection.prelayer,
            values: layers,
            onChange: setPreLayerQuery,
            width: '80px',
          },
          {
            title: 'Post-syn layer',
            currentValue: quickSelection.postlayer,
            values: layers,
            onChange: setPostLayerQuery,
            width: '80px',
          },
        ]}
      />
      <DataContainer
        visible={!!prelayer && !!postlayer}
        navItems={[
          { id: 'pathwaySection', label: 'Pathway' },
          { id: 'synaptomesSection', label: 'Synaptomes' },
          { id: 'simulationsSection', label: 'Simulations' },
        ]}
      >
        <Collapsible
          id="pathwaySection"
          title={`Pathway ${prelayer}-${postlayer}`}
        >
          <h3 className="text-tmp">Pathway factsheet</h3>
          <h3 className="text-tmp">Synaptic anatomy&physiology distribution plots</h3>
          <h3 className="text-tmp">Exemplar connection</h3>

          <HttpData path={connectionViewerDataPath(prelayer, postlayer)}>
            {(data) => (
              <div className="mt-3">
                <h3>Exemplar connection 3D viewer</h3>
                <Spin spinning={!connViewerReady}>
                  <ConnectionViewer data={data} onReady={() => setConnViewerReady(true)} />
                </Spin>
              </div>
            )}
          </HttpData>
        </Collapsible>

        <Collapsible
          id="synaptomesSection"
          title="Synaptomes"
          className="mt-4"
        >
          <h3 className="text-tmp">Text</h3>
          <h3 className="text-tmp">Pre-synaptic Synaptome plots + render</h3>
          <h3 className="text-tmp">Post-synaptic Synaptome plots + render</h3>
        </Collapsible>

        <Collapsible
          id="simulationsSection"
          title="Simulations"
          className="mt-4"
        >
          <h3 className="text-tmp">Text + images/videos? + links to the pair recording app</h3>
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default ConnectionsView;