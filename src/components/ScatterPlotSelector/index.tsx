import React, { useRef, useState } from "react";
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import DownloadButton from "../DownloadButton";
import { downloadAsJson } from "@/utils";

type ScatterPlotSelectorProps = {
    xAxis: number;
    yAxis: number;

    xAxisLabel?: string;
    yAxisLabel?: string;

    theme?: number;
};


const ScatterPlotSelector: React.FC<ScatterPlotSelectorProps> = ({
    xAxis = 0,
    yAxis = 0,
    xAxisLabel,
    yAxisLabel,
    theme
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);

    const createChart = () => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {


                const chartOptions: ChartOptions<'scatter'> = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: xAxisLabel,
                            },
                            min: 0,
                            max: 0.5,
                            ticks: {
                                color: 'black',
                                font: {
                                    size: 12,
                                },
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: yAxisLabel,
                            },
                            min: 0,
                            max: 0.5,
                            ticks: {
                                font: {
                                    size: 12,
                                },
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        }
                    },
                };

                const exampleData = {
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: [
                                { x: 10, y: 20 },
                                { x: 15, y: 10 },
                                { x: 20, y: 30 },
                                { x: 25, y: 25 },
                                null,  // Represents a gap in data
                                { x: 30, y: 40 }
                            ],
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                        },
                        {
                            label: 'Dataset 2',
                            data: [
                                { x: 12, y: 22 },
                                { x: 18, y: 12 },
                                { x: 22, y: 32 },
                                { x: 28, y: 28 },
                                { x: 35, y: 38 }
                            ],
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                        }
                    ]
                };

                const newChart = new Chart(ctx, {
                    type: 'scatter',
                    data: exampleData,
                    options: chartOptions,
                });

                setChart(newChart);
            }
        }
    };

    return (
        <div>
            <div className="" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson({/* data */ }, `Connection-Probability-Data.json`)}>
                    Connection Probability Data
                </DownloadButton>
            </div>
        </div>
    )

}


export default ScatterPlotSelector;