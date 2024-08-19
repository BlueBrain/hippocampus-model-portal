
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
  project: 'hippocampus',
  datasetViewId: encodeURIComponent('https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset'),
};

export const deploymentUrl = 'https://www.hippocampushub.eu';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
export const dataPath = process.env.NEXT_PUBLIC_STATIC_DATA_BASE_URL;

export const isServer = typeof window === 'undefined';
export const isProduction = process.env.NODE_ENV === 'production';

export const nexusImgLoaderUrl = process.env.NEXT_PUBLIC_NEXUS_IMG_LOADER_URL;
export const nexusAuthProxyUrl = process.env.NEXT_PUBLIC_NEXUS_AUTH_PROXY_URL;

export const nexus = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL,
  token: process.env.NEXT_PUBLIC_NEXUS_TOKEN,
};

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const staticDataBaseUrl = process.env.NEXT_PUBLIC_STATIC_DATA_BASE_URL;

export const nexusPluginBaseUrl = process.env.NEXT_PUBLIC_NEXUS_PLUGIN_BASE_URL;

export const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

export const gtm = {
  id: process.env.NEXT_PUBLIC_GTM_ID,
  cookiePrefsKey: 'hippocampusPortalCookiePreferences',
};
