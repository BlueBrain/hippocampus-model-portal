import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';

import { colorName } from './config';
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import MinisTable from './minis/minis';

import selectorStyle from '@/styles/selector.module.scss';


const MinisView: React.FC = () => {
    const theme = 1;
    return (
        <>
            <Filters theme={theme}>
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
                                title="Minis"
                                subtitle="Experimental Data"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        The spontaneous synaptic events are due to the spontaneous release of a vesicle (miniature events known as minis) or also due to a spontaneous action potential (spontaneous events). These events normally produce small voltage deflection of the membrane, but given the multitude of synaptic contacts in a network, their role in the network computation can be significant.
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
                                    {/*}
                                    <Image
                                        src="https://fakeimg.pl/640x480/282828/faad14/?retina=1&text=Illustration&font=bebas"
                                        width="640"
                                        height="480"
                                        unoptimized
                                        alt=""
                                    />
                                    */}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Filters>

            <DataContainer
                navItems={[
                    { id: 'minisSection', label: 'Minis' },

                ]}

            >
                <Collapsible
                    id="minisSection"
                    title="Minis"
                >
                    <p>Single cell recordings with or without the neurotoxin tetrodotoxin (TTX), which blocks the action potentials, allow the estimation of frequency and amplitude of the spontaneous or miniature events in different pathways.</p>

                    <MinisTable />
                </Collapsible>


            </DataContainer>
        </>
    );
};


export default MinisView;
