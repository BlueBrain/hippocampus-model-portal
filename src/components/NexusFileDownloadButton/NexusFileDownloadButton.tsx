import React, { useState } from 'react';
import { useNexusContext } from '@bbp/react-nexus';
import { saveAs } from 'file-saver';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { parseUrl } from '../../utils';



export type NexusFileDownloadButtonProps = {
  filename: string;
  url: string;
  org?: string;
  project?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
};

const NexusFileDownloadButton: React.FC<NexusFileDownloadButtonProps> = ({
  filename,
  url,
  org,
  project,
  children,
  icon = <DownloadOutlined />,
  className = '',
  id = '',
  animate = true,
}) => {
  const nexus = useNexusContext();

  const [loading, setLoading] = useState<boolean>(false);

  const download = () => {
    setLoading(true);
    const { org: fileOrg, project: fileProject } = {...parseUrl(url), ...{ org, project }};
    const fileId = url.split('/').reverse()[0];

    nexus.File.get(fileOrg as string, fileProject as string, fileId, { as: 'blob' })
      .then(imageData => saveAs(imageData as Blob, filename))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <Button
      id={id}
      className={className}
      type="primary"
      size="small"
      icon={icon}
      onClick={download}
      loading={animate && loading}
      disabled={loading}
    >
      {children}
    </Button>
  );
};

export default NexusFileDownloadButton;
