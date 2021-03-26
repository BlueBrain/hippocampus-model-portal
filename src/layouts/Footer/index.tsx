import React from 'react';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

// import './style.scss';

const classPrefix = 'footer__';

const Footer: React.FC<{}> = () => {
  return (
    <div className={`${classPrefix}basis`}>
      <div className={`${classPrefix}container`}>
        <div className={`${classPrefix}address`}>
          <h4 className="text-white">Blue Brain Project</h4>
          <p>EPFL/Campus Biotech</p>
          <p>Chemin des Mines 9</p>
          <p>CH-1202 Geneva</p>
          <p>Switzerland</p>
        </div>
        <div className="text-right">
          <h4 className="text-white">Contact</h4>
          <p>
            For all enquiries, support and collaborations, <br/>
            please email: <a href="mailto:info@hippocampushub.eu">info@hippocampushub.eu</a>
          </p>
        </div>
        {/* <div>
          <h4 className="text-white">Share and follow us</h4>
          <div className={`${classPrefix}social-media`}>
            <a href="#" className={`${classPrefix}social-media-item`}>
              <div className={`${classPrefix}social-media-icon`}>
                <FaTwitter />
              </div>
              <span className={`${classPrefix}social-link`}>@Twitter</span>
            </a>
            <a href="#" className={`${classPrefix}social-media-item`}>
              <div className={`${classPrefix}social-media-icon`}>
                <FaFacebookF />
              </div>
              <span className={`${classPrefix}social-link`}>
                @Facebook
              </span>
            </a>
            <a href="#" className={`${classPrefix}social-media-item`}>
              <div className={`${classPrefix}social-media-icon`}>
                <FaLinkedinIn />
              </div>
              <span className={`${classPrefix}social-link`}>
                @LinkedIn
              </span>
            </a>
          </div>
        </div> */}
      </div>
      <div className={`${classPrefix}bottom-line`}>
        <p>©Blue Brain Project/EPFL 2005-2021</p>
        <p>
          <a
            href="https://go.epfl.ch/privacy-policy"
            target="_blank"
          >
            Privacy Policy
          </a>
          &nbsp; | &nbsp;
          <a
            href="/model/terms-of-use"
            target="_blank"
          >
            Terms of use
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
