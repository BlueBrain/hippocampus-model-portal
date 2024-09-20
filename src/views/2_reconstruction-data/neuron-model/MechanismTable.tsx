import React, { useState, useEffect } from 'react';

type MechanismTableProps = {
    theme?: number;
    data: {
        all: string[];
        somatic: string[];
        axonal: string[];
        alldend: string[];
    }
};

const MechanismTable: React.FC<MechanismTableProps> = ({ theme, data }) => {
    const [mechanisms, setMechanisms] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        setMechanisms(data);
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
                                    <span key={mech} className="inline-block mr-2 mb-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                        {mech}
                                    </span>
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