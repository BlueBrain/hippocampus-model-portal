import React, { useState, useEffect } from 'react';
import { downloadAsJson } from '@/utils';
import ResponsiveTable from '@/components/ResponsiveTable';
import NumberFormat from '@/components/NumberFormat';
import { layerDescription, mtypeDescription } from '@/terms';
import { termFactory } from '@/components/Term';
import DownloadButton from '@/components/DownloadButton';
import { dataPath } from '@/config';

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
  ref: string; // Changed from 'reference' to 'ref' to match the data
  ref_link?: string; // Added optional 'ref_link'
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

const columns = [
  {
    title: 'M-type',
    dataIndex: 'mtype' as keyof BoutonDensity,
    render: (mtype: string) => (
      <Term term={mtype} description={getMtypeDescription(mtype)} />
    ),
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
        render: (mean: number, record: BoutonDensity) => (
          <>
            <NumberFormat value={mean} /> ± <NumberFormat value={record.std} />
          </>
        ),
      },
      {
        title: <> SEM</>,
        dataIndex: 'sem' as keyof BoutonDensity,
        render: (sem: number) => <NumberFormat value={sem} />,
      },
      {
        title: 'N. cells',
        dataIndex: 'n' as keyof BoutonDensity,
      },
    ],
  },
  {
    title: 'Reference',
    dataIndex: 'ref' as keyof BoutonDensity,
    render: (ref: string, record: BoutonDensity) =>
      record.ref_link ? (
        <a href={record.ref_link} target="_blank" rel="noopener noreferrer">
          {ref}
        </a>
      ) : (
        ref
      ),
  },
];

type BoutonDensityTableProps = {
  theme?: number;
};

const BoutonDensityTable: React.FC<BoutonDensityTableProps> = ({ theme }) => {
  const [data, setData] = useState<BoutonDensity[] | null>(null);

  useEffect(() => {
    fetch(`${dataPath}/1_experimental-data/connection-anatomy/bouton-density.json`)
      .then((response) => response.json())
      .then((fetchedData) => setData(fetchedData));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

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
      </small>{' '}
      <br />
      <small>
        <sup>[2]</sup> The authors define the sample size (n) probably as the number of sampled segments
        rather than the number of animals.
      </small>{' '}
      <br />
      <small>
        <sup>[3]</sup> The authors do not mention specie and age in the paper. Anyway,
        a later paper (Sik et al., 1995) mentions the result so we assume they use the same method.
      </small>{' '}
      <br />
      <small>
        <sup>[4]</sup> Calculated (see below).
      </small>

      <div className="mt-2">
        <DownloadButton
          theme={theme}
          onClick={() => downloadAsJson(data, `Bouton-Density-Data.json`)}
        >
          Bouton density
        </DownloadButton>
      </div>

      <h3 className="text-2xl mt-12 mb-2">Calculations</h3>

      <h4 className="text-lg mb-2">
        <a
          href="https://doi.org/10.1002/(sici)1096-9861(19990614)408:4%3C449::aid-cne1%3E3.0.co;2-r"
          target="_blank"
          rel="noopener noreferrer"
        >
          Esclapez et al., 1999
        </a>
      </h4>
      <p className="mb-2">
        Mean number of varicosities per 100 μm of axon for each segment order:
      </p>
      <ul className="mb-2">
        <li>
          4.02 ± 1.5 and 4.31 ± 1.33, respectively, for first-order segments.
        </li>
        <li>10.04 ± 2.98 and 9.15 ± 2.56 for second-order segments.</li>
        <li>14.78 ± 3.42 and 13.51 ± 5.36 for third-order segments.</li>
        <li>12.34 ± 2.6 and 10.04 ± 3.57 for fourth-order segments.</li>
      </ul>

      <h4 className="text-lg mb-2">
        <a
          href="https://dx.doi.org/10.1002%2Fhipo.22141"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bezaire and Soltesz, 2013
        </a>
      </h4>
      <p>
        In a representative CA1 pyramidal axonal arbor, segments of third or fourth order constituted
        most of the axonal length; therefore we used an average of the bouton densities of the third and
        fourth order segments that is 13.56 ± 3.01 boutons per 100 um).
      </p>
    </>
  );
};

export default BoutonDensityTable;