import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdInfoOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import styles from './styles.module.scss';
import { Row, Col } from 'antd';

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
          <Row justify="space-between" align="middle">
            <Col>
              <div className={styles.title}>
                <h3 className="text-white">{title}</h3>
              </div>
            </Col>
            <Col>
              <MdInfoOutline className={styles.icon} onClick={() => setInfoOpened(!infoOpened)} />
            </Col>
          </Row>
        </div>
        <div className={styles.body}>
          {links.map(link => link.href ? (
            <Link key={link.label} href={link.href} prefetch={false} legacyBehavior>
              <a>{link.label}</a>
            </Link>
          ) : (
            <p key={link.label}>{link.label}<sup>*</sup></p>
          ))}
        </div>
      </div>
      <div className={`${styles.popup} ${infoOpened ? styles.show : ''}`} onClick={handlePopupClick}>
        <div className={`${styles.popup__window} ${styles[`popup__window--${idx}`]}`}>
          <div className={`${styles.popup__header} ${styles[`popup__header--${idx}`]}`}>
            <span className="text-white">{title}</span>
            <IoMdClose className={`${styles.popup__close}`} onClick={() => setInfoOpened(!infoOpened)} />
          </div>
          <div className={`${styles.popup__content}`}>{description}</div>
        </div>
      </div>
    </>
  );
};

export default SectionCard;