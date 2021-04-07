
export const hippocampus = {
  org: 'public',
  project: 'hippocampus',
  datasetViewId: encodeURIComponent(
    'https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset',
  ),
};

export const nexus = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL || 'https://bbp.epfl.ch/nexus/v1',
  token: process.env.NEXT_PUBLIC_NEXUS_TOKEN,
};

export const nexusPluginBaseUrl = 'https://bbp.epfl.ch/nexus/plugins';

export const accentColors: { [key: string]: string } = {
  yellow: '#ffc500',
  blue: '#84bbf8',
  lavender: '#657be1',
  green: '#33b080',
  grey: '#b2b3b3',
  orange: '#ed8048',
};

export const basePath = '/model';

export const gtm = {
  id: 'G-SGZ83Y6E8H',
  cookiePrefsKey: 'bbpCookiePreferences',
};
