import React from 'react';

// Component Imports
import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

// Table Component Import
import CellDensityTable from './cell-density/CellDensity';

const CellDensityView: React.FC = () => {
    const theme = 1;

    return (
        <>
            {/* Filters Section */}
            <Filters theme={theme}>
                <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
                    {/* Title and Info */}
                    <div className="w-full mb-12 md:mb-0">
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
                    </div>
                </div>
            </Filters>

            {/* Data Container Section */}
            <DataContainer
                theme={theme}
                navItems={[
                    { id: 'cellDensitySection', label: 'Cell Density' },
                ]}
            >
                <Collapsible
                    id="cellDensitySection"
                    className="mt-4"
                    title="Cell Density"
                >
                    <p className="mb-4">Cell density is the number of cells per unitary volume.</p>
                    <CellDensityTable />
                </Collapsible>
            </DataContainer>
        </>
    );
};

export default CellDensityView;