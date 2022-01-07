import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

type HttpDownloadButtonProps = {
  href?: string;
  download?: string | boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

const HttpDownloadButton: React.FC<HttpDownloadButtonProps> = ({ href, download, children, onClick }) => {
  return (
    <Button
      type="primary"
      size="small"
      icon={<DownloadOutlined />}
      href={href}
      download={download}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default HttpDownloadButton;
