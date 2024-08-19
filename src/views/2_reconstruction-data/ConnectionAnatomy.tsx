import React from 'react';
import Link from 'next/link';

import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';

import SynsPerConnectionTable from './connections/synapsesPerConnection';

const ConnectionsView: React.FC = () => {

  const theme = 2;

  return (
    <>
      <Filters theme={theme}>
        <div className="flex flex-col md:flex-row w-full md:items-center mt-40 md:mt-0">
          {/* Title and Info */}
          <div className="w-full mb-12 md:mb-0">
            <StickyContainer>
              <Title
                title="Connection Anatomy"
                subtitle="Reconstruction Data"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We used sparse data on <Link href={"/experimental-data/connection-anatomy/"} className={"link theme-" + theme}>connections</Link> to estimate properties of uncharacterized pathways.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
        </div>
      </Filters>

      <DataContainer theme={theme} navItems={[
        { id: 'nbSynapsesPerConnectionSection', label: 'Nb synapses p. connection' },
        { id: 'boutonDensitySection', label: 'Bouton density' },
      ]}>

        <Collapsible id="nbSynapsesPerConnectionSection" title="Number of synapses per connection">
          <p>For <u>characterized pathways</u> we can use data from literature (see <Link href={"/experimental-data/connection-anatomy/"}> connection anatomy</Link>)</p>
          <p>For <u>uncharacterized pathways</u> we can use the following plot to extrapolate the ratio between appositions and synapses per connection.</p>
          <div className="my-8">
            <SynsPerConnectionTable theme={theme} />
          </div>
          <p>For each pathway, the standard deviation is computed multiplying the mean and the coefficient of variation (CV) which is set to 0.5.</p>
        </Collapsible>

        <Collapsible id="boutonDensitySection" title="Bouton density">
          <p>For <u>characterized pathways</u> we can use data from literature (see <Link href={"/experimental-data/connection-anatomy/"}>connection anatomy</Link>)</p>
          <p>For <u>uncharacterized pathways</u> we can use the average of the values from the characterized pathways (0.2260 μm-1).</p>
        </Collapsible>

      </DataContainer >
    </>
  );
};


export default ConnectionsView;
