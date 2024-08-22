import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


import Filters from '@/layouts/Filters';
import StickyContainer from '@/components/StickyContainer';
import Title from '@/components/Title';
import InfoBox from '@/components/InfoBox';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import List from '@/components/List';


import { cellGroup, achConcentrations, defaultSelection, volumeSections } from '@/constants';
import { Layer, AchConcentration, QuickSelectorEntry } from '@/types';


const AcetylcholineEffectOnSynapsesView: React.FC = () => {
  const router = useRouter();
  const { achConcentration, prelayer, postlayer } = router.query as Record<string, string>;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({ achConcentration, prelayer, postlayer });

  const theme = 3;

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.prelayer && !router.query.achConcentration && !router.query.postlayer) {
      const query = defaultSelection.digitalReconstruction.acetylcholine;
      const { achConcentration, prelayer, postlayer } = query;
      setQuickSelection({ achConcentration, prelayer, postlayer });
      router.replace({ query }, undefined, { shallow: true });
    } else {
      setQuickSelection({ achConcentration, prelayer, postlayer });
    }
  }, [router.query]);

  const setAchConcentrationQuery = (achConcentration: AchConcentration) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, achConcentration };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPreLayerQuery = (prelayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, prelayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPostLayerQuery = (postlayer: Layer) => {
    setQuickSelection(prev => {
      const updatedSelection = { ...prev, postlayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: 'Concentration',
      key: 'achConcentration',
      values: achConcentrations,
      setFn: setAchConcentrationQuery,
    },
    {
      title: 'Pre-synaptic cell group',
      key: 'prelayer',
      values: cellGroup,
      setFn: setPreLayerQuery,
    },
    {
      title: 'Post-synaptic cell group',
      key: 'postlayer',
      values: cellGroup,
      setFn: setPostLayerQuery,
    },
  ];


  return (
    <>
      <Filters theme={theme} hasData={!!prelayer && !!postlayer}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Acetylcholine - Effects on Synapses"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We applied the <Link className={`link theme-${theme}`} href={'/reconstruction-data/acetylcholine/'}> dose - effect curves</Link> to predict the effect of acetylcholine on synapse short-term plasticity.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center" style={{ maxWidth: '800px' }}>
            <div className={`selector__column selector__column--lg mt-3 theme-${theme}`} style={{ maxWidth: "auto" }}>
              <div className={`selector__head theme-${theme}`}>1.Select a concentration</div>
              <div className="selector__body">
                <List
                  block
                  list={achConcentrations}
                  value={postlayer}
                  title="concentrations"
                  onSelect={setAchConcentrationQuery}
                  theme={theme} />
              </div>

            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
              <div className={`selector__column theme-${theme} flex-1`} style={{ maxWidth: "auto" }}>
                <div className={`selector__head theme-${theme}`}>2. Select a pre-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={prelayer}
                    title="m-type"
                    onSelect={setPreLayerQuery}
                    theme={theme} />
                </div>
              </div><div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>2. Select a post-synaptic cell group</div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={postlayer}
                    title="m-type"
                    onSelect={setPostLayerQuery}
                    theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer theme={theme}
        navItems={[
          { id: 'BoutonDenstiySection', label: 'Bouton density' },

        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible title="whatever" id="BoutonDenstiySection" className="mt-4">
          <p></p>
        </Collapsible>

        <Collapsible title="whatever" id="BoutonDenstiySection" className="mt-4">
          <p></p>
        </Collapsible>

      </DataContainer >
    </>
  );
};


export default AcetylcholineEffectOnSynapsesView;