import React from 'react';
// import { NavLink, withRouter } from 'react-router-dom';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { useSelector } from 'react-redux';

import Button from '../../components/Button';
import { HomeNav, SecondaryNav } from '../Navigation';
// import { State } from '../../store';

// import './style.scss';

const classPrefix = 'nav-desktop__';

type NavButtonProps = {
  path: string;
  name: string;
  notifications?: number;
  home?: boolean;
  highlight?: boolean;
  onClick?: () => void;
};

const NavButton: React.FC<NavButtonProps> = ({
  path,
  name,
  notifications,
  home,
  highlight,
  onClick,
}) => {
  return (
    <Link href={path}>
      <a>
        <Button
          width={highlight || home ? 140 : undefined}
          discrete={!highlight && !home}
          onClick={onClick}
          notifications={notifications}
          uppercase
        >
          {name}
        </Button>
      </a>
    </Link>
  );
};

const NavDesktop = () => {
  const router = useRouter();

  const [secondaryNav, setSecondaryNav] = React.useState(false);
  React.useEffect(() => setSecondaryNav(false), [router]);
  // const downloadItems = useSelector<State, number>(
  //   state => state.download.items.length,
  // )

  return (
    <ul className={`${classPrefix}basis`}>
      <li style={{ position: 'relative' }}>
        {secondaryNav ? (
          <NavButton path="/" name="Home" home />
        ) : (
          <Button
            width={140}
            active={router.pathname === '/'}
            onClick={() => setSecondaryNav(true)}
            uppercase
          >
            Home
          </Button>
        )}
        {secondaryNav && (
          <div className="flyout">
            <HomeNav />
            <SecondaryNav initActive="exp" />
          </div>
        )}
      </li>
      {/* <li>
        <NavButton
          path="/downloads"
          name="Download"
          // notifications={downloadItems > 0 ? downloadItems : undefined}
          notifications={undefined}
          highlight
        />
      </li> */}
      <li>
        <NavButton path="/glossary" name="Glossary" />
      </li>
      <li>
        <NavButton
          path="/contact"
          name="Contact Us"
        />
      </li>
    </ul>
  );
}

export default NavDesktop;
