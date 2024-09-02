import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import ScatterPlotSelector from '@/components/ScatterPlotSelector';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import DistributionPlot from '@/components/DistributionPlot';

import { QuickSelectorEntry } from '@/types';
import models from "@/models.json";
import { dataPath } from '@/config';

const MinisRate = [
    0.00025, 0.0005, 0.00075, 0.001, 0.00125, 0.0015, 0.00175, 0.002
];

const CA_O = [1, 1.5, 2];

const getMtypes = (): string[] => {
    return [...new Set(models.map(model => model.mtype))].sort();
}

const getEtypes = (mtype: string): string[] => {
    return [...new Set(models.filter(model => model.mtype === mtype).map(model => model.etype))].sort();
}

const SpontaneousActivityView: React.FC = () => {
    const router = useRouter();
    const theme = 5;

    const [currentMtype, setCurrentMtype] = useState<string>('');
    const [currentEtype, setCurrentEtype] = useState<string>('');
    const [currentCA_O, setCurrentCA_O] = useState<number>(CA_O[0]);
    const [currentMinisRate, setCurrentMinisRate] = useState<number>(MinisRate[0]);
    const [distributionData, setDistributionData] = useState<any>(null);

    useEffect(() => {
        const { mtype, etype, ca_o, minis_rate } = router.query;
        if (typeof mtype === 'string') setCurrentMtype(mtype);
        if (typeof etype === 'string') setCurrentEtype(etype);
        if (typeof ca_o === 'string') setCurrentCA_O(parseFloat(ca_o));
        if (typeof minis_rate === 'string') setCurrentMinisRate(parseFloat(minis_rate));
    }, [router.query]);

    useEffect(() => {
        const fetchDistributionData = async () => {
            if (currentMtype && currentEtype && currentCA_O && currentMinisRate) {
                const dataId = `MFR_${currentMtype}-${currentEtype}`;

                try {
                    const response = await fetch(`${dataPath}/5_prediction/spontaneous-activity/${currentMinisRate}-${currentCA_O}/mean-firing-rate.json`);
                    const data = await response.json();
                    const relevantData = data.find(item => item.id === dataId);
                    setDistributionData(relevantData);
                } catch (error) {
                    console.error('Error fetching distribution data:', error);
                    setDistributionData(null);
                }
            }
        };

        fetchDistributionData();
    }, [currentMtype, currentEtype, currentCA_O, currentMinisRate]);

    const setParams = (params: Record<string, string | number>): void => {
        const newQuery = { ...router.query, ...params };
        router.push({ query: newQuery, pathname: router.pathname }, undefined, { shallow: true });
    };

    const handleMtypeSelect = (mtype: string) => {
        setCurrentMtype(mtype);
        setCurrentEtype('');
        setParams({ mtype, etype: '' });
    };

    const handleEtypeSelect = (etype: string) => {
        setCurrentEtype(etype);
        setParams({ etype });
    };

    const handleScatterPlotSelect = (ca_o: number, minis_rate: number) => {
        setCurrentCA_O(ca_o);
        setCurrentMinisRate(minis_rate);
        setParams({ ca_o, minis_rate });
    };

    const qsEntries: QuickSelectorEntry[] = [
        {
            title: 'M-type',
            key: 'mtype',
            getValuesFn: getMtypes,
            setFn: handleMtypeSelect,
            sliderRange: MinisRate
        },
        {
            title: 'E-Type',
            key: 'etype',
            getValuesFn: () => getEtypes(currentMtype),
            setFn: handleEtypeSelect,
            sliderRange: CA_O
        },
    ];

    const mtypes = getMtypes();
    const etypes = getEtypes(currentMtype);

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
                                <List
                                    block
                                    list={mtypes}
                                    value={currentMtype}
                                    title={`M-type ${mtypes.length ? '(' + mtypes.length + ')' : ''}`}
                                    onSelect={handleMtypeSelect}
                                    theme={theme}
                                />
                                <List
                                    block
                                    list={etypes}
                                    value={currentEtype}
                                    title={`E-type ${etypes.length ? '(' + etypes.length + ')' : ''}`}
                                    onSelect={handleEtypeSelect}
                                    theme={theme}
                                />
                            </div>
                        </div>
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Configure</div>
                            <div className="selector__body">
                                <ScatterPlotSelector
                                    path="5_prediction/spontaneous-activity/"
                                    xRange={CA_O}
                                    yRange={MinisRate}
                                    xAxisLabel='Ca2+ (mM)'
                                    yAxisLabel='Spontaneous synaptic release (Hz)'
                                    theme={theme}
                                    onSelect={handleScatterPlotSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>

            <DataContainer
                theme={theme}
                navItems={[
                    { id: 'meanFiringRateSection', label: "Mean Firing Rate" },
                    { id: 'spikeTimeSection', label: "Spike Time" },
                    { id: 'traceSection', label: "Traces" }
                ]}
                quickSelectorEntries={qsEntries}
            >
                <Collapsible id='meanFiringRateSection' properties={[currentMtype, currentEtype]} title="Mean Firing Rate">
                    {distributionData ? (
                        <DistributionPlot
                            data={distributionData}
                            xAxis="Time (ms)"
                            yAxis="Frequency"
                        />
                    ) : (
                        <p>Select M-type, E-type, Ca2+ concentration, and minis rate to view the distribution plot.</p>
                    )}
                </Collapsible>

                <Collapsible id='spikeTimeSection' properties={[currentMtype, currentEtype]} title="Spike Time">
                    <p>Spike Time visualization to be implemented</p>
                </Collapsible>

                <Collapsible id='traceSection' title="Traces">
                    <p>Traces visualization to be implemented</p>
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default SpontaneousActivityView;