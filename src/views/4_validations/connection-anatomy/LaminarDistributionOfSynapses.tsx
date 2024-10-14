import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';

const LaminarDistributionOfSynapsesGraph = ({ theme }) => {
    const chartRef = useRef(null);

    const data = [
        { name: 'SLM_PPA', SO: [0, 0], SP: [0, 0], SR: [35.48, 37.7], SLM: [64.18, 62.3], out: [0.34, null] },
        { name: 'SR_SCA', SO: [26.65, 0], SP: [14.45, 0.2], SR: [56.15, 97.4], SLM: [1.88, 2.4], out: [0.86, null] },
        { name: 'SP_AA', SO: [5.52, null], SP: [89.96, null], SR: [4.52, null], SLM: [0, null], out: [0, null] },
        { name: 'SP_BS', SO: [32.64, 47.6], SP: [20.86, 9.85], SR: [45.85, 42.55], SLM: [0.20, 0], out: [0.46, null] },
        { name: 'SP_CCKBC', SO: [34.76, 29.4], SP: [43.95, 62.85], SR: [21.03, 7.75], SLM: [0.03, 0], out: [0.24, null] },
        { name: 'SP_Ivy', SO: [34.40, null], SP: [36.26, null], SR: [29.12, null], SLM: [0.02, null], out: [0.20, null] },
        { name: 'SP_PC', SO: [77.47, null], SP: [11.48, null], SR: [3.34, null], SLM: [0.02, null], out: [7.68, null] },
        { name: 'SP_PVBC', SO: [33.10, null], SP: [43.00, null], SR: [23.58, null], SLM: [0.05, null], out: [0.27, null] },
        { name: 'SO_BP', SO: [31.11, null], SP: [24.54, null], SR: [40.36, null], SLM: [3.56, null], out: [0.43, null] },
        { name: 'SO_BS', SO: [33.11, 48.1], SP: [17.90, 12.4], SR: [47.46, 39.5], SLM: [0.90, 0], out: [0.64, null] },
        { name: 'SO_OLM', SO: [0.39, null], SP: [0.55, null], SR: [31.28, null], SLM: [65.60, null], out: [2.18, null] },
        { name: 'SO_Tri', SO: [57.41, 58.12], SP: [27.02, 18.11], SR: [14.39, 23.77], SLM: [0.13, 0], out: [1.06, null] },
    ];

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['SO (Model)', 'SP (Model)', 'SR (Model)', 'SLM (Model)', 'out (Model)',
                    'SO (Exp)', 'SP (Exp)', 'SR (Exp)', 'SLM (Exp)']
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                    align: 'right',
                    margin: 10
                },
                name: 'mtype',
                nameLocation: 'middle',
                nameGap: 50
            },
            yAxis: {
                type: 'value',
                name: 'Synapses (%)',
                max: 100,
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 90
            },
            grid: {
                bottom: '15%',
                left: '10%'
            },
            series: [
                {
                    name: 'SO (Model)',
                    type: 'bar',
                    stack: 'Model',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SO[0]),
                    color: graphTheme.blue
                },
                {
                    name: 'SP (Model)',
                    type: 'bar',
                    stack: 'Model',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SP[0]),
                    color: graphTheme.yellow
                },
                {
                    name: 'SR (Model)',
                    type: 'bar',
                    stack: 'Model',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SR[0]),
                    color: graphTheme.green
                },
                {
                    name: 'SLM (Model)',
                    type: 'bar',
                    stack: 'Model',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SLM[0]),
                    color: graphTheme.red
                },
                {
                    name: 'out (Model)',
                    type: 'bar',
                    stack: 'Model',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.out[0]),
                    color: graphTheme.purple
                },
                {
                    name: 'SO (Exp)',
                    type: 'bar',
                    stack: 'Exp',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SO[1]),
                    color: graphTheme.blue,
                    itemStyle: {
                        decal: {
                            symbol: 'rect',
                            symbolSize: 1,
                            rotation: Math.PI / 4,
                            dashArrayX: [1, 0],
                            dashArrayY: [2, 5],
                            color: 'white'
                        }
                    }
                },
                {
                    name: 'SP (Exp)',
                    type: 'bar',
                    stack: 'Exp',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SP[1]),
                    color: graphTheme.yellow,
                    itemStyle: {
                        decal: {
                            symbol: 'rect',
                            symbolSize: 1,
                            rotation: Math.PI / 4,
                            dashArrayX: [1, 0],
                            dashArrayY: [2, 5],
                            color: 'white'
                        }
                    }
                },
                {
                    name: 'SR (Exp)',
                    type: 'bar',
                    stack: 'Exp',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SR[1]),
                    color: graphTheme.green,
                    itemStyle: {
                        decal: {
                            symbol: 'rect',
                            symbolSize: 1,
                            rotation: Math.PI / 4,
                            dashArrayX: [1, 0],
                            dashArrayY: [2, 5],
                            color: 'white'
                        }
                    }
                },
                {
                    name: 'SLM (Exp)',
                    type: 'bar',
                    stack: 'Exp',
                    emphasis: { focus: 'series' },
                    data: data.map(item => item.SLM[1]),
                    color: graphTheme.red,
                    itemStyle: {
                        decal: {
                            symbol: 'rect',
                            symbolSize: 1,
                            rotation: Math.PI / 4,
                            dashArrayX: [1, 0],
                            dashArrayY: [2, 5],
                            color: 'white'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);

        return () => {
            chart.dispose();
        };
    }, []);

    return (
        <div>
            <div className="graph">
                <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
            </div>
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Laminar-Distribution-Of-Synapses-Data.json`)}>
                    Laminar distribution of synapse
                </DownloadButton>
            </div>
        </div>
    );
};

export default LaminarDistributionOfSynapsesGraph;