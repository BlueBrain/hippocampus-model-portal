// React and Next.js imports
import React, { useMemo } from 'react';
import groupBy from 'lodash/groupBy';

import { neuriteTypes } from '../../../constants'
import Factsheet from '@/components/Factsheet';
import DownloadButton from '@/components/DownloadButton';
import { downloadAsJson } from '@/utils';



export type InstanceViewerProps = {
    theme?: number,
    facts: any,
    id: any
};

const NeuronFactsheet: React.FC<InstanceViewerProps> = ({ theme, facts, id }) => {
    const factsGrouped = groupBy(facts, fact => neuriteTypes.find(entryType => fact.type === entryType));

    return (
        <>
            <h3 className="text-xl mb-2 mt-10">Factsheet</h3>
            <div id={id}>
                {neuriteTypes
                    .filter(entryType => factsGrouped[entryType])
                    .map(entryType => (
                        <div key={entryType}>
                            <h4 className="capitalize text-right">{entryType}</h4>
                            <Factsheet facts={factsGrouped[entryType]} />
                        </div>
                    )
                    )}
            </div>

        </>

    );
}

export default NeuronFactsheet
