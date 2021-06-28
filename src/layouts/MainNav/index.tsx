import React, { useState } from 'react';
import NextLink from 'next/link';
import { HomeFilled, GlobalOutlined, ToolFilled  } from '@ant-design/icons';

import styles from './nav.module.scss';


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
    : (<NextLink href={href}><a className={className}>{label}</a></NextLink>)
};

type SubmenuLinkProps = {
  href: string;
  label: string;
  external: boolean;
  grey?: boolean;
};

const SubmenuLink: React.FC<SubmenuLinkProps> = ({ href, label, external = false, grey = false }) => {
  return (
    <Link
      className={`${styles.submenuLink} ${grey ? styles.submenuLinkGrey : ''}`}
      label={label}
      href={href}
      external={external}
    />
  );
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
        <Link className={styles.submenuLink} label={label} href={href} external={external}/>
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
    ? (<Link className={styles.submenuGroupLink} label={labelWithCircle} href={href} external={external}/>)
    : (<span className={styles.submenuGroupDisabledLink}>{labelWithCircle}</span>);
};

type MenuItemProps = {
  label: string;
  href: string;
  external?: boolean;
  background?: string;
  className?: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ label, href, children, external = false, background = '', className = '' }) => {
  return (
    <li className={`${styles.menuItem} ${className}`}>
      <div className={`${styles.menuLink} bg-${background}`}>
        <Link label={label} href={href} external={external}/>
      </div>
      <div className={styles.hoverBar}></div>
      {children && (
        <div className={styles.submenu}>
          <div className="pos-relative">
            {children}
          </div>
        </div>
      )}
    </li>
  );
};

const MainNav: React.FC = () => {
  return (
    <Menu>
      <MenuItem
        label="Home"
        className="menu-group-home"
        external
        background="white"
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
        href="/"
      >
        <SubmenuGroup label="Experimental Data" background="grey-1">
          <SubmenuGroupLink label="Layer Anatomy" />
          <SubmenuGroupLink label="Neuronal Morphology" href="/experimental-data/neuronal-morphology/" />
          <SubmenuGroupLink label="Neuronal Electrophysiology" href="/experimental-data/neuronal-electrophysiology/" />
        </SubmenuGroup>

        <SubmenuGroup label="Reconstruction Data" background="grey-2">
          <SubmenuGroupLink label="Brain Regions" />
          <SubmenuGroupLink label="Microcircuits" />
          <SubmenuGroupLink label="Synaptic Pathways" />
          <SubmenuGroupLink label="Neurons" />
        </SubmenuGroup>

        <SubmenuGroup label="Digital Reconstructions" background="grey-3">
          <SubmenuGroupLink label="Brain Regions" />
          <SubmenuGroupLink label="Microcircuits" />
          <SubmenuGroupLink label="Synaptic Pathways" />
          <SubmenuGroupLink label="Neurons" href="/digital-reconstructions/neurons/" />
        </SubmenuGroup>

        <SubmenuGroup label="Validations" background="grey-4">
          <SubmenuGroupLink label="Brain Regions" />
          <SubmenuGroupLink label="Microcircuits" />
          <SubmenuGroupLink label="Synaptic Pathways" />
          <SubmenuGroupLink label="Neurons" />
        </SubmenuGroup>

        <SubmenuGroup label="Predictions" background="grey-5">
          <SubmenuGroupLink label="Brain Regions" />
          <SubmenuGroupLink label="Microcircuits" />
          <SubmenuGroupLink label="Synaptic Pathways" />
          <SubmenuGroupLink label="Neurons" />
        </SubmenuGroup>

        <SubmenuLink label="Glossary" href="/model/glossary/" external grey />
      </MenuItem>

      <MenuItem label="Contact us" external href="/#contact-us" />
    </Menu>
  );
};

export default MainNav;