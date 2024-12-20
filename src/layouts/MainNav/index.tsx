import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { basePath } from '../../config';
import styles from './nav.module.scss';

const Menu: React.FC = ({ children }) => {
  return <>{children}</>;
};

type MenuItemProps = {
  label: string;
  href: string;
  external?: boolean;
  menuGroup: string;
};

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  href,
  children,
  external = false,
  menuGroup,
}) => {
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');
  const menuRef = useRef<HTMLLIElement>(null);

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuGroup((prevGroup) => (prevGroup === menuGroup ? '' : menuGroup));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuGroup('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <li ref={menuRef} onClick={handleMenuToggle} className={styles['main-navigation__item']}>
      <Link href={href}>{label}</Link>
      <div
        className={`${styles['arrow']} ${
          openMenuGroup === menuGroup ? styles['arrow--active'] : ''
        }`}
      >
        <IoIosArrowDown />
      </div>
      {children && openMenuGroup === menuGroup && (
        <div className={styles['submenu']}>{children}</div>
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

const SubmenuLink: React.FC<SubmenuLinkProps> = ({
  href,
  label,
  external = false,
  highlight = false,
}) => {
  return external ? (
    <a
      className={`${styles['submenu__link']} md:text-base xs:text-2xl ${
        highlight ? styles['submenu__link--highlight'] : ''
      }`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  ) : (
    <Link
      className={`${styles['submenu__link']} md:text-base xs:text-2xl ${
        highlight ? styles['submenu__link--highlight'] : ''
      }`}
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
  openMenuGroup: string;
  setOpenMenuGroup: React.Dispatch<React.SetStateAction<string>>;
};

const SubmenuGroup: React.FC<SubmenuGroupProps> = ({
  label,
  href,
  children,
  external = false,
  menuGroup = '',
  color,
  openMenuGroup,
  setOpenMenuGroup,
}) => {
  const isOpened = openMenuGroup === menuGroup;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuGroup((prevGroup) => (prevGroup === menuGroup ? '' : menuGroup));
  };

  useEffect(() => {
    if (isOpened && contentRef.current) {
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    } else if (contentRef.current) {
      contentRef.current.style.height = '0';
    }
  }, [isOpened]);

  return (
    <>
      <div
        onClick={handleMenuToggle}
        className={`${styles['submenu__group-link']} ${
          isOpened ? styles['submenu__group-link--active'] : ''
        }`}
        style={color ? { borderLeft: '8px solid ' + color } : {}}
      >
        {href ? <Link href={href}>{label}</Link> : <span>{label}</span>}
        <div className={`${styles['arrow']} ${isOpened ? styles['arrow--active'] : ''}`}>
          <IoIosArrowDown />
        </div>
      </div>

      <div
        ref={contentRef}
        className={`${styles['submenu__group-list']} ${
          isOpened ? styles['submenu__group-list--active'] : ''
        }`}
      >
        {children}
      </div>
    </>
  );
};

const MainNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenuGroup, setOpenMenuGroup] = useState<string>('');

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
    if (menuOpen) {
      setOpenMenuGroup('');
    }
  };

  return (
    <>
      <div
        className={`${styles.hamburger} ${menuOpen ? styles['hamburger--open'] : ''}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Menu>
        <ul
          className={`${styles['main-navigation']} ${
            menuOpen ? styles['main-navigation--open'] : ''
          }`}
        >
          {/* Home */}
          <MenuItem label="Home" href="/" external menuGroup="menu-group-home">
            <SubmenuLink label="About the Hub" href="/#about" external />
            <SubmenuLink label="About Build models" href="/#build" external />
            <SubmenuLink label="About Explore models" href="/#explore" external />
            <SubmenuLink label="Resources" href={`${basePath}/resources`} external />
            <SubmenuLink label="Glossary" href={`${basePath}/glossary`} external />
            <SubmenuLink
              label="Terms and conditions"
              href={`${basePath}/model/terms-of-use`}
              external
            />
          </MenuItem>

          {/* Explore Models */}
          <MenuItem label="Explore Models" href="/" menuGroup="menu-group-explore">
            <SubmenuGroup
              label="Experimental Data"
              menuGroup="menu-group-experimental-data"
              color="#EFAE97"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Layer Anatomy" href="/experimental-data/layer-anatomy/" />
              <SubmenuLink
                label="Neuronal Morphology"
                href="/experimental-data/neuronal-morphology/"
              />
              <SubmenuLink
                label="Neuronal Electrophysiology"
                href="/experimental-data/neuronal-electrophysiology/"
              />
              <SubmenuLink label="Cell Density" href="/experimental-data/cell-density" />
              <SubmenuLink
                label="Connection Anatomy"
                href="/experimental-data/connection-anatomy/"
              />
              <SubmenuLink
                label="Connection Physiology"
                href="/experimental-data/connection-physiology/"
              />
              <SubmenuLink
                label="Schaffer Collaterals"
                href="/experimental-data/schaffer-collaterals/"
              />
              <SubmenuLink label="Minis" href="/experimental-data/minis/" />
              <SubmenuLink label="Acetylcholine" href="/experimental-data/acetylcholine/" />
              <SubmenuLink label="Theta" href="/experimental-data/theta/" />
            </SubmenuGroup>

            <SubmenuGroup
              label="Reconstruction Data"
              menuGroup="menu-group-reconstruction-data"
              color="#EA9088"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Volume" href="/reconstruction-data/volume/" />
              <SubmenuLink label="Cell composition" href="/reconstruction-data/cell-composition/" />
              <SubmenuLink
                label="Morphology library"
                href="/reconstruction-data/morphology-library/"
              />
              <SubmenuLink label="Neuron models" href="/reconstruction-data/neuron-models/" />
              <SubmenuLink
                label="Neuron model library"
                href="/reconstruction-data/neuron-model-library/"
              />
              <SubmenuLink
                label="Connection Anatomy"
                href="/reconstruction-data/connection-anatomy/"
              />
              <SubmenuLink
                label="Connection Physiology"
                href="/reconstruction-data/connection-physiology/"
              />
              <SubmenuLink
                label="Schaffer Collaterals"
                href="/reconstruction-data/schaffer-collaterals/"
              />
              <SubmenuLink label="Acetylcholine" href="/reconstruction-data/acetylcholine/" />
            </SubmenuGroup>

            <SubmenuGroup
              label="Digital Reconstructions"
              menuGroup="menu-group-digital-reconstructions"
              color="#CC8A99"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Region" href="/digital-reconstructions/region/" />
              <SubmenuLink
                label="Schaffer Collaterals"
                href="/digital-reconstructions/schaffer-collaterals/"
              />
              <SubmenuLink
                label="Connection Anatomy"
                href="/digital-reconstructions/connection-anatomy/"
              />
              <SubmenuLink
                label="Connection Physiology"
                href="/digital-reconstructions/connection-physiology/"
              />
              <SubmenuLink label="Neurons" href="/digital-reconstructions/neurons/" />
              <SubmenuLink
                label="Acetylcholine - Effects on Cells"
                href="/digital-reconstructions/acetylcholine-effects-on-cells/"
              />
              <SubmenuLink
                label="Acetylcholine - Effects on Synapses"
                href="/digital-reconstructions/acetylcholine-effects-on-synapses/"
              />
            </SubmenuGroup>

            <SubmenuGroup
              label="Validations"
              menuGroup="menu-group-validations"
              color="#9E98AE"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Neurons" href="/validations/neurons/" />
              <SubmenuLink label="Connection Anatomy" href="/validations/connection-anatomy/" />
              <SubmenuLink
                label="Connection Physiology"
                href="/validations/connection-physiology/"
              />
              <SubmenuLink
                label="Schaffer collaterals 1"
                href="/validations/schaffer-collaterals-1/"
              />
              <SubmenuLink
                label="Schaffer collaterals 2"
                href="/validations/schaffer-collaterals-2/"
              />
              <SubmenuLink label="Acetylcholine" href="/validations/acetylcholine/" />
            </SubmenuGroup>

            <SubmenuGroup
              label="Predictions"
              menuGroup="menu-group-predictions"
              color="#8398B5"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Spontaneous Activity" href="/predictions/spontaneouns-activity" />
              <SubmenuLink label="Voltage - Calcium Scan" href="/predictions/voltage" />
              <SubmenuLink label="Random Input" href="/predictions/random-input" />
              <SubmenuLink
                label="Theta - Oscillatory input"
                href="/predictions/theta-oscillatory-input"
              />
              <SubmenuLink label="Theta - MS input" href="/predictions/theta-ms-input" />
              <SubmenuLink label="Other Frequencies" href="/predictions/other-frequencies" />
            </SubmenuGroup>
          </MenuItem>

          {/* Build Models */}
          <MenuItem label="Build Models" href="/build/" external menuGroup="menu-group-build">
            <SubmenuGroup
              label="Data"
              href="/build/data"
              external
              menuGroup="menu-group-build"
              openMenuGroup={openMenuGroup}
              setOpenMenuGroup={setOpenMenuGroup}
            >
              <SubmenuLink label="Connections" external href="/build/data/connection" />
              <SubmenuLink
                label="Electrophysiology"
                external
                href="/build/data/electrophysiology"
              />
              <SubmenuLink label="Morphologies" external href="/build/data/morphology" />
            </SubmenuGroup>
            <SubmenuLink label="Models" href="/build/models" external />
            <SubmenuLink label="Workflows" href="/build/workflows" external />
          </MenuItem>

          <button
            className={`${styles['main-navigation__button']}`}
            onClick={() => (document.location.href = '/#contact')}
          >
            Contact Us
          </button>
        </ul>
      </Menu>
    </>
  );
};

export default MainNav;
