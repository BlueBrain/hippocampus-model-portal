import React from 'react';
import Link from 'next/link';

import Brand from '../Brand';
import NavDesktop from '../NavDesktop';
import NavMobile from '../NavMobile';
import { IoIosArrowDropdown } from 'react-icons/io';


const classPrefix = 'nav__';

export const HomeNav: React.FC = () => (
  <div className="home-nav">
    <ul>
      <li>
        <Link href="/">
          <a className="text-uppercase">Explore models</a>
        </Link>
      </li>
      <li>
        <a className="text-uppercase" href="/build/">Build models</a>
      </li>
    </ul>
  </div>
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
      <li className={`bg-grey-1 ${active === 'exp' ? 'active' : ''}`}>
        <button onClick={() => toggleSubmenu('exp')}>
          Experimental Data{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul className="bg-grey-1">
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
            <Link href="/experimental-data/neuronal-electrophysiology">Neuron Electrophysiology</Link>
          </li>
        </ul>
      </li>
      <li className={`bg-grey-2 ${active === 'rec' ? 'active' : ''}`}>
        <button onClick={() => toggleSubmenu('rec')}>
          Reconstruction Data{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul className="bg-grey-2">
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
      <li className={`bg-grey-3 ${active === 'dig' ? 'active' : ''}`}>
        <button onClick={() => toggleSubmenu('dig')}>
          Digital Reconstructions{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul className="bg-grey-3">
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
      <li className={`bg-grey-4 ${active === 'val' ? 'active' : ''}`}>
        <button onClick={() => toggleSubmenu('val')}>
          Validations{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul className="bg-grey-4">
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
      <li className={`bg-grey-5 ${active === 'pre' ? 'active' : ''}`}>
        <button onClick={() => toggleSubmenu('pre')}>
          Predictions{' '}
          <span className="show-mobile">
            <IoIosArrowDropdown />
          </span>
        </button>
        <ul className="bg-grey-5">
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
