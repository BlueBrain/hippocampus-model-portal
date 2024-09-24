import React, { useState, useMemo, useEffect } from 'react';
import Factsheet from '@/components/Factsheet';

type MetricData = {
    name: string;
    values: number | number[];
};

type PopulationData = {
    [key: string]: MetricData[];
};

type PopulationProps = {
    data: PopulationData;
};

const Population: React.FC<PopulationProps> = ({ data }) => {
    const [selectedStep, setSelectedStep] = useState<string>('');

    // Get all available steps from the data
    const steps = useMemo(() => Object.keys(data), [data]);

    // Automatically select the first step when data is available
    useEffect(() => {
        if (steps.length > 0) {
            setSelectedStep(steps[0]); // Set the first available step as default
        }
    }, [steps]);

    const handleStepChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStep(event.target.value);
    };

    const factsheetData = useMemo(() => {
        if (!selectedStep) return [];
        const stepData = data[selectedStep];
        if (!Array.isArray(stepData)) {
            console.error(`Data for step ${selectedStep} is not an array`);
            return [];
        }
        return stepData.map(item => ({
            ...item,
            values: Array.isArray(item.values) ? item.values : [item.values]
        }));
    }, [selectedStep, data]);

    return (
        <div className="population-container">
            <div className="row">
                <div className="col-xs-6 flex">
                    <label htmlFor="stepSelect"></label>
                    <select
                        id="stepSelect"
                        value={selectedStep}
                        onChange={handleStepChange}
                        className="p-2 border rounded"
                    >
                        {steps.map((step) => (
                            <option key={step} value={step}>
                                {step}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4">
                {selectedStep && factsheetData.length > 0 ? (
                    <Factsheet facts={factsheetData} />
                ) : (
                    <p>No data available for the selected step</p>
                )}
            </div>
        </div>
    );
};

export default Population;