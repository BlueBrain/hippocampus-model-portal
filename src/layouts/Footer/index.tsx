import React from 'react';
import Link from 'next/link';

import { basePath } from '../../config';
import styles from './styles.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={`${styles.footer} py-12 relative`}>
      <div className="w-full max-w-screen-xl mx-auto xl:px-0 xs:px-8">
        <h2 className="text-white text-xl">The Hippocampus Hub Explorer</h2>
        <div className="flex flex-wrap justify-between mt-4">
          <div className="w-full sm:w-1/3 pr-12 mb-4 xs:mb-12">
            <Link href="https://www.epfl.ch/research/domains/bluebrain/">Blue Brain Project</Link>
            <br />
            <br />
            <p className="text-gray-400">
              EPFL/Campus Biotech <br />
              Chemin des Mines 9 <br />
              CH-1202 Geneva <br />
              Switzerland <br />
            </p>
          </div>

          <div className="w-full sm:w-1/3 pr-12 mb-4 xs:mb-12">
            <ul className="list-none p-0">
              <li className="mb-2">
                <Link href={`/terms-of-use/`} className="text-white hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li className="mb-2">
                <Link href={`/privacy-policy/`} className="text-white hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href={`/cookies-policy/`} className="text-white hover:underline">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full sm:w-1/3 pr-12 mb-4 xs:mb-12">
            <ul className="list-none p-0">
              <li className="mb-1">
                <Link href="/" className="text-white hover:underline">
                  Home
                </Link>
              </li>
              <li className="mb-1">
                <Link href={`/`} className="text-white hover:underline">
                  Explore Models
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/build/" className="text-white hover:underline">
                  Build Models
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/#resources" className="text-white hover:underline">
                  Resources
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/#terms" className="text-white hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li className="mb-1">
                <Link href={`/resources`} className="text-white hover:underline">
                  Resources
                </Link>
              </li>
              <li className="mb-1">
                <Link href={`/glossary`} className="text-white hover:underline">
                  Glossary
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/#contact" className="text-white hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="mt-4">
              <p className="text-white">Follow the Blue Brain</p>
              <div className="flex space-x-2 mt-2">
                <Link href="https://x.com/bluebrainpjt?lang=en">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1.5rem"
                    width="1.5rem"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"></path>
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/showcase/blue-brain-project/">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
                  </svg>
                </Link>
                <Link href="https://www.youtube.com/user/Bluebrainpjt/featured/">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M186.8 202.1l95.2 54.1-95.2 54.1V202.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-42 176.3s0-59.6-7.6-88.2c-4.2-15.8-16.5-28.2-32.2-32.4C337.9 128 224 128 224 128s-113.9 0-142.2 7.7c-15.7 4.2-28 16.6-32.2 32.4-7.6 28.5-7.6 88.2-7.6 88.2s0 59.6 7.6 88.2c4.2 15.8 16.5 27.7 32.2 31.9C110.1 384 224 384 224 384s113.9 0 142.2-7.7c15.7-4.2 28-16.1 32.2-31.9 7.6-28.5 7.6-88.1 7.6-88.1z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <div className="w-full  text-gray-400">
            <p>© EPFL | Blue Brain Project | 2005-2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
