import React from 'react';
import { Table } from 'antd';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';


type BoutonDensity = {
  mtype: string;
  region: string;
  specie: string;
  ageWeight: string;
  mean: number;
  std: number;
  unit: string;
  n: number;
  sem: number;
  reference: string | React.ReactNode;
};

const data: BoutonDensity[] = [{
  mtype: 'SO_BS',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  ageWeight: '250-350 g',
  mean: 0.21,
  std: 5.6,
  unit: '/µm',
  n: 1,
  sem: 5.6,
  reference: (
    <>
      <a
        href="https://doi.org/10.1126/science.8085161"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sik et al., 1995
      </a> <sup>[1]</sup> <sup>[2]</sup></>
  ),
}, {
  mtype: 'SO_BP',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  ageWeight: '250-350 g',
  mean: 0.248,
  std: 4.13,
  unit: '/µm',
  n: 1,
  sem: 4.13,
  reference: (
    <>
      <a
        href="https://doi.org/10.1126/science.8085161"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sik et al., 1995
      </a> <sup>[3]</sup>
    </>
  ),
}, {
  mtype: 'SP_PC',
  region: 'CA1',
  specie: 'Wistar rats',
  ageWeight: '180-200 g',
  mean: 0.1241,
  std: 6.02,
  unit: '/µm',
  n: 4,
  sem: 3.01,
  reference: (
    <>
      <a
        href="https://doi.org/10.1002/(sici)1096-9861(19990614)408:4%3C449::aid-cne1%3E3.0.co;2-r"
        target="_blank"
        rel="noopener noreferrer"
      >
        Esclapez et al., 1999
      </a>; <a
        href="https://dx.doi.org/10.1002%2Fhipo.22141"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bezaire and Soltesz, 2013
      </a> <sup>[4]</sup>
    </>
  ),
}, {
  mtype: 'SO_Tri',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  ageWeight: '250-350 g',
  mean: 0.282,
  std: 4.9,
  unit: '/µm',
  n: 1,
  sem: 4.9,
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
  mtype: 'SP_PVBC',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  ageWeight: '250-350 g',
  mean: 0.226,
  std: 3.9,
  unit: '/µm',
  n: 4,
  sem: 1.95,
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
  mtype: 'SO_OLM',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  ageWeight: '250-350 g',
  mean: 0.266,
  std: 4.0,
  unit: '/µm',
  n: 2,
  sem: 2.83,
  reference: (
    <>
      <a
        href="https://doi.org/10.1126/science.8085161"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sik et al., 1995
      </a> <sup>[1]</sup></>
  ),
}];

const unit = data[0].unit;

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof BoutonDensity
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof BoutonDensity
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof BoutonDensity
  },
  {
    title: 'Age / Weight',
    dataIndex: 'ageWeight' as keyof BoutonDensity
  },
  {
    title: 'Bouton Density',
    children: [
      {
        title: <> Mean, {unit} </>,
        dataIndex: 'mean' as keyof BoutonDensity,
        render: (mean, record) => <><NumberFormat value={mean} /> ± <NumberFormat value={record.std} /></>
      },
      {
        title: <> SEM, {unit} </>,
        dataIndex: 'sem' as keyof BoutonDensity,
      },
      {
        title: 'N. cells',
        dataIndex: 'n' as keyof BoutonDensity,
      },
    ],
  },
  {
    title: 'Reference',
    dataIndex: 'reference' as keyof BoutonDensity,
  }
];

const BoutonDenisityTable = () => {
  return (
    <>
      <ResponsiveTable<BoutonDensity>
        className="mb-2"
        columns={columns}
        data={data}
        rowKey={({ mtype }) => mtype}
      />
      <small>
        <sup>[1]</sup> The authors do not specify if this is std or SEM. Anyway,
        in a previous publication (Sik et al., 1994) they used std. We can assume they are std.
      </small> <br/>
      <small>
        <sup>[2]</sup> The authors define the sample size (n) probably as the number of sampled segments
        rather than the number of animals.
      </small> <br/>
      <small>
        <sup>[3]</sup> The authors do not mention specie and age in the paper. Anyway,
        a later paper (Sik et al., 1995) mentions the result so we assume they use the same method.
        </small> <br/>
      <small>
        <sup>[4]</sup> Calculated (see below).
      </small>

      <h3 className="mt-3">Calculations</h3>

      <h4><a
        href="https://doi.org/10.1002/(sici)1096-9861(19990614)408:4%3C449::aid-cne1%3E3.0.co;2-r"
        target="_blank"
        rel="noopener noreferrer"
      >
        Esclapez et al., 1999
      </a></h4>
      <p>Mean number of varicosities per 100 μm of axon for each segment order:</p>
      <ul>
        <li>4.02 ± 1.5 and 4.31 ± 1.33, respectively, for first-order segments.</li>
        <li>10.04 ± 2.98 and 9.15 ± 2.56 for second-order segments.</li>
        <li>14.78 ± 3.42 and 13.51 ± 5.36 for third-order segments.</li>
        <li>12.34 ± 2.6 and 10.04 ± 3.57 for fourth-order segments</li>
      </ul>

      <h4><a
        href="https://dx.doi.org/10.1002%2Fhipo.22141"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bezaire and Soltesz, 2013
      </a></h4>
      <p>
        In a representative CA1 pyramidal axonal arbor, segments of third or fourth order
        constituted most of the axonal length; therefore we used an average of the bouton densities
        of the third and fourth order segments (13.56 boutons per 100 lm)
      </p>

      <Table
        size="small"
        style={{ width: '360px' }}
        dataSource={[
          {mean: 14.78, sem: 3.42, key: 1},
          {mean: 12.34, sem: 2.6, key: 2},
          {mean: 13.56, sem: 3.01, key: 3}
        ]}
        columns={[
          {title: 'Mean', dataIndex: 'mean'},
          {title: 'SEM', dataIndex: 'sem'}
        ]}
        pagination={false}
        bordered
      />
    </>
  );
};


export default BoutonDenisityTable;
