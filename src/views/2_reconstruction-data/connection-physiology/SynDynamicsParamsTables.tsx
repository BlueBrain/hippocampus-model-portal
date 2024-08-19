import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { termFactory } from '@/components/Term';
import { stypeDescription, mtypeDescription, layerDescription, pathwayDescription, formattedTerm } from '@/terms';
import DataContainer from '@/components/DataContainer';
import Collapsible from '@/components/Collapsible';
import DownloadButton from '@/components/DownloadButton/DownloadButton';
import { dataPath } from '@/config';

const termDescription = {
  ...stypeDescription,
  ...mtypeDescription,
  ...layerDescription,
  ...pathwayDescription,
};

const termFormatter = (term: string) => formattedTerm[term] ?? term;
const Term = termFactory(termDescription, termFormatter);

type PreSynDynamicsParam = {
  ruleN: number;
  from: string;
  to: string;
  ruleType: string;
  u: string;
  d: string;
  f: string;
  nrrp: number;
  hillScaling: number;
  CVValidationPathway: string;
};

type PostSynDynamicsParam = {
  ruleN: number;
  from: string;
  to: string;
  ruleType: string;
  gsyn: string;
  tdecayFast: string;
  NMDAAMPARatio: string | number;
  tdecayNMDA: string | number;
  PSPValidationPathway: string;
};

function getMtypeDescription(fullMtype: string) {
  const [layer, mtype] = fullMtype.split('_');
  return layerDescription[layer] && mtypeDescription[mtype]
    ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
    : null;
}

function formatPathway(pathway: string) {
  const [pre, post] = pathway.split('-');
  if (!pre || !post) return '-';
  return (
    <>
      <Term term={pre} description={getMtypeDescription(pre)} />
      -
      <Term term={post} description={getMtypeDescription(post)} />
    </>
  );
}

function formatValue(value: string) {
  const [mean, std] = value.split('±').map(v => v.trim());
  return (
    <>
      <NumberFormat value={mean} /> ± <NumberFormat value={std} />
    </>
  );
}

const preColumns = [
  { title: 'Rule #', dataIndex: 'ruleN' as keyof PreSynDynamicsParam },
  {
    title: 'From',
    dataIndex: 'from' as keyof PreSynDynamicsParam,
    render: (from: string) => from.split(',').map(mtype => mtype.trim()).map(mtype => (
      <span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br /></span>
    ))
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof PreSynDynamicsParam,
    render: (to: string) => to.split(',').map(mtype => mtype.trim()).map(mtype => (
      <span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br /></span>
    ))
  },
  {
    title: 'Rule type',
    dataIndex: 'ruleType' as keyof PreSynDynamicsParam,
    render: (ruleType: string) => (<Term term={ruleType} />)
  },
  { title: (<><Term term="U" /> (mean ± std)</>), dataIndex: 'u' as keyof PreSynDynamicsParam, render: formatValue },
  { title: (<><Term term="D" /> (mean ± std), ms</>), dataIndex: 'd' as keyof PreSynDynamicsParam, render: formatValue },
  { title: (<><Term term="F" /> (mean ± std), ms</>), dataIndex: 'f' as keyof PreSynDynamicsParam, render: formatValue },
  { title: 'NRRP', dataIndex: 'nrrp' as keyof PreSynDynamicsParam },
  { title: 'Hill scaling', dataIndex: 'hillScaling' as keyof PreSynDynamicsParam },
  {
    title: 'CV Validation pathway used',
    dataIndex: 'CVValidationPathway' as keyof PreSynDynamicsParam,
    render: formatPathway,
  },
];

const postColumns = [
  { title: 'Rule #', dataIndex: 'ruleN' as keyof PostSynDynamicsParam },
  {
    title: 'From',
    dataIndex: 'from' as keyof PostSynDynamicsParam,
    render: (from: string) => from.split(',').map(mtype => mtype.trim()).map(mtype => (
      <span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br /></span>
    ))
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof PostSynDynamicsParam,
    render: (to: string) => to.split(',').map(mtype => mtype.trim()).map(mtype => (
      <span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br /></span>
    ))
  },
  {
    title: 'Rule type',
    dataIndex: 'ruleType' as keyof PostSynDynamicsParam,
    render: (ruleType: string) => (<Term term={ruleType} />)
  },
  { title: (<><Term term="gsyn" /> (mean ± std), nS</>), dataIndex: 'gsyn' as keyof PostSynDynamicsParam, render: formatValue },
  { title: 'tdecay fast (mean ± std), ms', dataIndex: 'tdecayFast' as keyof PostSynDynamicsParam, render: formatValue },
  { title: 'NMDA/AMPA ratio', dataIndex: 'NMDAAMPARatio' as keyof PostSynDynamicsParam },
  { title: 'τdecay NMDA, ms', dataIndex: 'tdecayNMDA' as keyof PostSynDynamicsParam },
  {
    title: 'PSP validation pathway used',
    dataIndex: 'PSPValidationPathway' as keyof PostSynDynamicsParam,
    render: formatPathway,
  },
];

type SynDynamicsParamsTablesProps = {
  theme?: number;
}

const SynDynamicsParamsTables: React.FC<SynDynamicsParamsTablesProps> = ({ theme }) => {
  const [preData, setPreData] = useState<PreSynDynamicsParam[] | null>(null);
  const [postData, setPostData] = useState<PostSynDynamicsParam[] | null>(null);

  useEffect(() => {
    fetch(`${dataPath}/2_reconstruction-data/connection-physiology/presyn-dynamics-params.json`)
      .then((response) => response.json())
      .then((data) => setPreData(data));

    fetch(`${dataPath}/2_reconstruction-data/connection-physiology/postsyn-dynamics-params.json`)
      .then((response) => response.json())
      .then((data) => setPostData(data));
  }, []);

  if (!preData || !postData) {
    return <div>Loading...</div>;
  }

  return (
    <DataContainer
      theme={theme}
      navItems={[
        { id: 'presynapsesSection', label: 'Presynaptic dynamics parameters' },
        { id: 'postsynapsesSection', label: 'Postsynaptic dynamics parameters' },
      ]}
    >
      <Collapsible id="presynapsesSection" title="Presynaptic dynamics parameters">
        <p className='text-base mb-4'>
          Presynaptic parameters include the probability of release (U), the time constants for depression (D) and facilitation (F), and the number of release sites (NRRP). The coefficient of variation (CV) of the EPSP amplitudes are <Link href="/validations/connection-physiology">validated against pathway-specific data</Link>.
        </p>
        <ResponsiveTable<PreSynDynamicsParam>
          columns={preColumns}
          data={preData}
          rowKey={({ from, to }) => `${from}_${to}`}
        />
        <div className="text-right mt-4">
          <DownloadButton
            theme={theme}
            onClick={() => downloadAsJson(preData, `Presynaptic-Dynamics-Parameters-Data.json`)}
          >
            Presynaptic dynamics parameters Data
          </DownloadButton>
        </div>
      </Collapsible>

      <Collapsible id="postsynapsesSection" title="Postsynaptic dynamics parameters">
        <p className='text-base mb-4'>
          Postsynaptic parameters include the maximum synaptic conductance (gsyn), rise and decay time constant of the fast ionotropic receptors (AMPA, GABAA), rise and decay time constant of the slow ionotropic receptors (NMDA), and NMDA/AMPA ratio. Note that we set rise time constant to 0.2 and 2.95 ms respectively for fast and slow receptors. We do not consider the slow ionotropic receptor GABAA. The somatic postsynaptic potentials (PSPs) are validated against <Link href="/validations/connection-physiology">pathway-specific data</Link>.
        </p>
        <ResponsiveTable<PostSynDynamicsParam>
          className="mt-3"
          columns={postColumns}
          data={postData}
          rowKey={({ from, to }) => `${from}_${to}`}
        />
        <div className="text-right mt-4">
          <DownloadButton
            theme={theme}
            onClick={() => downloadAsJson(postData, `Postsynaptic-Dynamics-Parameters-Data.json`)}
          >
            Postsynaptic dynamics parameters Data
          </DownloadButton>
        </div>
      </Collapsible>
    </DataContainer>
  );
};

export default SynDynamicsParamsTables;