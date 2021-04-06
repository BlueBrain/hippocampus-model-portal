import React from 'react';
import MainLayout from '../layouts/MainLayout';

import FullPage from '../layouts/FullPage';

import styles from '../styles/privacy-policy.module.scss';




export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <FullPage>
        <div className={styles.container}>
          <h2>PRIVACY POLICY</h2>

          <p>
            Protecting your privacy and, in particular, your personal data is very important to us.
          </p>

          <p>
            Based on Article 13 of the Federal Constitution and the provisions of
            Swiss federal data protection legislation, everyone has the right to the protection of their privacy,
            as well as to protection from misuse of their personal details.
          </p>

          <p>
            The Blue Brain Project comply with these provisions. Personal data is treated as strictly confidential and
            is neither passed on nor sold to third parties.
          </p>

          <p>
            In close cooperation with our IT service providers, we make every effort to protect the databases as well as
            possible from outside access, data loss, misuse or falsification.
          </p>

          <p>
            When you access our websites, the following data is stored in log files: IP address, date, time,
            browser request and general information on the operating system and browser.
          </p>

          <p>
            This usage data forms the basis for statistical, impersonal evaluations for the purpose of tracking trends
            so that the Blue Brain Project can adapt and improve the Hub in line with your needs.
          </p>

          <p>
            When you choose to make contact with us, your e-mail address will be stored in a separate database
            not connected with the anonymous log files. You may delete your registration at any time.
          </p>

          <h4>Right to Information</h4>

          <p>
            If you would like information on data relating to your person that has been collected and processed,
            if you want such data to be corrected, destroyed, or blocked,
            please contact the the following address: &nbsp;
            <a href="mailto:bbp.legal@epfl.ch">bbp.legal@epfl.ch</a>
          </p>
        </div>
      </FullPage>
    </MainLayout>
  );
}