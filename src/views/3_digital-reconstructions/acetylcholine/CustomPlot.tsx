import React, { useMemo } from 'react';
import DistributionPlot from '@/components/DistributionPlot';

const CustomPlot = ({ plotData }) => {
    const processedData = useMemo(() => {
        if (!plotData || !plotData.value) {
            return null;
        }

        // Check if the value is already an array (for PSP and CV distributions)
        if (Array.isArray(plotData.value)) {
            return plotData.value;
        }

        // For u_syn distribution, we need to create a histogram
        if (plotData.id === 'u_syn-distribution') {
            const values = plotData.value;
            const bins = 20; // You can adjust this number
            const min = Math.min(...values);
            const max = Math.max(...values);
            const binWidth = (max - min) / bins;

            const histogram = new Array(bins).fill(0);
            values.forEach(value => {
                const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
                histogram[binIndex]++;
            });

            return {
                bins: Array.from({ length: bins }, (_, i) => min + (i + 0.5) * binWidth),
                counts: histogram
            };
        }

        return null;
    }, [plotData]);

    if (!processedData) {
        return <div>No data available for this plot.</div>;
    }

    return (
        <DistributionPlot
            plotData={processedData}
            xAxis={plotData.units || 'Value'}
            yAxis="Frequency"
        />
    );
};

export default CustomPlot;