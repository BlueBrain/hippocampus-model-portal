import React, { useMemo, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { graphTheme } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PlotDetailsProps {
    plotData: any;

}

const ScatterPlot: React.FC<PlotDetailsProps> = ({
    plotData,
}) => {
    return (
        <p>ha</p>
    )
}

export default ScatterPlot;