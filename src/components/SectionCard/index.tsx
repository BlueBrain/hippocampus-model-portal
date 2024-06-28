import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMinus, FaPlus } from 'react-icons/fa';

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

  return (
    <div className={`${styles.container} bg-card-gradiant-${idx} ${infoOpened ? 'show' : ''}`}>
      <div className={styles.head}>
        <div className={styles.title}>
          {/*

          Icon & Count

          <Row justify="space-between" align="middle">
            <Col>{icon && <img src={icon} alt="icon" className={styles.icon} />}</Col>
            <Col><div className={styles.idx}>0{idx}</div></Col>
          </Row>
          */}
          <h3 className="text-white">{title}</h3>
        </div>
      </div>
      <div className={styles.body}>
        {links.map(link => link.href ? (
          <Link key={link.label} href={link.href} prefetch={false} legacyBehavior>
            {link.label}
          </Link>
        ) : (
          <p key={link.label}>{link.label}<sup>*</sup></p>
        ))}

        <div
          className={styles.infoBtn}
          onClick={() => setInfoOpened(!infoOpened)}
        >
          {infoOpened ? (<FaMinus size={14} />) : (<FaPlus size={14} />)}
        </div>

        <div
          className={styles.info + ' bg-card-gradiant-' + idx}
        >
          {description}
        </div>
        <div className={styles.infoBottomGradient}></div>
      </div>
    </div>
  );
};

export default SectionCard
