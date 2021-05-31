
export const accentColors: { [key: string]: string } = {
  yellow: '#ffc500',
  blue: '#84bbf8',
  lavender: '#657be1',
  green: '#33b080',
  grey: '#b2b3b3',
  orange: '#ed8048',
};

export const hippocampus = {
  org: 'public',
  project: 'hippocampus-hub',
  datasetViewId: encodeURIComponent('https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset'),
};

export const deploymentUrl = 'https://hippocampushub.eu';
export const basePath = '/model';

export const isServer = typeof window === 'undefined';
export const isProduction = process.env.NODE_ENV === 'production';

export const nexus = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL,
  token: process.env.NEXT_PUBLIC_NEXUS_TOKEN,
};

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const nexusPluginBaseUrl = process.env.NEXT_PUBLIC_NEXUS_PLUGIN_BASE_URL;

export const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

export const gtm = {
  id: 'G-SGZ83Y6E8H',
  cookiePrefsKey: 'bbpCookiePreferences',
};
