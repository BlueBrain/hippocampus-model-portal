import React, { ReactNode, useState } from 'react';
import Link from 'next/link';

import { MdInfoOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import styles from './styles.module.scss';

type SectionCardProps = {
  title: string;
  description?: ReactNode;
  idx: string;
  icon?: string;
  bgColor?: string;
  links: {
    label: string;
    href?: string;
  }[];
};

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  idx,
  links,
  icon,
}) => {
  const [infoOpened, setInfoOpened] = useState(false);


  const handlePopupClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setInfoOpened(false);
    }
  };

  return (
    <>
      <div className={`${styles.container} bg-card-gradiant-${idx} ${infoOpened ? 'show' : ''}`}>
        <div className={styles.head}>
          <div className="flex justify-between items-center">
            <div>
              <div className="sm:text-l">
                <h3 className='text-white'>{title}</h3>
              </div>
            </div>
            <div>
              <MdInfoOutline className="cursor-pointer" onClick={() => setInfoOpened(!infoOpened)} />
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {links.map(link => link.href ? (
            <Link key={link.label} href={link.href} prefetch={false} legacyBehavior>
              <a className='md:text-sm sm:text-lg'>{link.label}</a>
            </Link>
          ) : (
            <p key={link.label}>{link.label}<sup>*</sup></p>
          ))}
        </div>
      </div>
      <div className={`${styles.popup} ${infoOpened ? styles.show : ''} `} onClick={handlePopupClick}>
        <div className={`${styles.popup__window} ${styles[`popup__window--${idx}`]}`}>
          <div className={`${styles.popup__header} ${styles[`popup__header--${idx}`]}`}>
            <span className="text-white text-base ">{title}</span>
            <IoMdClose className={`${styles.popup__close}`} onClick={() => setInfoOpened(!infoOpened)} />
          </div>
          <div className={`${styles.popup__content}`}>{description}</div>
        </div>
      </div>
    </>
  );
};

export default SectionCard;