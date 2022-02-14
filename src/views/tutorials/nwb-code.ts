
const pynwbInstallCode = `conda create --name nwb python=3
conda activate nwb
pip install pynwb==2`;

const jupyterInstallCode = `pip install jupyter matplotlib
jupyter notebook`;

const nwbApi1 = `import numpy as np
from pynwb import NWBHDF5IO
import matplotlib.pyplot as plt`;

const nwbApi2 = `from hdmf.common.hierarchicaltable import to_hierarchical_dataframe, flatten_column_index

def getNWBTimestamps(PatchClampSeries, absolute_time = False):
    '''Generate timestamps for any PatchClampSeries object.
    '''
    data_shape = PatchClampSeries.data.shape
    rate = PatchClampSeries.rate
    starting_time = PatchClampSeries.starting_time

    assert len(data_shape) == 1, 'Too many dimensions'
    if absolute_time == False:
        starting_time = 0.0
    nsamples = data_shape[0]
    timestamps = starting_time + np.linspace(0, nsamples/rate, nsamples)
    return timestamps`;

const nwbApi3 = `filepath = '001_140709EXP_A1.nwb'`;

const nwbApi4 = `io = NWBHDF5IO(filepath, 'r', load_namespaces = True)
nwbfile = io.read()`;

const nwbApi5 = `# Consider using nwbfile.get_icephys_meta_parent_table() or nwbfile.icephys_experimental_conditions
# instead of nwbfile.icephys_repetitions
df = to_hierarchical_dataframe(nwbfile.icephys_repetitions).reset_index()
df = flatten_column_index(df, max_levels = 2)`;

const nwbApi6 = `stimulus_types = sorted(df[('sequential_recordings','stimulus_type')].unique().tolist())`;

const nwbApi7_1 = `print(stimulus_types)`;
const nwbApi7_2 = `['APWaveform', 'DeHyperPol', 'Delta', 'ElecCal', 'FirePattern', 'HyperDePol', 'IDRest', 'IDThres', 'IV', 'NegCheops', 'PosCheops', 'RPip', 'RSealClose', 'RSealOpen', 'Rac', 'ResetITC', 'SetAmpl', 'SetISI', 'SineSpec', 'SponHold3', 'SponHold30', 'SponNoHold30', 'StartHold', 'StartNoHold', 'TestAmpl', 'TestRheo', 'sAHP']`;

const nwbApi8 = `# Get stimulus and response traces
trace_no = 60
S = df[('stimuli','stimulus')][trace_no][2] # "2" refers to an implementation detail
R = df[('responses','response')][trace_no][2]`;

const nwbApi9 = `# Plot stimulus
plt.plot(getNWBTimestamps(S), S.data[:] * S.conversion,'r')
plt.xlabel('seconds')
_ = plt.ylabel(S.unit)`;

const nwbApi10 = `# Plot response
plt.plot(getNWBTimestamps(S), R.data[:] * R.conversion,'k')
plt.xlabel('seconds')
_ = plt.ylabel(R.unit)`;

const nwbApi11 = `st = stimulus_types[0]`;

const nwbApi12_1 = `df_st = df[df[('sequential_recordings','stimulus_type')] == st]
repetitions = df_st[('repetitions','id')].unique().tolist()

print(f'Stimulus {st}, repetitions {repetitions}')`;

const nwbApi12_2 = `Stimulus APWaveform, repetitions [1, 2]`;

const nwbApi13 = `fig, axs = plt.subplots(2, len(repetitions), figsize = (12,8), sharex = 'col', sharey = 'row', squeeze = False)

for idx, rep in enumerate(repetitions):

    df_st_rep = df[(df[('sequential_recordings','stimulus_type')] == st) &
                   (df[('repetitions','id')] == rep)]
    stimuli = df_st_rep[('stimuli','stimulus')]
    responses = df_st_rep[('responses','response')]

    # S and R below are tuples: (start_index, index_count, PatchClampSeries)
    for S in stimuli:
        axs[0, idx].plot(getNWBTimestamps(S[2]), S[2].data[:] * S[2].conversion,'r')
        axs[0, idx].set_ylabel(S[2].unit)
        axs[0, idx].set_title(f'stimuli in repetition {idx+1}')

    for R in responses:
        axs[1, idx].plot(getNWBTimestamps(R[2]), R[2].data[:] * R[2].conversion,'k')
        axs[1, idx].set_ylabel(R[2].unit)
        axs[1, idx].set_title(f'responses in repetition {idx+1}')
        axs[1, idx].set_xlabel('seconds')`;

const matlabInstall1 = `git clone https://github.com/NeurodataWithoutBorders/matnwb.git`;

const matlabInstall2 = `cd matnwb
git checkout 276e462`;

const matlabInstall3 = `cd matnwb
addpath(genpath(pwd));
generateCore()`;

const matlab1 = `filename = '001_140709EXP_A1.nwb';

% Read file.
nwb = nwbRead(filename);`;

const nwbCode = {
  pynwbInstallCode,
  jupyterInstallCode,

  nwbApi1,
  nwbApi2,
  nwbApi3,
  nwbApi4,
  nwbApi5,
  nwbApi6,
  nwbApi7_1,
  nwbApi7_2,
  nwbApi8,
  nwbApi9,
  nwbApi10,
  nwbApi11,
  nwbApi12_1,
  nwbApi12_2,
  nwbApi13,

  matlabInstall1,
  matlabInstall2,
  matlabInstall3,

  matlab1,
};

export default nwbCode;
