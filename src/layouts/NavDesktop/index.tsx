import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Button from '../../components/Button';
import { HomeNav, SecondaryNav } from '../Navigation';


const classPrefix = 'nav-desktop__';

type NavButtonProps = {
  path: string;
  external?: boolean;
  name: string;
  notifications?: number;
  home?: boolean;
  highlight?: boolean;
  onClick?: () => void;
};

const NavButton: React.FC<NavButtonProps> = ({
  path,
  external = false,
  name,
  notifications,
  home,
  highlight,
  onClick,
}) => {
  const button = (
    <Button
      width={highlight || home ? 140 : undefined}
      discrete={!highlight && !home}
      onClick={onClick}
      notifications={notifications}
      uppercase
    >
      {name}
    </Button>
  );

  return external
    ? (<a href={path} target="_blank">{button}</a>)
    : (<Link href={path}><a>{button}</a></Link>);
};

const NavDesktop = () => {
  const router = useRouter();

  const [secondaryNav, setSecondaryNav] = React.useState(false);
  React.useEffect(() => setSecondaryNav(false), [router]);

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
      <li>
        <NavButton path="/glossary" name="Glossary" />
      </li>
      <li>
        <NavButton
          path="/#contact"
          name="Contact Us"
          external
        />
      </li>
    </ul>
  );
}

export default NavDesktop;
