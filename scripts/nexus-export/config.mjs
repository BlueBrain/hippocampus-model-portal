
export const nexus = {
  url: 'https://bbp.epfl.ch/nexus/v1',
  org: 'public',
  project: 'hippocampus',
  accessToken: process.env.ACCESS_TOKEN,
  defaultESViewId: encodeURIComponent('https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset'),
};

export const targetBaseDir = '../../public/nexus';
