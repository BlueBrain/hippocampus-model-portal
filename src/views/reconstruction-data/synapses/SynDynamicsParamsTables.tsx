import React from 'react';

import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import HttpDownloadButton from '@/components/HttpDownloadButton';

import preSynDynamicsParamsData from './presyn-dynamics-params.json';
import postSynDynamicsParamsData from './postsyn-dynamics-params.json';


type PreSynDynamicsParam = {
  ruleN: number;
  from: string;
  to: string;
  ruleType: string;
  use: string;
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

const preColumns = [
  {
    title: 'Rule #',
    dataIndex: 'ruleN' as keyof PreSynDynamicsParam,
  },
  {
    title: 'From',
    dataIndex: 'from' as keyof PreSynDynamicsParam,
    render: from => from.split(',').map(mtype => mtype.trim()).map(mtype => (<span key={mtype}>{mtype} <br/></span>))
  },
  {
    title: 'to',
    dataIndex: 'to' as keyof PreSynDynamicsParam,
    render: from => from.split(',').map(mtype => mtype.trim()).map(mtype => (<span key={mtype}>{mtype} <br/></span>))
  },
  {
    title: (<span>Rule type <sup>*</sup></span>),
    dataIndex: 'ruleType' as keyof PreSynDynamicsParam,
  },
  {
    title: 'USE',
    dataIndex: 'use' as keyof PreSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'D, ms',
    dataIndex: 'd' as keyof PreSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'F, ms',
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
      .map(mtype => (<span key={mtype}>{mtype} <br/></span>)),
  },
  {
    title: 'to',
    dataIndex: 'to' as keyof PostSynDynamicsParam,
    render: from => from
      .split(',')
      .map(mtype => mtype.trim())
      .map(mtype => (<span key={mtype}>{mtype} <br/></span>)),
  },
  {
    title: (<span>Rule type <sup>*</sup></span>),
    dataIndex: 'ruleType' as keyof PostSynDynamicsParam,
  },
  {
    title: 'gsyn, nS',
    dataIndex: 'gsyn' as keyof PostSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'tdecayFast, ms',
    dataIndex: 'tdecayFast' as keyof PostSynDynamicsParam,
    render: formatValue,
  },
  {
    title: 'NMDA/AMPA ratio',
    dataIndex: 'NMDAAMPARatio' as keyof PostSynDynamicsParam,
  },
  {
    title: 'τdecay NMDA (ms)',
    dataIndex: 'tdecayNMDA' as keyof PostSynDynamicsParam,
  },
  {
    title: 'PSP validation pathway used',
    dataIndex: 'PSPValidationPathway' as keyof PostSynDynamicsParam,
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

      <small>
        <sup>*</sup> Rule types:
          <ul>
            <li>E1: excitatory facilitating</li>
            <li>E2: excitatory depressing</li>
            <li>I1: inhibitory facilitating</li>
            <li>I2: inhibitory depressing</li>
            <li>I3: inhibitory pseudo linear</li>
          </ul>
      </small>
    </>
  );
};


export default SynDynamicsParamsTables;
