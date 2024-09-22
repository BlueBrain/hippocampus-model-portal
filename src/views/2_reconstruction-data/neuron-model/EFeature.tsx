import React, { useState, useMemo } from 'react';
import Factsheet from '@/components/Factsheet';

// Define the type for the efeatures data structure
type EFeatureProps = {
    data: {
        efeatures: {
            [key: string]: {
                soma: {
                    [key: string]: number[];
                };
            };
        };
    };
};

const EFeature: React.FC<EFeatureProps> = ({ data }) => {
    const [selectedStep, setSelectedStep] = useState<string | null>(null);

    // Extract available steps
    const steps = Object.keys(data.efeatures);

    // Handle step change
    const handleStepChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStep(event.target.value);
    };

    // Memoized value to transform the selected step's data into a format for Factsheet
    const factsheetData = useMemo(() => {
        if (!selectedStep) return [];

        const metrics = data.efeatures[selectedStep].soma;

        // Convert the metrics into the format expected by the Factsheet component
        return Object.keys(metrics).map((metric) => ({
            name: metric,
            description: metric, // You can provide a better description if needed
            values: metrics[metric],
        }));
    }, [selectedStep, data]);

    return (
        <div className="efeature-container">
            <div className="row">
                <div className="col-xs-6 gap-6 flex">
                    <label>Select Step:</label>
                    <select value={selectedStep || ''} onChange={handleStepChange}>
                        <option value="">Select Step</option>
                        {steps.map((step) => (
                            <option key={step} value={step}>
                                {step}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className=" mt-4">
                {selectedStep ? (
                    <>
                        <Factsheet facts={factsheetData} />
                    </>
                ) : (
                    <p>Please select a step to view the metrics</p>
                )}
            </div>
        </div>
    );
};

export default EFeature;