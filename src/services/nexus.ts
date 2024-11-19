import { nexus, dataPath } from '@/config';

const originalFetch = typeof window !== 'undefined' ? window.fetch : undefined;

function sanitizeHeaders(headers: Record<string, string>) {
  if (!headers) {
    return;
  }

  const sanitizedHeaders = {};

  const headersToRemove = ['Authorization', 'Content-Type'].map(((header) => header.toLowerCase()));

  Object.keys(headers).forEach((header) => {
    if (!headersToRemove.includes(header.toLowerCase())) {
      sanitizedHeaders[header] = headers[header];
    }
  });

  return sanitizedHeaders;
}

export function registerNexusFetchInterceptor() {
  if (!originalFetch) {
    return;
  }

  window.fetch = async function fetchWithInterceptor(...args) {
    const [url, options] = args;

    if (typeof url !== 'string') return originalFetch(url, options);

    if (!url.startsWith(nexus.url)) {
      return originalFetch(url, options);
    }

    // POST requests (ES queries).

    if (options?.method === 'POST') {
      // There should not be any ES queries left.

      return originalFetch(url, options);
    }

    // The rest are GET requests

    // Serving files from static storage
    if (url.includes('/files/')) {

      if (options?.headers) {
        options.headers = sanitizeHeaders(options.headers as Record<string, string>);
      }

      const urlObj = new URL(url);
      const fileId = decodeURIComponent(urlObj.pathname.split('/').at(-1)!);
      const fileUUID = fileId.split('/').at(-1) as string;

      const subDir = options?.headers && 'Accept' in options.headers && ['json'].some(type => options.headers!['Accept'].includes(type))
        ? 'file-meta'
        : 'files';

      const fileUrl = `${dataPath}/nexus/${subDir}/${fileUUID[0]}/${fileUUID[1]}/${fileUUID}`;

      return originalFetch(fileUrl);
    }

    // Serving resources from static storage
    if (url.includes('/resources/')) {
      if (options?.headers) {
        options.headers = sanitizeHeaders(options.headers as Record<string, string>);
      }

      const urlObj = new URL(url);

      const isIncomingResource = urlObj.pathname.includes('/incoming');
      const resourceId = decodeURIComponent(urlObj.pathname.replace('/incoming', '').split('/').at(-1)!);
      const resourceUUID = resourceId.split('/').at(-1) as string;

      const subDir = isIncomingResource ? 'incoming' : 'resources';

      const resourceUrl = `${dataPath}/nexus/${subDir}/${resourceUUID[0]}/${resourceUUID[1]}/${resourceUUID}`;

      return originalFetch(resourceUrl, options);
    }

    return originalFetch(url, options);
  };}
