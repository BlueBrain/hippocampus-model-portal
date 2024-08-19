import React from 'react';
import { Table } from 'antd';

import { downloadAsJson } from '@/utils';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import synsPerConnData from './syns-per-conn.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';


type DataEntry = {
  from: string;
  to: string;
  region: string;
  specie: string;
  age?: string;
  weight?: string;
  mean: number;
  std: number | 'n/a';
  n: number;
  sem: number | '-';
  reference: string | React.ReactNode;
};

const termDescription = {
  ...mtypeDescription,
  ...layerDescription,
};

const Term = termFactory(termDescription);

function getMtypeDescription(fullMtype: string) {
  const [layer, mtype] = fullMtype.split('_');

  return layerDescription[layer] && mtypeDescription[mtype]
    ? `${mtypeDescription[mtype]} from ${layerDescription[layer]} layer`
    : null;
}

const data: DataEntry[] = [{
  from: 'SP_BS',
  to: 'SP_PC',
  region: 'CA1',
  specie: '-',
  age: '-',
  weight: '-',
  mean: 6,
  std: 0,
  n: 1,
  sem: 0,
  reference: (
    <>
      <a
        href="https://doi.org/10.1038/368823a0"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buhl et al., 1994a
      </a>
    </>
  ),
}, {
  from: 'SP_PVBC',
  to: 'PV',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  age: '-',
  weight: '250-350 g',
  mean: 1.546875,
  std: 1.0831821193,
  n: 64,
  sem: 0.1353977649125,
  reference: (
    <>
      <a
        href="https://doi.org/10.1126/science.8085161"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sik et al., 1995
      </a> <sup>[1]</sup>
    </>
  ),
}, {
  from: 'SP_PC',
  to: 'SO_OLM',
  region: 'CA1',
  specie: 'Wistar rat',
  age: '14-21 d',
  weight: '-',
  mean: 2.83,
  std: 1.93509689679871,
  n: 6,
  sem: 0.79,
  reference: (
    <>
      <a
        href="https://doi.org/10.1523/jneurosci.3688-04.2005"
        target="_blank"
        rel="noopener noreferrer"
      >
        Birò et al., 2005
      </a>
    </>
  ),
}, {
  from: 'SO_OLM',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Wistar rat',
  age: '10-17 d',
  weight: '-',
  mean: 10,
  std: 9.89949493661167,
  n: 2,
  sem: 7,
  reference: (
    <>
      <a
        href="https://doi.org/10.1111/j.1469-7793.2000.t01-3-00091.x"
        target="_blank"
        rel="noopener noreferrer"
      >
        Maccaferri et al., 2000
      </a>
    </>
  ),
}, {
  from: 'AA',
  to: 'GC',
  region: 'CA3',
  specie: 'Wistar rat',
  age: 'Young',
  weight: '-',
  mean: 8,
  std: 'n/a',
  n: 1,
  sem: '-',
  reference: (
    <>
      <a
        href="https://doi.org/10.1038/368823a0"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buhl et al., 1994a
      </a>
    </>
  ),
}, {
  from: 'AA',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Wistar rat',
  age: 'Young',
  weight: '-',
  mean: 5.88888888888889,
  std: 'n/a',
  n: 9,
  sem: '-',
  reference: (
    <>
      <a
        href="https://doi.org/10.1152/jn.1994.71.4.1289"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buhl et al., 1994b
      </a>
    </>
  ),
}, {
  from: 'SP_PC',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Sprague Dawley rat',
  age: '-',
  weight: '100-180 g',
  mean: 1.16666666666667,
  std: 0.408248290463863,
  n: 6,
  sem: 0.166666666666667,
  reference: (
    <>
      <a
        href="https://doi.org/10.1016/0306-4522(96)00251-5"
        target="_blank"
        rel="noopener noreferrer"
      >
        Deuchars and Thomson, 1996
      </a>
    </>
  ),
}, {
  from: 'SP_CCKBC',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Sprague-Dawley rat / mouse',
  age: '2-3 w / >3 w',
  weight: '-',
  mean: 8.3,
  std: 2.30477764654207,
  n: 14,
  sem: 0.8,
  reference: (
    <>
      <a
        href="https://doi.org/10.1523/jneurosci.6238-09.2010"
        target="_blank"
        rel="noopener noreferrer"
      >
        Foldy et al., 2010
      </a>
    </>
  ),
}, {
  from: 'SR_SCA',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Wistar rats',
  age: '-',
  weight: '>120 g',
  mean: 5.3333333333,
  std: 1.1547005384,
  n: 3,
  sem: 0.666666666666667,
  reference: (
    <>
      <a
        href="https://doi.org/10.1111/j.1469-7793.1998.755bv.x"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vida et al., 1998
      </a>
    </>
  ),
}, {
  from: 'SP_PVBC',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'Sprague-Dawley rat / mouse',
  age: '2-3 w / >3 w',
  weight: '-',
  mean: 11,
  std: 1.98997487421324,
  n: 15,
  sem: 0.6,
  reference: (
    <>
      <a
        href="https://doi.org/10.1523/jneurosci.6238-09.2010"
        target="_blank"
        rel="noopener noreferrer"
      >
        Foldy et al., 2010
      </a>
    </>
  ),
}, {
  from: 'SR_SCA',
  to: 'SR_SCA',
  region: 'CA1',
  specie: 'Wistar rat',
  age: '18-21 d',
  weight: '-',
  mean: 3.5,
  std: 1.5,
  n: 9,
  sem: '-',
  reference: (
    <>
      <a
        href="https://doi.org/10.1152/jn.00831.2010"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ali 2011
      </a>
    </>
  ),
}];

const columns = [
  {
    title: 'From',
    dataIndex: 'from' as keyof DataEntry,
    render: from => (<Term term={from} description={getMtypeDescription(from)} />),
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof DataEntry,
    render: to => (<Term term={to} description={getMtypeDescription(to)} />),
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof DataEntry,
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof DataEntry,
  },
  {
    title: 'Age',
    dataIndex: 'age' as keyof DataEntry,
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof DataEntry,
  },
  {
    title: 'Synapses per connection',
    children: [
      {
        title: 'Mean ± std',
        dataIndex: 'mean' as keyof DataEntry,
        render: (mean, record) => <><NumberFormat value={mean} /> ± <NumberFormat value={record.std} /></>
      },
      {
        title: 'SEM',
        dataIndex: 'sem' as keyof DataEntry,
        render: (sem) => (<NumberFormat value={sem} />),
      },
      {
        title: 'N. conns',
        dataIndex: 'n' as keyof DataEntry,
      },
    ],
  },
  {
    title: 'Reference',
    dataIndex: 'reference' as keyof DataEntry,
  }
];

type SynsPerConnTableProps = {
  theme?: number;
}

const SynsPerConnTable: React.FC<SynsPerConnTableProps> = ({ theme }) => {
  return (
    <>
      <ResponsiveTable<DataEntry>
        className="mb-2"
        columns={columns}
        data={data}
        rowKey={({ from, to }) => `${from}_${to}`}
      />
      <small><sup>[1]</sup> Additional calculations (see below).</small>

      <div className="text-right mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            synsPerConnData,
            `exp-connection-anatomy_-_syns-per-conn-table.json`
          )}
        >
          Number of synapses per connection Data
        </DownloadButton>
      </div>

      <h3 className="text-xl mt-12 mb-2">Calculations</h3>

      <h4 className='text-base mb-2'><a
        href="https://doi.org/10.1126/science.8085161"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sik et al., 1995
      </a></h4>
      <p className='mb-4'>
        Overall, 99 boutons in contact with 64 parvalbumin-immunoreactive neurons were counted (Fig. 2).
        Thirty-five contacts were on somata and the remaining ones on thick proximal dendrites.
        The majority of the targets were contacted by a single bouton, whereas 13 neurons received
        two to four boutons from the biocytin filled cell.
      </p>
      <Table
        size="small"
        className="mb-1"
        style={{ width: '420px' }}
        dataSource={[
          { name: '', conns: 51, nsyns: 1, totalSyns: 1, mean: 1, key: 1 },
          { name: '', conns: 13, nsyns: '2-4', totalSyns: 48, mean: 3.6923, key: 2 }
        ]}
        columns={[
          { title: '', dataIndex: 'name' },
          { title: 'Conns', dataIndex: 'conns' },
          { title: 'N. syns per conns', dataIndex: 'nsyns' },
          { title: 'Total syns', dataIndex: 'totalSyns' },
          { title: 'Mean', dataIndex: 'mean' },
        ]}
        pagination={false}
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><strong>64</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
            <Table.Summary.Cell index={3}><strong>99</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={4} />
          </Table.Summary.Row>
        )}
      />
      <p className='mt-4'>
        Mean = 99/64 = 1.54688, SD = 1.0831.
      </p>

      <h4 className='text-base mt-4 mb-1'><a
        href="https://doi.org/10.1016/0306-4522(96)00251-5"
        target="_blank"
        rel="noopener noreferrer"
      >
        Deuchars and Thomson, 1996
      </a></h4>
      <p>
        Number of synapses per connection, data: 1, 1 ,1, 1, 1, 2.
        Mean = 1.1666, std = 0.4082, n = 6, sem = 0.1666.
      </p>

      <h4 className='text-base mt-3 mb-1'><a
        href="https://doi.org/10.1111/j.1469-7793.1998.755bv.x"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vida et al., 1998
      </a></h4>
      <p>
        Number of synapses per connection, data: 6, 6, 4.
        Mean = 5.3333, std = 1.1547, n = 3, sem = 0.6666.
      </p>

      <h4 className='text-base mt-3 mb-1'><a
        href="https://doi.org/10.1152/jn.00831.2010"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ali 2011
      </a></h4>
      <p>
        On average 2–5 close apposition of presynaptic boutons on postsynaptic dendrites were observed
        at the light micro-scope level. <br />
        Note that the range 2-5 refers to the first synaptic type described in the paper,
        that is the one from LM-SCA to SCA cells (n=7) and SP basket cells (n=2).
      </p>
      <p>
        Range, data: 2 - 5.
        Mean = 3.5, max error = 1.5.
      </p>
      <p className='text-xs mt-8'>* We used the max error as an estimation of the std.</p>
    </>
  );
};


export default SynsPerConnTable;