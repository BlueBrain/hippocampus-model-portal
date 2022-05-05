import React from 'react';

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
        href="http://doi.org/10.1523/JNEUROSCI.15-10-06651.1995"
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
  reference: <>Sik et al., 1994 <sup>[3]</sup></>,
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
  reference: <>Esclapez et al., 1999; Bezaire and Soltesz, 2013 <sup>[4]</sup></>,
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
        href="http://doi.org/10.1523/JNEUROSCI.15-10-06651.1995"
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
        href="http://doi.org/10.1523/JNEUROSCI.15-10-06651.1995"
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
        href="http://doi.org/10.1523/JNEUROSCI.15-10-06651.1995"
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
      <small><sup>[1]</sup> The authors do not specify if this is std or SEM. Anyway, in a previous publication (Sik et al., 1994) they used std. We can assume they are std.</small> <br/>
      <small><sup>[2]</sup> The authors define the sample size (n) probably as the number of sampled segments rather than the number of animals.</small> <br/>
      <small><sup>[3]</sup> The authors do not mention specie and age in the paper. Anyway, a later paper (Sik et al., 1995) mentions the result so we assume they use the same method.</small> <br/>
      <small><sup>[4]</sup> Calculated.</small>
    </>
  );
};


export default BoutonDenisityTable;
