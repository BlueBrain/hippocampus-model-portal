import React, { useMemo, useCallback } from "react";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type MechanismToolTipProps = {
    equation: string
}

const MechanismToolTip: React.FC<MechanismToolTipProps> = ({ equation }) => {
    const parseLatex = useCallback((latex: string): string => {
        if (!latex) return ''; // Return empty string if latex is undefined or null
        return latex
            .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
            .replace(/\^/g, '**')
            .replace(/_{([^}]*)}/g, '$1')
            .replace(/\\/g, '')
            .replace(/ACh/g, 'x');
    }, []);

    const evaluateEquation = useCallback((x: number, eq: string): number => {
        if (!eq) return 0; // Return 0 if equation is undefined or null
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
        const xValues = Array.from({ length: 50 }, (_, i) => i / 5); // 0 to 9.8 in 0.2 steps
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

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
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
                    text: 'U_{SE}^{ACh}'
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