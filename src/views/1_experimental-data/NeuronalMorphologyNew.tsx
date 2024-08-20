// React and Next.js imports
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import List from '@/components/List';
import LayerSelector3D from '@/components/LayerSelector3D';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import AuthorBox from '@/components/AuthorBox/AuthorBox';
import HttpData from '@/components/HttpData';

import InstanceViewer from './neuronal-morphology/InstanceViewer';
import NeuronFactsheet from './neuronal-morphology/NeuronFactsheet';

import { basePath } from '@/config';
import { layers } from '@/constants';
import morphologies from '@/exp-morphology-list.json';
import MorphDistributionPlots from '@/components/MorphDistributionsPlots';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { downloadAsJson } from '@/utils';
import { expMorphDistributionPlotsPath } from '@/queries/http';
import NeuronTable from './neuronal-morphology/NeuronTable';



const NeuronalMorphologyView: React.FC = () => {
    const router = useRouter();
    const { query } = router;

    const theme = 1;
    const currentLayer = query.layer;
    const currentMtype = query.mtype;
    const currentInstance = query.instance;

    const getMtypes = (layer) => {
        return layer
            ? Array.from(new Set(morphologies.filter(m => m.region === layer).map(m => m.mtype))).sort()
            : [];
    };

    const getInstances = (mtype) => {
        return mtype
            ? morphologies.filter(m => m.mtype === mtype).map(m => m.name).sort()
            : [];
    };

    const setQuery = (query) => {
        router.push({ query, pathname: router.pathname }, undefined, { shallow: true });
    };

    const setLayer = (layer) => {
        const newMtypes = getMtypes(layer);
        const newMtype = newMtypes.length > 0 ? newMtypes[0] : null;
        const newInstances = getInstances(newMtype);
        const newInstance = newInstances.length > 0 ? newInstances[0] : null;

        setQuery({
            layer,
            mtype: newMtype,
            instance: newInstance,
        });
    };

    const setMtype = (mtype) => {
        const newInstances = getInstances(mtype);
        const newInstance = newInstances.length > 0 ? newInstances[0] : null;

        setQuery({
            mtype,
            layer: currentLayer,
            instance: newInstance,
        });
    };

    const setInstance = (instance) => {
        setQuery({
            instance,
            layer: currentLayer,
            mtype: currentMtype,
        });
    };

    const mtypes = getMtypes(currentLayer);
    const instances = getInstances(currentMtype);

    const qsEntries = [
        {
            title: 'Layer',
            key: 'layer',
            values: layers,
            setFn: setLayer,
        },
        {
            title: 'E-type',
            key: 'etype',
            values: mtypes,
            setFn: setMtype,
        },
        {
            title: 'Instance',
            key: 'etype_instance',
            values: instances,
            setFn: setInstance,
        },
    ];

    return (
        <>
            <Filters theme={theme} hasData={!!currentInstance}>
                <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
                    <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
                        <StickyContainer>
                            <Title
                                title={<span>Neuronal Morphology</span>}
                                subtitle="Experimental Data"
                                theme={theme}
                            />
                            <div className='w-full' role="information">
                                <InfoBox>
                                    <p>
                                        We classified neuronal morphologies into different morphological types (m-types) and created digital 3D reconstructions. Using objective classification methods, we identified 12 m-types in region CA1 of the rat hippocampus.
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
                                    title="m-type"
                                    onSelect={setMtype}
                                    theme={theme}
                                />
                                <List
                                    block
                                    list={instances}
                                    value={currentInstance}
                                    title="Reconstructed morphology"
                                    onSelect={setInstance}
                                    anchor="data"
                                    theme={theme}
                                />
                            </div>
                        </div>
                        <div className={`selector__column theme-${theme} w-full`}>
                            <div className={`selector__head theme-${theme}`}>Choose a layer</div>
                            <div className="selector__body">
                                <LayerSelector3D
                                    value={currentLayer}
                                    onSelect={setLayer}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Filters>
            <DataContainer
                theme={theme}
                visible={!!currentInstance}
                navItems={[
                    { id: 'morphologySection', label: 'Neuron Morphology' },
                    { id: 'populationSection', label: 'Population' },
                ]}
                quickSelectorEntries={qsEntries}
            >

                <Collapsible
                    id="morphologySection"
                    title="Neuron Morphology"
                    properties={[currentLayer, currentMtype, currentInstance]} // Assuming 'layer' is a string
                >

                    <AuthorBox>
                        <h3 className="text-lg">Contribution</h3>
                        <p>Alex Thomson: supervision, Audrey Mercer: supervision, University College London.</p>
                    </AuthorBox>

                    <p className='text-lg mt-10 mb-2 '>
                        We provide visualization and morphometrics for the selected morphology.
                    </p>

                    <InstanceViewer theme={theme} currentMtype={currentMtype} currentInstance={currentInstance} />

                    <div className="mb-4">
                        <HttpData path={`${basePath}/resources/data/1_experimental-data/neuronal-morphology/morphology/${currentInstance}/factsheet.json`}>
                            {(factsheetData) => (
                                <>
                                    {factsheetData && (
                                        <>
                                            <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                                            <div className="mt-4">
                                                <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${instances}-factsheet.json`)} theme={theme}>
                                                    Factsheet
                                                </DownloadButton>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </HttpData>
                    </div>

                    <div className="mb-4">
                        <HttpData path={`${basePath}/resources/data/1_experimental-data/neuronal-morphology/morphology/${currentInstance}/distribution-plots.json`}>
                            {(plotsData) => (
                                <>
                                    {plotsData && (
                                        <>
                                            <MorphDistributionPlots type="singleMorphology" data={plotsData} />
                                            <div className="mt-4">
                                                <DownloadButton onClick={() => downloadAsJson(plotsData, `${instances}-plot-data.json`)} theme={theme}>
                                                    Plot Data
                                                </DownloadButton>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </HttpData>
                    </div>

                    <div className="mt-16 mb-4">
                        <HttpData path={`${basePath}/resources/data/1_experimental-data/neuronal-morphology/morphology/${currentInstance}/table.json`}>
                            {(tableData) => (
                                <>
                                    {tableData && (
                                        <NeuronTable theme={theme} data={tableData} layer={currentLayer} mtype={currentMtype} nameLink={false} />
                                    )}
                                </>
                            )}
                        </HttpData>
                    </div>



                </Collapsible>

                <Collapsible
                    id="populationSection"
                    title="Population"
                >
                    <p className='text-lg mb-2'>
                        We provide morphometrics for the entire m-type group selected.
                    </p>

                    <div className="mb-4">
                        <HttpData path={`${basePath}/resources/data/1_experimental-data/neuronal-morphology/mtype/${currentMtype}/factsheet.json`}>
                            {(factsheetData) => (
                                <>
                                    {factsheetData && (
                                        <>
                                            <NeuronFactsheet id="morphometrics" facts={factsheetData.values} />
                                            <div className="mt-4">
                                                <DownloadButton onClick={() => downloadAsJson(factsheetData.values, `${instances}-factsheet.json`)} theme={theme}>
                                                    Factsheet
                                                </DownloadButton>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </HttpData>
                    </div>

                    <div className="mt-16 mb-4">
                        <HttpData path={`${basePath}/resources/data/1_experimental-data/neuronal-morphology/mtype/${currentMtype}/table.json`}>
                            {(tableData) => (
                                <>
                                    {tableData && (
                                        <>
                                            <NeuronTable theme={theme} data={tableData} layer={currentLayer} mtype={currentMtype} nameLink={true} />

                                        </>
                                    )}
                                </>
                            )}
                        </HttpData>
                    </div>

                </Collapsible>
            </DataContainer >
        </>
    )

}

export default NeuronalMorphologyView;