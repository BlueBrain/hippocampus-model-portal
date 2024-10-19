import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DownloadButton from '../DownloadButton';

interface DownloadModelProps {
    theme: any; // Replace 'any' with the actual theme type
    resources: string[];
}

const DownloadModel: React.FC<DownloadModelProps> = ({ theme, resources }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addResourceToZip = async (zip: JSZip, resourcePath: string) => {
        try {
            const response = await fetch(resourcePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch resource: ${resourcePath}`);
            }

            const fileName = resourcePath.split('/').pop() || '';
            const content = await response.blob();

            if (fileName.endsWith('.zip')) {
                // It's a zip file, add it directly
                zip.file(fileName, content);
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    // It's likely a folder (directory listing)
                    const files = await response.json();
                    const folderName = resourcePath.split('/').filter(Boolean).pop() || '';
                    const folderZip = zip.folder(folderName);

                    if (folderZip) {
                        for (const file of files) {
                            const filePath = `${resourcePath}${file}`;
                            await addResourceToZip(folderZip, filePath);
                        }
                    }
                } else {
                    // It's a regular file
                    zip.file(fileName, content);
                }
            }
        } catch (error) {
            console.warn(`Failed to add resource: ${resourcePath}`, error);
        }
    };

    const downloadResources = async () => {
        setIsLoading(true);
        setError(null);
        const zip = new JSZip();

        try {
            for (const resource of resources) {
                await addResourceToZip(zip, resource);
            }

            const zipContent = await zip.generateAsync({ type: 'blob' });
            saveAs(zipContent, 'neuron_model.zip');
        } catch (error) {
            console.error('Error downloading resources:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DownloadButton
                onClick={downloadResources}
                theme={theme}
                isLoading={isLoading}
            >
                {isLoading ? 'Downloading...' : 'Download Model'}
            </DownloadButton>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </>
    );
};

export default DownloadModel;
