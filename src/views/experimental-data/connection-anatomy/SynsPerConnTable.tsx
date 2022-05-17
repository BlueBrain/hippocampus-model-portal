import React from 'react';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';


type DataEntry = {
  from: string;
  to: string;
  region: string;
  specie: string;
  ageWeight: string;
  mean: number;
  std: number | 'n/a';
  n: number;
  sem: number | 'n/a';
  reference: string | React.ReactNode;
};

const data: DataEntry[] = [{
  from: 'SP_BS',
  to: 'SP_PC',
  region: 'CA1',
  specie: 'n/a',
  ageWeight: 'n/a',
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
  ageWeight: '250-350 g',
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
  ageWeight: 'P14-21',
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
  ageWeight: 'P10-17',
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
  ageWeight: 'Young',
  mean: 8,
  std: 'n/a',
  n: 1,
  sem: 'n/a',
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
  ageWeight: 'Young',
  mean: 5.88888888888889,
  std: 'n/a',
  n: 9,
  sem: 'n/a',
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
  ageWeight: '100-180 g',
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
  ageWeight: '2-3 w / >3 w',
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
  ageWeight: '> 120 g',
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
  ageWeight: '2-3 w / >3 w',
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
  ageWeight: 'P18-21',
  mean: 3.5,
  std: 1.5,
  n: 9,
  sem: 'n/a',
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
    dataIndex: 'from' as keyof DataEntry
  },
  {
    title: 'To',
    dataIndex: 'to' as keyof DataEntry
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof DataEntry
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof DataEntry
  },
  {
    title: 'Age / Weight',
    dataIndex: 'ageWeight' as keyof DataEntry
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

const SynsPerConnTable = () => {
  return (
    <>
      <ResponsiveTable<DataEntry>
        className="mb-2"
        columns={columns}
        data={data}
        rowKey={({ from, to }) => `${from}_${to}`}
      />
      <small><sup>[1]</sup> Additional calculation.</small> <br/>
    </>
  );
};


export default SynsPerConnTable;
