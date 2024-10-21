import React, { ReactChild, ReactFragment } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { MdOutlineBuild } from "react-icons/md";
import styles from './styles.module.scss';

interface DownloadButtonProps {
    onClick: () => void;
    theme: any; // Replace 'any' with the actual theme type
    isLoading?: boolean; // Add this line
    children: ReactChild | ReactFragment;
    download?: string | boolean;
    href?: string;
    buildIcon?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ children, download, theme, onClick, href, buildIcon = false, isLoading }) => {

    const IconComponent = buildIcon ? MdOutlineBuild : MdOutlineFileDownload;

    if (href) {
        return (
            <a
                href={href}
                download={download ? true : undefined}
                className={`text-sm ${styles.button} ${theme ? styles[`theme-${theme}`] : ''}`}
            >
                <div className={`${styles.iconContainer} ${theme ? styles[`theme-${theme}`] : ''}`}>
                    <IconComponent className={`${styles.icon} ${theme ? styles[`theme-${theme}`] : ''}`} />
                </div>
                <span>{children}</span>
            </a>
        );
    }

    return (
        <button
            className={`text-sm ${styles.button} ${theme ? styles[`theme-${theme}`] : ''}`}
            onClick={onClick}
        >

            <div className={`${styles.iconContainer} ${theme ? styles[`theme-${theme}`] : ''}`}>
                {buildIcon ? (
                    <MdOutlineBuild className={`${styles.icon} ${theme ? styles[`theme-${theme}`] : ''}`} />
                ) : (
                    <MdOutlineFileDownload className={`${styles.icon} ${theme ? styles[`theme-${theme}`] : ''}`} />
                )}
            </div>

            <span>{children}</span>
        </button>
    );
};

export default DownloadButton;
