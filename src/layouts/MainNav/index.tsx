import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowDown } from "react-icons/io";

import { basePath } from '../../config';

import styles from './nav.module.scss';

const Menu: React.FC = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

type MenuItemProps = {
  label: string;
  href: string;
  external?: boolean;
  menuGroup: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ label, href, children, external = false, menuGroup }) => {
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleMenuToggle = (menuGroup: string) => {
    setOpenMenuGroup(prevGroup => (prevGroup === menuGroup ? '' : menuGroup));
    setIsMenuOpened(prevState => !prevState);
  };

  const handleMouseEnter = (menuGroup: string) => {
    if (window.innerWidth > 1200) {
      setOpenMenuGroup(menuGroup);
      setIsMenuOpened(true);
    }
  };

  const handleMouseLeave = (menuGroup: string) => {
    if (window.innerWidth > 1200) {
      setIsMenuOpened(false);
      setOpenMenuGroup('');
    }
  };

  const handleClick = (menuGroup: string) => {
    if (window.innerWidth <= 1200) {
      handleMenuToggle(menuGroup);
    }
  };

  return (
    <li
      onMouseEnter={() => handleMouseEnter(menuGroup)}
      onMouseLeave={() => handleMouseLeave(menuGroup)}
      onClick={() => handleClick(menuGroup)}
      className={styles['main-navigation__item']}
    >
      <Link href={href}>{label}</Link>
      <div className={`${styles["arrow"]} ${isMenuOpened && openMenuGroup === menuGroup ? styles["arrow--active"] : ""}`}>
        <IoIosArrowDown />
      </div>
      {children && isMenuOpened && (openMenuGroup === menuGroup) && (
        <div className={styles["submenu"]}>
          {children}
        </div>
      )}
    </li>
  );
};

type SubmenuLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  highlight?: boolean;
};

const SubmenuLink: React.FC<SubmenuLinkProps> = ({ href, label, external = false, highlight = false }) => {
  return external ? (
    <a
      className={`${styles["submenu__link"]} ${highlight ? styles["submenu__link--highlight"] : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  ) : (
    <Link
      className={`${styles["submenu__link"]} ${highlight ? styles["submenu__link--highlight"] : ""}`}
      href={href}
    >
      {label}
    </Link>
  );
};

type SubmenuGroupProps = {
  label: string;
  href?: string;
  external?: boolean;
  color?: string;
  menuGroup?: string;
};

const SubmenuGroup: React.FC<SubmenuGroupProps> = ({ label, href, children, external = false, menuGroup = "", color }) => {
  const [isOpened, setIsOpened] = useState<Boolean>(false);
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');

  const handleMenuToggle = () => {
    setIsOpened(prevState => !prevState);
    setOpenMenuGroup(prevGroup => (prevGroup === menuGroup ? '' : menuGroup));
  };

  return (
    <>
      <div onClick={handleMenuToggle} className={`${styles["submenu__group-link"]} ${isOpened && openMenuGroup === menuGroup ? styles["submenu__group-link--active"] : ""}`} style={color ? { borderLeft: "8px solid " + color } : {}}>
        {href ? <Link href={href}>{label}</Link> : <span>{label}</span>}
        <div className={`${styles["arrow"]} ${isOpened ? styles["arrow--active"] : ""}`}>
          <IoIosArrowDown />
        </div>
      </div>

      <div className={`${styles["submenu__group-list"]} ${isOpened && openMenuGroup === menuGroup ? styles["submenu__group-list--active"] : ""}`}>
        {children}
      </div>
    </>
  );
};

const MainNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <>
      <div className={`${styles.hamburger} ${menuOpen ? styles["hamburger--open"] : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Menu>
        <ul className={`${styles['main-navigation']} ${menuOpen ? styles['main-navigation--open'] : ''}`}>
          {/* Home */}
          <MenuItem
            label="Home"
            href='/'
            external
            menuGroup='menu-group-home'
          >
            <SubmenuLink label="About the Hub" href="/#about" external />
            <SubmenuLink label="About Build models" href="/#build" external />
            <SubmenuLink label="About Explore models" href="/#explore" external />
            <SubmenuLink label="Resources" href="/#resources" external />
            <SubmenuLink label="Terms and conditions" href="/#terms" external />
          </MenuItem>

          {/* Build Models */}
          <MenuItem
            label="Build Models"
            href='/build/'
            external
            menuGroup='menu-group-build'
          >
            <SubmenuGroup label='Data' href="/build/data" external menuGroup='menu-group-build'>
              <SubmenuLink label="Connections" external href="/build/data/connection" />
              <SubmenuLink label="Electrophysiology" external href="/build/data/electrophysiology" />
              <SubmenuLink label="Morphologies" external href="/build/data/morphology" />
            </SubmenuGroup>
            <SubmenuLink label="Models" href="/build/models" external />
            <SubmenuLink label="Workflows" href="/build/workflows" external />
          </MenuItem>

          {/* Explore Models */}
          <MenuItem
            label="Explore Models"
            href='/'
            menuGroup='menu-group-explore'
          >
            <SubmenuGroup label="Experimental Data" menuGroup='menu-group-experimental-data' color='#EFAE97'>
              <SubmenuLink label="Layer Anatomy" href="/experimental-data/layer-anatomy/" />
              <SubmenuLink label="Neuronal Morphology" href="/experimental-data/neuronal-morphology/" />
              <SubmenuLink label="Neuronal Electrophysiology" href="/experimental-data/neuronal-electrophysiology/" />
              <SubmenuLink label="Cell Density" href="/experimental-data/cell-density" />
              <SubmenuLink label="Connection Anatomy" href="/experimental-data/connection-anatomy/" />
              <SubmenuLink label="Connection Physiology" href="/experimental-data/connection-physiology/" />
              <SubmenuLink label="Schaffer Collaterals" href="/experimental-data/schaffer-collaterals/" />
              <SubmenuLink label="Minis" href="/experimental-data/minis/" />
              <SubmenuLink label="Acetylcholine" href="/experimental-data/acetylcholine/" />
              <SubmenuLink label="Theta" href="/experimental-data/theta/" />
            </SubmenuGroup>

            <SubmenuGroup label="Reconstruction Data" menuGroup='menu-group-reconstruction-data' color='#EA9088'>
              <SubmenuLink label="Volume" href="/reconstruction-data/volume/" />
              <SubmenuLink label="Cell composition" href="/reconstruction-data/cell-composition/" />
              <SubmenuLink label="Morphology library" href="/reconstruction-data/morphology-library/" />
              <SubmenuLink label="Neuron models" href="/reconstruction-data/neuron-models/" />
              <SubmenuLink label="Neuron model library" href="/reconstruction-data/neuron-model-library/" />
              <SubmenuLink label="Connections" href="/reconstruction-data/connections/" />
              <SubmenuLink label="Synapses" href="/reconstruction-data/synapses/" />
              <SubmenuLink label="Schaffer Collaterlas" href="/reconstruction-data/schaffer-collaterals/" />
              <SubmenuLink label="Acetylcholine" href="/reconstruction-data/acetylcholine/" />
            </SubmenuGroup>

            <SubmenuGroup label="Digital Reconstructions" menuGroup='menu-group-digital-reconstructions' color='#CC8A99'>
              <SubmenuLink label="Region" href="/digital-reconstructions/region/" />
              <SubmenuLink label="Schaffer Collaterals" href="/digital-reconstructions/schaffer-collaterals/" />
              <SubmenuLink label="Connections" href="/digital-reconstructions/connections/" />
              <SubmenuLink label="Synapses" href="/digital-reconstructions/synapses/" />
              <SubmenuLink label="Neurons" href="/digital-reconstructions/neurons/" />
              <SubmenuLink label="Acetylcholine" href="/digital-reconstructions/acetylcholine/" />
            </SubmenuGroup>

            <SubmenuGroup label="Validations" menuGroup='menu-group-validations' color='#9E98AE'>
              <SubmenuLink label="Neurons" href='/validations/neurons/' />
              <SubmenuLink label="Connection anatomy" href='/validations/connection-anatomy/' />
              <SubmenuLink label="Connection physiology" href='/validations/connection-physiology/' />
              <SubmenuLink label="Schaffer collaterals" href='/validations/schaffer-collaterals/' />
              <SubmenuLink label="Acetylcholine" href='/validations/acetylcholine/' />
            </SubmenuGroup>

            <SubmenuGroup label="Predictions" menuGroup='menu-group-predictions' color='#8398B5'>
              <SubmenuLink label="Spontaneous Activity" href='/predictions/spontaneouns-activity' />
              <SubmenuLink label="Voltage - Calcium Scan" href='/predictions/voltage' />
              <SubmenuLink label="Theta - Oscillatory input" href='/predictions/theta-oscillatory-input' />
              <SubmenuLink label="Theta - MS input" href='/predictions/theta-ms-input' />
            </SubmenuGroup>

            <SubmenuLink label="Glossary" href={`${basePath}/glossary/`} external highlight />
          </MenuItem>

          <button className={styles['main-navigation__button']}>
            Contact Us
          </button>
        </ul>
      </Menu>
    </>
  );
};

export default MainNav;
