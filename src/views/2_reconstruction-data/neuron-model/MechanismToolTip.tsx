import React, { useMemo, useCallback } from "react";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type MechanismToolTipProps = {
    equation: string
}

const MechanismToolTip: React.FC<MechanismToolTipProps> = ({ equation }) => {
    const parseLatex = useCallback((latex: string): string => {
        if (!latex) return '';
        return latex
            .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
            .replace(/\^/g, '**')
            .replace(/_{([^}]*)}/g, '$1')
            .replace(/\\/g, '')
            .replace(/ACh/g, 'x');
    }, []);

    const evaluateEquation = useCallback((x: number, eq: string): number => {
        if (!eq) return 0;
        const jsEquation = parseLatex(eq);
        const expression = jsEquation.replace(/x/g, x.toString());
        try {
            return Function('return ' + expression)();
        } catch (error) {
            console.error('Error evaluating equation:', error);
            return 0;
        }
    }, [parseLatex]);

    const chartData = useMemo(() => {
        const xValues = Array.from({ length: 50 }, (_, i) => i / 5);
        const yValues = xValues.map(x => evaluateEquation(x, equation || ''));

        return {
            labels: xValues.map(x => x.toFixed(1)),
            datasets: [
                {
                    label: 'Equation',
                    data: yValues,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };
    }, [equation, evaluateEquation]);

    const options = useMemo<ChartOptions<'line'>>(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Disable all animations
        transitions: {
            active: {
                animation: {
                    duration: 0 // Disable hover animations
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'ACh'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'U_SE^ACh'
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: false
            }
        }
    }), []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow bg-gray-100 h-[150px]">
                <Line data={chartData} options={options} height={150} width={350} />
            </div>
            <div className="p-2">
                <MathJaxContext>
                    <MathJax>
                        {`\\[${equation || ''}\\]`}
                    </MathJax>
                </MathJaxContext>
            </div>
        </div>
    );
}

export default React.memo(MechanismToolTip);