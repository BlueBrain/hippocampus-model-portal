import React, { ReactChild, ReactFragment } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";

import styles from './styles.module.scss';

type DownloadButtonProps = {
    children: ReactChild | ReactFragment;
    download?: string | boolean;
    theme?: number;
    onClick?: () => void;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ children, download, theme, onClick }) => {
    return (
        <button className={`text-sm ${styles.button} ${theme ? styles[`theme-${theme}`] : ''} `} onClick={onClick}>
            <div className={`${styles.iconContainer} ${theme ? styles[`theme-${theme}`] : ''} `}>
                <MdOutlineFileDownload className={`${styles.icon} ${theme ? styles[`theme-${theme}`] : ''} `} />
            </div>
            <span>{children}</span>
        </button>
    );
};
export default DownloadButton;