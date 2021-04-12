import * as Sentry from '@sentry/browser';
import { Integrations } from "@sentry/tracing";

import { sentryDsn, isProduction } from '../config';


export const init = () => {
  if (!sentryDsn) return;

  Sentry.init({
    enabled: isProduction,
    dsn: sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
  });
};
