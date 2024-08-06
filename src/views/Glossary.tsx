import React from 'react';

import Title from '../components/Title';
import FullPage from '../layouts/FullPage';
import { accentColors } from '../config';
import { Color } from '../types';
import glossaryContent from './glossary-content.json';
import { basePath } from '../config';

const Glossary: React.FC = () => {
  const sectionLabels = Object.keys(glossaryContent);

  return (
    <FullPage>


      <div className="glossary__container">
        <Title title="Glossary" />
        {sectionLabels.map(sectionLabel => (
          <section key={sectionLabel}>
            {sectionLabel !== 'Glossary' && (
              <Title subtitle={sectionLabel} theme={null} isDark={true} />
            )}

            {(glossaryContent as any)[sectionLabel].map(([term, description]: [term: any, d: any]) => (
              <div className="row" key={term}>
                <div className="col-xs-12 col-md-3">
                  <strong className='text-black' dangerouslySetInnerHTML={{ __html: term }} />
                </div>
                <div className="col-xs-12 xs:pb-5 col-md-9">
                  <span className='text-black' dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>
            ))}
          </section>
        ))}

        <img
          className="w-100 mt-2"
          src={`${basePath}/data/etypes.png`}
          alt="etype"
        />
      </div>
    </FullPage>
  );
};


export default Glossary;
