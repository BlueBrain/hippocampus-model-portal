import React, { useState, useMemo, useEffect } from 'react';
import Factsheet from '@/components/Factsheet';

type PopulationData = {
    [key: string]: Array<{
        name: string;
        values: number[];
    }>;
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
        return data[selectedStep];
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
                {selectedStep ? (
                    <Factsheet facts={factsheetData} />
                ) : (
                    <p>Please select a step to view the metrics</p>
                )}
            </div>
        </div>
    );
};

export default Population;