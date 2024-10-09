import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { downloadAsJson } from '@/utils';
import DownloadButton from '@/components/DownloadButton';
import { graphTheme } from '@/constants';
import { dataPath } from '@/config';

export type SynapticDivergencePercentagesProps = {
    theme?: number;
};

const SynapticDivergencePercentagesGraph: React.FC<SynapticDivergencePercentagesProps> = ({ theme }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(dataPath + '/4_validations/connection-anatomy/synaptic-divergence-percentages.json')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    useEffect(() => {
        if (data && chartRef.current) {
            const chart = echarts.init(chartRef.current);
            const mtypes = Object.values(data.value_map.mtype);
            const spPcIndex = mtypes.indexOf('SP_PC');

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let tooltip = params[0].axisValue + '<br/>';
                        params.forEach(param => {
                            tooltip += `${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
                        });
                        return tooltip;
                    }
                },
                legend: {
                    data: [
                        {
                            name: 'Model I-E',
                            itemStyle: { color: graphTheme.blue }
                        },
                        {
                            name: 'Model I-I',
                            itemStyle: { color: graphTheme.purple }
                        },
                        {
                            name: 'Exp E-E',
                            itemStyle: { color: graphTheme.blue }
                        },
                        {
                            name: 'Exp E-I',
                            itemStyle: { color: graphTheme.purple }
                        }
                    ],
                    right: 10,
                    top: 'center',
                    orient: 'vertical',
                },
                xAxis: {
                    type: 'category',
                    data: mtypes,
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        align: 'right',
                        margin: 10
                    },
                    name: 'mtype',
                    nameLocation: 'middle',
                    nameGap: 40
                },
                yAxis: {
                    type: 'value',
                    name: 'Divergence (%)',
                    min: 0,
                    max: 100
                },
                grid: {
                    bottom: '15%',
                    right: '15%'
                },
                series: [
                    {
                        name: 'Model I-E',
                        type: 'bar',
                        stack: 'Model',
                        emphasis: { focus: 'series' },
                        data: mtypes.map((_, index) => ({
                            value: data.value_map.model_PC[index],
                            itemStyle: {
                                color: index === spPcIndex ? graphTheme.red : graphTheme.blue
                            }
                        }))
                    },
                    {
                        name: 'Model I-I',
                        type: 'bar',
                        stack: 'Model',
                        emphasis: { focus: 'series' },
                        data: mtypes.map((_, index) => ({
                            value: data.value_map.model_INT[index],
                            itemStyle: {
                                color: index === spPcIndex ? graphTheme.green : graphTheme.purple
                            }
                        }))
                    },
                    {
                        name: 'Exp E-E',
                        type: 'bar',
                        stack: 'Exp',
                        emphasis: { focus: 'series' },
                        data: mtypes.map((_, index) => ({
                            value: data.value_map.exp_PC[index] || 0,
                            itemStyle: {
                                color: index === 6 ? graphTheme.red : graphTheme.blue,
                                decal: {
                                    symbol: 'rect',
                                    symbolSize: 1,
                                    rotation: Math.PI / 4,
                                    dashArrayX: [1, 0],
                                    dashArrayY: [2, 5],
                                    color: 'white'
                                }
                            }
                        }))
                    },
                    {
                        name: 'Exp E-I',
                        type: 'bar',
                        stack: 'Exp',
                        emphasis: { focus: 'series' },
                        data: mtypes.map((_, index) => ({
                            value: data.value_map.exp_INT[index] || 0,
                            itemStyle: {
                                color: index === 6 ? graphTheme.green : graphTheme.purple,
                                decal: {
                                    symbol: 'rect',
                                    symbolSize: 1,
                                    rotation: Math.PI / 4,
                                    dashArrayX: [1, 0],
                                    dashArrayY: [2, 5],
                                    color: 'white'
                                }
                            }
                        }))
                    }
                ]
            };

            chart.setOption(option);

            const handleResize = () => {
                chart.resize();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.dispose();
            };
        }
    }, [data]);

    return (
        <div>
            <div className="graph" style={{ height: "500px" }} ref={chartRef} />
            <div className="mt-4">
                <DownloadButton theme={theme} onClick={() => downloadAsJson(data, `Synaptic-Divergence-Percentages-Data.json`)}>
                    Synaptic divergence percentages
                </DownloadButton>
            </div>
        </div>
    );
};

export default SynapticDivergencePercentagesGraph;