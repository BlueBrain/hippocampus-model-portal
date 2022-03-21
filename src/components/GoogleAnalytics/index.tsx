import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { gtm, isProduction } from '../../config';
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
    if (!isProduction || !gtm.id) return;

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
        {gtm.id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtm.id}`}></script>
              <script
              async
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}`
              }}
            />
          </>
        )}
      </Head>

      {formVisible && (
        <div className={styles.container}>
          <div className="row end-sm middle-xs">
            <div className="col-xs-12 col-sm-4 col-md-6 mt-2">
              We use cookies to improve user experience and analyze website traffic. Read the &nbsp;
              <a href="/model/cookies-policy" target="_blank">Cookies policy</a>
            </div>
            <div className="col-xs-12 col-sm-4 col-md-3 mt-2">
              <CtaButton
                color="grey"
                block
                maxWidth={320}
                onClick={disallowGtm}
              >
                Don't allow
              </CtaButton>
            </div>
            <div className="col-xs-12 col-sm-4 col-md-3 mt-2">
              <CtaButton
                color="yellow"
                block
                maxWidth={320}
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
