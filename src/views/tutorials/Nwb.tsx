import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import solarizedDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/solarized-dark';

import { basePath } from '../../config';
import Title from '../../components/Title';
import FullPage from '../../layouts/FullPage';
import { Color } from '../../types';

import code from './nwb-code';

import styles from './nwb.module.scss';


type CodeProps = {
  code: string;
  language: string;
  wrapLongLines?: Boolean;
};

const Code: React.FC<CodeProps> = ({ code, language, wrapLongLines })=> (
  <SyntaxHighlighter
    language={language}
    style={solarizedDark}
    wrapLongLines={wrapLongLines}
    customStyle={{ fontSize: '14px' }}
  >
    {code}
  </SyntaxHighlighter>
);

const PythonCode = ({ code }) => (<Code language="python" code={code} />);
const BashCode = ({ code }) => (<Code language="bash" code={code} />);
const MatlabCode = ({ code }) => (<Code language="matlab" code={code} />);
const PlaintextCode:React.FC<{ code: string, wrapLongLines?: Boolean }> = ({ code, wrapLongLines }) => (
  <Code
    language="plaintext"
    code={code}
    wrapLongLines={wrapLongLines}
  />
);

const NwbTutorialView: React.FC = () => {
  return (
    <FullPage>
      <div className={styles.container}>
        <Title title="How to read NWB files tutorial" primaryColor="grey-1" />

        <h2>Introduction</h2>

        <p>NWB files can be read in the following ways:</p>

        <ul>
          <li>
            <Link href="#pynwb-api">Method 1</Link>: Read NWB files in Python with <a
              href="https://github.com/NeurodataWithoutBorders/pynwb/"
              target="_blank"
              rel="noopener noreferrer"
            >PyNWB</a> (<a
              href="https://pynwb.readthedocs.io/en/stable/tutorials/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >official tutorial</a>)
          </li>
          <li>
            <Link href="#matlab">Method 2</Link>: Read NWB files in Matlab with <a
              href="https://github.com/NeurodataWithoutBorders/matnwb/"
              target="_blank"
              rel="noopener noreferrer"
            >MatNWB</a> (<a
              href="https://github.com/NeurodataWithoutBorders/matnwb#tutorials"
              target="_blank"
              rel="noopener noreferrer"
            >official tutorial</a>)
            </li>
        </ul>

        <h2>Installation instructions for PyNWB</h2>

        <ol>
          <li>
            Install the latest version of <a
              href="https://conda.io/projects/conda/en/latest/user-guide/install/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >Miniconda with Python 3</a>.
          </li>
          <li>
            Create an environment and install <code>pynwb</code>:
            <BashCode code={code.pynwbInstallCode} />
          </li>
          <li>
            If you want to explore these tutorials install <code>jupyter</code> and <code>matplotlib</code>:
            <BashCode code={code.jupyterInstallCode} />
          </li>
        </ol>


        <h2 id="pynwb-api">Method 1: Read NWB files with PyNWB API</h2>

        <div className={styles.section}>
          <small>In [1]:</small>
          <PythonCode code={code.nwbApi1} />

          <p>Import and define convenience functions.</p>

          <small>In [2]:</small>
          <PythonCode code={code.nwbApi2} />

          <h3>Load NWB file</h3>

          <small>In [3]:</small>
          <PythonCode code={code.nwbApi3} />

          <small>In [4]:</small>
          <PythonCode code={code.nwbApi4} />

          <h3>Load all tables into memory</h3>

          <p>
            The easiest way to work with the data is to retrieve and combine all icephys tables
            in a single pandas DataFrame. This step can take some time.
          </p>

          <p>
            For more details, please refer to the <a
              href="https://pynwb.readthedocs.io/en/stable/tutorials/domain/plot_icephys.html#sphx-glr-tutorials-domain-plot-icephys-py"
              target="_blank"
              rel="noopener noreferrer"
            >pynwb documentation</a>.
          </p>

          <small>In [5]:</small>
          <PythonCode code={code.nwbApi5} />

          <h3>Retrieve stimulus types</h3>

          <p>
            Stimulus types (also known as protocols, patterns, sequential recordings, or just stimuli)
            are stored in a dedicated column (<code>stimulus_type</code>)
            in the <code>sequential_recordings</code> table.
          </p>

          <small>In [6]:</small>
          <PythonCode code={code.nwbApi6} />

          <small>In [7]:</small>

          <PythonCode code={code.nwbApi7_1} />
          <PlaintextCode wrapLongLines={true} code={code.nwbApi7_2} />

          <h3>Plot one stimulus-response pair</h3>

          <small>In [8]:</small>
          <PythonCode code={code.nwbApi8} />

          <small>In [9]:</small>
          <PythonCode code={code.nwbApi9} />

          <div className="mt-1 mb-1">
            <Image
              src={`${basePath}/assets/images/tutorials/nwb/stimulus.png`}
              width="400"
              height="273"
              alt="Stimulus plot"
              className="bg-almost-white"
            />
          </div>

          <small>In [10]:</small>
          <PythonCode code={code.nwbApi10} />

          <div className="mt-1 mb-1">
            <Image
              src={`${basePath}/assets/images/tutorials/nwb/response.png`}
              width="400"
              height="262"
              alt="Response plot"
              className="bg-almost-white"
            />
          </div>

          <h3>Retrieve and plot all traces of a given stimulus type (i.e. repetitions)</h3>

          <p>Choose one stimulus type from the list printed above.</p>

          <small>In [11]:</small>
          <PythonCode code={code.nwbApi11} />

          <small>In [12]:</small>
          <PythonCode code={code.nwbApi12_1} />
          <PythonCode code={code.nwbApi12_2} />

          <p>Plot traces for each repetition.</p>

          <p>
            (Please note that in the code below it is assumed that for each stimulus there is a response,
            and vice versa. The tuple <code>(start_index, index_count, PatchClampSeries)</code>
            will only contain <code>None</code>&apos;s if a trace does not exist.)
          </p>

          <small>In [13]:</small>
          <PythonCode code={code.nwbApi13} />

          <div className="mt-1">
            <Image
              src={`${basePath}/assets/images/tutorials/nwb/all-traces.png`}
              width="735"
              height="496"
              alt="All trace plots"
              className="bg-almost-white"
            />
          </div>
        </div>

        <h2 id="matlab">Method 2: Read NWB files in Matlab</h2>

        <div className={styles.section}>
          <h3>Installation instructions</h3>

          <p>First download MatNWB. In a terminal type:</p>
          <BashCode code={code.matlabInstall1} />

          <p>
            This script has been tested on the commit <code>276e462</code> implementing
            NWB schema v2.4.0, so you might want to check out to it:
          </p>
          <BashCode code={code.matlabInstall2} />

          <p>In Matlab, add the matnwb folder and its subfolders to Path and generate the core classes:</p>
          <MatlabCode code={code.matlabInstall3} />

          <p>Then you can run this script.</p>

          <p>
            For the full documentation visit <a
              className="word-break-all"
              href="https://github.com/NeurodataWithoutBorders/matnwb#matnwb"
              target="_blank"
              rel="noopener noreferrer"
            >https://github.com/NeurodataWithoutBorders/matnwb#matnwb</a>.
          </p>

          <h3>Read NWB file</h3>

          <MatlabCode code={code.matlab1} />
        </div>
      </div>
    </FullPage>
  );
};


export default NwbTutorialView;
