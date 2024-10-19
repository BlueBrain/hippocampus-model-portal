import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import MechanismToolTip from './MechanismToolTip';

type MechanismTableProps = {
    theme?: number;
    instance: string;
    data: {
        [key: string]: Array<{
            channel_name: string;
            name: string;
            value: number;
            distribution: string;
            function: string;
        }>;
    };
};

const MechanismTable: React.FC<MechanismTableProps> = ({ theme, data, instance }) => {
    const [mechanisms, setMechanisms] = useState<{
        [key: string]: Array<{
            channel_name: string;
            name: string;
            value: number;
            distribution: string;
            function: string;
        }>
    }>({});

    useEffect(() => {
        if (data && typeof data === 'object') {
            setMechanisms(data);
        }
    }, [data]);

    const sections = ['axonal', 'somatic', 'alldend'];

    return (
        <div className="p-4">
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
                                        key={mech.channel_name}
                                        title={<MechanismToolTip mechanism={mech} />}
                                        trigger="hover"
                                        placement="top"
                                        overlayInnerStyle={{
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                            width: '300px'
                                        }}
                                    >
                                        <span
                                            className="inline-block mr-2 mb-1 px-2 py-1 bg-blue-100 text-blue-800 cursor-pointer"
                                        >
                                            {mech.channel_name}
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
