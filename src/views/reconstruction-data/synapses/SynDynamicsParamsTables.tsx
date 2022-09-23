import React from 'react';

import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';
import { termFactory } from '@/components/Term';
import { stypeDescription, mtypeDescription, layerDescription, pathwayDescription, formattedTerm } from '@/terms';

import preSynDynamicsParamsData from './presyn-dynamics-params.json';
import postSynDynamicsParamsData from './postsyn-dynamics-params.json';


const termDescription = {
  ...stypeDescription,
  ...mtypeDescription,
  ...layerDescription,
  ...pathwayDescription,
};

const termFormatter = (term) => formattedTerm[term] ?? term;
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

function formatPathway(pathway) {
  const [pre, post] = pathway.split('-');

  if (!pre || !post) return '-';

  return (
    <>
      <Term
        term={pre}
        description={getMtypeDescription(pre)}
      />-<Term
        term={post}
        description={getMtypeDescription(post)}
      />
    </>
  )
}

const preColumns = [
  {
    title: 'Rule #',
    dataIndex: 'ruleN' as keyof PreSynDynamicsParam,
  },
  {
    title: 'From',
    dataIndex: 'from' as keyof PreSynDynamicsParam,
    render: from => from
      .split(',')
      .map(mtype => mtype.trim())
      .map(mtype => (<span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br/></span>))
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof PreSynDynamicsParam,
    render: from => from
      .split(',')
      .map(mtype => mtype.trim())
      .map(mtype => (<span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br/></span>))
  },
  {
    title: 'Rule type',
    dataIndex: 'ruleType' as keyof PreSynDynamicsParam,
    render: ruleType => (<Term term={ruleType} />)
  },
  {
    title: (<><Term term="U" /> (mean ± std)</>),
    dataIndex: 'u' as keyof PreSynDynamicsParam,
    render: formatValue,
  },
  {
    title: (<><Term term="D" /> (mean ± std), ms</>),
    dataIndex: 'd' as keyof PreSynDynamicsParam,
    render: formatValue,
  },
  {
    title: (<><Term term="F" /> (mean ± std), ms</>),
    dataIndex: 'f' as keyof PreSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'NRRP',
    dataIndex: 'nrrp' as keyof PreSynDynamicsParam,
  },
  {
    title: 'Hill scaling',
    dataIndex: 'hillScaling' as keyof PreSynDynamicsParam,
  },
  {
    title: 'CV Validation pathway used',
    dataIndex: 'CVValidationPathway' as keyof PreSynDynamicsParam,
    render: pathway => formatPathway(pathway),
  },
];

const postColumns = [
  {
    title: 'Rule #',
    dataIndex: 'ruleN' as keyof PostSynDynamicsParam,
  },
  {
    title: 'From',
    dataIndex: 'from' as keyof PostSynDynamicsParam,
    render: from => from
      .split(',')
      .map(mtype => mtype.trim())
      .map(mtype => (<span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br/></span>))
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof PostSynDynamicsParam,
    render: to => to
      .split(',')
      .map(mtype => mtype.trim())
      .map(mtype => (<span key={mtype}><Term term={mtype} description={getMtypeDescription(mtype)} /> <br/></span>))
  },
  {
    title: 'Rule type',
    dataIndex: 'ruleType' as keyof PostSynDynamicsParam,
    render: ruleType => (<Term term={ruleType} />)
  },
  {
    title: (<><Term term="gsyn" /> (mean ± std), nS</>),
    dataIndex: 'gsyn' as keyof PostSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'tdecay fast, ms',
    dataIndex: 'tdecayFast' as keyof PostSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'NMDA/AMPA ratio',
    dataIndex: 'NMDAAMPARatio' as keyof PostSynDynamicsParam,
  },
  {
    title: 'τdecay NMDA, ms',
    dataIndex: 'tdecayNMDA' as keyof PostSynDynamicsParam,
  },
  {
    title: 'PSP validation pathway used',
    dataIndex: 'PSPValidationPathway' as keyof PostSynDynamicsParam,
    render: pathway => formatPathway(pathway),
  },
];

function formatValue(value) {
  const [mean, std] = value.split('±').map(v => v.trim());

  return (
    <>
      <NumberFormat value={mean} /> ± <NumberFormat value={std} />
    </>
  );
}

const SynDynamicsParamsTables: React.FC = () => {
  return (
    <>
      <h3>Presynaptic dynamics parameters</h3>
      <ResponsiveTable<PreSynDynamicsParam>
        columns={preColumns}
        data={preSynDynamicsParamsData}
        rowKey={({ from, to }) => `${from}_${to}`}
      />
      <div className="text-right mt-2 mb-4">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            preSynDynamicsParamsData,
            `rec-data-synapses_-_presynaptic-dynamics-parameters.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>

      <h3>Postsynaptic dynamics parameters</h3>
      <ResponsiveTable<PostSynDynamicsParam>
        className="mt-3"
        columns={postColumns}
        data={postSynDynamicsParamsData}
        rowKey={({ from, to }) => `${from}_${to}`}
      />
      <div className="text-right mt-2">
        <HttpDownloadButton
          onClick={() => downloadAsJson(
            postSynDynamicsParamsData,
            `rec-data-synapses_-_postsynaptic-dynamics-parameters.json`
          )}
        >
          table data
        </HttpDownloadButton>
      </div>
    </>
  );
};


export default SynDynamicsParamsTables;
