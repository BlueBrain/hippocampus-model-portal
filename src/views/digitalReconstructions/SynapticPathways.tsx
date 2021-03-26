import React from 'react';

import SynapticPathwaysTemplates from '../../templates/SynapticPathways';
import { pathwayFactsheetPath } from '../../queries/http';
import DataContainer from '../../components/DataContainer';
import HttpData from '../../components/HttpData';
import Factsheet from '../../components/Factsheet';
import { colorName, sectionTitle } from './config';
import Collapsible from '../../components/Collapsible';
import Synaptome from '../../components/Synaptome';

import ImageViewer from '../../components/ImageViewer';
import Button from '../../components/Button';

const RecSynPathwaysView = () => (
  <SynapticPathwaysTemplates
    color={colorName}
    sectionTitle={sectionTitle}
  >
    {(subregion, pathway) => (
      <DataContainer visible={!!pathway}>
        <Collapsible title={`Pathway ${pathway}`}>
          <HttpData path={pathwayFactsheetPath(subregion, pathway)}>
            {data => (
              <>
                <h3 className="mb-2">Anatomy</h3>
                {data && <Factsheet facts={data[0].values} />}
                <h3 className="mt-3 mb-2">Physiology</h3>
                {data && <Factsheet className="mb-3" facts={data[1].values} />}
              </>
            )}
          </HttpData>

          <div className="row around-xs mt-4">
            <div className="col-xs-6 col-sm-2">
              <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/148969/figure1.png" />
            </div>
            <div className="col-xs-6 col-sm-2">
              <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/148969/diagram.png" />
            </div>
            <div className="col-xs-6 col-sm-2">
              <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/148969/figure3.png" />
            </div>
            <div className="col-xs-6 col-sm-2">
              <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/148969/figure4.png" />
            </div>
            <div className="col-xs-6 col-sm-2">
              <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/148969/rendering.png" />
            </div>
          </div>

          <Synaptome label="Pre-synaptic Synaptome L1_NGC-DA" mtype="L1_NGC-DA"/>
          <Synaptome label="Post-synaptic Synaptome L23_BTC" mtype="L23_BTC"/>
        </Collapsible>

        <div className="mt-2">
          <Collapsible color="red" title="Simulations">
            <div className="row">
              <div className="col-xs-4">
                Definition : explain that these are in silico experiments. Explanation of this exact simulation.
              </div>
              <div className="col-xs-4">
                <ImageViewer border src="https://bbp.epfl.ch/nmc-portal/documents/10184/1204661/11_maya_christmasTree.jpg" />
              </div>
              <div className="col-xs-4">
                <h3 className="mt-0">Explore data</h3>
                <ul>
                  <li> <Button>Pair Recording App</Button> </li>
                  <li> <Button>Visualize with Brayns</Button> </li>
                </ul>
              </div>
            </div>
          </Collapsible>
        </div>
      </DataContainer>
    )}
  </SynapticPathwaysTemplates>
);

export default RecSynPathwaysView;
