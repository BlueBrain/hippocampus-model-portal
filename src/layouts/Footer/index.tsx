import React from 'react';

import { basePath } from '../../config';

import styles from './styles.module.scss';


const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.sectionContent}>
        <h2 >The Hippocampus Hub Explorer</h2>
        <div className="row between-xs mt-3">
          <div className="col-xs-12 col-sm-4" style={{ paddingRight: "3rem" }}>
            <h4>About</h4>
            <p style={{ width: "50%" }}>
              The Hippocampus Hub is a platform for the exploration of hippocampal
              models. It is a project of the Blue Brain Project at EPFL.
            </p>
          </div>

          <div className="col-xs-12 col-sm-offset-1 col-sm-2" style={{ paddingRight: "3rem" }}>
            <h4>Adresse</h4>
            <p>
              <a
                href="https://www.epfl.ch/research/domains/bluebrain/"
                rel="noopener"
              >
                Blue Brain Project
              </a> <br />
              EPFL/Campus Biotech <br />
              Chemin des Mines 9 <br />
              CH-1202 Geneva <br />
              Switzerland <br />
            </p>
          </div>

          <div className="col-xs-12 col-sm-2" style={{ paddingRight: "3rem" }}>
            <h4>Usefuls Link</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/build/">Build Models</a></li>
              <li><a href={`${basePath}/`}>Explore Models</a></li>
              <li><a href="/#resources">Resources</a></li>
              <li><a href="/#terms">Terms & Conditions</a></li>
              <li><a href="/#contact-us">Contact Us</a></li>
            </ul>
          </div>


          <div className="col-xs-12 col-sm-2" style={{ paddingRight: "3rem" }}>
            <h4>Legal</h4>
            <ul>
              <li><a href={`${basePath}/terms-of-use/`}>Terms of Use</a> - EPFL/BBP</li>
              <li><a href={`${basePath}/privacy-policy/`}>Privacy Policy</a> - EPFL/BBP</li>
              <li><a href={`${basePath}/cookies-policy/`}>Cookies Policy</a> - EPFL/BBP</li>
            </ul>
          </div>
        </div>

        <div className="row between-xs mt-3">

          <div className="col-xs-12 col-sm-2"><p>© EPFL | Blue Brain Project | 2005-2022</p></div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
