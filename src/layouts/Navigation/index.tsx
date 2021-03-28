import React, { ReactChild, ReactFragment } from 'react';
// import './style.scss';
import Brand from '../Brand';
import NavDesktop from '../NavDesktop';
import NavMobile from '../NavMobile';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import { accentColors } from '../../config';
import SvgRegions from '../../components/Icons/Regions';
import SvgNeuron from '../../components/Icons/Neuron';
import SvgMicrocircuit from '../../components/Icons/Microcircuit';
import SvgSynapse from '../../components/Icons/Synapse';
import { IoIosArrowDropdown } from 'react-icons/io';

const classPrefix = 'nav__';

export const HomeNav: React.FC = () => (
  <ul className="home-nav">
    <li>
      <Link href="/about">
        About
      </Link>
    </li>
    <li>
      <Link href="#">
        Explore
      </Link>
    </li>
  </ul>
);

type NavProps = {
  initActive?: string;
  canClose?: boolean;
};

export const SecondaryNav: React.FC<NavProps> = ({ initActive, canClose }) => {
  const [active, setActive] = React.useState(initActive);

  const toggleSubmenu = (name: string) => {
    if (active !== name) {
      setActive(name);
    } else if (canClose) {
      setActive(undefined);
    }
  };

  return (
    <ul className="secondary-nav">
      <li className={active === 'exp' ? 'active' : ''}>
        {/* <span style={{ backgroundColor: accentColors.yellow }} /> */}
        <button onClick={() => toggleSubmenu('exp')}>
          Experimental Data{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul
          style={{ borderLeftColor: accentColors.yellow }}
        >
          <li>
            <span className="inactive">Layer Anatomy</span>
            {/* <Link href="/experimental-data/layer-anatomy">
              <a>
                Layer Anatomy
              </a>
            </Link> */}
          </li>
          <li>
            <Link href="/experimental-data/neuronal-morphology">Neuron Morphology</Link>
          </li>
          <li>
            <Link href="/experimental-data/neuron-electrophysiology">Neuron Electrophysiology</Link>
          </li>
        </ul>
      </li>
      <li className={active === 'rec' ? 'active' : undefined}>
        {/* <span style={{ backgroundColor: accentColors.blue }} /> */}
        <button onClick={() => toggleSubmenu('rec')}>
          Reconstruction Data{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul
          style={{ borderLeftColor: accentColors.blue }}
        >
          <li>
            <span className="inactive">Brain Regions</span>
            {/* <Link href="/reconstruction-data/brain-regions">
              <a>
                Brain Regions
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Microcircuit</span>
            {/* <Link href="/reconstruction-data/microcircuit">
              <a>
                Microcircuit
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Synaptic Pathways</span>
            {/* <Link href="/reconstruction-data/synaptic-pathways">
              <a>
                Synaptic Pathways
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Neurons</span>
            {/* <Link href="/reconstruction-data/neurons">
              <a>
                Neurons
              </a>
            </Link> */}
          </li>
        </ul>
      </li>
      <li className={active === 'dig' ? 'active' : undefined}>
        {/* <span style={{ backgroundColor: accentColors.lavender }} /> */}
        <button onClick={() => toggleSubmenu('dig')}>
          Digital Reconstructions{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul
          style={{ borderLeftColor: accentColors.lavender }}
        >
          <li>
            <span className="inactive">Brain Regions</span>
            {/* <Link href="/digital-reconstructions/brain-regions">
              <a>
                Brain Regions
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Microcircuit</span>
            {/* <Link href="/digital-reconstructions/microcircuit">
              <a>
                Microcircuit
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Synaptic Pathways</span>
            {/* <Link href="/digital-reconstructions/synaptic-pathways">
              <a>
                Synaptic Pathways
              </a>
            </Link> */}
          </li>
          <li>
            <Link href="/digital-reconstructions/neurons">Neurons</Link>
          </li>
        </ul>
      </li>
      <li className={active === 'val' ? 'active' : undefined}>
        {/* <span style={{ backgroundColor: accentColors.green }} /> */}
        <button onClick={() => toggleSubmenu('val')}>
          Validations{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul
          style={{ borderLeftColor: accentColors.green }}
        >
          <li>
            <span className="inactive">Brain Regions</span>
            {/* <Link href="/validations/brain-regions">
              <a>
                Brain Regions
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Microcircuit</span>
            {/* <Link href="/validations/microcircuit">
              <a>
                Microcircuit
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Synaptic Pathways</span>
            {/* <Link href="/validations/synaptic-pathways">
              <a>
                Synaptic Pathways
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Neurons</span>
            {/* <Link href="/validations/neurons">
              <a>
                Neurons
              </a>
            </Link> */}
          </li>
        </ul>
      </li>
      <li className={active === 'pre' ? 'active' : undefined}>
        {/* <span style={{ backgroundColor: accentColors.grey }} /> */}
        <button onClick={() => toggleSubmenu('pre')}>
          Predictions{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul
          style={{ borderLeftColor: accentColors.grey }}
        >
          <li>
            <span className="inactive">Brain Regions</span>
            {/* <Link href="/predictions/brain-regions">
              <a>
                Brain Regions
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Microcircuit</span>
            {/* <Link href="/predictions/microcircuit">
              <a>
                Microcircuit
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Synaptic Pathways</span>
            {/* <Link href="/predictions/synaptic-pathways">
              <a>
                Synaptic Pathways
              </a>
            </Link> */}
          </li>
          <li>
            <span className="inactive">Neurons</span>
            {/* <Link href="/predictions/neurons">
              <a>
                Neurons
              </a>
            </Link> */}
          </li>
        </ul>
      </li>
    </ul>
  );
};

const Navigation: React.FC = () => {
  return (
    <div role="navigation" className={`${classPrefix}basis`}>
      <Brand />
      <NavDesktop />
      <NavMobile />
    </div>
  );
};

export default Navigation;
