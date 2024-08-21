import React, { useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useRouter } from 'next/router';

import Filters from '@/layouts/Filters';
import { regionFactsheetPath } from '@/queries/http';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import Factsheet from '@/components/Factsheet';
import HttpData from '@/components/HttpData';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import { VolumeSection } from '@/types';
import { defaultSelection, volumeSections } from '@/constants';
import withPreselection from '@/hoc/with-preselection';
import withQuickSelector from '@/hoc/with-quick-selector';

import { basePath, dataPath } from '@/config';

import RegionViewer from './region/region-viewer/RegionViewer';
import VolumeSectionSelector3D from '@/components/VolumeSectionSelector3D';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { downloadAsJson } from '@/utils';

const RegionView: React.FC = () => {
  const router = useRouter();
  const theme = 3;
  const { volume_section: volumeSection } = router.query as { volume_section: VolumeSection | undefined };

  const [isViewerReady, setIsViewerReady] = useState(false);

  const setVolumeSectionQuery = (volumeSection: VolumeSection) => {
    const query = { volume_section: volumeSection };
    router.push({ query }, undefined, { shallow: true });
  };

  const qsEntries = [{
    title: 'Volume section',
    key: 'volume_section',
    values: volumeSections,
  }];


  const validVolumeSection: VolumeSection = volumeSection ?? defaultSelection.digitalReconstruction.region.volume_section as VolumeSection;

  if (!validVolumeSection) {
    return null; // Or handle this case appropriately
  }

  const getVolumeDescription = (section: VolumeSection) => {
    switch (section) {
      case 'region':
        return "Region CA1."
      case 'cylinder':
        return "Cylindrical subvolume of radius 300 um from the dorsal CA1."
      case 'slice':
        return "Coronal slice of 400 um from the dorsal CA1."
      default:
        return '';
    }
  };

  return (
    <>
      <Filters theme={theme} hasData={true}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Region"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    Reconstruction data are combined to produce an instance of the CA1 network model.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center">
            <div className={`selector__column selector__column--lg theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>Choose a layer</div>
              <div className="selector__body">
                <VolumeSectionSelector3D
                  value={volumeSection}
                  onSelect={setVolumeSectionQuery}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>


      <DataContainer theme={theme}
        visible={!!volumeSection}
        navItems={[
          { id: 'ViewerSection', label: "Viewer" },
          { id: 'factsheetSection', label: "Factsheet" },
        ]}
        quickSelectorEntries={qsEntries}
      >

        <Collapsible id='viewerSection' title={'Viewer'}>
          <h3>{getVolumeDescription(validVolumeSection)}</h3>
          <div className="text-base mb-2">The image shows soma positions.</div>

          <div className="graph no-padding">
            <RegionViewer
              meshPath={`${basePath}/resources/3d/3_digital-reconstruction/region/region.obj`}
              volumeSection={validVolumeSection}
              onReady={() => setIsViewerReady(true)} />
          </div>
        </Collapsible>

        <Collapsible id="factsheetSection" title="Factsheet">


          {validVolumeSection && (

            <HttpData path={`${dataPath}3_digital-reconstruction/region/${volumeSection}/factsheet.json`}>

              {(data, loading) => (
                <Spin spinning={loading}>
                  {data && (
                    <>
                      <h3 className="mt-2">Neuronal anatomy</h3>
                      <Factsheet facts={data.neuronalAnatomy} />

                      <h3 className="mt-3">Neuronal physiology</h3>
                      <Factsheet facts={data.neuronalPhysiology} />

                      <h3 className="mt-3">Synaptic anatomy</h3>
                      <Factsheet facts={data.synapticAnatomy} />

                      <h3 className="mt-3">Synaptic physiology</h3>
                      <Factsheet facts={data.synapticPhysiology} />

                      <h3 className="mt-3">Network anatomy</h3>
                      <Factsheet facts={data.networkAnatomy} />

                      <h3 className="mt-3">Schaffer collaterals</h3>
                      <Factsheet facts={data.schafferCollaterals} />

                      <div className="text-right mt-2">
                        <DownloadButton
                          theme={theme} onClick={() => downloadAsJson(data, `region-factsheet.json`)} >
                          Region Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </Spin>
              )}
            </HttpData>
          )}
        </Collapsible>
      </DataContainer>
    </>
  );
};



export default withPreselection(
  RegionView,
  {
    key: 'volume_section',
    defaultQuery: defaultSelection.digitalReconstruction.region,
  },
);


