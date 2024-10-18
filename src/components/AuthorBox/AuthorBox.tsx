import React, { ReactChild, ReactFragment } from 'react';
import { TfiWrite } from "react-icons/tfi";

import styles from './styles.module.scss';

type AuthorBoxProps = {
    children: ReactChild | ReactFragment;
    hasIcon?: boolean;
};

const AuthorBox: React.FC<AuthorBoxProps> = ({ children, hasIcon = true }) => {
    return (
        <div className={`${styles.authorBox} flex flex-row flex-grow-0`}>

            <div className={`flex justify-center pt-1 mr-2`}>
                {hasIcon && <TfiWrite className={`${styles.icon} `} />}
            </div>

            <div className='flex-grow' > {children}</div>
        </div>
    );
};
export default AuthorBox;