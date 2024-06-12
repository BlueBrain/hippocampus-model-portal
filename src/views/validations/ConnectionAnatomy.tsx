import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import selectorStyle from '@/styles/selector.module.scss';


const ConnectionAnatomyView: React.FC = () => {

    const theme = 4;

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
                                title="Connection Anatomy"
                                subtitle="Validations"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>

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

        </>
    );
};


export default ConnectionAnatomyView;
