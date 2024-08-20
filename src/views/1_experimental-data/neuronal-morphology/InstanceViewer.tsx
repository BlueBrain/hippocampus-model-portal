// React and Next.js imports
import React, { useMemo } from 'react';

import ESData from '@/components/ESData';
import NexusPlugin from '@/components/NexusPlugin';

import { useNexusContext } from '@bbp/react-nexus';
import { morphologyDataQuery } from '@/queries/es';

export type InstanceViewerProps = {
    theme?: number,
    currentMtype: string | string[] | undefined,
    currentInstance: string | string[] | undefined
};

const InstanceViewer: React.FC<InstanceViewerProps> = ({ theme, currentMtype, currentInstance }) => {
    const nexus = useNexusContext();

    return (
        <>
            <ESData query={morphologyDataQuery(currentMtype, currentInstance)}>
                {(esDocuments) => {
                    if (!esDocuments || !esDocuments.length) return null;
                    const esDocument = esDocuments[0]._source;
                    return (
                        <>

                            <div className="neuron-viewer-container">
                                <NexusPlugin
                                    className=""
                                    name="neuron-morphology"
                                    resource={esDocument}
                                    nexusClient={nexus}
                                />
                            </div>
                            <div className="flex gap-4">
                                {/* Buttons */}
                            </div >
                        </>
                    )
                }}
            </ESData >
        </>
    )
}

export default InstanceViewer