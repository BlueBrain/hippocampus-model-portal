import React from 'react';
import { Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import AnatomyTable from './schaffer-collaterals/Anatomy';
import PhysiologyTable from './schaffer-collaterals/Physiology';

import selectorStyle from '@/styles/selector.module.scss';


const ConnectionPhysiologyView: React.FC = () => {

    const theme = 2;

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
                                title="Schaffer Collaterals"
                                subtitle="Reconstruction Data"
                                theme={theme}
                            />
                            <div role="information">
                                <InfoBox>
                                    <p>
                                        Starting from <Link href="/experimental-data/schaffer-collaterals/" className={`link theme-${theme}`}>experimental data</Link>, we constrained the anatomy and physiology of SC. The available data allowed us to describe three pathways with sufficient precision: SC-PC, SC-CB1R+, SC-CB1R-.
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


            <DataContainer
                navItems={[
                    { id: 'anatomySection', label: 'Anatomy' },
                    { id: 'physiologySection', label: 'Physiology' },

                ]}
            >

                <Collapsible
                    id="anatomySection"
                    className="mt-4"
                    title="Anatomy"
                >
                    <p>We combined the reported number of CA3 PCs from <Link href="https://pubmed.ncbi.nlm.nih.gov/23674373/"> Bezaire and Soltesz (2013)</Link> (TBC) and <Link href={"/reconstruction-data/cell-composition/"}>cell composition</Link>, to estimate 267,238 SC fibers. By considering also the convergence of SC onto PC and INT, this was sufficient to define the anatomy of SC.</p>
                    <AnatomyTable />
                </Collapsible>

                <Collapsible
                    id="physiologySection"
                    className="mt-4"
                    title="Physiology"
                >
                    <p>
                        With a specific optimization protocol, we defined a set of parameters and rules to describe the three pathways. These parameters include the ones defining the short-term plasticity model using Tsodyks-Markram formalism (U, D, F), number of vesicles in the release-ready pool (NRRP), the dependency of release probability from the extracellular calcium concentration (Hill scaling), the maximum synaptic conductance (gsyn), rise and decay time
                        constant of the fast ionotropic AMPA receptors, rise and decay time constant of the slow ionotropic receptors NMDA, and NMDA/AMPA ratio.

                    </p>
                    <PhysiologyTable />
                </Collapsible>

            </DataContainer>

        </>
    );
};


export default ConnectionPhysiologyView;
