import React from 'react';
import groupBy from 'lodash/groupBy';

import { neuriteTypes } from '../../../constants';
import Factsheet, { FactsheetEntryType } from '@/components/Factsheet';

export type Fact = {
    name: string;
    value: number[];
    unit?: string;
    type?: string;
    description?: string;
};

export type InstanceViewerProps = {
    theme?: number;
    facts: Fact[];
    id: string;
};

const NeuronFactsheet: React.FC<InstanceViewerProps> = ({ theme, facts, id }) => {
    const processedFacts: FactsheetEntryType[] = facts.map(fact => {
        const [meanValue, stdDevValue] = fact.value;
        return {
            name: fact.name,
            value: Number(meanValue.toFixed(3)),
            unit: stdDevValue !== undefined ? `± ${Number(stdDevValue.toFixed(3))}` : '',
            description: fact.description || '',
            type: fact.type || ''
        };
    });

    const factsGrouped: { [key: string]: FactsheetEntryType[] } = groupBy(processedFacts, fact =>
        fact.type ? neuriteTypes.find(entryType => fact.type === entryType) || '' : ''
    );

    const renderFactsheet = (groupedFacts: FactsheetEntryType[], title: string) => (
        <div key={title}>
            <h4 className="capitalize">{title || 'General'}</h4>
            <Factsheet facts={groupedFacts} />
        </div>
    );

    return (
        <>
            <h3 className="text-xl mb-2 mt-10">Factsheet</h3>
            <div id={id}>
                {Object.entries(factsGrouped).map(([entryType, groupedFacts]) =>
                    renderFactsheet(groupedFacts, entryType)
                )}
            </div>
        </>
    );
};

export default NeuronFactsheet;