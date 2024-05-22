import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { FaMinus, FaPlus } from 'react-icons/fa';

import styles from './styles.module.scss';


type SectionCardProps = {
  title: string;
  description?: ReactNode;
  idx: string;
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
}) => {
  const [infoOpened, setInfoOpened] = useState(false);

  return (
    <div className={`${styles.container} bg-grey-${idx} ${infoOpened ? 'show' : ''}`}>
      <div className={styles.head}>
        <div className={styles.title}>
          <div className={styles.idx}>0{idx}</div>
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
          {infoOpened ? (<FaMinus size={14}/>) : (<FaPlus size={14}/>)}
        </div>

        <div
          className={styles.info}
        >
          {description}
        </div>
        <div className={styles.infoBottomGradient}></div>
      </div>
    </div>
  );
};

export default SectionCard
