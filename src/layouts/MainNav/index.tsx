import React, { useState } from 'react';
import Link from 'next/link';
import { HomeFilled, GlobalOutlined, ToolFilled } from '@ant-design/icons';
import { IoIosArrowDown } from "react-icons/io";

import { basePath } from '../../config';

import styles from './nav.module.scss'

const Menu: React.FC = ({ children }) => {
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  return (
    <>
      {children}
    </>
  )
}

type MenuItemProps = {
  label: string;
  href: string;
  external?: boolean;
  menuGroup: string
};

const MenuItem: React.FC<MenuItemProps> = ({ label, href, children, external = false, menuGroup }) => {
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');
  const [isMenuOpened, setIsMenuOpened] = useState(true);

  const MouseEnter = (menuGroup: string) => {
    setOpenMenuGroup(menuGroup);
    setIsMenuOpened(true);

    console.log("Enter: " + openMenuGroup + " " + isMenuOpened);
  }

  const MouseLeave = (menuGroup: string) => {
    setIsMenuOpened(false);
    setOpenMenuGroup(menuGroup);
    console.log("Leave: " + openMenuGroup + " " + isMenuOpened);
  }

  return (
    <li onMouseEnter={() => MouseEnter(menuGroup)} onMouseLeave={() => MouseLeave(menuGroup)} className={styles['main-navigation__item']}>
      <span>{label}</span>
      <div className={`${styles["arrow"]} ${isMenuOpened ? styles["arrow--active"] : ""}`}>
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
  external: boolean;
  highlight?: boolean
};

const SubmenuLink: React.FC<SubmenuLinkProps> = ({ href, label, external = false, highlight = false }) => {
  return (
    <Link
      className={styles["submenu__link"] + " " + (highlight && " highlight")}
      href={href}
      external={external}
      highlight={highlight}
    >
      {label}
    </Link>

  );
};

{/* 
const Menu: React.FC = ({ children }) => {
  const [openMobileMenuGroup, setOpenMobileMenuGroup] = useState<string>('');
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  const onMobileMenuGroupClick = (menuGroup) => {
    if (mobileMenuOpened) {
      if (openMobileMenuGroup === menuGroup) {
        setMobileMenuOpened(false);
      } else {
        setOpenMobileMenuGroup(menuGroup);
      }
    } else {
      if (openMobileMenuGroup !== menuGroup) {
        setOpenMobileMenuGroup(menuGroup);
      }

      setMobileMenuOpened(true);
    }
  }

  const isMobileMenuGroupActive = (menuGroup) => {
    return openMobileMenuGroup === menuGroup && mobileMenuOpened;
  }

  return (
    <>
      <ul className={`${styles.menu} menu-group-${openMobileMenuGroup}-open ${mobileMenuOpened ? styles.mobileShow : ''}`}>
        {children}
      </ul>

      <div className={styles.bottomMobileMenuBar}>
        <HomeFilled
          className={isMobileMenuGroupActive('home') ? styles.active : ''}
          onClick={() => onMobileMenuGroupClick('home')}
        />
        <GlobalOutlined
          className={isMobileMenuGroupActive('explore') ? styles.active : ''}
          onClick={() => onMobileMenuGroupClick('explore')}
        />
        <ToolFilled
          className={isMobileMenuGroupActive('build') ? styles.active : ''}
          onClick={() => onMobileMenuGroupClick('build')}
        />
      </div>
    </>
  );
};

type LinkProps = {
  label: React.ReactElement | string;
  href: string;
  external: boolean;
  className?: string;
};

const Link: React.FC<LinkProps> = ({ href, label, external = false, className = '' }) => {
  return external
    ? (<a className={className} href={href}>{label}</a>)
    : (<NextLink href={href} prefetch={false} className={className} label={label}>{label}</NextLink>);
};

type SubmenuGroupProps = {
  label: string;
  href?: string;
  external?: boolean;
  background?: string;
};

const SubmenuGroup: React.FC<SubmenuGroupProps> = ({ label, href, children, background, external = false }) => {
  return (
    <div className={styles.submenuGroup}>
      {href ? (
        <Link className={styles.submenuLink} label={label} href={href} external={external} />
      ) : (
        <span className={styles.submenuDisabledLink}>{label}</span>
      )}
      <div className={`${styles.submenuGroupContainer} bg-${background}`}>
        {children}
      </div>
      <div className={`${styles.submenuGroupColorLabel} bg-${background}`}></div>
    </div>
  );
};

type SubmenuGroupLinkProps = {
  label: string;
  href?: string;
  external?: boolean;
};

const SubmenuGroupLink: React.FC<SubmenuGroupLinkProps> = ({ label, href, external = false }) => {
  const labelWithCircle = (
    <>
      <div className={styles.groupLinkCircle}></div>
      <span className={styles.groupLinkLabel}>{label}</span>
    </>
  );

  return href
    ? (<Link className={styles.submenuGroupLink} label={labelWithCircle} href={href} external={external} />)
    : (<span className={styles.submenuGroupDisabledLink}>{labelWithCircle}</span>);
};


*/}

const MainNav: React.FC = () => {
  return (
    <Menu>

      <ul className={styles['main-navigation']}>

        { /* Home */}
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

        { /* Build Models */}
        <MenuItem
          label="Build Models"
          href='/build/'
          external
          menuGroup='menu-group-build'
        >
          { /* !!! Add Group Here */}
          <SubmenuLink label="Models" href="/build/models" external />
          <SubmenuLink label="Workflows" href="/build/workflows" external />
        </MenuItem>

        { /* Explore Models */}
        <MenuItem
          label="Explore Models"
          href='/'
          menuGroup='menu-group-explore'
        >
          <SubmenuLink label="Glossary" href={`${basePath}/glossary/`} external highlight />
        </MenuItem>

        <button className={styles['main-navigation__button']}>
          Contact Us
        </button>

      </ul>
    </Menu>
  );
  { /*
    return (
  {/* 
    <Menu className>
      <MenuItem
        label="Home"
        className="menu-group-home"
        external
        href="/"
      >
        <SubmenuLink label="About the Hub" href="/#about" external />
        <SubmenuLink label="About Build models" href="/#build" external />
        <SubmenuLink label="About Explore models" href="/#explore" external />
        <SubmenuLink label="Resources" href="/#resources" external />
        <SubmenuLink label="Terms and conditions" href="/#terms" external />
      </MenuItem>

      <MenuItem
        label="Build Models"
        className="menu-group-build"
        external
        href="/build/"
      >
        <SubmenuGroup label="Data" href="/build/data" external background="white">
          <SubmenuGroupLink label="Connections" external href="/build/data/connection" />
          <SubmenuGroupLink label="Electrophysiology" external href="/build/data/electrophysiology" />
          <SubmenuGroupLink label="Morphologies" external href="/build/data/morphology" />
        </SubmenuGroup>
        <SubmenuLink label="Models" href="/build/models" external />
        <SubmenuLink label="Workflows" href="/build/workflows" external />
      </MenuItem>

      <MenuItem
        label="Explore models"
        className="menu-group-explore"
        background="white"
        href="/"
      >
        <SubmenuGroup label="Experimental Data" background="grey-1">
          <SubmenuGroupLink label="Layer Anatomy" href="/experimental-data/layer-anatomy/" />
          <SubmenuGroupLink label="Neuronal Morphology" href="/experimental-data/neuronal-morphology/" />
          <SubmenuGroupLink label="Neuronal Electrophysiology" href="/experimental-data/neuronal-electrophysiology/" />
          <SubmenuGroupLink label="Connection Anatomy" href="/experimental-data/connection-anatomy/" />
          <SubmenuGroupLink label="Connection Physiology" href="/experimental-data/connection-physiology/" />
          <SubmenuGroupLink label="Schaffer Collaterals" href="/experimental-data/schaffer-collaterals/" />
          <SubmenuGroupLink label="Minis" href="/experimental-data/minis/" />
          <SubmenuGroupLink label="Acetylcholine" href="/experimental-data/acetylcholine/" />

          <SubmenuGroupLink label="Theta" href="/experimental-data/theta/" />
        </SubmenuGroup>

        <SubmenuGroup label="Reconstruction Data" background="grey-2">
          <SubmenuGroupLink label="Volume" href="/reconstruction-data/volume/" />
          <SubmenuGroupLink label="Cell composition" href="/reconstruction-data/cell-composition/" />
          <SubmenuGroupLink label="Morphology library" href="/reconstruction-data/morphology-library/" />
          <SubmenuGroupLink label="Neuron models" href="/reconstruction-data/neuron-models/" />
          <SubmenuGroupLink label="Neuron model library" href="/reconstruction-data/neuron-model-library/" />
          <SubmenuGroupLink label="Connections" href="/reconstruction-data/connections/" />
          <SubmenuGroupLink label="Synapses" href="/reconstruction-data/synapses/" />
          <SubmenuGroupLink label="Schaffer Collaterlas" href="/reconstruction-data/schaffer-collaterals/" />
          <SubmenuGroupLink label="Acetylcholine" href="/reconstruction-data/acetylcholine/" />
        </SubmenuGroup>

        <SubmenuGroup label="Digital Reconstructions" background="grey-3">
          <SubmenuGroupLink label="Region" href="/digital-reconstructions/region/" />
          <SubmenuGroupLink label="Schaffer Collaterals" href="/digital-reconstructions/schaffer-collaterals/" />
          <SubmenuGroupLink label="Connections" href="/digital-reconstructions/connections/" />
          <SubmenuGroupLink label="Synapses" href="/digital-reconstructions/synapses/" />
          <SubmenuGroupLink label="Neurons" href="/digital-reconstructions/neurons/" />
          <SubmenuGroupLink label="Acetylcholine" href="/digital-reconstructions/acetylcholine/" />
        </SubmenuGroup>

        <SubmenuGroup label="Validations" background="grey-4">
          <SubmenuGroupLink label="Neurons" href='/validations/neurons/' />
          <SubmenuGroupLink label="Connection anatomy" href='/validations/connection-anatomy/' />
          <SubmenuGroupLink label="Connection physiology" href='/validations/connection-physiology/' />
          <SubmenuGroupLink label="Schaffer collaterals" href='/validations/schaffer-collaterals/' />
          <SubmenuGroupLink label="Acetylcholine" href='/validations/acetylcholine/' />
        </SubmenuGroup>


        <SubmenuGroup label="Predictions" background="grey-5">
          <SubmenuGroupLink label="Spontaneous Activity" href='/predictions/spontaneouns-activity' />
          <SubmenuGroupLink label="Voltage - Calcium Scan" href='/predictions/voltage' />
          <SubmenuGroupLink label="Theta - Oscillatory input" href='/predictions/theta-oscillatory-input' />
          <SubmenuGroupLink label="Theta - MS input" href='/predictions/theta-ms-input' />
        </SubmenuGroup>

        <SubmenuLink label="Glossary" href={`${basePath}/glossary/`} external grey />
      </MenuItem>

      <MenuItem label="Contact us" external href="/#contact-us" />
    </Menu>
    */}
};

export default MainNav;
