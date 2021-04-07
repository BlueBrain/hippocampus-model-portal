import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { gtm } from '../../config';
import CtaButton from '../CtaButton';
import { getCookiePrefs, setCookiePrefs, initGtm } from '../../services/gtag';

import styles from './styles.module.scss';


const CookiePrefsForm: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);

  const allowGtm = () => {
    setCookiePrefs({ cookies: true });
    initGtm(gtm.id);
    setFormVisible(false);
  };

  const disallowGtm = () => {
    setCookiePrefs({ cookies: false });
    setFormVisible(false);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const cookiePrefs = getCookiePrefs();
    if (!cookiePrefs) {
      setFormVisible(true);
      return;
    }

    if (cookiePrefs.cookies) {
      initGtm(gtm.id);
    }
  }, []);

  return (
    <>
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtm.id}`}></script>
        <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}`
            }}
          />
      </Head>

      {formVisible && (
        <div className={styles.container}>
          <div className="row end-sm middle-xs">
            <div className="col-xs-12 col-md-6 col-lg-8 mt-2">
              We use cookies to improve user experience and analyze website traffic. Read the &nbsp;
              <a
                href="https://www.epfl.ch/about/presidency/presidents-team/legal-affairs/epfl-privacy-policy/cookies-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >Cookies policy</a>
            </div>
            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2 mt-2">
              <CtaButton
                color="grey"
                block
                onClick={disallowGtm}
              >
                Don't allow
              </CtaButton>
            </div>
            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2 mt-2">
              <CtaButton
                color="yellow"
                block
                onClick={allowGtm}
              >
                Allow
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CookiePrefsForm;
