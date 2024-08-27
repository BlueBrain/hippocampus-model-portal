import React from 'react';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';

import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import ScatterPlotSelector from '@/components/ScatterPlotSelector';

const SpontaneousActivityView: React.FC = () => {

    const theme = 5;

    return (
        <>
            <Filters theme={theme}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title="Spontaneous Activity"
                                subtitle="Predictions"
                                theme={theme}
                            />
                            <div className='w-full' role="information">
                                <InfoBox>
                                    <p>
                                        We simulated the network using different levels of spontaneous synaptic release (0.00025 - 0.002 Hz) and different extracellular calcium concentration (1 - 2 mM). These simulations can give a prediction on how the CA1 could behave without any external inputs at in vivo or in vitro extracellular calcium concentrations (respectively 1 and 2 mM). In these conditions, the activity is very sparse and irregular.
                                    </p>
                                </InfoBox>
                            </div>
                        </StickyContainer>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none">
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Select reconstruction</div>
                            <div className="selector__body">
                                {/* 
                                <List
                                    block
                                    list={mtypes}
                                    value={quickSelection.mtype}
                                    title="m-type"
                                    onSelect={setMtypeQuery}
                                    theme={theme}
                                />
                                <List
                                    block
                                    list={instances}
                                    value={quickSelection.instance}
                                    title="Reconstructed morphology"
                                    onSelect={setInstanceQuery}
                                    anchor="data"
                                    theme={theme}
                                />
                                */}
                            </div>
                        </div>
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Choose a layer</div>
                            <div className="selector__body">
                                <ScatterPlotSelector xAxis={10} yAxis={10} theme={theme} />
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>
        </>
    );
};


export default SpontaneousActivityView;
