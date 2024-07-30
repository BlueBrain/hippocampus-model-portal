import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import selectorStyle from '@/styles/selector.module.scss';

import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import CellDensityTable from './cell-density/CellDensity';


const CellDensityView: React.FC = () => {

    const theme = 1;

    return (
        <>
            <Filters>
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
                                title="Cell Density"
                                subtitle="Experimental Data"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        We collected data on cell density for different neuronal classes.
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
                        <div className={selectorStyle.selector} style={{ maxWidth: '26rem' }}>
                            <div className={selectorStyle.selectorColumn}>
                                <div className={selectorStyle.selectorBody}>

                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Filters>
            <DataContainer theme={theme}

            >

                <Collapsible
                    id="cellDensitySection"
                    className="mt-4"
                    title="Cell Density"
                >
                    <p>Cell density is the number of cells per unitary volume.</p>
                    { /*<CellDensityTable /> */}
                </Collapsible>


            </DataContainer >
        </>
    );
};


export default CellDensityView;
