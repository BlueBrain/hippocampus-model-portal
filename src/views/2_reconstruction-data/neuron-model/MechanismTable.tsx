import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { dataPath } from '@/config';
import MechanismToolTip from './MechanismToolTip';

type MechanismTableProps = {
    theme?: number;
    instance: string;
    data: {
        all: string[];
        somatic: string[];
        axonal: string[];
        alldend: string[];
    }
};

const MechanismTable: React.FC<MechanismTableProps> = ({ theme, data, instance }) => {
    const [mechanisms, setMechanisms] = useState<{ [key: string]: string[] }>({});
    const [validMechanisms, setValidMechanisms] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        setMechanisms(data);
        checkValidMechanisms(data);
    }, [data]);

    const sections = ['axonal', 'somatic', 'alldend'];

    const checkValidMechanisms = async (mechanismsData: { [key: string]: string[] }) => {
        const validMechs: { [key: string]: boolean } = {};
        for (const section of sections) {
            for (const mech of mechanismsData[section] || []) {
                const response = await fetch(`${dataPath}/2_reconstruction-data/neuron-models/${instance}/mechanisms/${mech}.mod`);
                validMechs[mech] = response.ok;
            }
        }
        setValidMechanisms(validMechs);
    };

    const handleDownload = (filename: string) => {
        if (validMechanisms[filename]) {
            const link = document.createElement('a');
            link.href = `${dataPath}/2_reconstruction-data/neuron-models/${instance}/mechanisms/${filename}.mod`;
            link.download = `${filename}.mod`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="p-4">
            <style jsx global>{`
             
            `}</style>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left p-2 border-b-2">Sections</th>
                        <th className="text-left p-2 border-b-2">Mechanisms</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section) => (
                        <tr key={section} className="border-b">
                            <td className="p-2 font-medium">{section}</td>
                            <td className="p-2">
                                {mechanisms[section]?.map((mech) => (
                                    <Tooltip
                                        key={mech}
                                        title={<MechanismToolTip equation={"U_{SE}^{ACh} = \\frac{1.0 ACh^{-0.576}}{4.541^{-0.576} + ACh^{-0.576}}"} />}
                                        trigger="hover"
                                        placement="top"
                                        overlayInnerStyle={{
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                        }}
                                    >
                                        <span
                                            className={`inline-block mr-2 mb-1 px-2 py-1 ${validMechanisms[mech]
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {mech}
                                        </span>
                                    </Tooltip>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MechanismTable;