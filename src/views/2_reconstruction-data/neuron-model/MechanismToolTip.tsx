import React, { useMemo, useCallback } from "react";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MechanismToolTipProps = {
    mechanism?: {
        channel_name: string;
        name: string;
        value: number;
        distribution: string;
        function: string;
    };
}

const MechanismToolTip: React.FC<MechanismToolTipProps> = ({ mechanism }) => {
    const evaluateFunction = useCallback((distance: number, func: string | undefined): number => {
        if (!func) return 0;

        // Handle constant value
        if (!isNaN(Number(func))) {
            return Number(func);
        }

        // Handle exponential function
        if (func.includes('math.exp')) {
            const match = func.match(/math\.exp\(\(-\{distance\}\)\/(\d+)\)\*(\d+(?:\.\d+)?(?:e-?\d+)?)/);
            if (match) {
                const [, scale, coefficient] = match;
                return Math.exp(-distance / Number(scale)) * Number(coefficient);
            }
        }

        // Handle scientific notation
        if (func.includes('e')) {
            return Number(func);
        }

        return 0;
    }, []);

    const chartData = useMemo(() => {
        if (!mechanism) return [];
        const distances = Array.from({ length: 100 }, (_, i) => i);
        return distances.map(distance => ({
            distance,
            value: evaluateFunction(distance, mechanism.function)
        }));
    }, [mechanism, evaluateFunction]);

    const formatFunction = (func: string | undefined): string => {
        if (!func) return 'undefined';
        if (!isNaN(Number(func))) {
            return func;
        }
        if (func.includes('math.exp')) {
            return func.replace('{distance}', 'x').replace('math.exp', 'e');
        }
        return func;
    };

    if (!mechanism) {
        return <div>No mechanism data available</div>;
    }

    return (
        <div className="flex flex-col justify-center h-full">
            <div className="mt-4 flex-grow h-[150px] ">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
                    >
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3B4165"
                            strokeWidth={2}
                            dot={false}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="distance"
                            ticks={[0, 25, 50, 75, 100]}
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => value.toFixed(5)}
                            width={40}
                        />
                        <Tooltip formatter={(value) => typeof value === 'number' ? value.toExponential(4) : value} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="p-2">
                <MathJaxContext>
                    <MathJax >
                        {`\\[f(x) = ${formatFunction(mechanism.function)}\\]`}
                    </MathJax>
                </MathJaxContext>
            </div>
        </div>
    );
}

export default React.memo(MechanismToolTip);
