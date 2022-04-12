import React from 'react';

import { basePath } from '../../config';

import styles from './styles.module.scss';


const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.sectionContent}>
        <h3>The Hippocampus Hub Explore</h3>
        <div className="row between-xs">
          <div className="col-xs-12 col-sm-4">
            <p>
              <a
                href="https://www.epfl.ch/research/domains/bluebrain/"
                rel="noopener"
              >
                Blue Brain Project
              </a> <br/>
              EPFL/Campus Biotech <br/>
              Chemin des Mines 9 <br/>
              CH-1202 Geneva <br/>
              Switzerland <br/>
            </p>
          </div>
          <div className="col-xs-12 col-sm-4">
            <p>
              <a href={`${basePath}/terms-of-use/`}>Terms of Use</a> - EPFL/BBP
            </p>
            <p>
              <a href={`${basePath}/privacy-policy/`}>Privacy Policy</a> - EPFL/BBP
            </p>
            <p>
              <a href={`${basePath}/cookies-policy/`}>Cookies Policy</a> - EPFL/BBP
            </p>
          </div>
          <div className="col-xs-12 col-sm-4">
            <p><a href="/">Home</a></p>
            <p><a href="/build/">Build Models</a></p>
            <p><a href={`${basePath}/`}>Explore Models</a></p>
            <p><a href="/#resources">Resources</a></p>
            <p><a href="/#terms">Terms & Conditions</a></p>
            <p><a href="/#contact-us">Contact Us</a></p>
          </div>
        </div>
        <div className="mt-2">
          <p>©Blue Brain Project/EPFL 2005-2022</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
