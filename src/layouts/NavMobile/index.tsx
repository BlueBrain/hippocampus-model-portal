import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdClose } from 'react-icons/md';
import { IoMdMenu } from 'react-icons/io';

import { SecondaryNav } from '../Navigation';
import { basePath } from '../../config';


const classPrefix = 'nav-mobile__';

type MenuProps = {
  open?: boolean;
  onClose: () => void;
};

const Menu: React.FC<MenuProps> = ({ open, onClose }) => (
  <div className={`${classPrefix}menu ${open ? 'open' : ''}`}>
    <div className="close-icon" onClick={onClose}>
      <MdClose />
    </div>
    <div className="top-links">
      <Link href="/">
        <a>
          <img
            src={`${basePath}/assets/images/icons/home.svg`}
            alt="Explore models"
          />
          <span>Explore models</span>
        </a>
      </Link>
      <a href="/build/">
        <img
          src={`${basePath}/assets/images/icons/home.svg`}
          alt="Build models"
        />
        <span>Build models</span>
      </a>
      <Link href="/glossary">
        <a>
          <img
            src={`${basePath}/assets/images/icons/globe.svg`}
            alt="Glossary"
          />
          <span>Glossary</span>
        </a>
      </Link>
      <a href="/#contact-us">
        <img
          src={`${basePath}/assets/images/icons/mail-alt.svg`}
          alt="Contact"
        />
        <span>Contact</span>
      </a>
    </div>
    <SecondaryNav canClose />
  </div>
);

const NavMobile = () => {
  const router = useRouter()

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setOpen(false), [router]);

  return (
    <>
      <div className={`${classPrefix}basis`} onClick={() => setOpen(true)}>
        <IoMdMenu />
      </div>
      <Menu onClose={() => setOpen(false)} open={open} />
    </>
  );
}

export default NavMobile;
