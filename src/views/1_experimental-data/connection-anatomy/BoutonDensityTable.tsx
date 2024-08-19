import React from 'react';

import { downloadAsJson } from '@/utils';

import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';

import boutonDensityData from './bouton-density.json';
import DownloadButton from '@/components/DownloadButton/DownloadButton';


type BoutonDensity = {
  mtype: string;
  region: string;
  specie: string;
  weight: string;
  mean: number;
  std: number;
  unit: string;
  n: number;
  sem: number;
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

const data: BoutonDensity[] = [{
  mtype: 'SO_BS',
  region: 'CA1',
  specie: 'Sprague-Dawley rat',
  weight: '250-350 g',
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
  weight: '250-350 g',
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
  weight: '180-200 g',
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
  weight: '250-350 g',
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
  weight: '250-350 g',
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
  weight: '250-350 g',
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

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof BoutonDensity,
    render: mtype => (<Term term={mtype} description={getMtypeDescription(mtype)} />),
  },
  {
    title: 'Region',
    dataIndex: 'region' as keyof BoutonDensity,
  },
  {
    title: 'Specie',
    dataIndex: 'specie' as keyof BoutonDensity,
  },
  {
    title: 'Weight',
    dataIndex: 'weight' as keyof BoutonDensity,
  },
  {
    title: 'Bouton Density, boutons/µm',
    children: [
      {
        title: <> Mean ± std</>,
        dataIndex: 'mean' as keyof BoutonDensity,
        render: (mean, record) => <><NumberFormat value={mean} /> ± <NumberFormat value={record.std} /></>
      },
      {
        title: <> SEM</>,
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

type BoutonDenisityTableProps = {
  theme?: number;
}

const BoutonDenisityTable: React.FC<BoutonDenisityTableProps> = ({ theme }) => {
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
      </small> <br />
      <small>
        <sup>[2]</sup> The authors define the sample size (n) probably as the number of sampled segments
        rather than the number of animals.
      </small> <br />
      <small>
        <sup>[3]</sup> The authors do not mention specie and age in the paper. Anyway,
        a later paper (Sik et al., 1995) mentions the result so we assume they use the same method.
      </small> <br />
      <small>
        <sup>[4]</sup> Calculated (see below).
      </small>

      <div className="text-right mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(
            boutonDensityData,
            `Bouton-Density-Data.json`
          )}
        >
          Bouton Density Data
        </DownloadButton>
      </div>

      <h3 className="text-2xl mt-12 mb-2">Calculations</h3>

      <h4 className='text-lg mb-2'><a
        href="https://doi.org/10.1002/(sici)1096-9861(19990614)408:4%3C449::aid-cne1%3E3.0.co;2-r"
        target="_blank"
        rel="noopener noreferrer"
      >
        Esclapez et al., 1999
      </a></h4>
      <p className='mb-2'>Mean number of varicosities per 100 μm of axon for each segment order:</p>
      <ul className='mb-2'>
        <li>4.02 ± 1.5 and 4.31 ± 1.33, respectively, for first-order segments.</li>
        <li>10.04 ± 2.98 and 9.15 ± 2.56 for second-order segments.</li>
        <li>14.78 ± 3.42 and 13.51 ± 5.36 for third-order segments.</li>
        <li>12.34 ± 2.6 and 10.04 ± 3.57 for fourth-order segments.</li>
      </ul>

      <h4 className='text-lg mb-2'><a
        href="https://dx.doi.org/10.1002%2Fhipo.22141"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bezaire and Soltesz, 2013
      </a></h4>
      <p>
        In a representative CA1 pyramidal axonal arbor, segments of third or fourth order constituted
        most of the axonal length; therefore we used an average of the bouton densities of the third and
        fourth order segments that is 13.56 ± 3.01 boutons per 100 um).
      </p>
    </>
  );
};


export default BoutonDenisityTable;