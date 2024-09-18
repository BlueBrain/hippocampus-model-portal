// React and Next.js imports
import React, { useMemo } from 'react';
import groupBy from 'lodash/groupBy';

import { neuriteTypes } from '../../../constants'
import Factsheet from '@/components/Factsheet';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';



export type InstanceViewerProps = {
    data: any
};

const ModelFactsheet: React.FC<InstanceViewerProps> = ({ data }) => {
    const factsGrouped = groupBy(data, fact => neuriteTypes.find(entryType => fact.type === entryType));

    return (
        <>

            <div >
                {neuriteTypes
                    .filter(entryType => factsGrouped[entryType])
                    .map(entryType => (
                        <div key={entryType}>
                            <h4 className="capitalize">{entryType}</h4>
                            <Factsheet facts={factsGrouped[entryType]} />
                        </div>
                    )
                    )}
            </div>

        </>

    );
}

export default ModelFactsheet
