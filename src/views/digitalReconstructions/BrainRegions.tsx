import React from 'react';

import BrainRegionTemplate from '../../templates/BrainRegions';
import DataContainer from '../../components/DataContainer';
import Factsheet from '../../components/Factsheet';
import HttpData from '../../components/HttpData';
import { colorName, sectionTitle } from './config';
import { regionCircuitFactsheetPath, subregionCircuitFactsheetPath } from '../../queries/http';
import Collapsible from '../../components/Collapsible';
import ImageViewer from '../../components/ImageViewer';
import Button from '../../components/Button';

const BrainRegionsView = () => (
  <BrainRegionTemplate
    color={colorName}
    sectionTitle={sectionTitle}
  >
    {(subregion) => (
      <DataContainer visible={!!subregion}>
        <Collapsible title="S1 (Region) Factsheet">
          <HttpData path={regionCircuitFactsheetPath()}>
            {data => (
              <>
                {data && <Factsheet facts={data[0].values} />}
              </>
            )}
          </HttpData>
        </Collapsible>

        <Collapsible
          className="mt-4"
          title={`${subregion} (Sub-region) Factsheet`}
        >
          <HttpData path={subregionCircuitFactsheetPath(subregion)}>
            {data => (
              <>
                {data && <Factsheet facts={data[0].values} />}
              </>
            )}
          </HttpData>
        </Collapsible>

        <div className="mt-4">
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
                  <li><Button>Pair Recording App</Button></li>
                  <li><Button>Visualize with Brayns</Button></li>
                </ul>
              </div>
            </div>
          </Collapsible>
        </div>

      </DataContainer>
    )}
  </BrainRegionTemplate>
);

export default BrainRegionsView;

